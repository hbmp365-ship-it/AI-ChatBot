import React from 'react';

const ChatBubble = ({ message, bubble, component, options, onOptionClick }) => {
  const isLeft = bubble === 'left';

  return (
    <div className={`chat-bubble-container ${isLeft ? 'left' : 'right'}`}>
      <div className={`chat-bubble ${isLeft ? 'ai-bubble' : 'user-bubble'}`}>
        <div className="message-text">{message}</div>
        
        {component === 'quick_reply' && options && (
          <div className="quick-reply-buttons">
            {options.map((option, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => onOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        
        {component === 'card' && options && (
          <div className="card-options">
            {options.map((option, index) => (
              <button
                key={index}
                className="card-option-btn"
                onClick={() => onOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
