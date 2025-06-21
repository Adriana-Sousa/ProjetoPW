import React from 'react';
import './message.css';

const MessageBox = ({ message, type = 'info', onClose }) => {
  return (
    <div className={`message-box message-box--${type}`}>
      <span className="message-box__text">{message}</span>
      <button
        onClick={onClose}
        className="message-box__close"
        aria-label="Fechar mensagem"
      >
        ✕
      </button>
    </div>
  );
};

export default MessageBox;