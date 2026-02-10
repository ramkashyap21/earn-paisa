import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get, set, update } 
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

const taskBox = document.getElementById("tasks");

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const tasksRef = ref(db, "tasks");
  const completedRef = ref(db, "users/" + user.uid + "/completedTasks");
  const walletRef = ref(db, "users/" + user.uid + "/wallet");

  const tasksSnap = await get(tasksRef);
  const completedSnap = await get(completedRef);

  const completed = completedSnap.exists() ? completedSnap.val() : {};

  tasksSnap.forEach(task => {
    const t = task.val();
    const taskId = task.key;

    const div = document.createElement("div");
    div.style = "background:#fff;padding:15px;border-radius:10px;margin:10px 0";

    div.innerHTML = `
      <h4>${t.title}</h4>
      <p>Reward: ₹${t.reward}</p>
      <button ${completed[taskId] ? "disabled" : ""}>
        ${completed[taskId] ? "Completed" : "Complete Task"}
      </button>
    `;

    div.querySelector("button").onclick = async () => {
      if (completed[taskId]) return;

      // Mark task completed
      await set(ref(db, "users/" + user.uid + "/completedTasks/" + taskId), true);

      // Add reward to wallet
      const walletSnap = await get(walletRef);
      const balance = walletSnap.val().balance || 0;
      await update(walletRef, { balance: balance + t.reward });

      alert("₹" + t.reward + " added to wallet");
      location.reload();
    };

    taskBox.appendChild(div);
  });
});
