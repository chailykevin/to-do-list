import "./style.css";

class Task {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  showDetail() {
    var details = "";
    details += `Title : ${this.title}\n`;
    details += `Description : ${this.description}\n`;
    details += `dueDate : ${this.dueDate}\n`;
    details += `Priority : ${this.priority}\n`;
    alert(details);
  }
}

class TaskManager {
  constructor(projectName) {
    this.projectName = projectName;
    this.tasks = [];
  }

  addTask(title, description, dueDate, priority) {
    this.tasks.push(new Task(title, description, dueDate, priority));
    alert("Task has been added!");
  }

  getTasks() {
    return this.tasks;
  }

  openCertainTask(taskIndex) {
    alert(this.tasks[taskIndex]);
    return this.tasks[taskIndex].showDetail();
    // return this.tasks[taskIndex].taskManager;
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
    return this.projects[projectIndex].taskManager;
  }
}

class Menu {
  constructor() {
    this.welcome();
  }

  welcome() {
    alert("Welcome to to do app, choose your project!");
    this.showProjects();
  }

  showProjects() {
    var options = "";
    for (var [i, project] of projectManager.getAllProjects().entries()) {
      options += `${i + 1}. ${project.name}\n`;
    }
    if (options == "") {
      options += "No project is available\n";
    }
    options += "Input the number. If you want to create a new project, input 0";
    this.chooseProject(prompt(options));
  }

  chooseProject(projectIndex) {
    var taskManager;
    if (projectIndex != 0 && Number.isInteger(parseInt(projectIndex))) {
      taskManager = projectManager.openCertainProject(projectIndex - 1);
    } else if (Number.isInteger(parseInt(projectIndex))) {
      projectManager.addProject(prompt("Input your project name"));
      taskManager = projectManager.openCertainProject(
        projectManager.getAllProjects().length - 1
      );
    } else {
      alert("What did you input?");
      this.showProjects();
    }
    this.showTasks(taskManager);
  }

  showTasks(taskManager) {
    // taskManager.addTask("Jokowi", "Indonesia", "14-05-04", "Low");
    console.log(taskManager);
    var options = "";
    options += "List of your tasks: \n";
    for (var [i, task] of taskManager.getTasks().entries()) {
      options += `${i + 1}. ${task.title}\n`;
    }
    console.log(options);
    if (options == "List of your tasks: \n") {
      options += `There's no available tasks\n`;
    }
    options +=
      "Write down the number. If you want to create a new task, insert 0\nTo select other project, input x";
    this.chooseTask(prompt(options), taskManager);
  }

  chooseTask(taskIndex, taskManager) {
    var task;
    console.log(Number.isInteger(parseInt(taskIndex)));
    if (taskIndex == "x") {
      this.showProjects();
    } else if (taskIndex != 0 && Number.isInteger(parseInt(taskIndex))) {
      task = taskManager.openCertainTask(taskIndex - 1);
      this.showTasks(taskManager);
    } else if (Number.isInteger(parseInt(taskIndex))) {
      const title = prompt("Input the task's title : ");
      const description = prompt("Input the task's description : ");
      const dueDate = prompt("Input the task's due date (DD-MM-YYYY) : ");
      const priority = prompt("Input the task's priority (Low/Medium/High) : ");
      taskManager.addTask(title, description, dueDate, priority);
      this.showTasks(taskManager);
    } else {
      alert("What did you input?");
      this.showTasks(taskManager);
    }
  }
}

const insideProject = function () {};

var projectManager = new ProjectManager();
projectManager.addProject("Senin");
projectManager.addProject("Selasa");
projectManager.addProject("Rabu");

const menuX = new Menu();
