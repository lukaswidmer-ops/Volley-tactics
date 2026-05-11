import { initializeApp }
  from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getDatabase, ref, set, get, update, onValue, remove }
  from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey:            "AIzaSyC2dwh4gBB_7SjdR6YXLdMMMZpmC7o8kGA",
  authDomain:        "volley-vendetta.firebaseapp.com",
  databaseURL:
    "https://volley-vendetta-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "volley-vendetta",
  storageBucket:     "volley-vendetta.firebasestorage.app",
  messagingSenderId: "433993912576",
  appId:             "1:433993912576:web:cbdd7aba5be694a2a8a3e5",
  measurementId:     "G-LE6R37WZBC"
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

export { db, ref, set, get, update, onValue, remove };
