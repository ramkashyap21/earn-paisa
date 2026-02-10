import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get, set, onValue } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBc_f9XBgUi3HMpFQU40fWJdzxscfV826s",
  authDomain: "paisaeran-43a70.firebaseapp.com",
  databaseURL: "https://paisaeran-43a70-default-rtdb.firebaseio.com",
  projectId: "paisaeran-43a70"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  const walletRef = ref(db, "users/" + user.uid + "/wallet");

  // First time user → create wallet
  get(walletRef).then((snap) => {
    if (!snap.exists()) {
      set(walletRef, {
        balance: 0
      });
    }
  });

  // Live balance listener
  onValue(walletRef, (snap) => {
    if (snap.exists()) {
      document.getElementById("balance").innerText =
        "₹ " + snap.val().balance;
    }
  });
});
