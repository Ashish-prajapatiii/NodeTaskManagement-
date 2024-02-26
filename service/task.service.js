const TaskModel = require("../model/task.model");
const response = require("../helper/middlewere");
// Create Task API
const createTask = async (req, res) => {
  const { title, description, status, dueDate, category } = req.body;
  try {
    if (!title) {
      return res.send(
        response.common("Task Title is required", false, undefined, 300)
      );
    }
    const newTask = new TaskModel({
      title,
      description,
      status,
      dueDate,
      category,
    });
    await newTask.save();
    res.send(response.common("Task Created successfully", true, newTask, 200));
  } catch (err) {
    res.status(500).send(response.common(err, false, undefined, 500));
  }
};

// Get All Tasks API
const getAllTask = async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.send(response.common("All Tasks Here!", true, tasks, 200));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send(response.common(error, false, undefined, 500));
  }
};

/*
 Update Task Status API

 In This Api Multiple Marked Status Can change Using Array
 Body Data Like This

{
 "updates":  [{"id":"65dc1d41c41f38765e2fdbb7","status":"completed"},
   {"id":"65dc1d4cc41f38765e2fdbb9","status":"completed"}]
 }

 */
const UpdateTaskStatus = async (req, res) => {
  const updates = req.body.updates;
  if (!updates || !Array.isArray(updates) || updates.length === 0) {
    return res.send(
      response.common(
        "Invalid Request: No updates provided",
        false,
        undefined,
        400
      )
    );
  }

  try {
    const updateResults = await Promise.all(
      updates.map(async ({ id, status }) => {
        const existingTask = await TaskModel.findById(id);
        if (!existingTask) {
          return { id: id, updatedTask: null, message: "Task not found" };
        }
        if (existingTask.status === status) {
          return {
            id: id,
            updatedTask: existingTask,
            message: `Task already marked as ${status}`,
          };
        }
        const statusUpdate = await TaskModel.findByIdAndUpdate(
          id,
          { status: status },
          { new: true }
        );
        return {
          id: id,
          updatedTask: statusUpdate,
          message: "Status Updated Successfully",
        };
      })
    );
    res.status(200).json({ data: updateResults });
  } catch (error) {
    console.error("Error updating tasks:", error);
    res.status(500).send(response.common(error, false, undefined, 500));
  }
};

// Delete Task API
const DeleteTask = async (req, res) => {
  const taskId = req.params.id;
  if (!taskId) {
    return res.send(
      response.common("Task Id Not Found", false, undefined, 400)
    );
  }
  try {
    const deletedTask = await TaskModel.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.send(
      response.common("Task Deleted Successfully", true, deletedTask, 200)
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send(response.common(error, false, undefined, 500));
  }
};

// Update Task Details API
const updateTask = async (req, res) => {
  const { id, title, description, status, dueDate, category } = req.body;
  if (!id) {
    return res.send(
      response.common("Invalid Request: Missing ID", false, undefined, 400)
    );
  }
  try {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      { title, description, status, dueDate, category },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.send(
      response.common("Task updated successfully", true, updatedTask, 200)
    );
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send(response.common(error, false, undefined, 500));
  }
};

module.exports = {
  createTask,
  getAllTask,
  UpdateTaskStatus,
  DeleteTask,
  updateTask,
};
