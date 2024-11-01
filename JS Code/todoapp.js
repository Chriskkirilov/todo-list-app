let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

function addTask(taskText, priority = "low", dueDate = null, tags = []) {
  if (!taskText) {
    console.log("Task cannot be empty!");
    return;
  }
  const task = { text: taskText, completed: false, priority, dueDate, tags };
  todoList.push(task);
  saveTasks();
  console.log(`Added Task: "${taskText}" with priority "${priority}"`);
}

function viewTasks(filter = "all", sortBy = "priority") {
  if (todoList.length === 0) {
    console.log("No tasks found.");
    return;
  }

  let tasksToShow = [...todoList];
  if (filter === "completed")
    tasksToShow = tasksToShow.filter((task) => task.completed);
  if (filter === "pending")
    tasksToShow = tasksToShow.filter((task) => !task.completed);

  if (sortBy === "priority") {
    tasksToShow.sort(
      (a, b) =>
        (a.priority === "high" ? -1 : a.priority === "medium" ? 0 : 1) -
        (b.priority === "high" ? -1 : b.priority === "medium" ? 0 : 1)
    );
  } else if (sortBy === "dueDate") {
    tasksToShow.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  console.log(`\nYour To-Do List (${filter} sorted by ${sortBy}):`);
  tasksToShow.forEach((task, index) => {
    const status = task.completed ? "[✔]" : "[ ]";
    const priority =
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    const dueDate = task.dueDate ? ` (Due: ${task.dueDate})` : "";
    const tags = task.tags.length ? ` [Tags: ${task.tags.join(", ")}]` : "";
    console.log(
      `${index + 1}. ${status} ${
        task.text
      } - Priority: ${priority}${dueDate}${tags}`
    );
  });
}

function completeTask(taskNumber) {
  if (taskNumber <= 0 || taskNumber > todoList.length) {
    console.log("Invalid task number!");
    return;
  }
  todoList[taskNumber - 1].completed = true;
  saveTasks();
  console.log(`Task "${todoList[taskNumber - 1].text}" marked as complete.`);
}

function deleteTask(taskNumber) {
  if (taskNumber <= 0 || taskNumber > todoList.length) {
    console.log("Invalid task number!");
    return;
  }
  const removedTask = todoList.splice(taskNumber - 1, 1);
  saveTasks();
  console.log(`Deleted Task: "${removedTask[0].text}"`);
}

function updateTask(
  taskNumber,
  newText = null,
  newPriority = null,
  newDueDate = null,
  newTags = null
) {
  if (taskNumber <= 0 || taskNumber > todoList.length) {
    console.log("Invalid task number!");
    return;
  }
  const task = todoList[taskNumber - 1];
  if (newText) task.text = newText;
  if (newPriority) task.priority = newPriority;
  if (newDueDate) task.dueDate = newDueDate;
  if (newTags) task.tags = newTags;
  saveTasks();
  console.log(`Updated Task ${taskNumber}`);
}

function searchTasks(keyword) {
  if (!keyword) {
    console.log("Please provide a search keyword.");
    return;
  }
  const results = todoList.filter((task) =>
    task.text.toLowerCase().includes(keyword.toLowerCase())
  );
  if (results.length === 0) {
    console.log(`No tasks found containing "${keyword}".`);
  } else {
    console.log(`\nSearch Results for "${keyword}":`);
    results.forEach((task, index) => {
      const status = task.completed ? "[✔]" : "[ ]";
      const priority =
        task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
      const dueDate = task.dueDate ? ` (Due: ${task.dueDate})` : "";
      const tags = task.tags.length ? ` [Tags: ${task.tags.join(", ")}]` : "";
      console.log(
        `${index + 1}. ${status} ${
          task.text
        } - Priority: ${priority}${dueDate}${tags}`
      );
    });
  }
}

function saveTasks() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

function clearCompletedTasks() {
  todoList = todoList.filter((task) => !task.completed);
  saveTasks();
  console.log("Cleared all completed tasks.");
}

addTask("Buy groceries", "medium", "2023-11-15", ["shopping", "chores"]);
addTask("Complete JavaScript project", "high", "2023-11-18", [
  "work",
  "coding",
]);
addTask("Read a book", "low", null, ["leisure"]);

viewTasks();
completeTask(2);
viewTasks("completed");
viewTasks("pending", "dueDate");
deleteTask(1);
viewTasks();
searchTasks("JavaScript");
clearCompletedTasks();
viewTasks();
