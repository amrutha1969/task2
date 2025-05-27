const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filterBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

let tasks = [];
let currentFilter = 'all';

function renderTasks() {
  taskList.innerHTML = '';
  let filteredTasks = tasks;
  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(t => !t.completed);
  }

  if (filteredTasks.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.color = '#666';
    emptyMessage.textContent = 'No tasks found.';
    taskList.appendChild(emptyMessage);
    return;
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    // Task text span or edit input
    let taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = task.text;

    li.appendChild(taskSpan);

    // Done button
    const doneBtn = document.createElement('button');
    doneBtn.textContent = task.completed ? 'Undo' : 'Done';
    doneBtn.className = 'taskBtn doneBtn';
    doneBtn.onclick = () => {
      tasks[index].completed = !tasks[index].completed;
      renderTasks();
    };
    li.appendChild(doneBtn);

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'taskBtn editBtn';
    editBtn.onclick = () => {
      enterEditMode(li, task, index);
    };
    li.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'taskBtn deleteBtn';
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      renderTasks();
    };
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

function enterEditMode(li, task, index) {
  li.innerHTML = '';

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.value = task.text;
  editInput.className = 'editInput';
  li.appendChild(editInput);
  editInput.focus();

  // Save button
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'taskBtn editBtn';
  saveBtn.onclick = () => {
    const newText = editInput.value.trim();
    if (newText === '') {
      alert('Task cannot be empty.');
      editInput.focus();
      return;
    }
    tasks[index].text = newText;
    renderTasks();
  };
  li.appendChild(saveBtn);

  // Cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'taskBtn deleteBtn';
  cancelBtn.onclick = () => renderTasks();
  li.appendChild(cancelBtn);
}

addTaskBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (!text) {
    alert('Please enter a task');
    return;
  }
  tasks.push({ text, completed: false });
  taskInput.value = '';
  renderTasks();
});

taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTaskBtn.click();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderTasks();
  });
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all tasks?')) {
    tasks = [];
    renderTasks();
  }
});

// Initial render
renderTasks();
