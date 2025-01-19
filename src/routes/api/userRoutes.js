const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userControllers");

const { authMiddleware } = require("../../middlewares/authMiddleware");

router.patch("/theme", authMiddleware, userController.updateTheme);

router.post("/projects", authMiddleware, userController.addProject);

router.post(
  "/projects/:projectName/columns",
  authMiddleware,
  userController.addColumn
);

router.patch(
  "/projects/:projectName/column/:columnName",
  authMiddleware,
  userController.updateColumn
);

router.post(
  "/projects/:projectName/columns/:columnName/tasks",
  authMiddleware,
  userController.addTask
);

router.patch(
  "/projects/:projectName/column/:columnName/tasks/:taskName",
  authMiddleware,
  userController.updateTask
);

router.patch(
  "/projects/:projectName/column/:columnName/tasks/:taskName/move",
  authMiddleware,
  userController.moveTask
);

router.delete(
  "/projects/:projectName/columns/:columnName/tasks/:taskName",
  authMiddleware,
  userController.deleteTask
);

router.delete(
  "/projects/:projectName/columns/:columnName",
  authMiddleware,
  userController.deleteColumn
);

router.delete(
  "/projects/:projectName",
  authMiddleware,
  userController.deleteProject
);

router.patch(
  "/projects/:projectName/appearance",
  authMiddleware,
  userController.updateProjectAppearance
);

module.exports = router;
