import React, { useState, useEffect } from "react";
import { createTask, updateTask } from "../services/api";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Show_Toast } from "../utils/toastService";

function TaskForm({ task, onClose, refreshTasks }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        completed: task.completed ?? false,
      });
    }
  }, [task]);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    } else if (formData.title.length < 3 || formData.title.length > 50) {
      newErrors.title = "Title must be between 3 and 50 characters.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (
      formData.description.length < 5 ||
      formData.description.length > 500
    ) {
      newErrors.description =
        "Description must be between 5 and 500 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "completed" ? value === "true" : value,
    });

    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    setServerErrors(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErrors(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      // if (task) {
      //     await updateTask(task._id, formData);
      //     Show_Toast("Task updated successfully!", true);
      // } else {
      //     await createTask(formData);
      //     Show_Toast("Task created successfully!", true);
      // }
      let response;

      if (task) {
        response = await updateTask(task._id, formData);
      } else {
        response = await createTask(formData);
      }

      const successMessage =
        response?.message || "Action completed successfully!";
      Show_Toast(successMessage, true);
      refreshTasks();
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || "An error occurred.";
        setServerErrors(errorMessage);
      } else {
        setServerErrors("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {serverErrors && (
        <Alert variant="danger" className="mb-3">
          {serverErrors}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          isInvalid={!!errors.title}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          isInvalid={!!errors.description}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      {task && (
        <Form.Group className="mb-3">
          <Form.Label>Completed</Form.Label>
          <Form.Select
            name="completed"
            value={formData.completed.toString()}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="false">Not Completed</option>
            <option value="true">Completed</option>
          </Form.Select>
        </Form.Group>
      )}

      <Button
        type="submit"
        variant={task ? "warning" : "success"}
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}
            Processing...
          </>
        ) : task ? (
          "Update Task"
        ) : (
          "Add Task"
        )}
      </Button>
    </Form>
  );
}

export default TaskForm;
