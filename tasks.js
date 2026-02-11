import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getAuth } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getDatabase, 
  ref, 
  get, 
  update 
} from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


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
const auth = getAuth(app);
const db = getDatabase(app);

const tasksContainer = document.getElementById("tasks");

const tasks = [
  { id:"visit", title:"Visit Website", reward:10 },
  { id:"download", title:"Download App", reward:20 },
  { id:"watch", title:"Watch Video", reward:5 }
];

auth.onAuthStateChanged(async (user)=>{
  if(!user) return;

  const userRef = ref(db,"users/"+user.uid);
  const snap = await get(userRef);
  const userData = snap.exists() ? snap.val() : {};

  tasksContainer.innerHTML="";

  tasks.forEach(task=>{
    const lastTime = userData.tasks?.[task.id] || 0;
    const now = Date.now();
    const cooldown = 24*60*60*1000;

    const card = document.createElement("div");
    card.style.marginBottom="15px";
    card.style.padding="15px";
    card.style.background="#f9fafb";
    card.style.borderRadius="12px";

    let buttonHTML;

    if(now - lastTime < cooldown){
      const hoursLeft = Math.ceil((cooldown-(now-lastTime))/(1000*60*60));
      buttonHTML = `<button disabled style="
        background:#aaa;
        color:#fff;
        padding:10px 15px;
        border:none;
        border-radius:8px;
        margin-top:8px;
      ">
      ⏳ Try Again in ${hoursLeft}h
      </button>`;
    } else {
      buttonHTML = `<button onclick="completeTask('${task.id}',${task.reward})"
        style="
        background:#22c55e;
        color:#fff;
        padding:10px 15px;
        border:none;
        border-radius:8px;
        margin-top:8px;
        cursor:pointer;
      ">
      Complete Task
      </button>`;
    }

    card.innerHTML = `
      <h4>${task.title}</h4>
      <p>Reward: ₹${task.reward}</p>
      ${buttonHTML}
    `;

    tasksContainer.appendChild(card);
  });
});


window.completeTask = async function(taskId,reward){
  const user = auth.currentUser;
  if(!user) return;

  const userRef = ref(db,"users/"+user.uid);
  const snap = await get(userRef);

  let currentBalance = 0;
  let userData = {};

  if(snap.exists()){
    userData = snap.val();
    currentBalance = userData.balance || 0;
  }

  const updates = {};
  updates["balance"] = currentBalance + reward;
  updates["tasks/"+taskId] = Date.now();

  await update(userRef,updates);

  // 🔥 SUCCESS POPUP CALL
  if(typeof showSuccessPopup === "function"){
    showSuccessPopup(reward);
  }

  location.reload();
};
