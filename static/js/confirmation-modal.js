/**
 * Confirmation Modal - Reusable component
 * Usage: showConfirmationModal(message, onConfirm, onCancel)
 */

(function() {
  // Create modal HTML if it doesn't exist
  function createModal() {
    if (document.getElementById('confirmation-modal')) return;

    const modalHTML = `
      <div id="confirmation-modal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-icon">⚠️</div>
          <h3 class="modal-title">Confirmation Required</h3>
          <p class="modal-message" id="modal-message"></p>
          <div class="modal-buttons">
            <button id="modal-cancel" class="modal-btn modal-btn-secondary">No, Go Back</button>
            <button id="modal-confirm" class="modal-btn modal-btn-primary">Yes, Continue</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Close modal when clicking outside
    document.getElementById('confirmation-modal').addEventListener('click', function(e) {
      if (e.target === this) {
        hideModal();
      }
    });
  }

  function showModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  function hideModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  // Public function to show confirmation modal
  window.showConfirmationModal = function(message, onConfirm, onCancel) {
    createModal();

    const messageEl = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');

    // Set message
    if (messageEl) {
      messageEl.textContent = message;
    }

    // Remove old event listeners by cloning
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Add new event listeners
    newConfirmBtn.addEventListener('click', function() {
      hideModal();
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    });

    newCancelBtn.addEventListener('click', function() {
      hideModal();
      if (typeof onCancel === 'function') {
        onCancel();
      }
    });

    // Show modal
    showModal();
  };

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      hideModal();
    }
  });
})();
