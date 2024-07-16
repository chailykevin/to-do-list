import "./style.css";

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
    const title = prompt("Input the task's title : ");
    const description = prompt("Input the task's description : ");
    const dueDate = prompt("Input the task's due date (DD-MM-YYYY) : ");
    const priority = prompt("Input the task's priority (Low/Medium/High) : ");
    this.tasks.push(new Task(title, description, dueDate, priority));
    alert("Task has been added!");
  }

  getTasks() {
    return this.tasks;
  }

  openCertainTask(taskIndex) {
    if (this.tasks[taskIndex] != null) {
      return this.tasks[taskIndex].showDetail();
    }
    return null;
  }

  deleteCertainTask(taskIndex) {
    this.tasks.splice(taskIndex, 1);
  }

  editCertainTask(taskIndex, taskManager) {
    taskManager.getTasks();
    console.log(`Task Index : ${taskIndex}`);
    console.log(`Task Manager : ${taskManager}`);
    var task = "";
    task = taskManager.openCertainTask(taskIndex);
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
      alert(this.tasks[taskIndex].showDetail());
      menuX.chooseTask(taskIndex + 1, taskManager);
    } else {
      alert("The info isn't valid");
      this.editCertainTask(taskIndex, taskManager);
    }
  }

  markUpdate(taskIndex, taskManager) {
    this.tasks[taskIndex].isComplete = !this.tasks[taskIndex].isComplete;
    menuX.chooseTask(taskIndex + 1, taskManager);
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
    options +=
      "Input the number. If you want to create a new project, input 0\n";
    options += "To quit the app input x";
    this.chooseProject(prompt(options));
  }

  chooseProject(projectIndex) {
    var taskManager;
    if (projectIndex != 0 && Number.isInteger(parseInt(projectIndex))) {
      taskManager = projectManager.openCertainProject(projectIndex - 1);
      if (taskManager == null) {
        alert("The input is not valid");
        this.showProjects();
      }
    } else if (Number.isInteger(parseInt(projectIndex))) {
      projectManager.addProject(prompt("Input your project name"));
      taskManager = projectManager.openCertainProject(
        projectManager.getAllProjects().length - 1
      );
    } else if (projectIndex == "x") {
      return null;
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
      if (task == null) {
        alert("Input value is not valid");
        this.showTasks(taskManager);
      }
      task +=
        "What do you want to do with this task?\n1 to update complete\n2 to edit task\n3 to delete task\nx to go back to task list";
      const answer = prompt(task);
      switch (answer) {
        case "1":
          alert("Task is marked as complete");
          taskManager.markUpdate(taskIndex - 1, taskManager);
          break;
        case "2":
          taskManager.editCertainTask(taskIndex - 1, taskManager);
          break;
        case "3":
          alert("Task is deleted");
          taskManager.deleteCertainTask(taskIndex - 1);
          this.showTasks(taskManager);
          break;
        case "x":
          this.showTasks(taskManager);
          break;
        default:
          alert("Input invalid.");
          this.chooseTask(taskIndex, taskManager);
      }
      // this.showTasks(taskManager);
    } else if (Number.isInteger(parseInt(taskIndex))) {
      taskManager.addTask();
      this.showTasks(taskManager);
    } else {
      alert("What did you input?");
      this.showTasks(taskManager);
    }
  }

  manageTask(task) {
    alert(task);
  }
}

const insideProject = function () {};

var projectManager = new ProjectManager();
projectManager.addProject("Senin");
projectManager.addProject("Selasa");
projectManager.addProject("Rabu");

const menuX = new Menu();
menuX.welcome();
