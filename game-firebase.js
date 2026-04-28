/* ================================================================
   VOLLEY VENDETTA — Firebase / Multiplayer scaffolding
   Loaded after firebase-app and firebase-database compat scripts.
   Exposes window.VV_FIREBASE.

   Usage:
     <script>
       window.FIREBASE_CONFIG = {
         apiKey: "...",
         authDomain: "....firebaseapp.com",
         databaseURL: "https://....firebaseio.com",
         projectId: "...",
         storageBucket: "...",
         messagingSenderId: "...",
         appId: "..."
       };
     </script>
   then load firebase-app + firebase-database compat, then this file.
   ================================================================ */
(function () {
'use strict';

let app = null, db = null, available = false, currentRoomRef = null, listeners = [];

function isAvailable() {
  return !!(window.FIREBASE_CONFIG &&
            window.FIREBASE_CONFIG.apiKey &&
            !window.FIREBASE_CONFIG.apiKey.startsWith('YOUR_') &&
            typeof firebase !== 'undefined' &&
            firebase.app);
}

function init() {
  if (available) return true;
  if (!isAvailable()) return false;
  try {
    app = firebase.initializeApp(window.FIREBASE_CONFIG);
    db = firebase.database();
    available = true;
    return true;
  } catch (e) {
    console.warn('Firebase init failed:', e);
    return false;
  }
}

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random()*chars.length)];
  return s;
}

async function createRoom(host) {
  if (!init()) throw new Error('Firebase not configured');
  const code = genCode();
  const ref = db.ref('rooms/' + code);
  await ref.set({
    code,
    host: host.id,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    started: false,
    players: { [host.id]: { id: host.id, name: host.name, host: true, joinedAt: firebase.database.ServerValue.TIMESTAMP } },
    state: null,
  });
  currentRoomRef = ref;
  // Set up presence
  ref.child('players/' + host.id).onDisconnect().remove();
  return code;
}

async function joinRoom(code, player) {
  if (!init()) throw new Error('Firebase not configured');
  const ref = db.ref('rooms/' + code.toUpperCase());
  const snap = await ref.once('value');
  if (!snap.exists()) throw new Error('Room not found');
  if (snap.val().started) throw new Error('Game already started');
  await ref.child('players/' + player.id).set({
    id: player.id,
    name: player.name,
    host: false,
    joinedAt: firebase.database.ServerValue.TIMESTAMP
  });
  currentRoomRef = ref;
  ref.child('players/' + player.id).onDisconnect().remove();
  return ref;
}

function watchRoom(callback) {
  if (!currentRoomRef) return;
  const fn = snap => callback(snap.val());
  currentRoomRef.on('value', fn);
  listeners.push({ ref: currentRoomRef, fn });
}

async function startGame(initialState) {
  if (!currentRoomRef) throw new Error('No room');
  await currentRoomRef.update({ started: true, state: initialState });
}

async function pushState(state) {
  if (!currentRoomRef) return;
  await currentRoomRef.child('state').set(state);
}

async function pushAction(action) {
  if (!currentRoomRef) return;
  await currentRoomRef.child('actions').push(action);
}

function leaveRoom() {
  for (const l of listeners) l.ref.off('value', l.fn);
  listeners = [];
  currentRoomRef = null;
}

window.VV_FIREBASE = {
  isAvailable,
  init,
  createRoom,
  joinRoom,
  watchRoom,
  startGame,
  pushState,
  pushAction,
  leaveRoom,
};
})();
