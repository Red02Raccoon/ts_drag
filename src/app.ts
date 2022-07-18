// classes are used for educational purposes;

/// <reference path='./models/project.ts' />
/// <reference path='./components/project-item.ts' />
/// <reference path='./components/project-list.ts' />
/// <reference path='./components/project-form.ts' />

namespace App {
  const projectForm = new ProjectForm();

  const activeProjectList = new ProjectList(ProjectType.active);
  const finishedProjectList = new ProjectList(ProjectType.finished);

  console.log({ projectForm, activeProjectList, finishedProjectList, projectState });
}
