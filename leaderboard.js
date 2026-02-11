import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBc_f9XBgUi3HMpFQU40fWJdzxscfV826s",
  authDomain: "paisaeran-43a70.firebaseapp.com",
  databaseURL: "https://paisaeran-43a70-default-rtdb.firebaseio.com",
  projectId: "paisaeran-43a70"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const list = document.getElementById("leaderboardList");

onValue(ref(db,"users"), (snapshot)=>{
  if(!snapshot.exists()){
    list.innerHTML="No Users Yet";
    return;
  }

  let users=[];

  snapshot.forEach(child=>{
    const data=child.val();
    users.push({
      name: data.name || "User",
      balance: data.balance || 0
    });
  });

  users.sort((a,b)=> b.balance - a.balance);

  list.innerHTML="";

  users.slice(0,10).forEach((user,index)=>{
    let medal="";

    if(index===0) medal="🥇";
    else if(index===1) medal="🥈";
    else if(index===2) medal="🥉";
    else medal="⭐";

    const div=document.createElement("div");
    div.style.padding="8px 0";
    div.innerHTML=`
      ${medal} ${user.name} — ₹${user.balance}
    `;

    list.appendChild(div);
  });
});
