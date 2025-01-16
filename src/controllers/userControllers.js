const userServices = require("../services/userServices");

const updateTheme = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
    const { theme } = req.body;

    const updatedTheme = await userServices.updateTheme(userId, theme);

    res
      .status(200)
      .json({ message: "Theme updated successfully", theme: updatedTheme });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectName } = req.body;

    const projects = await userServices.addProject(userId, projectName);

    res.status(201).json({ message: "Project added successfully", projects });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addColumn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, columnName } = req.body;

    const project = await userServices.addColumn(userId, projectId, columnName);

    res.status(201).json({ message: "Column added successfully", project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, columnId, taskData } = req.body;

    const column = await userServices.addTask(
      userId,
      projectId,
      columnId,
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
    const { projectId, columnId, taskId, updates } = req.body;

    const task = await userServices.updateTask(
      userId,
      projectId,
      columnId,
      taskId,
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
    const { projectId, taskId, fromColumnId, toColumnId } = req.body;

    const task = await userServices.moveTask(
      userId,
      projectId,
      taskId,
      fromColumnId,
      toColumnId
    );

    res.status(200).json({ message: "Task moved successfully", task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, columnId, taskId } = req.body;

    const column = await userServices.deleteTask(
      userId,
      projectId,
      columnId,
      taskId
    );

    res.status(200).json({ message: "Task deleted successfully", column });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteColumn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, columnId } = req.body;

    const project = await userServices.deleteColumn(
      userId,
      projectId,
      columnId
    );

    res.status(200).json({ message: "Column deleted successfully", project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.body;

    const projects = await userServices.deleteProject(userId, projectId);

    res.status(200).json({ message: "Project deleted successfully", projects });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProjectAppearance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, icon, background } = req.body;

    const project = await userServices.updateProjectAppearance(
      userId,
      projectId,
      { icon, background }
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
  addTask,
  updateTask,
  moveTask,
  deleteTask,
  deleteColumn,
  deleteProject,
  updateProjectAppearance,
};
