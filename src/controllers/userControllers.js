const userServices = require("../services/userServices");

const updateTheme = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { theme } = req.body;

    const updatedTheme = await userServices.updateTheme(userId, theme);

    res
      .status(200)
      .json({ message: "Theme updated successfully", User: updatedTheme });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
    next(error);
  }
};

const addProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, icon, background } = req.body;

    const projects = await userServices.addProject(
      userId,
      name,
      icon,
      background
    );

    res.status(201).json({ message: "Project added successfully", projects });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addColumn = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectName = req.params.projectName;
    console.log(projectName);

    const { columnName } = req.body;

    const project = await userServices.addColumn(
      userId,
      projectName,
      columnName
    );

    res.status(201).json({ message: "Column added successfully", project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateColumn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectName, columnName } = req.params;

    const newColumnName = req.body;

    const project = await userServices.updateColumn(
      userId,
      projectName,
      columnName,
      newColumnName
    );

    res
      .status(201)
      .json({ message: "Column title successfully updated", project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectName, columnName } = req.params;
    const taskData = req.body;

    const column = await userServices.addTask(
      userId,
      projectName,
      columnName,
      taskData
    );

    res.status(201).json({ message: "Task added successfully", column });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectName, columnName, taskName } = req.params;
    const updates = req.body;

    const task = await userServices.updateTask(
      userId,
      projectName,
      columnName,
      taskName,
      updates
    );

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const moveTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectName, columnName, taskName } = req.params;
    const { toColumnName } = req.body;

    const task = await userServices.moveTask(
      userId,
      projectName,
      columnName,
      taskName,
      toColumnName
    );

    res.status(200).json({ message: "Task moved successfully", task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectName, columnName, taskName } = req.params;

    const column = await userServices.deleteTask(
      userId,
      projectName,
      columnName,
      taskName
    );

    res.status(200).json({ message: "Task deleted successfully", column });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteColumn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectName, columnName } = req.params;

    const project = await userServices.deleteColumn(
      userId,
      projectName,
      columnName
    );

    res.status(200).json({ message: "Column deleted successfully", project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectName } = req.params;

    const projects = await userServices.deleteProject(userId, projectName);

    res.status(200).json({ message: "Project deleted successfully", projects });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProjectAppearance = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const { projectName } = req.params;
    const updates = req.body;

    const project = await userServices.updateProjectAppearance(
      userId,
      projectName,
      updates
    );

    res
      .status(200)
      .json({ message: "Project appearance updated successfully", project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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
