import React from "react";

const ChatBubble = ({ message, bubble, component, options, onOptionClick }) => {
  const isLeft = bubble === "left";

  return (
    <div
      className={`flex mb-3 animate-slide-in-up ${
        isLeft ? "justify-start" : "justify-end"
      }`}
    >
      <div className={`max-w-[75%] ${isLeft ? "flex items-start gap-2" : ""}`}>
        {/* AI 아바타 */}
        {isLeft && (
          <div className="flex-shrink-0 w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
            🤖
          </div>
        )}

        <div className="flex flex-col gap-2">
          {/* 메시지 말풍선 */}
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              isLeft
                ? "bg-white text-gray-800 rounded-tl-none"
                : "bg-kakao-yellow text-gray-900 rounded-tr-none"
            }`}
          >
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {message}
            </p>
          </div>

          {/* Quick Reply 버튼들 */}
          {component === "quick_reply" && options && options.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onOptionClick(option)}
                  className="px-4 py-2 bg-btn-gray text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors duration-200 active:scale-95"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Card 옵션 버튼들 */}
          {component === "card" && options && options.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onOptionClick(option)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-800 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left active:scale-98"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
