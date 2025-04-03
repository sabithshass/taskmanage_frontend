import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

function TaskCard({ task, onDelete, onEdit }) {
  return (
    <Card className="task-card mx-auto my-3 shadow-lg border-0 rounded-4">
      <Card.Body className="d-flex flex-column justify-content-between p-4">
        <div>
          <Card.Title className="fw-bold text-primary">
            {task?.title}
          </Card.Title>
          <Badge
            bg={task?.completed ? "success" : "secondary"}
            className="status-badge mt-3"
          >
            {task?.completed ? "Completed" : "Not Completed"}
          </Badge>
          <Card.Text className="description-box p-2 mt-3">
            {task?.description}
          </Card.Text>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            variant="warning"
            className="icon-btn rounded-circle p-2 d-flex align-items-center justify-content-center"
            onClick={() => onEdit?.(task)}
          >
            <BsPencilSquare size={20} />
          </Button>
          <Button
            variant="danger"
            className="icon-btn rounded-circle p-2 d-flex align-items-center justify-content-center"
            onClick={() => onDelete?.(task?._id)}
          >
            <BsTrash size={20} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TaskCard;
