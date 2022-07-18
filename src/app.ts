// classes are used for educational purposes;

import { ProjectForm } from "./components/project-form.js";
import { ProjectList } from "./components/project-list.js";
import { ProjectType } from "./models/project.js";
import { projectState } from "./state/projects.js";

const projectForm = new ProjectForm();

const activeProjectList = new ProjectList(ProjectType.active);
const finishedProjectList = new ProjectList(ProjectType.finished);

console.log({
  projectForm,
  activeProjectList,
  finishedProjectList,
  projectState,
});
