import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue, update } 
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

const notifCount = document.getElementById("notifCount");

onAuthStateChanged(auth,(user)=>{
  if(!user) return;

  const notifRef = ref(db,"notifications/"+user.uid);

  onValue(notifRef,(snap)=>{
    let count = 0;

    snap.forEach(n=>{
      if(n.val().read === false){
        count++;
        showAlert(n.key,n.val().message);
      }
    });

    notifCount.innerText = count;
  });
});

function showAlert(id,message){
  alert(message);

  // mark as read
  const authUser = auth.currentUser;
  update(
    ref(db,"notifications/"+authUser.uid+"/"+id),
    {read:true}
  );
}
