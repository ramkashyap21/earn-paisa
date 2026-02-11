import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get, push, update } 
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

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  window.requestWithdraw = async function () {
    const amount = Number(document.getElementById("wamount").value);
    const method = document.getElementById("wmethod").value;

    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    const walletRef = ref(db, "users/" + user.uid + "/wallet");
    const walletSnap = await get(walletRef);
    const balance = walletSnap.val().balance || 0;

    if (amount > balance) {
      alert("Insufficient balance");
      return;
    }

    // Deduct balance (hold)
    await update(walletRef, {
      balance: balance - amount
    });

    if(amount < 100){
  alert("Minimum withdraw amount is ₹100");
  return;
    }
    // Create withdraw request
    await push(ref(db, "withdrawRequests"), {
      uid: user.uid,
      amount: amount,
      method: method,
      status: "pending",
      time: Date.now()
    });

    alert("Withdraw request submitted");
    document.getElementById("wamount").value = "";
  };
});
