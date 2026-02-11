import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getDatabase, ref, get } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBc_f9XBgUi3HMpFQU40fWJdzxscfV826s",
  authDomain: "paisaeran-43a70.firebaseapp.com",
  databaseURL: "https://paisaeran-43a70-default-rtdb.firebaseio.com",
  projectId: "paisaeran-43a70",
  storageBucket: "paisaeran-43a70.firebasestorage.app",
  messagingSenderId: "856454531468",
  appId: "1:856454531468:web:92ab5b407f2def2cb7aea9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const list = document.getElementById("leaderboardList");

async function loadLeaderboard() {

  const snap = await get(ref(db,"users"));

  if(!snap.exists()){
    list.innerHTML = "No Users Found";
    return;
  }

  let users = [];

  snap.forEach(child=>{
    const data = child.val();
    users.push({
      name: data.email || "User",
      balance: data.balance || 0
    });
  });

  users.sort((a,b)=> b.balance - a.balance);

  list.innerHTML = "";

  users.slice(0,10).forEach((user,index)=>{
    list.innerHTML += `
      <div style="
        padding:12px;
        margin:8px 0;
        background:#fff;
        border-radius:10px;
        box-shadow:0 4px 10px rgba(0,0,0,0.05);
      ">
        <b>#${index+1}</b> ${user.name}
        <span style="float:right;color:#16a34a">
          ₹${user.balance}
        </span>
      </div>
    `;
  });

}

loadLeaderboard();
