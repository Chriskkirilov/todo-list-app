class NotificationService {
  constructor() {
    this.tasks = this.loadTasks().map(task => ({
      ...task,
      dueDate: new Date(task.dueDate)
    }));
    this.notificationTimeframe = 24 * 60 * 60 * 1000;
    this.reminderOffset = 60 * 60 * 1000;
    this.iconPath = "path/to/icon.png";
    this.loadUserPreferences();
    this.checkUpcomingTasks();
    setInterval(() => this.checkUpcomingTasks(), this.getNotificationInterval());
  }

  loadTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem("userPreferences"));
    if (preferences) {
      this.reminderOffset = preferences.reminderOffset || this.reminderOffset;
      this.iconPath = preferences.iconPath || this.iconPath;
    }
  }

  getNotificationInterval() {
    const preferences = JSON.parse(localStorage.getItem("userPreferences"));
    return preferences ? preferences.notificationInterval || (60 * 60 * 1000) : (60 * 60 * 1000);
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
        body: `Due: ${task.dueDate.toLocaleString()}\nPriority: ${task.priority}`,
        icon: this.iconPath,
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
        } else {
          console.error('Notification permission denied');
        }
      }).catch(error => {
        console.error('Error requesting notification permission:', error);
      });
    }
  }

  handleNotificationClick(task) {
    alert(`You clicked on the notification for task: ${task.title}`);
  }

  recordNotification(taskTitle) {
    const history = JSON.parse(localStorage.getItem("notificationHistory")) || [];
    history.push({ title: taskTitle, timestamp: new Date() });
    localStorage.setItem("notificationHistory", JSON.stringify(history));
    
    if (history.length > 100) {
      history.shift();
    }
  }
}
