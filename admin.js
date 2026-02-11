import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
  update,
  get
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const ADMIN_EMAIL = "admin@earnpaisa.com"; // 👈 CHANGE IF NEEDED

const firebaseConfig = {
  apiKey: "AIzaSyBc_f9XBgUi3HMpFQU40fWJdzxscfV826s",
  authDomain: "paisaeran-43a70.firebaseapp.com",
  databaseURL: "https://paisaeran-43a70-default-rtdb.firebaseio.com",
  projectId: "paisaeran-43a70"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const list = document.getElementById("withdrawList");

onAuthStateChanged(auth,(user)=>{
  if(!user || user.email !== ADMIN_EMAIL){
    alert("Unauthorized access");
    location.href="login.html";
    return;
  }

  const reqRef = ref(db,"withdrawRequests");

  onValue(reqRef,(snap)=>{
    list.innerHTML = "";
    snap.forEach(item=>{
      const r = item.val();
      const id = item.key;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${r.uid}</td>
        <td>₹${r.amount}</td>
        <td>${r.method}</td>
        <td><span class="status ${r.status}">${r.status}</span></td>
        <td>
          ${r.status==="pending" ? `
            <button class="btn approve">Approve</button>
            <button class="btn reject">Reject</button>
          ` : "—"}
        </td>
      `;

      if(r.status==="pending"){
        tr.querySelector(".approve").onclick = ()=>{
          update(ref(db,"withdrawRequests/"+id),{status:"approved"});
        };

        tr.querySelector(".reject").onclick = async ()=>{
          // refund wallet
          const walletRef = ref(db,"users/"+r.uid+"/wallet");
          const snapWallet = await get(walletRef);
          const bal = snapWallet.val().balance || 0;

          await update(walletRef,{balance:bal + r.amount});
          await update(ref(db,"withdrawRequests/"+id),{status:"rejected"});
        };
      }

      list.appendChild(tr);
    });
  });
});

window.logout = function(){
  signOut(auth).then(()=>{
    location.href="login.html";
  });
};
