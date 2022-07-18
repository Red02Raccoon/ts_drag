import { autobind } from "../decorators/autobind";
import { Draggable } from "../models/draggable";
import { Project } from "../models/project";
import { Component } from "./base-component";

export class ProjectItem
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
