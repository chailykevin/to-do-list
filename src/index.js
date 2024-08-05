import "./style.css";
const {
  format,
  parse,
  addDays,
  formatDistanceToNowStrict,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
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

    const now = new Date();

    const startOfWeekDate = startOfWeek(now, { weekStartsOn: 0 });
    const endOfWeekDate = endOfWeek(now, { weekStartsOn: 0 });

    function parseDate(dateString) {
      return parse(dateString, "dd/MM/yyyy", new Date());
    }

    for (var task of this.tasks) {
      const taskDate = parse(task.dueDate, "dd/MM/yyyy", new Date());
      if (
        isWithinInterval(taskDate, {
          start: startOfWeekDate,
          end: endOfWeekDate,
        })
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

  updateProjectName(projectIndex, projectNewName) {
    this.projects[projectIndex].name = projectNewName;
  }

  deleteCertainProject(projectIndex) {
    this.projects.splice(projectIndex, 1);
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

    DOM.loadProjects(projectManager.getAllProjects());
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
      DOM.newProject();
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

class DOMRelated {
  constructor() {
    this.body = document.querySelector("body");
    this.projects = document.getElementById("projects");
    this.main = document.querySelector(".main");
    this.updateProjectModal = document.getElementById("updateProject-modal");
    this.addProjectModal = document.getElementById("addProject-modal");
    this.addTaskModal = document.getElementById("addTask-modal");
    this.confirmDeleteProjectModal = document.getElementById(
      "confirmDeleteProject-modal"
    );
    this.confirmDeleteTaskModal = document.getElementById(
      "confirmDeleteTask-modal"
    );
    this.taskModal = document.querySelector(".main.project");
    this.taskHeader = document.querySelector(".header");
    this.tasks = document.getElementById("tasks");
    this.taskManager;
    this.i;
    this.j;
    this.currentTaskOpen = "alltask";
    this.projectSelected = false;
    this.day = document.getElementById("day");
    this.assignButtons();
    this.loadProjects(projectManager.projects);
  }

  assignButtons() {
    menuX.projectIndex = 0;
    const button = document.getElementsByClassName("button");
    for (let element of button) {
      if (element.classList.contains("cancel")) {
        if (element.classList.contains("project")) {
          element.addEventListener("click", (e) => {
            e.preventDefault();
            this.toggleNewProjectModal(false);
            this.toggleUpdateProjectModal(false);
            this.toggleConfirmDeleteProjectModal(false);
            this.toggleConfirmDeleteTaskModal(false);
            document.getElementById("formAddProject").reset();
          });
        } else if (element.classList.contains("task")) {
          element.addEventListener("click", (e) => {
            e.preventDefault();
            this.toggleNewTaskModal(false);
            document.getElementById("formAddTask").reset();
          });
        }
      } else if (element.classList.contains("taskday")) {
        element.addEventListener("click", () => {
          console.log(element);
          this.dayLoad(element.id);
        });
      } else if (element.classList.contains("add")) {
        if (element.classList.contains("project")) {
          console.log("test 2");
          element.addEventListener("click", () => {
            this.toggleNewProjectModal(true);
          });
        } else if (element.classList.contains("task")) {
          console.log("test 3");
          element.addEventListener("click", () => {
            this.toggleNewTaskModal(true);
          });
        }
      } else if (element.classList.contains("submit")) {
        if (element.classList.contains("project")) {
          element.addEventListener("click", (e) => {
            const projectName = document.getElementById("projectNameA");
            if (projectName.value != "") {
              e.preventDefault();
              this.addNewProject();
              this.toggleNewProjectModal(false);
              document.getElementById("formAddProject").reset();
            }
          });
        } else if (element.classList.contains("task")) {
          element.addEventListener("click", (e) => {
            const taskTitle = document.getElementById("taskTitle");
            const description = document.getElementById("description");
            const dueDate = document.getElementById("dueDate");
            const priority = document.getElementById("priority");
            if (
              taskTitle.value != "" &&
              description.value != "" &&
              dueDate.value != "" &&
              priority.value != ""
            ) {
              e.preventDefault();
              this.addNewTask();
              this.toggleNewTaskModal(false);
              document.getElementById("formAddTask").reset();
            }
          });
        }
      } else if (element.classList.contains("update")) {
        element.addEventListener("click", () => {
          this.toggleUpdateProjectModal(true);
        });
      } else if (element.classList.contains("confirm")) {
        if (element.classList.contains("project")) {
          element.addEventListener("click", (e) => {
            const projectName = document.getElementById("projectNameU");
            if (projectName.value != "") {
              e.preventDefault();
              this.updateProjectName();
              this.toggleUpdateProjectModal(false);
              document.getElementById("formAddProject").reset();
            }
            //Code to update
          });
        }
      } else if (element.classList.contains("delete")) {
        if (element.classList.contains("project")) {
          element.addEventListener("click", () => {
            this.deleteProject(this.i);
            this.loadProjects(projectManager.projects);
            this.toggleConfirmDeleteProjectModal(false);
          });
        } else if (element.classList.contains("task")) {
          element.addEventListener("click", () => {
            this.deleteTask(this.j);
            this.loadTask(this.currentTaskOpen);
            this.toggleConfirmDeleteTaskModal(false);
          });
        }
      }
    }
  }

  toggleUpdateProjectModal(visibility) {
    if (visibility) {
      this.loadProjectName();
      this.updateProjectModal.style.display = "block";
    } else {
      this.updateProjectModal.style.display = "none";
    }
  }

  toggleConfirmDeleteProjectModal(visibility) {
    if (visibility) {
      this.confirmDeleteProjectModal.style.display = "block";
    } else {
      this.confirmDeleteProjectModal.style.display = "none";
    }
  }

  toggleConfirmDeleteTaskModal(visibility) {
    if (visibility) {
      this.confirmDeleteTaskModal.style.display = "block";
    } else {
      this.confirmDeleteTaskModal.style.display = "none";
    }
  }

  toggleNewProjectModal(visibility) {
    if (visibility) {
      this.addProjectModal.style.display = "block";
    } else {
      this.addProjectModal.style.display = "none";
    }
  }

  toggleNewTaskModal(visibility) {
    if (visibility) {
      this.addTaskModal.style.display = "block";
    } else {
      this.addTaskModal.style.display = "none";
    }
  }

  addNewProject() {
    const projectName = document.querySelector("input#projectNameA");
    projectManager.addProject(projectName.value);
    this.loadProjects(projectManager.projects);
  }

  addNewTask() {
    const taskTitle = document.querySelector("input#taskTitle");
    const description = document.querySelector("textarea#description");
    const dueDate = document.querySelector("input#dueDate");
    const priority = document.querySelector("select#priority");

    console.log();

    this.taskManager.tasks.push(
      new Task(
        taskTitle.value,
        description.value,
        format(dueDate.value, "dd/MM/yyyy"),
        priority.value
      )
    );

    console.log(this.taskManager);
    console.log(this.currentTaskOpen);
    this.loadTask(this.currentTaskOpen);
    console.log(this.i);
  }

  loadProjectName() {
    const projectNameInput = document.querySelector("input#projectNameU");
    projectNameInput.value = document.querySelector(
      "h2.update.button.project"
    ).textContent;
  }

  updateProjectName() {
    const projectName = document.querySelector("input#projectNameU");
    projectManager.updateProjectName(this.i, projectName.value);
    this.loadProjects(projectManager.projects);
    this.openTaskModal(projectManager.projects[this.i]);
  }

  loadProjects(projects) {
    this.projects.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Projects";
    this.projects.appendChild(title);

    const container = document.createElement("div");
    const icon = document.createElement("i");
    const name = document.createElement("h3");
    const scrollable = document.createElement("div");
    scrollable.classList.add("scrollable");

    container.classList.add("withicon");
    container.classList.add("add");
    container.classList.add("button");
    container.classList.add("project");
    icon.classList.add("material-icons");

    icon.textContent = "add";
    name.textContent = "Add Project";

    container.appendChild(icon);
    container.appendChild(name);

    container.addEventListener("click", () => {
      this.toggleNewProjectModal(true);
      this.loadProjects;
    });

    this.projects.appendChild(container);

    if (projects != null) {
      for (let i = projects.length - 1; i >= 0; i--) {
        const containerMain = document.createElement("div");
        const containerX = document.createElement("div");
        const icon = document.createElement("i");
        const name = document.createElement("h3");
        const deleteIcon = document.createElement("i");

        containerMain.classList.add("withicon");
        containerMain.classList.add("open");
        containerMain.classList.add("button");
        containerMain.classList.add("project");
        icon.classList.add("material-icons");
        deleteIcon.classList.add("material-icons");

        icon.textContent = "folder";
        name.textContent = projects[i].name;
        deleteIcon.textContent = "delete";

        deleteIcon.style.alignSelf = "last baseline";
        deleteIcon.style.visibility = "hidden";
        deleteIcon.style.paddingRight = "4px";

        containerX.style.display = "flex";
        containerX.style.alignItems = "center";
        containerX.style.gap = "8px";
        containerX.style.flex = "auto";

        containerX.appendChild(icon);
        containerX.appendChild(name);

        containerMain.appendChild(containerX);
        containerMain.appendChild(deleteIcon);

        deleteIcon.addEventListener("click", () => {
          this.i = i;
          this.toggleConfirmDeleteProjectModal(true);
        });

        containerX.addEventListener("click", () => {
          this.i = i;
          console.log(this.i);
          this.removeActive();
          containerMain.classList.add("active");
          this.currentTaskOpen = "alltask";
          this.loadTask(this.currentTaskOpen);
          console.log(projects);
          this.openTaskModal(projects[this.i]);
          this.dayLoad(this.currentTaskOpen);
        });

        scrollable.appendChild(containerMain);
        this.projects.appendChild(scrollable);
      }
    }
  }

  dayLoad(i) {
    if (this.projectSelected) {
      const allTask = document.querySelector("div#alltask");
      const thisWeek = document.querySelector("div#thisweek");
      const tomorrow = document.querySelector("div#tomorrow");
      const today = document.querySelector("div#today");

      switch (i) {
        case "alltask":
          allTask.classList.add("active");
          today.classList.remove("active");
          tomorrow.classList.remove("active");
          thisWeek.classList.remove("active");

          this.currentTaskOpen = "alltask";
          this.loadTask(this.currentTaskOpen);
          break;
        case "today":
          today.classList.add("active");
          tomorrow.classList.remove("active");
          thisWeek.classList.remove("active");
          allTask.classList.remove("active");

          this.currentTaskOpen = "today";
          this.loadTask(this.currentTaskOpen);
          break;
        case "tomorrow":
          tomorrow.classList.add("active");
          today.classList.remove("active");
          thisWeek.classList.remove("active");
          allTask.classList.remove("active");

          this.currentTaskOpen = "tomorrow";
          this.loadTask(this.currentTaskOpen);
          break;
        case "thisweek":
          thisWeek.classList.add("active");
          today.classList.remove("active");
          tomorrow.classList.remove("active");
          allTask.classList.remove("active");

          this.currentTaskOpen = "thisweek";
          this.loadTask(this.currentTaskOpen);
          break;
      }
    }
  }

  deleteProject(i) {
    projectManager.deleteCertainProject(i);
  }

  deleteTask(j) {
    this.taskManager.deleteCertainTask(j);
  }

  removeActive() {
    const container = document.querySelector(".project.active");
    if (container != null) {
      container.classList.remove("active");
    }
  }

  loadTask(day) {
    this.projectSelected = true;
    this.taskManager = projectManager.openCertainProject(this.i);
    this.taskHeader;
    this.tasks.innerHTML = "";

    if (this.taskManager.tasks == "" || this.taskManager.tasks == null) {
      const empty = document.createElement("p");
      empty.textContent = "There's no any tasks available.";
      empty.classList.add("empty");
      this.tasks.appendChild(empty);

      console.log("I'm empty");
      switch (day) {
        case "alltask":
          this.day.textContent = "- All Tasks";
          break;
        case "today":
          this.day.textContent = "- Today's Tasks";
          break;
        case "tomorrow":
          this.day.textContent = "- Tomorrow's Tasks";
          break;
        case "thisweek":
          this.day.textContent = "- This Week's Tasks";
          break;
      }
    } else {
      let tasks = [];
      switch (day) {
        case "alltask":
          tasks = this.taskManager.getTasks();
          this.day.textContent = "- All Tasks";
          break;
        case "today":
          tasks = this.taskManager.getTodayTask();
          this.day.textContent = "- Today's Tasks";
          break;
        case "tomorrow":
          this.day.textContent = "- Tomorrow's Tasks";
          tasks = this.taskManager.getTomorrowTask();

          break;
        case "thisweek":
          tasks = this.taskManager.getWeekTask();
          this.day.textContent = "- This Week's Tasks";
          break;
      }
      for (let j = 0; j < tasks.length; j++) {
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task");
        var priority = document.createElement("p");
        var taskName = document.createElement("p");
        var dueDate = document.createElement("p");
        var editDelete = document.createElement("div");
        var editIcon = document.createElement("i");
        var deleteIcon = document.createElement("i");

        priority.textContent = tasks[j].priority;
        taskName.textContent = tasks[j].title;
        dueDate.textContent = tasks[j].dueDate;

        priority.classList.add("priority");
        taskName.classList.add("taskName");
        dueDate.classList.add("taskDueDate");

        editIcon.classList.add("material-icons");
        editIcon.style.marginRight = "12px";
        deleteIcon.classList.add("material-icons");

        editIcon.textContent = "edit";
        deleteIcon.textContent = "delete";

        deleteIcon.addEventListener("click", () => {
          this.j = j;
          console.log("test");
          this.toggleConfirmDeleteTaskModal(true);
        });

        editDelete.appendChild(editIcon);
        editDelete.appendChild(deleteIcon);

        taskContainer.appendChild(priority);
        taskContainer.appendChild(taskName);
        taskContainer.appendChild(dueDate);
        taskContainer.appendChild(editDelete);
        this.tasks.appendChild(taskContainer);
      }
    }
  }

  openTaskModal(project) {
    this.main.style.display = "none";
    this.taskModal.style.display = "grid";

    this.taskModal.childNodes[1].textContent = project.name;
  }
}

var projectManager = new ProjectManager();
projectManager.addProject("Senin");
projectManager.addProject("Selasa");
projectManager.addProject("Rabu");
projectManager.addProject("Kamis");
projectManager.addProject("Jumat");
projectManager.addProject("Sabtu");
projectManager.addProject("Minggu");

const menuX = new Menu();
const DOM = new DOMRelated();
// menuX.welcome();
