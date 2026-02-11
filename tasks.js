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

  if(!tasksSnap.exists()) return;

  const userData = userSnap.val() || {};
  const completed = userData.completedTasks || {};

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

    card.innerHTML = `
      <h4>${data.title}</h4>
      <p>Reward: ₹${data.reward}</p>
      ${
        isDone
        ? "<button disabled style='background:gray;color:#fff;padding:8px;border:none;border-radius:6px'>Completed</button>"
        : `<button onclick="completeTask('${taskId}',${data.reward})"
           style="background:#22c55e;color:#fff;padding:8px;border:none;border-radius:6px">
           Complete Task
           </button>`
      }
    `;

    tasksDiv.appendChild(card);
  });
});

window.completeTask = async function(taskId,reward){
  const user = auth.currentUser;
  if(!user) return;

  const userRef = ref(db,"users/"+user.uid);

  await update(userRef,{
    ["completedTasks/"+taskId]: true
  });

  const snap = await get(userRef);
  const currentBalance = snap.val().balance || 0;

  await update(userRef,{
    balance: currentBalance + reward
  });

  alert("Task Completed! ₹"+reward+" Added");

  location.reload();
};
