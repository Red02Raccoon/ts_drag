// classes are used for educational purposes;

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

  private getFormInfo(): [string, string, number] | void {
    const title = this.titleInput.value.trim();
    const description = this.descriptionInput.value.trim();
    const people = +this.peopleInput.value;

    if (
      !validation({ title, description, people }, ProjectForm.validationRules)
    ) {
      alert("Error: Data is invalid, please check fields!");
      return;
    }

    return [title, description, people];
  }

  @autobind
  private handleSubmit(e: Event) {
    e.preventDefault();

    const info = this.getFormInfo();

    if (Array.isArray(info)) {
      console.log({ info });
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
