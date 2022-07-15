// classes are used for educational purposes;

// decorators
const autobind = (
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;
  const adjDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    },
  };

  return adjDescriptor;
};

class ProjectForm {
  formTemplate: HTMLTemplateElement;
  rootElement: HTMLDivElement;
  form: HTMLFormElement;

  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  peopleInput: HTMLInputElement;

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

  @autobind
  private handleSubmit(e: Event) {
    e.preventDefault();

    console.log(e);
  }

  private configureForm() {
    // bind or descriptor
    // this.form.addEventListener("submit", this.handleSubmit.bind(this));
    this.form.addEventListener("submit", this.handleSubmit);
  }
}

const projectForm = new ProjectForm();
