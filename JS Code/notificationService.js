class NotificationService {
  constructor() {
    this.tasks = this.loadTasks();
    this.notificationTimeframe = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    this.reminderOffset = 60 * 60 * 1000; // Default reminder offset: 1 hour
    this.loadUserPreferences();
    this.checkUpcomingTasks();
    setInterval(() => this.checkUpcomingTasks(), 60 * 60 * 1000); // Check every hour
  }

  loadTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem("userPreferences"));
    if (preferences) {
      this.reminderOffset = preferences.reminderOffset || this.reminderOffset;
    }
  }

  checkUpcomingTasks() {
    const currentTime = new Date();
    this.tasks.forEach((task) => {
      const timeDifference = task.dueDate - currentTime;
      if (timeDifference > 0 && timeDifference <= this.notificationTimeframe) {
        this.scheduleNotification(task);
      }
    });
  }

  scheduleNotification(task) {
    const reminderTime = task.dueDate - this.reminderOffset;
    const currentTime = new Date();

    if (reminderTime > currentTime) {
      const timeUntilNotification = reminderTime - currentTime;
      setTimeout(() => this.showNotification(task), timeUntilNotification);
    }
  }

  showNotification(task) {
    if (Notification.permission === "granted") {
      const notification = new Notification("Upcoming Task: " + task.title, {
        body: `Due: ${task.dueDate.toLocaleString()}\nPriority: ${
          task.priority
        }`,
        icon: "path/to/icon.png", // Replace with your icon path
      });

      notification.onclick = () => {
        this.handleNotificationClick(task);
      };

      notification.onclose = () => {
        this.recordNotification(task.title);
      };
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          this.showNotification(task);
        }
      });
    }
  }

  handleNotificationClick(task) {
    alert(`You clicked on the notification for task: ${task.title}`);
  }

  recordNotification(taskTitle) {
    const history =
      JSON.parse(localStorage.getItem("notificationHistory")) || [];
    history.push({ title: taskTitle, timestamp: new Date() });
    localStorage.setItem("notificationHistory", JSON.stringify(history));
  }
}
