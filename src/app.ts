// classes are used for educational purposes;

import { ProjectForm } from "./components/project-form";
import { ProjectList } from "./components/project-list";
import { ProjectType } from "./models/project";
import { projectState } from "./state/projects";

const projectForm = new ProjectForm();

const activeProjectList = new ProjectList(ProjectType.active);
const finishedProjectList = new ProjectList(ProjectType.finished);

console.log({
  projectForm,
  activeProjectList,
  finishedProjectList,
  projectState,
});
