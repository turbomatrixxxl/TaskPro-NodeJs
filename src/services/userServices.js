const User = require("../models/userSchema");

const updateTheme = async (userId, theme) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.theme = theme;
  await user.save();

  return user;
};

const addProject = async (userId, projectName, icon, background) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.projects.push({
    name: projectName,
    columns: [],
    icon: icon ?? 0,
    background: background ?? "none",
  });
  await user.save();

  return user;
};

const addColumn = async (userId, projectName, columnName) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const project = user.projects.find((project) => project.name === projectName);
  if (!project) throw new Error("Project not found");

  project.columns.push({ name: columnName, cards: [] });

  await user.save();

  return user;
};

const updateColumn = async (userId, projectName, columnName, update) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const project = user.projects.find((project) => project.name === projectName);
  if (!project) throw new Error("Project not found");

  const column = project.columns.find((column) => column.name === columnName);
  if (!column) {
    throw new Error("Column not found");
  } else {
    column.name = update.name || column.name;
  }

  await user.save();

  return user;
};

const addTask = async (userId, projectName, columnName, taskData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const project = user.projects.find((project) => project.name === projectName);
  if (!project) throw new Error("Project not found");

  const column = project.columns.find((column) => column.name === columnName);
  if (!column) throw new Error("Column not found");

  // Ensure taskData has all required fields
  const { title, description, priority, dueDate } = taskData;
  if (!title) throw new Error("Title is required");
  if (!description) throw new Error("Description is required");
  if (!priority) throw new Error("Priority is required");
  if (!dueDate) throw new Error("DueDate is required");

  column.cards.push(taskData);
  await user.save();

  return user;
};

const updateTask = async (
  userId,
  projectName,
  columnName,
  taskName,
  updates
) => {
  try {
    // Find the user by ID and the task using project and column names
    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new Error("User not found");
    }

    // Find the specific project, column, and task
    const project = user.projects.find(
      (project) => project.name === projectName
    );
    if (!project) {
      throw new Error("Project not found");
    }

    const column = project.columns.find((column) => column.name === columnName);
    if (!column) {
      throw new Error("Column not found");
    }

    const task = column.cards.find((card) => card.title === taskName);
    if (!task) {
      throw new Error("Task not found");
    } else {
      task.title = updates.title || task.title;
      task.description = updates.description || task.description;
      task.priority = updates.priority || task.priority;
      task.dueDate = updates.dueDate ? new Date(updates.dueDate) : task.dueDate;
    }

    // Log the full task object to inspect its structure
    // console.log("Task object:", task);

    // console.log("updates object:", updates);

    // Save the changes to the user document
    await user.save();

    // Log the task after update
    // console.log("Task after update:", task);

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const moveTask = async (
  userId,
  projectName,
  columnName,
  taskName,
  toColumnName
) => {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Error("User not found");

  // Find the specific project
  const project = user.projects.find((project) => project.name === projectName);
  if (!project) {
    throw new Error("Project not found");
  }

  // Find the source column
  const fromColumn = project.columns.find(
    (column) => column.name === columnName
  );
  if (!fromColumn) {
    throw new Error("Source column not found");
  }

  // Find the task in the source column
  const taskIndex = fromColumn.cards.findIndex(
    (card) => card.title === taskName
  );
  if (taskIndex === -1) throw new Error("Task not found");

  // Remove the task from the source column
  const [task] = fromColumn.cards.splice(taskIndex, 1);

  // Find the target column
  const toColumn = project.columns.find(
    (column) => column.name === toColumnName
  );
  if (!toColumn) throw new Error("Target column not found");

  // Add the task to the target column
  toColumn.cards.push(task);

  // Save the updated user document
  await user.save();

  return user;
};

const deleteTask = async (userId, projectName, columnName, taskName) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Find the specific project, column, and task
  const project = user.projects.find((project) => project.name === projectName);
  if (!project) {
    throw new Error("Project not found");
  }

  const column = project.columns.find((column) => column.name === columnName);
  if (!column) {
    throw new Error("Column not found");
  }

  // Find the task in the source column
  const taskIndex = column.cards.findIndex((card) => card.title === taskName);
  if (taskIndex === -1) throw new Error("Task not found");

  column.cards.splice(taskIndex, 1);

  await user.save();

  return user;
};

const deleteColumn = async (userId, projectName, columnName) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Find the specific project
  const project = user.projects.find((project) => project.name === projectName);
  if (!project) {
    throw new Error("Project not found");
  }

  // Find the column in the source project
  const columnIndex = project.columns.findIndex(
    (column) => column.name === columnName
  );
  if (columnIndex === -1) throw new Error("Column not found");

  project.columns.splice(columnIndex, 1);

  await user.save();

  return user;
};

const deleteProject = async (userId, projectName) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Find the column in the source project
  const projectIndex = user.projects.findIndex(
    (project) => project.name === projectName
  );
  if (projectIndex === -1) throw new Error("Project not found");

  user.projects.splice(projectIndex, 1);

  await user.save();

  return user;
};

const updateProjectAppearance = async (userId, projectName, updates) => {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Error("User not found");

  const project = user.projects.find((project) => project.name === projectName);

  if (!project) {
    throw new Error("Project not found");
  } else {
    project.name = updates.name || project.name;

    if (updates.icon < 0 || updates.icon > 7) {
      throw new Error("Icon index out of range");
    }
    project.icon = updates.icon || project.icon;

    if (
      ![...Array(15).keys()]
        .map(String)
        .concat("none")
        .includes(updates.background)
    ) {
      throw new Error("Background index out of range");
    }
    project.background = updates.background || project.background;
  }

  await user.save();
  return user;
};

module.exports = {
  updateTheme,
  addProject,
  addColumn,
  updateColumn,
  addTask,
  updateTask,
  moveTask,
  deleteTask,
  deleteColumn,
  deleteProject,
  updateProjectAppearance,
};
