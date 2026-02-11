import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getDatabase, 
  ref, 
  get, 
  set, 
  onValue 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "paisaeran-43a70.firebaseapp.com",
  databaseURL: "https://paisaeran-43a70-default-rtdb.firebaseio.com",
  projectId: "paisaeran-43a70"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


// 🔐 Auth Check
onAuthStateChanged(auth, async (user) => {

  if (!user) return;

  const walletRef = ref(db, "users/" + user.uid + "/wallet");

  try {

    // ✅ First time user → create wallet
    const snap = await get(walletRef);

    if (!snap.exists()) {
      await set(walletRef, {
        balance: 0
      });
    }

    // ✅ Live balance listener
    onValue(walletRef, (snapshot) => {
      if (snapshot.exists()) {
        document.getElementById("balance").innerText =
          "₹ " + snapshot.val().balance;
      }
    });

  } catch (error) {
    console.error("Wallet error:", error);
  }

});
