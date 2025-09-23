import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function FilterModal({ show, handleClose, visibleColumns, setVisibleColumns }) {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setVisibleColumns({ ...visibleColumns, [name]: checked });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Filter Columns</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {Object.keys(visibleColumns).map((col) => (
            <Form.Check
              key={col}
              type="checkbox"
              label={col.charAt(0).toUpperCase() + col.slice(1)}
              name={col}
              checked={visibleColumns[col]}
              onChange={handleCheckboxChange}
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FilterModal;
