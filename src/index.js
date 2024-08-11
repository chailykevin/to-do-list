import "./style.css";
const {
  format,
  parse,
  addDays,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} = require("date-fns");

class Storage {
  checkStorage() {
    if (localStorage.length == 0) {
      console.log(localStorage.getItem("P0"));
      console.log("nun");
    } else {
      this.getProjects();
    }
  }

  // loadProjects()

  saveProjects() {
    // localStorage.clear();
    // for (let project of projectManager.projects) {
    //   localStorage.setItem(`P${project.uid}`, JSON.stringify(project.name));
    //   for (var task of project.taskManager.tasks) {
    //     localStorage.setItem(
    //       `P${project.uid}.T${task.uid}`,
    //       JSON.stringify(task)
    //     );
    //   }
    // }
    // localStorage.setItem("tasks", projectManager.projects);
    localStorage.setItem("projectManager", JSON.stringify(projectManager));
    // for (let project of projectManager.projects) {
    //   // console.log(project.name);
    //   localStorage.setItem(
    //     `${project.name}.task`,
    //     JSON.stringify(project.taskManager.tasks)
    //   );
    // }
  }

  getProjects() {
    let projectManagers = JSON.parse(localStorage.getItem("projectManager"));
    for (let i = 0; i < projectManagers.projects.length; i++) {
      projectManager.addProject(projectManagers.projects[i].name);
      let currentProject = projectManager.projects[i];
      let taskList = projectManagers.projects[i].taskManager.tasks;
      console.log(taskList);

      for (let task of taskList) {
        console.log(task.isComplete);
        if (task.projectName == currentProject.name) {
          currentProject.taskManager.addTask(
            task.title,
            task.description,
            task.dueDate,
            task.priority,
            task.isComplete
          );
        }
      }

      DOM.loadProjects(projectManager.projects);
    }
    //   let projects;
    //   let tasks = [];
    //   for (let i = 0; i < localStorage.length; i++) {
    //     // var value = localStorage.getItem(localStorage.key(i));
    //     // console.log(localStorage.key(i));
    //     if (!localStorage.key(i).includes(".")) {
    //       projects = JSON.parse(localStorage.getItem(localStorage.key(i)));
    //     } else {
    //       tasks.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    //     }
    //     // } else {
    //     //   // console.log(JSON.parse(localStorage.getItem(localStorage.key(i))));
    //     //   // projectManager.addProject(
    //     //   //   JSON.parse(localStorage.getItem(localStorage.key(i)))
    //     //   // );
    //     // }
    //   }
    //   for (let task of tasks) {
    //     console.log(task.projectName);
    //   }
    //   for (let project of projects) {
    //     projectManager.addProject(project.name);
    //   }
    //   console.log(tasks);
    //   // console.log(projectManager);
  }
}

const Store = new Storage();

class Task {
  constructor(title, description, dueDate, priority, projectName, isComplete) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isComplete = isComplete;
    this.projectName = projectName;
  }
}

class TaskManager {
  constructor(projectName) {
    this.projectName = projectName;
    this.tasks = [];
  }

  addTask(title, description, dueDate, priority, isComplete) {
    this.tasks.push(
      new Task(
        title,
        description,
        dueDate,
        priority,
        this.projectName,
        isComplete
      )
    );
    this.updateID();
  }

  getTasks() {
    return this.tasks;
  }

  deleteCertainTask(taskIndex) {
    this.tasks.splice(taskIndex, 1);
    this.updateID();
    return this.tasks;
  }

  editCertainTask(
    taskIndex,
    taskTitle,
    taskDescription,
    taskDueDate,
    taskPriority
  ) {
    this.tasks[taskIndex].title = taskTitle;
    this.tasks[taskIndex].description = taskDescription;
    this.tasks[taskIndex].dueDate = taskDueDate;
    this.tasks[taskIndex].priority = taskPriority;
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

  markUpdate(taskIndex) {
    this.tasks[taskIndex].isComplete = !this.tasks[taskIndex].isComplete;
  }

  updateID() {
    // for (let i = 0; i < this.tasks.length; i++) {
    //   this.tasks[i].uid = i;
    // }
    Store.saveProjects();
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
    this.updateID();
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
    this.updateID();
  }

  updateID() {
    // for (let i = 0; i < this.projects.length; i++) {
    //   this.projects[i].uid = i;
    // }
    Store.saveProjects();
  }
}

class DOMRelated {
  constructor() {
    this.projects = document.getElementById("projects"); //Cuma kepakai di load projects
    this.main = document.querySelector(".main");
    this.addProjectModal = document.getElementById("addProject-modal");
    this.addTaskModal = document.getElementById("addTask-modal");
    this.updateProjectModal = document.getElementById("updateProject-modal");
    this.updateTaskModal = document.getElementById("updateTask-modal");
    this.confirmDeleteProjectModal = document.getElementById(
      "confirmDeleteProject-modal"
    );
    this.confirmDeleteTaskModal = document.getElementById(
      "confirmDeleteTask-modal"
    );
    this.infoTaskModal = document.getElementById("infoTask-modal");
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
    this.setDateInput();
  }

  setDateInput() {
    var today = new Date().toISOString().split("T")[0];
    var dates = document.querySelectorAll("input.date").forEach((date) => {
      date.setAttribute("min", today);
    });
  }

  assignButtons() {
    const button = document.getElementsByClassName("button");
    for (let element of button) {
      if (element.classList.contains("cancel")) {
        if (element.classList.contains("project")) {
          element.addEventListener("click", (e) => {
            e.preventDefault();
            this.toggleNewProjectModal(false);
            this.toggleUpdateProjectModal(false);
            this.toggleConfirmDeleteProjectModal(false);
            document.getElementById("formAddProject").reset();
          });
        } else if (element.classList.contains("task")) {
          element.addEventListener("click", (e) => {
            e.preventDefault();
            this.toggleNewTaskModal(false);
            this.toggleConfirmDeleteTaskModal(false);
            this.toggleUpdateTaskModal(false);
            this.toggleInfoTaskModal(false);
            document.getElementById("formAddTask").reset();
          });
        }
      } else if (element.classList.contains("taskday")) {
        element.addEventListener("click", () => {
          this.dayLoad(element.id);
        });
      } else if (element.classList.contains("add")) {
        if (element.classList.contains("project")) {
          element.addEventListener("click", () => {
            this.toggleNewProjectModal(true);
          });
        } else if (element.classList.contains("task")) {
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
        if (element.classList.contains("project")) {
          element.addEventListener("click", () => {
            this.toggleUpdateProjectModal(true);
          });
        }
      } else if (element.classList.contains("confirm")) {
        if (element.classList.contains("project")) {
          element.addEventListener("click", (e) => {
            const projectName = document.getElementById("projectNameU");
            if (projectName.value != "") {
              e.preventDefault();
              this.updateProjectName();
              this.toggleUpdateProjectModal(false);
            }
            //Code to update
          });
        } else if (element.classList.contains("task")) {
          element.addEventListener("click", (e) => {
            const taskTitle = document.getElementById("taskTitleU");
            const description = document.getElementById("descriptionU");
            const dueDate = document.getElementById("dueDateU");
            const priority = document.getElementById("priorityU");

            if (
              taskTitle.value != "" &&
              description.value != "" &&
              dueDate.value != "" &&
              priority.value != ""
            ) {
              e.preventDefault();
              this.updateTask(
                taskTitle.value,
                description.value,
                dueDate.value,
                priority.value
              );
              this.toggleUpdateTaskModal(false);
            }
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

  toggleUpdateTaskModal(visibility) {
    if (visibility) {
      this.loadTaskInfo();
      this.updateTaskModal.style.display = "block";
    } else {
      this.updateTaskModal.style.display = "none";
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

    this.taskManager.addTask(
      taskTitle.value,
      description.value,
      dueDate.value,
      priority.value,
      false
    );

    this.loadTask(this.currentTaskOpen);
  }

  loadProjectName() {
    const projectNameInput = document.querySelector("input#projectNameU");
    projectNameInput.value = document.querySelector(
      "h2.update.button.project"
    ).textContent;
  }

  loadTaskInfo() {
    const taskTitle = document.getElementById("taskTitleU");
    const description = document.getElementById("descriptionU");
    const dueDate = document.getElementById("dueDateU");
    const priority = document.getElementById("priorityU");

    taskTitle.value = this.taskManager.tasks[this.j].title;
    description.value = this.taskManager.tasks[this.j].description;
    dueDate.value = this.taskManager.tasks[this.j].dueDate;
    priority.value = this.taskManager.tasks[this.j].priority;
  }

  updateProjectName() {
    const projectName = document.querySelector("input#projectNameU");
    projectManager.updateProjectName(this.i, projectName.value);
    this.loadProjects(projectManager.projects);
    this.openTaskModal(projectManager.projects[this.i]);
  }

  updateTask(taskTitle, taskDescription, taskDueDate, taskPriority) {
    this.taskManager.editCertainTask(
      this.j,
      taskTitle,
      taskDescription,
      taskDueDate,
      taskPriority
    );
    this.loadTask(this.currentTaskOpen);
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
          this.removeActive();
          containerMain.classList.add("active");
          this.currentTaskOpen = "alltask";
          this.loadTask(this.currentTaskOpen);
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
        const taskContainerX = document.createElement("div");
        const taskContainerY = document.createElement("div");
        const checkBox = document.createElement("input");

        checkBox.setAttribute("type", "checkbox");

        taskContainerX.classList.add("task");
        var taskName = document.createElement("p");
        var dueDate = document.createElement("p");
        var editDelete = document.createElement("div");
        var editIcon = document.createElement("i");
        var deleteIcon = document.createElement("i");

        taskName.textContent = tasks[j].title;
        dueDate.textContent = format(tasks[j].dueDate, "dd-MM-yyyy");

        taskName.classList.add("taskName");
        dueDate.classList.add("taskDueDate");

        editIcon.classList.add("material-icons");
        editIcon.style.marginRight = "12px";
        deleteIcon.classList.add("material-icons");
        deleteIcon.style.marginRight = "12px";

        editIcon.textContent = "edit";
        deleteIcon.textContent = "delete";

        const toggleUpdate = () => {
          this.j = j;
          this.toggleUpdateTaskModal(true);
        };

        const toggleConfirm = () => {
          this.j = j;
          this.toggleConfirmDeleteTaskModal(true);
        };

        editIcon.addEventListener("click", toggleUpdate);

        deleteIcon.addEventListener("click", toggleConfirm);

        editDelete.appendChild(editIcon);
        editDelete.appendChild(deleteIcon);

        editDelete.classList.add("editDelete");

        // taskContainerX.appendChild(priority);
        taskContainerX.appendChild(taskName);
        taskContainerX.appendChild(dueDate);

        taskContainerX.addEventListener("click", () => {
          this.j = j;
          this.toggleInfoTaskModal(true);
        });

        taskContainerY.appendChild(checkBox);
        taskContainerY.appendChild(taskContainerX);
        taskContainerY.appendChild(editDelete);

        taskContainerY.style.margin = "0px 8px 8px 8px";

        if (tasks[j].isComplete) {
          taskContainerY.children[0].click();
          taskContainerY.children[1].children[0].style.textDecoration =
            "line-through";
          taskContainerY.children[1].children[1].style.color = "grey";
          taskContainerY.children[2].children[0].style.color = "grey";
          taskContainerY.children[2].children[1].style.color = "grey";

          taskContainerY.children[2].children[0].removeEventListener(
            "click",
            toggleUpdate
          );
          taskContainerY.children[2].children[1].removeEventListener(
            "click",
            toggleConfirm
          );
        }

        checkBox.addEventListener("change", function () {
          if (checkBox.checked) {
            taskContainerY.children[1].children[0].style.textDecoration =
              "line-through";
            taskContainerY.children[1].children[1].style.color = "grey";
            taskContainerY.children[2].children[0].style.color = "grey";
            taskContainerY.children[2].children[1].style.color = "grey";

            taskContainerY.children[2].children[0].removeEventListener(
              "click",
              toggleUpdate
            );
            taskContainerY.children[2].children[1].removeEventListener(
              "click",
              toggleConfirm
            );

            tasks[j].isComplete = true;
            Store.saveProjects();
          } else {
            taskContainerY.children[1].children[0].style.textDecoration =
              "none";
            taskContainerY.children[1].children[1].style.color = "white";
            taskContainerY.children[2].children[0].style.color = "white";
            taskContainerY.children[2].children[1].style.color = "white";

            taskContainerY.children[2].children[0].addEventListener(
              "click",
              toggleUpdate
            );
            taskContainerY.children[2].children[1].addEventListener(
              "click",
              toggleConfirm
            );
            Store.saveProjects();
          }
        });

        taskContainerY.classList.add("detail");
        if (tasks[j].priority == "Low") {
          taskContainerY.style.backgroundColor = "rgb(79, 109, 79)";
        } else if (tasks[j].priority == "High") {
          taskContainerY.style.backgroundColor = "rgb(109, 79, 79)";
        } else if (tasks[j].priority == "Medium") {
          taskContainerY.style.backgroundColor = "rgb(109, 109, 79)";
        }

        this.tasks.appendChild(taskContainerY);
      }
    }
  }

  toggleInfoTaskModal(visibility) {
    if (visibility) {
      const taskTitle = document.getElementById("taskTitleI");
      const description = document.getElementById("descriptionI");
      const dueDate = document.getElementById("dueDateI");
      const priority = document.getElementById("priorityI");

      taskTitle.value = this.taskManager.tasks[this.j].title;
      description.value = this.taskManager.tasks[this.j].description;
      dueDate.value = this.taskManager.tasks[this.j].dueDate;
      priority.value = this.taskManager.tasks[this.j].priority;

      this.infoTaskModal.style.display = "block";
    } else {
      this.infoTaskModal.style.display = "none";
    }
  }

  openTaskModal(project) {
    this.main.style.display = "none";
    this.taskModal.style.display = "grid";

    this.taskModal.childNodes[1].textContent = project.name;
  }
}

var projectManager = new ProjectManager();
// Store.checkStorage();

// projectManager.addProject("Senin");
// projectManager.addProject("Selasa");
// projectManager.addProject("Rabu");
// projectManager.addProject("Kamis");
// projectManager.addProject("Jumat");
// projectManager.addProject("Sabtu");
// projectManager.addProject("Minggu");

const DOM = new DOMRelated();
// projectManager.projects[6].taskManager.addTask("a", "a", "2024-08-08", "Low");
// projectManager.projects[6].taskManager.addTask(
//   "b",
//   "b",
//   "2024-08-08",
//   "Medium"
// );
// projectManager.projects[0].taskManager.addTask("c", "c", "2024-08-08", "High");

Store.checkStorage();
//GIMANA BIAR GA ADA TITLE YANG SAMA EXIST IN THE SAME TIME? APAKAH HARUS PAKAI ID ? OR INDEX YA?
// projectManager.projects[6].taskManager.addTask("d", "d", "2024-08-08", "Low");
// projectManager.projects[6].taskManager.addTask("a", "a", "2024-08-08", "Low");
// projectManager.projects[6].taskManager.addTask(
//   "a",
//   "a",
//   "2024-08-08",
//   "Medium"
// );
// projectManager.projects[6].taskManager.addTask("a", "a", "2024-08-08", "Low");
// projectManager.projects[6].taskManager.addTask(
//   "a",
//   "a",
//   "2024-08-08",
//   "Medium"
// );
// projectManager.projects[6].taskManager.addTask(
//   "a",
//   "a",
//   "2024-08-08",
//   "Medium"
// );
// projectManager.projects[6].taskManager.addTask("a", "a", "2024-08-08", "Low");
// projectManager.projects[6].taskManager.addTask("a", "a", "2024-08-08", "Low");
// projectManager.projects[6].taskManager.addTask("a", "a", "2024-08-08", "High");
// projectManager.projects[6].taskManager.addTask("a", "a", "2024-08-08", "Low");
// projectManager.projects[6].taskManager.addTask("a", "a", "2024-08-08", "High");
// projectManager.projects[6].taskManager.addTask("a", "a", "2024-08-08", "High");
