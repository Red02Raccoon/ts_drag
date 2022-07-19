import { Project, ProjectInfo, ProjectType } from '../models/project';

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
        const project = this.projects.find(prj => prj.id === projectId);

        if (project && project.status !== newStatus) {
            project.status = newStatus;

            this.notifyListeners();
        }
    }

    private notifyListeners() {
        console.log('notifyListeners');
        this.listeners.forEach(listener => {
            listener([...this.projects]);
        });
    }
}

export const projectState = ProjectState.getInstance();
