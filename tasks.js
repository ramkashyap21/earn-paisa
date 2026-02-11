import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get, update } 
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

const tasksDiv = document.getElementById("tasks");

auth.onAuthStateChanged(async(user)=>{
  if(!user) return;

  const tasksSnap = await get(ref(db,"tasks"));
  const userSnap = await get(ref(db,"users/"+user.uid));

  if(!tasksSnap.exists()){
    tasksDiv.innerHTML="No Tasks Available";
    return;
  }

  const userData = userSnap.val() || {};
  const completed = userData.completedTasks || {};

  tasksDiv.innerHTML="";

  tasksSnap.forEach(task=>{
    const data = task.val();
    const taskId = task.key;

    const card = document.createElement("div");
    card.style.margin="15px 0";
    card.style.padding="15px";
    card.style.background="#f1f5f9";
    card.style.borderRadius="12px";

    const title = document.createElement("h4");
    title.innerText = data.title;

    const reward = document.createElement("p");
    reward.innerText = "Reward: ₹"+data.reward;

    const btn = document.createElement("button");
    btn.className="btn";
    btn.innerText="Complete Task";

    const timer = document.createElement("span");
    timer.style.display="block";
    timer.style.marginTop="8px";
    timer.style.fontSize="14px";
    timer.style.color="#555";

    if(completed[taskId]){
      const lastTime = completed[taskId];
      const diff = Date.now() - lastTime;
      const remaining = 86400000 - diff;

      if(remaining > 0){
        btn.disabled = true;
        btn.style.background="#9ca3af";

        startCountdown(timer, remaining);
      }
    }

    btn.onclick = async()=>{
      const userRef = ref(db,"users/"+user.uid);

      const newBalance = (userData.balance||0) + data.reward;

      await update(userRef,{
        balance:newBalance,
        ["completedTasks/"+taskId]: Date.now()
      });

      alert("₹"+data.reward+" Added Successfully!");
      location.reload();
    };

    card.appendChild(title);
    card.appendChild(reward);
    card.appendChild(btn);
    card.appendChild(timer);
    tasksDiv.appendChild(card);
  });
});

function startCountdown(el, ms){
  function updateTimer(){
    if(ms <= 0){
      el.innerText="";
      return;
    }

    let hours = Math.floor(ms/3600000);
    let minutes = Math.floor((ms%3600000)/60000);
    let seconds = Math.floor((ms%60000)/1000);

    el.innerText = "⏳ Try Again in " +
      String(hours).padStart(2,"0")+":"+
      String(minutes).padStart(2,"0")+":"+
      String(seconds).padStart(2,"0");

    ms -= 1000;
  }

  updateTimer();
  setInterval(updateTimer,1000);
}
