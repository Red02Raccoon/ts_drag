export enum ProjectType {
  active = "active",
  inprogress = "inprogress",
  finished = "finished",
}

export interface ProjectInfo {
  title: string;
  description: string;
  people: number;
}

export interface ProjectEntity extends ProjectInfo {
  id: string;
  status: ProjectType;
}

export class Project implements ProjectEntity {
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
