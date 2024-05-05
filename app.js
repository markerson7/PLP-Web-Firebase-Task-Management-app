const firebaseConfig = {
    apiKey: "AIzaSyC3BE3aO0P-CxcWBDRcjJIs-f2lFDGPO-Y",
    authDomain: "task-management-app-513a2.firebaseapp.com",
    projectId: "task-management-app-513a2",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);


const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Function to render tasks
function renderTasks(doc) {
    const li = document.createElement('li');
    li.setAttribute('data-id', doc.id);
    li.innerHTML = `
        <span>${doc.data().task}</span>
        <div>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    taskList.appendChild(li);

    // Delete task
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('tasks').doc(id).delete();
    });

    // Edit task
    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        const task = prompt('Edit Task:', doc.data().task);
        if (task) {
            db.collection('tasks').doc(id).update({ task });
        }
    });
}

// Display tasks from Firestore
db.collection('tasks').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            renderTasks(change.doc);
        } else if (change.type === 'removed') {
            const li = taskList.querySelector(`[data-id='${change.doc.id}']`);
            taskList.removeChild(li);
        }
    });
});

// Add new task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = taskInput.value.trim();
    if (task !== '') {
        db.collection('tasks').add({ task });
        taskInput.value = '';
    }
});
