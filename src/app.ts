// classes are used for educational purposes;

class ProjectForm {
    formTemplate: HTMLTemplateElement;
    rootElement: HTMLDivElement;
    form: HTMLFormElement

    constructor() {
        this.formTemplate = document.getElementById('project-input') as HTMLTemplateElement;
        this.rootElement = document.getElementById('app') as HTMLDivElement;

        this.form = document.importNode(this.formTemplate.content, true).firstElementChild as HTMLFormElement;
        this.form.id = 'user-input'

        this.render();
    }

    private render() {
        this.rootElement.insertAdjacentElement('afterbegin', this.form)
    }
}

const projectForm = new ProjectForm();