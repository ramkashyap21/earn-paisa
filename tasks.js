import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  get, 
  update 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

onAuthStateChanged(auth, async(user)=>{
  if(!user) return;

  const tasksSnap = await get(ref(db,"tasks"));
  const userSnap = await get(ref(db,"users/"+user.uid));

  if(!tasksSnap.exists()) {
    tasksDiv.innerHTML = "<p>No Tasks Available</p>";
    return;
  }

  const userData = userSnap.val() || {};
  const completed = userData.completedTasks || {};
  const currentBalance = userData.balance || 0;

  tasksDiv.innerHTML = "";

  tasksSnap.forEach(task=>{
    const taskId = task.key;
    const data = task.val();
    const isDone = completed[taskId];

    const card = document.createElement("div");
    card.style.background="#fff";
    card.style.padding="15px";
    card.style.margin="10px 0";
    card.style.borderRadius="10px";
    card.style.boxShadow="0 2px 8px rgba(0,0,0,.1)";

    const btn = document.createElement("button");
    btn.style.padding="8px";
    btn.style.border="none";
    btn.style.borderRadius="6px";
    btn.style.color="#fff";

    if(isDone){
      btn.innerText = "Completed";
      btn.style.background = "gray";
      btn.disabled = true;
    } else {
      btn.innerText = "Complete Task";
      btn.style.background = "#22c55e";

      btn.addEventListener("click", async()=>{
        await update(ref(db,"users/"+user.uid),{
          ["completedTasks/"+taskId]: true,
          balance: currentBalance + data.reward
        });

        alert("₹"+data.reward+" Added!");
        location.reload();
      });
    }

    card.innerHTML = `
      <h4>${data.title}</h4>
      <p>Reward: ₹${data.reward}</p>
    `;

    card.appendChild(btn);
    tasksDiv.appendChild(card);
  });
});
