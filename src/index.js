import "./style.css";
const {
  format,
  parse,
  addDays,
  formatDistanceToNowStrict,
} = require("date-fns");

class Task {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isComplete = false;
  }

  showDetail() {
    var details = "";
    details += `Title : ${this.title}\n`;
    details += `Description : ${this.description}\n`;
    details += `Due date : ${this.dueDate}\n`;
    details += `Priority : ${this.priority}\n`;
    details += `Is complete : ${this.isComplete}\n`;
    return details;
  }
}

class TaskManager {
  constructor(projectName) {
    this.projectName = projectName;
    this.tasks = [];
    const menuX = new Menu();
  }

  addTask() {
    var dueDate;
    const title = prompt("Input the task's title : ");
    const description = prompt("Input the task's description : ");
    do {
      try {
        const dueDatePre = prompt("Input the task's due date (DD/MM/YYYY) : ");
        dueDate = format(
          parse(dueDatePre, "dd/MM/yyyy", new Date()),
          "dd/MM/yyyy"
        );
      } catch (err) {
        dueDate = null;
        alert("Please input a valid date");
      }
      console.log(dueDate);
    } while (dueDate == null);
    const priority = prompt("Input the task's priority (Low/Medium/High) : ");
    this.tasks.push(new Task(title, description, dueDate, priority));
    alert("Task has been added!");
  }

  getTasks() {
    return this.tasks;
  }

  openCertainTask(task) {
    console.log(task);
    if (task != null) {
      return task.showDetail(); // Ga kerecognize sebagai function
    }
    return null;
  }

  deleteCertainTask(taskIndex) {
    this.tasks.splice(taskIndex, 1);
    return this.tasks;
  }

  editCertainTask(task, taskManager, numberOfDay, taskIndex) {
    // taskManager.getTasks();
    // var task = "";
    task = taskManager.openCertainTask(task);
    task += "Input which info to edit";
    var name = prompt(task);
    if (
      name == "title" ||
      name == "priority" ||
      name == "due date" ||
      name == "description"
    ) {
      if (name == "title") {
        this.tasks[taskIndex].title = prompt(
          `${name} : ${this.tasks[taskIndex].title}\nInput the new value`
        );
      } else if (name == "due date") {
        this.tasks[taskIndex].dueDate = prompt(
          `${name} : ${this.tasks[taskIndex].dueDate}\nInput the new value`
        );
      } else if (name == "description") {
        this.tasks[taskIndex].description = prompt(
          `${name} : ${this.tasks[taskIndex].description}\nInput the new value`
        );
      } else if (name == "priority") {
        this.tasks[taskIndex].priority = prompt(
          `${name} : ${this.tasks[taskIndex].priority}\nInput the new value`
        );
      }
      menuX.chooseTask(numberOfDay, false, true);
    } else {
      alert("The info isn't valid");
      this.editCertainTask(
        this.tasks[this.taskIndex],
        this.taskManager,
        numberOfDay
      ); // Fix
    }
  }

  getTodayTask() {
    var todayTask = [];
    for (var task of this.tasks) {
      if (task.dueDate == format(new Date(), "dd/MM/yyyy")) {
        todayTask.push(task);
      }
    }
    return todayTask;
  }

  getTomorrowTask() {
    var tomorrowTask = [];
    for (var task of this.tasks) {
      if (task.dueDate == format(addDays(new Date(), 1), "dd/MM/yyyy")) {
        tomorrowTask.push(task);
      }
    }
    return tomorrowTask;
  }

  getWeekTask() {
    var weekTask = [];
    for (var task of this.tasks) {
      if (
        formatDistanceToNowStrict(new Date("2024", "06", "23"), {
          unit: "day",
        }).substring(
          0,
          formatDistanceToNowStrict(new Date("2024", "6", "23"), {
            unit: "day",
          }).indexOf(" ")
        ) >= 0 &&
        formatDistanceToNowStrict(new Date("2024", "6", "23"), {
          unit: "day",
        }).substring(
          0,
          formatDistanceToNowStrict(new Date("2024", "6", "23"), {
            unit: "day",
          }).indexOf(" ")
        ) < 7
      ) {
        weekTask.push(task);
      }
    }
    return weekTask;
  }

  markUpdate(taskIndex, numberOfDay) {
    this.tasks[taskIndex].isComplete = !this.tasks[taskIndex].isComplete;
    menuX.chooseTask(numberOfDay, false, true);
  }
}

class Project {
  constructor(name) {
    this.name = name;
    this.taskManager = new TaskManager(name);
  }
}

class ProjectManager {
  constructor() {
    this.projects = [];
  }

  addProject(name) {
    let project = new Project(name);
    this.projects.push(project);
  }

  getAllProjects() {
    return this.projects;
  }

  openCertainProject(projectIndex) {
    if (this.projects[projectIndex] != null) {
      return this.projects[projectIndex].taskManager;
    } else {
      return null;
    }
  }
}

class Menu {
  constructor() {
    this.options = "";
    this.projectIndex = "";
    this.taskManager;
    this.taskIndex = "";
    this.tasks = [];
  }

  welcome() {
    alert("Welcome to to do app, choose your project!");
    this.showProjects();
  }

  showProjects() {
    this.options = "";
    for (var [i, project] of projectManager.getAllProjects().entries()) {
      this.options += `${i + 1}. ${project.name}\n`;
    }
    if (this.options == "") {
      this.options += "No project is available\n";
    }
    this.options +=
      "Input the number. If you want to create a new project, input 0\n";
    this.options += "To quit the app input x";
    this.projectIndex = prompt(this.options);
    this.chooseProject();
  }

  chooseProject() {
    console.log(this.projectIndex);
    if (
      this.projectIndex != 0 &&
      Number.isInteger(parseInt(this.projectIndex))
    ) {
      this.projectIndex -= 1;
      //If project Indexnya angka valid
      this.taskManager = projectManager.openCertainProject(this.projectIndex); //Cek
      if (this.taskManager == null) {
        // Kalau null berarti kosong, balik ke showProjects lagi
        alert("The input is not valid");
        this.showProjects();
      }
      this.showDates(); // Kalau ada lgsg buka list dates yg mau dipilih
    } else if (Number.isInteger(parseInt(this.projectIndex))) {
      this.projectIndex -= 1;
      //Angka 0
      console.log("test");
      projectManager.addProject(prompt("Input your project name")); //Bikin project baru
      this.taskManager = projectManager.openCertainProject(
        projectManager.getAllProjects().length - 1
      );
      this.showProjects();
    } else if (this.projectIndex == "x") {
      //X berarti nutup app
      return null;
    } else {
      //Unknown input
      alert("What did you input?");
      this.showProjects();
    }
    // this.showTasks(taskManager);
  }

  showTasks(numberOfDay) {
    var empty = false;
    var i = 1;
    this.options = "";
    this.options += "List of your tasks: \n";
    for (var task of this.tasks) {
      this.options += `${i}. ${task.title}\n`;
      i++;
    }
    if (this.options == "List of your tasks: \n") {
      this.options += `There's no available tasks\n`;
      empty = true;
    }
    this.options +=
      "Write down the number. If you want to create a new task, insert 0\nTo select other project, input x";
    this.taskIndex = prompt(this.options);
    this.chooseTask(numberOfDay, empty);
  }

  chooseTask(numberOfDay, empty, afterEdit) {
    if (afterEdit) {
      this.taskIndex += 1;
    }
    console.log("test 1");
    var task;
    if (this.taskIndex == "x") {
      this.showDates();
    } else if (
      this.taskIndex != 0 &&
      Number.isInteger(parseInt(this.taskIndex))
    ) {
      console.log("test 2");
      this.taskIndex -= 1;
      if (empty) {
        alert("Input value is not valid");
        this.showTasks(numberOfDay);
      } else {
        task = this.taskManager.openCertainTask(this.tasks[this.taskIndex]); // Make this based on date ?
        if (task == null) {
          alert("Invalid input");
          this.showTasks(numberOfDay);
        } else {
          task +=
            "What do you want to do with this task?\n1 to update complete\n2 to edit task\n3 to delete task\nx to go back to task list";
          const answer = prompt(task);
          switch (answer) {
            case "1":
              alert("Task is marked as complete");
              this.taskManager.markUpdate(this.taskIndex, numberOfDay);
              break;
            case "2":
              this.taskManager.editCertainTask(
                this.tasks[this.taskIndex],
                this.taskManager,
                numberOfDay,
                this.taskIndex
              );
              break;
            case "3":
              alert("Task is deleted");
              this.tasks = this.taskManager.deleteCertainTask(this.taskIndex);
              this.showTasks(numberOfDay);
              break;
            case "x":
              this.showTasks(numberOfDay);
              break;
            default:
              alert("Input invalid.");
              this.chooseTask(this.taskIndex);
          }
        }
      }
      // this.showTasks(taskManager);
    } else if (Number.isInteger(parseInt(this.taskIndex))) {
      console.log("test 3");
      this.taskIndex -= 1;
      this.taskManager.addTask(); //Habis ngedit malah masuk ke new task ???
      switch (numberOfDay) {
        case 1:
          this.tasks = this.taskManager.getTodayTask();
          this.showTasks(1);
          break;
        case 2:
          this.tasks = this.taskManager.getTomorrowTask();
          this.showTasks(2);
          break;
        case 3:
          this.tasks = this.taskManager.getWeekTask();
          this.showTasks(3);
          break;
        case 4:
          this.tasks = this.taskManager.getTasks();
          this.showTasks(4);
          break;
      }
    } else {
      alert("What did you input?");
      this.showTasks(numberOfDay);
    }
  }

  showDates() {
    var options = "";
    options += "Please select dates to see\n";
    options += "1. Today\n2. Tomorrow\n3. This week\n4. All\n";
    options += "Write down the number.\nTo select other project, input x";
    this.chooseDate(prompt(options));
  }

  chooseDate(date) {
    if (date == 1) {
      //Today
      this.tasks = this.taskManager.getTodayTask();
      this.showTasks(1);
    } else if (date == 2) {
      //Tomorrow
      this.tasks = this.taskManager.getTomorrowTask();
      this.showTasks(2);
    } else if (date == 3) {
      this.tasks = this.taskManager.getWeekTask();
      this.showTasks(3);
    } else if (date == 4) {
      this.tasks = this.taskManager.getTasks();
      this.showTasks(4);
    } else if (date == "x") {
      this.showProjects();
    } else {
      alert("Input is invalid.");
      this.showDates();
    }
  }

  manageTask(task) {
    alert(task);
  }
}

var projectManager = new ProjectManager();
projectManager.addProject("Senin");
// projectManager.addProject("Selasa");
// projectManager.addProject("Rabu");

const menuX = new Menu();
// menuX.welcome();
