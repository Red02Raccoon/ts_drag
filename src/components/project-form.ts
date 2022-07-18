import { validation } from "../utils/validation.js";
import { autobind } from "../decorators/autobind.js";
import { ProjectInfo } from "../models/project.js";
import { projectState } from "../state/projects.js";
import { Component } from "./base-component.js";

export class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {
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
