import { autobind } from "../decorators/autobind.js";
import { DragTarget } from "../models/draggable.js";
import { ProjectEntity, ProjectType, Project } from "../models/project.js";
import { projectState } from "../state/projects.js";
import { Component } from "./base-component.js";
import { ProjectItem } from "./project-item.js";

export class ProjectList
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
      this.element.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData("text/plain");

    projectState.moveProject(prjId, this.type);
    this.element.classList.remove("droppable");
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    this.element.classList.remove("droppable");
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
