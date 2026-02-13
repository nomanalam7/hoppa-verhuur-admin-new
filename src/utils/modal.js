
export const showModal = (message, onConfirm) => {
  const existingModal = document.getElementById('logout-modal');
  if (existingModal) {
    existingModal.remove();
  }
  const overlay = document.createElement('div');
  overlay.id = 'logout-modal-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    font-family: 'Helvetica', sans-serif;
  `;

  const modal = document.createElement('div');
  modal.id = 'logout-modal';
  modal.style.cssText = `
    background-color: #ffffff;
    border-radius: 24px;
    padding: 40px 32px;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    text-align: center;
  `;

  // Create icon container
  const iconContainer = document.createElement('div');
  iconContainer.style.cssText = `
    width: 88px;
    height: 88px;
    border-radius: 24px;
    background-color: #FFE6E6;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  const icon = document.createElement('div');
  icon.innerHTML = '⚠️';
  icon.style.cssText = `
    font-size: 40px;
  `;
  iconContainer.appendChild(icon);
  const messageEl = document.createElement('div');
  messageEl.textContent = message;
  messageEl.style.cssText = `
    font-size: 18px;
    font-weight: 600;
    color: #151515;
    line-height: 1.5;
  `;
  const button = document.createElement('button');
  button.textContent = 'OK';
  button.style.cssText = `
    background-color: #F97316;
    color: #ffffff;
    border: none;
    border-radius: 14px;
    padding: 12px 32px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'Helvetica', sans-serif;
    transition: background-color 0.2s;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#e86514';
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#F97316';
  });

  button.addEventListener('click', () => {
    overlay.remove();
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    }
  });

  modal.appendChild(iconContainer);
  modal.appendChild(messageEl);
  modal.appendChild(button);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  button.focus();
};

