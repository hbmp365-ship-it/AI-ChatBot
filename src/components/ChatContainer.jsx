import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import scenariosData from '../data/scenarios.json';

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentStepId, setCurrentStepId] = useState('intro');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const chatEndRef = useRef(null);

  // 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 초기 시나리오 로드
  useEffect(() => {
    const firstScenario = scenariosData.scenarios[0];
    setCurrentScenario(firstScenario);
    
    const introStep = firstScenario.steps.find(step => step.id === 'intro');
    if (introStep) {
      setTimeout(() => {
        addMessage(introStep);
      }, introStep.delay || 0);
    }
  }, []);

  // 메시지 추가 함수
  const addMessage = (step) => {
    setMessages(prev => [...prev, step]);
    
    if (step.speaker === 'AI' && !step.options && step.next && step.next !== 'end') {
      setTimeout(() => {
        moveToNextStep(step.next);
      }, 1000);
    }
  };

  // 옵션 클릭 핸들러
  const handleOptionClick = (optionText) => {
    if (isWaitingForResponse) return;
    
    setIsWaitingForResponse(true);

    const currentStep = currentScenario.steps.find(s => s.id === currentStepId);
    
    // 시나리오 선택
    if (currentStepId === 'intro') {
      let selectedScenario;
      if (optionText === '예약취소') {
        selectedScenario = scenariosData.scenarios[0];
      } else if (optionText === '예약확인') {
        selectedScenario = scenariosData.scenarios[1];
      } else if (optionText === '추천 받는 라운딩') {
        selectedScenario = scenariosData.scenarios[2];
      }
      
      if (selectedScenario) {
        setCurrentScenario(selectedScenario);
        
        const userMessage = {
          speaker: 'User',
          bubble: 'right',
          message: optionText
        };
        setMessages(prev => [...prev, userMessage]);
        
        const nextStepId = selectedScenario.steps[1].id;
        setCurrentStepId(nextStepId);
        
        setTimeout(() => {
          const nextStep = selectedScenario.steps.find(s => s.id === selectedScenario.steps[1].next);
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
    
    // 일반 응답 처리
    const userMessage = {
      speaker: 'User',
      bubble: 'right',
      message: optionText
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    if (currentStep && currentStep.next) {
      setTimeout(() => {
        moveToNextStep(currentStep.next);
        setIsWaitingForResponse(false);
      }, 500);
    }
  };

  // 다음 단계로 이동
  const moveToNextStep = (nextStepId) => {
    if (nextStepId === 'end') {
      setTimeout(() => {
        handleRestart();
      }, 3000);
      return;
    }

    const nextStep = currentScenario.steps.find(step => step.id === nextStepId);
    
    if (nextStep) {
      setCurrentStepId(nextStepId);
      
      if (nextStep.speaker === 'AI') {
        setTimeout(() => {
          addMessage(nextStep);
        }, nextStep.delay || 1500);
      } else {
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
    setCurrentStepId('intro');
    
    const introStep = firstScenario.steps.find(step => step.id === 'intro');
    if (introStep) {
      setTimeout(() => {
        addMessage(introStep);
      }, introStep.delay || 1500);
    }
  };

  return (
    <div className="w-full h-screen sm:h-auto sm:max-w-md sm:max-h-[800px] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRestart}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-white text-lg font-semibold">티샷 AI</h1>
        </div>
        <button 
          onClick={handleRestart}
          className="text-white hover:bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          처음으로
        </button>
      </div>
      
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-5 chat-messages bg-kakao-bg">
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            message={msg.message}
            bubble={msg.bubble}
            component={msg.component}
            options={msg.options}
            onOptionClick={handleOptionClick}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* 하단 입력 영역 (장식용) */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-2">
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5">
          <p className="text-gray-400 text-sm">메시지를 입력해주세요.</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
