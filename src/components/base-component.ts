export abstract class Component<P extends HTMLElement, E extends HTMLElement> {
    template: HTMLTemplateElement;
    parentElement: P;
    element: E;

    constructor(templateId: string, parentId: string, position: InsertPosition, newElementId?: string) {
        this.template = document.getElementById(templateId) as HTMLTemplateElement;
        this.parentElement = document.getElementById(parentId) as P;

        this.element = document.importNode(this.template.content, true).firstElementChild as E;

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
