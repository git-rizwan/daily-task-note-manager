document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const purposeInput = document.getElementById("purposeInput");
  const dayInput = document.getElementById("dayInput");
  const timeInput = document.getElementById("timeInput");
  const noteInput = document.getElementById("noteInput");
  const todayTaskList = document.getElementById("todayTaskList");
  const pastTaskList = document.getElementById("pastTaskList");
  const futureTaskList = document.getElementById("futureTaskList");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask(
      taskInput.value,
      purposeInput.value,
      dayInput.value,
      formatTime(timeInput.value),
      noteInput.value
    );
    taskInput.value = "";
    purposeInput.value = "";
    dayInput.value = "";
    timeInput.value = "";
    noteInput.value = "";
    saveTasks();
    renderTasks();
  });

  function addTask(taskContent, taskPurpose, taskDay, taskTime, taskNote) {
    const task = {
      content: taskContent,
      purpose: taskPurpose,
      day: taskDay,
      time: taskTime,
      note: taskNote,
      status: "incomplete",
    };
    tasks.push(task);
  }

  function editTask(index) {
    const task = tasks[index];
    const newContent = prompt("Edit your task:", task.content);
    if (newContent) {
      task.content = newContent;
      saveTasks();
      renderTasks();
    }
  }

  function editNoteTask(index) {
    const task = tasks[index];
    const newNote = prompt("Edit your note:", task.note);
    if (newNote) {
      task.note = newNote;
      saveTasks();
      renderTasks();
    }
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  function toggleTaskView(index) {
    const task = tasks[index];
    task.viewing = !task.viewing;
    saveTasks();
    renderTasks();
  }

  function formatTime(timeString) {
    const [hour, minute] = timeString.split(":");
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    const today = new Date().toISOString().split("T")[0];
    todayTaskList.innerHTML = "";
    pastTaskList.innerHTML = "";
    futureTaskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const taskDate = new Date(task.day).toISOString().split("T")[0];
      const taskDay = getDayOfWeek(new Date(task.day));
      const taskItem = document.createElement("li");
      taskItem.classList.add(task.status);

      taskItem.innerHTML = `
              <div class="task-details">
                  <span>${task.content}</span>
                  <div>
                      <a href="#" class="edit">Edit</a>
                      <a href="#" class="delete">Delete</a>
                      <a href="#" class="toggle">${
                        task.viewing ? "Close" : "View"
                      }</a>
                      <a href="#" class="editNote">Edit Note</a>
                  </div>
              </div>
              <div class="task-info" style="display: ${
                task.viewing ? "block" : "none"
              };">
                  <p>Purpose: ${task.purpose}</p>
                  <p>Day: ${task.day} (${taskDay})</p>
                  <p>Time: ${task.time}</p>
              </div>
              <div class="task-note" style="display: ${
                task.viewing ? "block" : "none"
              };">
                  <p>Note: ${task.note}</p>
              </div>
          `;

      taskItem
        .querySelector(".edit")
        .addEventListener("click", () => editTask(index));
      taskItem
        .querySelector(".delete")
        .addEventListener("click", () => deleteTask(index));
      taskItem
        .querySelector(".toggle")
        .addEventListener("click", () => toggleTaskView(index));
      taskItem
        .querySelector(".editNote")
        .addEventListener("click", () => editNoteTask(index));

      if (taskDate === today) {
        taskItem.querySelector(".edit").style.display = "inline";
        taskItem.querySelector(".delete").style.display = "inline";
        taskItem.querySelector(".editNote").style.display = "inline";
        todayTaskList.appendChild(taskItem);
      } else if (task.status === "complete") {
        taskItem.querySelector(".edit").style.display = "none";
        taskItem.querySelector(".editNote").style.display = "none";
        pastTaskList.appendChild(taskItem);
      } else if (taskDate < today) {
        taskItem.querySelector(".edit").style.display = "none";
        taskItem.querySelector(".editNote").style.display = "none";
        pastTaskList.appendChild(taskItem);
      } else {
        taskItem.querySelector(".edit").style.display = "inline";
        taskItem.querySelector(".delete").style.display = "inline";
        taskItem.querySelector(".editNote").style.display = "inline";
        futureTaskList.appendChild(taskItem);
      }
    });
  }

  function getDayOfWeek(date) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  }

  renderTasks();
});
