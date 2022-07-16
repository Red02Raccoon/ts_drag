// classes are used for educational purposes;

enum ProjectType {
  active = "active",
  finished = "finished",
}

interface ProjectInfo {
  title: string;
  description: string;
  people: number;
}

interface ProjectEntity extends ProjectInfo {
  id: string;
  status: ProjectType.active | ProjectType.finished;
}

interface FormValues {
  title: string;
  description: string;
  people: number;
}

interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
}

interface FormValidation {
  [prop: string]: FieldValidation;
}

// utils
const validation = (values: FormValues, rules: FormValidation): boolean => {
  let isValid = true;

  const data = Object.entries(values || {});

  if (!data) {
    return false;
  }

  data.forEach(([key, value]) => {
    const currentRules = rules[key];

    if (!currentRules) {
      return;
    }

    const { required, min, max } = currentRules;

    if (required) {
      isValid = isValid && value.toString().trim().length !== 0;
    }

    if (min != null && typeof value === "number") {
      isValid = isValid && value >= min;
    }

    if (max != null && typeof value === "number") {
      isValid = isValid && value <= max;
    }
  });

  return isValid;
};

// decorators
const autobind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  const adjDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    },
  };

  return adjDescriptor;
};

// Classes
class Project implements ProjectEntity {
  id: string;
  title: string;
  description: string;
  people: number;
  status: ProjectType.active | ProjectType.finished;

  constructor({ id, title, description, people, status }: ProjectEntity) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.people = people;
    this.status = status;
  }
}

type Listener = (items: Project[]) => void;

class ProjectState {
  private static instance: ProjectState;

  private listeners: Listener[] = [];
  private projects: ProjectEntity[] = [];

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }

    return this.instance;
  }

  addListener(listener: Listener) {
    this.listeners.push(listener);
  }

  addProject(project: ProjectInfo) {
    const newProject = new Project({
      ...project,
      id: Math.random().toString(),
      status: ProjectType.active,
    });

    this.projects.push(newProject);

    this.listeners.forEach((listener) => {
      listener(this.projects);
    });
  }
}

const projectState = ProjectState.getInstance();
console.log({ projectState });

class ProjectList {
  template: HTMLTemplateElement;
  rootElement: HTMLDivElement;
  element: HTMLElement;

  listId: string;
  projects: ProjectEntity[] = [];

  constructor(private type: ProjectType.active | ProjectType.finished) {
    this.listId = `${this.type}-project-list`;
    this.template = document.getElementById(
      "project-list"
    ) as HTMLTemplateElement;
    this.rootElement = document.getElementById("app") as HTMLDivElement;

    this.element = document.importNode(this.template.content, true)
      .firstElementChild as HTMLElement;

    this.prepareContent();
    this.render();
    this.subscribe();
  }

  private subscribe() {
    projectState.addListener((projects: Project[]) => {
      this.projects = projects.filter((item) => item.status === this.type);

      this.renderProjects();
    });
  }

  private renderProjects() {
    const list = this.element.querySelector(
      `#${this.listId}`
    ) as HTMLUListElement;

    list.innerHTML = "";

    this.projects.forEach((project: ProjectEntity) => {
      const item = document.createElement("li");
      item.textContent = project.title;

      list.appendChild(item);
    });
  }

  private prepareContent() {
    this.element.id = `${this.type}-projects`;
    this.element.querySelector("ul")!.id = this.listId;

    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private render() {
    this.rootElement.insertAdjacentElement("beforeend", this.element);
  }
}

class ProjectForm {
  formTemplate: HTMLTemplateElement;
  rootElement: HTMLDivElement;
  form: HTMLFormElement;

  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  peopleInput: HTMLInputElement;

  static validationRules = {
    title: {
      required: true,
    },
    description: {
      required: true,
    },
    people: {
      required: true,
      min: 1,
      max: 7,
    },
  };

  constructor() {
    this.formTemplate = document.getElementById(
      "project-input"
    ) as HTMLTemplateElement;
    this.rootElement = document.getElementById("app") as HTMLDivElement;

    this.form = document.importNode(this.formTemplate.content, true)
      .firstElementChild as HTMLFormElement;
    this.form.id = "user-input";

    this.titleInput = this.form.querySelector("#title") as HTMLInputElement;
    this.descriptionInput = this.form.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInput = this.form.querySelector("#people") as HTMLInputElement;

    this.configureForm();
    this.render();
  }

  private render() {
    this.rootElement.insertAdjacentElement("afterbegin", this.form);
  }

  private getFormInfo(): ProjectInfo | void {
    const title = this.titleInput.value.trim();
    const description = this.descriptionInput.value.trim();
    const people = +this.peopleInput.value;

    if (
      !validation({ title, description, people }, ProjectForm.validationRules)
    ) {
      alert("Error: Data is invalid, please check fields!");
      return;
    }

    return { title, description, people };
  }

  @autobind
  private handleSubmit(e: Event) {
    e.preventDefault();

    const project = this.getFormInfo();

    if (project) {
      projectState.addProject(project);

      this.form.reset();
    }
  }

  private configureForm() {
    // bind or descriptor
    // this.form.addEventListener("submit", this.handleSubmit.bind(this));
    this.form.addEventListener("submit", this.handleSubmit);
  }
}

const projectForm = new ProjectForm();

const activeProjectList = new ProjectList(ProjectType.active);
const finishedProjectList = new ProjectList(ProjectType.finished);
