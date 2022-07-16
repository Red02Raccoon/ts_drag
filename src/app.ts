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
  status: ProjectType;
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

interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
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
  status: ProjectType;

  constructor({ id, title, description, people, status }: ProjectEntity) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.people = people;
    this.status = status;
  }
}

type Listener<T> = (items: T[]) => void;

abstract class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}

class ProjectState extends State<Project> {
  private static instance: ProjectState;

  private projects: Project[] = [];

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }

    return this.instance;
  }

  addProject(project: ProjectInfo) {
    const newProject = new Project({
      ...project,
      id: Math.random().toString(),
      status: ProjectType.active,
    });

    this.projects.push(newProject);

    this.notifyListeners();
  }

  moveProject(projectId: string, newStatus: ProjectType) {
    const project = this.projects.find((prj) => prj.id === projectId);

    if (project && project.status !== newStatus) {
      project.status = newStatus;

      this.notifyListeners();
    }
  }

  private notifyListeners() {
    console.log("here");
    this.listeners.forEach((listener) => {
      listener([...this.projects]);
    });
  }
}

const projectState = ProjectState.getInstance();
console.log({ projectState });

abstract class Component<P extends HTMLElement, E extends HTMLElement> {
  template: HTMLTemplateElement;
  parentElement: P;
  element: E;

  constructor(
    templateId: string,
    parentId: string,
    position: InsertPosition,
    newElementId?: string
  ) {
    this.template = document.getElementById(templateId) as HTMLTemplateElement;
    this.parentElement = document.getElementById(parentId) as P;

    this.element = document.importNode(this.template.content, true)
      .firstElementChild as E;

    if (newElementId) {
      this.element.id = newElementId;
    }

    this.render(position);
  }

  private render(position: InsertPosition) {
    this.parentElement.insertAdjacentElement(position, this.element);
  }

  abstract configure(): void;
  abstract prepareContent(): void;
}

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get people() {
    const { people } = this.project;

    if (people === 1) {
      return "1 Person";
    }

    return `${people} Persons`;
  }

  constructor(parentId: string, project: Project) {
    super("single-project", parentId, "beforeend", project.id);

    this.project = project;

    this.prepareContent();
    this.configure();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {
    console.log("DragEnd");
  }

  prepareContent(): void {
    const { title, description } = this.project;

    this.element.querySelector("h2")!.textContent = title;
    this.element.querySelector(
      "h3"
    )!.textContent = `${this.people.toString()} assigned`;
    this.element.querySelector("p")!.textContent = description;
  }

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }
}

class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  listId: string;
  projects: ProjectEntity[] = [];

  constructor(private type: ProjectType) {
    super("project-list", "app", "beforeend", `${type}-projects`);

    this.listId = `${type}-project-list`;

    this.prepareContent();
    this.configure();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData("text/plain");

    projectState.moveProject(prjId, this.type);
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);

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
      new ProjectItem(this.listId, project);
    });
  }

  prepareContent() {
    this.element.querySelector("ul")!.id = this.listId;

    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }
}

class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {
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
    super("project-input", "app", "afterbegin", "user-input");

    this.titleInput = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInput = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInput = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
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

      this.element.reset();
    }
  }

  prepareContent() {}

  configure() {
    // bind or descriptor
    // this.form.addEventListener("submit", this.handleSubmit.bind(this));
    this.element.addEventListener("submit", this.handleSubmit);
  }
}

const projectForm = new ProjectForm();

const activeProjectList = new ProjectList(ProjectType.active);
const finishedProjectList = new ProjectList(ProjectType.finished);
