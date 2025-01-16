const User = require("../models/userSchema");

const updateTheme = async (userId, theme) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.theme = theme;
  await user.save();

  return user.theme;
};

const addProject = async (userId, projectName) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.projects.push({ name: projectName, columns: [] });
  await user.save();

  return user.projects;
};

const addColumn = async (userId, projectId, columnName) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const project = user.projects.id(projectId);
  if (!project) throw new Error("Project not found");

  project.columns.push({ name: columnName, cards: [] });
  await user.save();

  return project;
};

const addTask = async (userId, projectId, columnId, taskData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const project = user.projects.id(projectId);
  if (!project) throw new Error("Project not found");

  const column = project.columns.id(columnId);
  if (!column) throw new Error("Column not found");

  column.cards.push(taskData);
  await user.save();

  return column;
};

const updateTask = async (userId, projectId, columnId, taskId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const project = user.projects.id(projectId);
  if (!project) throw new Error("Project not found");

  const column = project.columns.id(columnId);
  if (!column) throw new Error("Column not found");

  const task = column.cards.id(taskId);
  if (!task) throw new Error("Task not found");

  Object.assign(task, updates);
  await user.save();

  return task;
};

const moveTask = async (
  userId,
  projectId,
  taskId,
  fromColumnId,
  toColumnId
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const project = user.projects.id(projectId);
  if (!project) throw new Error("Project not found");

  const fromColumn = project.columns.id(fromColumnId);
  if (!fromColumn) throw new Error("Source column not found");

  const task = fromColumn.cards.id(taskId);
  if (!task) throw new Error("Task not found");

  fromColumn.cards.id(taskId).remove();

  const toColumn = project.columns.id(toColumnId);
  if (!toColumn) throw new Error("Target column not found");

  toColumn.cards.push(task);
  await user.save();

  return task;
};

const deleteTask = async (userId, projectId, columnId, taskId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const project = user.projects.id(projectId);
  if (!project) throw new Error("Project not found");

  const column = project.columns.id(columnId);
  if (!column) throw new Error("Column not found");

  column.cards.id(taskId).remove();
  await user.save();

  return column;
};

const deleteColumn = async (userId, projectId, columnId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const project = user.projects.id(projectId);
  if (!project) throw new Error("Project not found");

  project.columns.id(columnId).remove();
  await user.save();

  return project;
};

const deleteProject = async (userId, projectId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.projects.id(projectId).remove();
  await user.save();

  return user.projects;
};

const updateProjectAppearance = async (userId, projectId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const project = user.projects.id(projectId);
  if (!project) throw new Error("Project not found");

  if (updates.icon !== undefined) {
    if (updates.icon < 0 || updates.icon > 7)
      throw new Error("Icon index out of range");
    project.icon = updates.icon;
  }

  if (updates.background !== undefined) {
    if (
      ![...Array(15).keys()]
        .map(String)
        .concat("none")
        .includes(updates.background)
    ) {
      throw new Error("Background index out of range");
    }
    project.background = updates.background;
  }

  await user.save();
  return project;
};

module.exports = {
  updateTheme,
  addProject,
  addColumn,
  addTask,
  updateTask,
  moveTask,
  deleteTask,
  deleteColumn,
  deleteProject,
  updateProjectAppearance,
};
