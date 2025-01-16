const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userControllers");

const { authMiddleware } = require("../../middlewares/authMiddleware");

router.patch("/theme", authMiddleware, userController.updateTheme);
router.post("/projects", authMiddleware, userController.addProject);
router.post(
  "/projects/:projectId/columns",
  authMiddleware,
  userController.addColumn
);
router.post(
  "/projects/:projectId/columns/:columnId/tasks",
  authMiddleware,
  userController.addTask
);
router.patch(
  "/projects/:projectId/columns/:columnId/tasks/:taskId",
  authMiddleware,
  userController.updateTask
);
router.patch(
  "/projects/:projectId/tasks/:taskId/move",
  authMiddleware,
  userController.moveTask
);
router.delete(
  "/projects/:projectId/columns/:columnId/tasks/:taskId",
  authMiddleware,
  userController.deleteTask
);
router.delete(
  "/projects/:projectId/columns/:columnId",
  authMiddleware,
  userController.deleteColumn
);
router.delete(
  "/projects/:projectId",
  authMiddleware,
  userController.deleteProject
);

router.patch(
  "/projects/:projectId/appearance",
  userController.updateProjectAppearance
);

module.exports = router;
