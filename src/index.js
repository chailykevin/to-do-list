import "./style.css";

class Task {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}

class TaskManager {
  constructor(projectName) {
    this.projectName = projectName;
    this.tasks = [];
  }

  addTask(title, description, dueDate, priority) {
    this.tasks.push(new Task(title, description, dueDate, priority));
  }

  getTasks() {
    return this.tasks;
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
    alert(this.projects[projectIndex].name);
    return this.projects[projectIndex].taskManager;
  }
}

const menu = function () {
  var options = "";
  var project;
  alert("Welcome to to do app, choose your project!");
  for (var [i, project] of projectManager.getAllProjects().entries()) {
    options += `${i + 1}. ${project.name}\n`;
  }
  if (options == "") {
    options += "No project is available\n";
  }
  options +=
    "Write down the number. If you want to create a new project, insert 0";
  var projectIndex = prompt(options);
  if (projectIndex != 0) {
    project = projectManager.openCertainProject(projectIndex - 1);
  } else {
    projectManager.addProject(prompt("Input your project name"));
    project = projectManager.openCertainProject(
      projectManager.getAllProjects().length - 1
    );
  }

  var tasks = "List of your tasks\n";

  project.addTask("Bersihin WC", "Gila gokil bngt men", "Tomorrow", "Low");
  for (var [i, task] of project.getTasks().entries()) {
    tasks += `${i + 1}. ${task.title}\n`;
  }
  alert(tasks);
};

const insideProject = function () {};

var projectManager = new ProjectManager();
projectManager.addProject("Senin");
projectManager.addProject("Selasa");
projectManager.addProject("Rabu");
// projectManager.openCertainProject(0).menu();
menu();
