import React from "react";

const ChatBubble = ({ message, bubble, component, options, onOptionClick }) => {
  const isLeft = bubble === "left";

  // 골프장 카드 렌더링 함수
  const renderGolfCourseCard = (option) => {
    // 골프장 정보 파싱 (예: "그린힐CC - 그린피 15만원")
    const [courseName, priceInfo] = option.split(" - ");
    const price = priceInfo || "가격 정보 없음";

    return (
      <div className="golf-course-card">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="course-name">{courseName}</div>
            <div className="course-info">경기도 이천시 · 15Km</div>
          </div>
          <div className="flex gap-1">
            <span className="promotion-tag promotion-new">신설</span>
            <span className="promotion-tag promotion-recommended">추천</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="course-price">{price}</div>
          <div className="course-teams">3팀</div>
        </div>
      </div>
    );
  };

  // 시간대 옵션 렌더링 함수
  const renderTimeSlot = (option) => {
    return <div className="time-slot-btn">{option}</div>;
  };

  return (
    <div className={`chat-bubble-container ${isLeft ? "left" : "right"}`}>
      <div className={`chat-bubble ${isLeft ? "ai-bubble" : "user-bubble"}`}>
        <div className="message-text">{message}</div>

        {component === "quick_reply" && options && (
          <div className="quick-reply-buttons">
            {options.map((option, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => onOptionClick(option)}
                aria-label={`선택: ${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {component === "card" && options && (
          <div className="card-options">
            {options.map((option, index) => {
              // 골프장 카드인지 확인
              if (option.includes("CC") || option.includes("골프장")) {
                return (
                  <div
                    key={index}
                    className="card-option-btn"
                    onClick={() => onOptionClick(option)}
                    aria-label={`선택: ${option}`}
                  >
                    {renderGolfCourseCard(option)}
                  </div>
                );
              }

              // 시간대 옵션인지 확인
              if (option.includes(":") || option.includes("시")) {
                return (
                  <div
                    key={index}
                    className="time-slot-btn"
                    onClick={() => onOptionClick(option)}
                    aria-label={`선택: ${option}`}
                  >
                    {option}
                  </div>
                );
              }

              // 일반 카드 옵션
              return (
                <button
                  key={index}
                  className="card-option-btn"
                  onClick={() => onOptionClick(option)}
                  aria-label={`선택: ${option}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
