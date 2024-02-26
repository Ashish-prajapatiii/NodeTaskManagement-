const router = require("express").Router();
const TaskService = require("../service/task.service");

router.post("/createTask", TaskService.createTask);
router.get("/getAllTask", TaskService.getAllTask);
router.post("/updateStatus", TaskService.UpdateTaskStatus);
router.post("/updateTask", TaskService.updateTask);
router.delete("/deleteTask/:id", TaskService.DeleteTask);

module.exports = router;
