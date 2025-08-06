import React from 'react';

const DeleteConfirmationModal = ({ showDeleteModal, deleteItem, setShowDeleteModal, confirmDelete }) => (
  showDeleteModal && deleteItem && (
    <div className="modal-overlay delete-modal" onClick={() => setShowDeleteModal(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirm Delete</h3>
          <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
        </div>
        <div className="modal-content">
          <div className="warning-icon">⚠️</div>
          <p>
            Are you sure you want to delete <span className="item-name">&quot;{deleteItem.name}&quot;</span>?
          </p>
          <p>This action cannot be undone.</p>
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn-danger" 
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
);

export default DeleteConfirmationModal;
