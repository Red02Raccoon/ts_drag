// classes are used for educational purposes;

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

    private handleSubmit(e: Event) {
        e.preventDefault();

        console.log(e);
    }

    private configureForm() {
        this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }
}

const projectForm = new ProjectForm();
