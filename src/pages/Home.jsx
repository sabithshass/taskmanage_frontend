import React, { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { Container, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { Show_Toast } from "../utils/toastService";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [page, limit]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks(page, limit);
      setTasks(data.data.tasks);
      setTotalPages(data.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDeleteModal = (id) => {
    setDeleteTaskId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTaskId) return;

    setDeleting(true);
    try {
      await deleteTask(deleteTaskId);
      Show_Toast("Task deleted successfully!", true);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      Show_Toast("Failed to delete task.", false);
    } finally {
      setDeleting(false);
      setDeleteTaskId(null);
      setShowDeleteModal(false);
    }
  };

  const handleShowModal = (task = null) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4 fw-bold text-dark display-5">
        Task Management
      </h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <p className="mt-3">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center my-4 mt-5">
          <p className="text-muted fs-4">No tasks available.</p>
          <Button
            variant="success"
            className="mt-2 fw-semibold shadow-sm rounded-pill px-4 py-2"
            onClick={() => handleShowModal()}
            disabled={loading}
          >
            Add Task
          </Button>
        </div>
      ) : (
        <>
          <Button
            variant="success"
            className="mt-2 fw-semibold shadow-sm rounded-pill px-4 py-2"
            onClick={() => handleShowModal()}
            disabled={loading}
          >
            Add Task
          </Button>

          <Row>
            {tasks.map((task) => (
              <Col md={6} lg={4} key={task._id}>
                <TaskCard
                  task={task}
                  onDelete={() => handleShowDeleteModal(task._id)}
                  onEdit={() => handleShowModal(task)}
                />
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
            <Button
              variant="outline-primary"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline-primary"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingTask ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm
            task={editingTask}
            onClose={handleCloseModal}
            refreshTasks={fetchTasks}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Home;
