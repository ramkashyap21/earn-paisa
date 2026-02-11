import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getDatabase,
  ref,
  onValue,
  update,
  get,
  push
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const ADMIN_EMAIL = "admin@earnpaisa.com"; // 🔥 change if needed

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "paisaeran-43a70.firebaseapp.com",
  databaseURL: "https://paisaeran-43a70-default-rtdb.firebaseio.com",
  projectId: "paisaeran-43a70"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// DOM
const list = document.getElementById("withdrawList");
const totalUsersEl = document.getElementById("totalUsers");
const totalBalanceEl = document.getElementById("totalBalance");
const totalWithdrawEl = document.getElementById("totalWithdraw");
const approvedEl = document.getElementById("approvedWithdraw");
const rejectedEl = document.getElementById("rejectedWithdraw");

// 🔐 Admin Check
onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== ADMIN_EMAIL) {
    alert("Unauthorized Access");
    location.href = "login.html";
    return;
  }

  loadWithdrawRequests();
  loadUserAnalytics();
  loadWithdrawAnalytics();
});


// ==========================
// LOAD WITHDRAW REQUESTS
// ==========================
function loadWithdrawRequests() {

  const reqRef = ref(db, "withdrawRequests");

  onValue(reqRef, (snap) => {
    list.innerHTML = "";

    snap.forEach((item) => {

      const r = item.val();
      const id = item.key;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${r.uid}</td>
        <td>₹${r.amount}</td>
        <td>${r.method}</td>
        <td><span class="status ${r.status}">${r.status}</span></td>
        <td>
          ${r.status === "pending" ? `
            <button class="btn approve">Approve</button>
            <button class="btn reject">Reject</button>
          ` : "—"}
        </td>
      `;

      if (r.status === "pending") {

        // ✅ APPROVE
        tr.querySelector(".approve").onclick = async () => {

          await update(ref(db, "withdrawRequests/" + id), {
            status: "approved"
          });

          await push(ref(db, "notifications/" + r.uid), {
            message: "Your withdrawal ₹" + r.amount + " has been APPROVED ✅",
            time: Date.now(),
            read: false
          });

        };

        // ❌ REJECT + REFUND
        tr.querySelector(".reject").onclick = async () => {

          const walletRef = ref(db, "users/" + r.uid + "/wallet");
          const snapWallet = await get(walletRef);

          let currentBalance = 0;

          if (snapWallet.exists() && snapWallet.val().balance) {
            currentBalance = snapWallet.val().balance;
          }

          await update(walletRef, {
            balance: currentBalance + r.amount
          });

          await update(ref(db, "withdrawRequests/" + id), {
            status: "rejected"
          });

          await push(ref(db, "notifications/" + r.uid), {
            message: "Your withdrawal ₹" + r.amount + " was REJECTED ❌ (Amount refunded)",
            time: Date.now(),
            read: false
          });

        };
      }

      list.appendChild(tr);
    });
  });
}


// ==========================
// USER ANALYTICS
// ==========================
function loadUserAnalytics() {

  onValue(ref(db, "users"), (snap) => {

    let totalUsers = 0;
    let totalBalance = 0;

    snap.forEach((u) => {
      totalUsers++;

      const data = u.val();

      if (data.wallet && data.wallet.balance) {
        totalBalance += data.wallet.balance;
      }
    });

    totalUsersEl.innerText = totalUsers;
    totalBalanceEl.innerText = totalBalance;
  });
}


// ==========================
// WITHDRAW ANALYTICS
// ==========================
function loadWithdrawAnalytics() {

  onValue(ref(db, "withdrawRequests"), (snap) => {

    let total = 0;
    let approved = 0;
    let rejected = 0;

    snap.forEach((w) => {

      const data = w.val();

      total += data.amount || 0;

      if (data.status === "approved") {
        approved += data.amount;
      }

      if (data.status === "rejected") {
        rejected += data.amount;
      }

    });

    totalWithdrawEl.innerText = total;
    approvedEl.innerText = approved;
    rejectedEl.innerText = rejected;
  });
}


// ==========================
// LOGOUT
// ==========================
window.logout = function () {
  signOut(auth).then(() => {
    location.href = "login.html";
  });
};
