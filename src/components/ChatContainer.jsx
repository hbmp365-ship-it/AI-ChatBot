import React, { useState, useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import scenariosData from "../data/scenarios.json";

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentStepId, setCurrentStepId] = useState("intro");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const chatEndRef = useRef(null);

  // 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 초기 시나리오 로드
  useEffect(() => {
    // 첫 번째 시나리오 로드 (인트로)
    const firstScenario = scenariosData.scenarios[0];
    setCurrentScenario(firstScenario);

    // 첫 메시지 표시
    const introStep = firstScenario.steps.find((step) => step.id === "intro");
    if (introStep) {
      setTimeout(() => {
        addMessage(introStep);
      }, introStep.delay || 0);
    }
  }, []);

  // 메시지 추가 함수
  const addMessage = (step) => {
    setMessages((prev) => [...prev, step]);

    // AI 메시지이고 options가 없으면 자동으로 다음 단계로 (단, intro 단계는 제외)
    if (
      step.speaker === "AI" &&
      !step.options &&
      step.next &&
      step.next !== "end" &&
      step.id !== "intro"
    ) {
      setTimeout(() => {
        moveToNextStep(step.next);
      }, 1000);
    }
  };

  // 옵션 클릭 핸들러
  const handleOptionClick = (optionText) => {
    if (isWaitingForResponse) return;

    setIsWaitingForResponse(true);

    // 사용자 응답 메시지 생성
    const currentStep = currentScenario.steps.find(
      (s) => s.id === currentStepId
    );

    // 특수 케이스: 시나리오 선택
    if (currentStepId === "intro") {
      // 선택된 옵션에 따라 시나리오 전환
      let selectedScenario;
      if (optionText === "예약취소") {
        selectedScenario = scenariosData.scenarios[0];
      } else if (optionText === "예약확인") {
        selectedScenario = scenariosData.scenarios[1];
      } else if (optionText === "추천 받는 라운딩") {
        selectedScenario = scenariosData.scenarios[2];
      }

      if (selectedScenario) {
        setCurrentScenario(selectedScenario);

        // 사용자 선택 메시지 추가
        const userMessage = {
          speaker: "User",
          bubble: "right",
          message: optionText,
        };
        setMessages((prev) => [...prev, userMessage]);

        // 선택된 시나리오의 두 번째 단계로 이동
        const nextStepId = selectedScenario.steps[1].id;
        setCurrentStepId(nextStepId);

        setTimeout(() => {
          const nextStep = selectedScenario.steps.find(
            (s) => s.id === selectedScenario.steps[1].next
          );
          if (nextStep) {
            setTimeout(() => {
              addMessage(nextStep);
              setCurrentStepId(nextStep.id);
              setIsWaitingForResponse(false);
            }, nextStep.delay || 1500);
          }
        }, 500);

        return;
      }
    }

    // 일반 사용자 응답 처리
    const userMessage = {
      speaker: "User",
      bubble: "right",
      message: optionText,
    };

    setMessages((prev) => [...prev, userMessage]);

    // 다음 단계로 이동
    if (currentStep && currentStep.next) {
      setTimeout(() => {
        moveToNextStep(currentStep.next);
        setIsWaitingForResponse(false);
      }, 500);
    }
  };

  // 다음 단계로 이동
  const moveToNextStep = (nextStepId) => {
    if (nextStepId === "end") {
      // 대화 종료
      setTimeout(() => {
        handleRestart();
      }, 3000);
      return;
    }

    const nextStep = currentScenario.steps.find(
      (step) => step.id === nextStepId
    );

    if (nextStep) {
      setCurrentStepId(nextStepId);

      // AI 메시지인 경우에만 딜레이 후 표시
      if (nextStep.speaker === "AI") {
        setTimeout(() => {
          addMessage(nextStep);
        }, nextStep.delay || 1500);
      } else {
        // User 단계는 자동으로 다음으로
        if (nextStep.next) {
          moveToNextStep(nextStep.next);
        }
      }
    }
  };

  // 대화 재시작
  const handleRestart = () => {
    setMessages([]);
    const firstScenario = scenariosData.scenarios[0];
    setCurrentScenario(firstScenario);
    setCurrentStepId("intro");

    const introStep = firstScenario.steps.find((step) => step.id === "intro");
    if (introStep) {
      setTimeout(() => {
        addMessage(introStep);
      }, introStep.delay || 1500);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-title">티샷 AI 챗봇</div>
        <button
          className="restart-btn"
          onClick={handleRestart}
          aria-label="대화 다시 시작"
        >
          처음으로
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <ChatBubble
            key={`${msg.id || index}-${index}`}
            message={msg.message}
            bubble={msg.bubble}
            component={msg.component}
            options={msg.options}
            onOptionClick={handleOptionClick}
          />
        ))}
        {isWaitingForResponse && (
          <div className="chat-bubble-container left">
            <div className="chat-bubble ai-bubble">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
