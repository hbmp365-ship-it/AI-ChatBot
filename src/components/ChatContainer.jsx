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

  // 메시지 추가 함수
  const addMessage = (step) => {
    // intro 단계 중복 방지
    if (step.id === "intro") {
      setMessages((prev) => {
        // 이미 intro 메시지가 있으면 추가하지 않음
        const hasIntro = prev.some((msg) => msg.id === "intro");
        if (hasIntro) return prev;
        return [...prev, step];
      });
      return;
    }

    setMessages((prev) => [...prev, step]);

    // AI 메시지이고 options가 없으면 자동으로 다음 단계로
    if (
      step.speaker === "AI" &&
      !step.options &&
      step.next &&
      step.next !== "end"
    ) {
      setTimeout(() => {
        moveToNextStep(step.next);
      }, 1000);
    }
  };

  // 초기 시나리오 로드
  useEffect(() => {
    // 이미 메시지가 있으면 중복 실행 방지
    if (messages.length > 0) return;

    const firstScenario = scenariosData.scenarios[0];
    setCurrentScenario(firstScenario);

    const introStep = firstScenario.steps.find((step) => step.id === "intro");
    if (introStep) {
      setTimeout(() => {
        addMessage(introStep);
      }, introStep.delay || 0);
    }
  }, []);

  // 골프장 정보 가져오기 함수
  const getGolfCourseInfo = (optionText) => {
    const golfCourses = {
      스카이힐CC: {
        name: "스카이힐CC",
        location: "경기도 가평군",
        greenFee: "8만원",
        cartFee: "3만원",
        caddieFee: "10만원",
        rating: "4.2/5.0",
        difficulty: "하",
      },
      마운틴뷰CC: {
        name: "마운틴뷰CC",
        location: "경기도 양평군",
        greenFee: "9만원",
        cartFee: "3만원",
        caddieFee: "10만원",
        rating: "4.3/5.0",
        difficulty: "하",
      },
      리버사이드CC: {
        name: "리버사이드CC",
        location: "경기도 포천시",
        greenFee: "7만원",
        cartFee: "3만원",
        caddieFee: "10만원",
        rating: "4.1/5.0",
        difficulty: "하",
      },
      그린힐CC: {
        name: "그린힐CC",
        location: "경기도 이천시",
        greenFee: "15만원",
        cartFee: "4만원",
        caddieFee: "12만원",
        rating: "4.5/5.0",
        difficulty: "중",
      },
      썬밸리CC: {
        name: "썬밸리CC",
        location: "경기도 용인시",
        greenFee: "18만원",
        cartFee: "4만원",
        caddieFee: "12만원",
        rating: "4.4/5.0",
        difficulty: "중",
      },
      레이크사이드CC: {
        name: "레이크사이드CC",
        location: "경기도 파주시",
        greenFee: "13만원",
        cartFee: "4만원",
        caddieFee: "11만원",
        rating: "4.3/5.0",
        difficulty: "중",
      },
      프리미엄CC: {
        name: "프리미엄CC",
        location: "경기도 성남시",
        greenFee: "25만원",
        cartFee: "5만원",
        caddieFee: "15만원",
        rating: "4.7/5.0",
        difficulty: "상",
      },
      골든밸리CC: {
        name: "골든밸리CC",
        location: "경기도 하남시",
        greenFee: "28만원",
        cartFee: "5만원",
        caddieFee: "15만원",
        rating: "4.8/5.0",
        difficulty: "상",
      },
      엘리트CC: {
        name: "엘리트CC",
        location: "경기도 수원시",
        greenFee: "22만원",
        cartFee: "5만원",
        caddieFee: "14만원",
        rating: "4.6/5.0",
        difficulty: "상",
      },
    };

    // 골프장명 추출
    let courseName = "";
    for (const name in golfCourses) {
      if (optionText.includes(name)) {
        courseName = name;
        break;
      }
    }

    if (courseName && golfCourses[courseName]) {
      const course = golfCourses[courseName];
      return {
        message: `${course.name} 상세 정보입니다.\n\n위치: ${course.location}\n날짜: 이번 주 토요일\n그린피: ${course.greenFee}\n카트피: ${course.cartFee}\n캐디피: ${course.caddieFee}\n평점: ${course.rating}\n코스 난이도: ${course.difficulty}`,
      };
    }

    return null;
  };

  // 옵션 클릭 핸들러
  const handleOptionClick = (optionText) => {
    if (isWaitingForResponse) return;

    setIsWaitingForResponse(true);

    const currentStep = currentScenario.steps.find(
      (s) => s.id === currentStepId
    );

    // 시나리오 선택
    if (currentStepId === "intro") {
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

        const userMessage = {
          speaker: "User",
          bubble: "right",
          message: optionText,
        };
        setMessages((prev) => [...prev, userMessage]);

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

    // 상담 완료 후 액션 처리
    if (currentStepId === "consultation_complete") {
      if (optionText === "처음으로 돌아가기") {
        handleRestart();
        return;
      } else if (optionText === "다른 도움이 필요해요") {
        const userMessage = {
          speaker: "User",
          bubble: "right",
          message: optionText,
        };
        setMessages((prev) => [...prev, userMessage]);

        const aiMessage = {
          speaker: "AI",
          bubble: "left",
          message: "무엇을 도와드릴까요?",
          component: "quick_reply",
          options: ["예약취소", "예약확인", "추천 받는 라운딩"],
        };
        setTimeout(() => {
          addMessage(aiMessage);
          setCurrentStepId("intro");
          setIsWaitingForResponse(false);
        }, 1000);
        return;
      }
    }

    // 최종 액션 처리
    if (currentStepId === "user_final_action") {
      if (optionText === "처음으로 돌아가기") {
        handleRestart();
        return;
      } else if (optionText === "상담자 전화") {
        // 상담자 전화 연결 로직
        const userMessage = {
          speaker: "User",
          bubble: "right",
          message: optionText,
        };
        setMessages((prev) => [...prev, userMessage]);

        // 전화 연결 시도
        const phoneNumber = "02-3333-4444";

        // 모바일 환경에서 전화 앱 실행
        if (window.navigator && window.navigator.userAgent) {
          const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              window.navigator.userAgent
            );

          if (isMobile) {
            // 모바일에서 전화 앱 실행
            window.location.href = `tel:${phoneNumber}`;
          }
        }

        const aiMessage = {
          speaker: "AI",
          bubble: "left",
          message: `상담자에게 연결해드리겠습니다.\n\n📞 전화번호: ${phoneNumber}\n⏰ 상담시간: 평일 09:00-18:00\n\n전화가 연결되지 않으면 위 번호로 직접 연락해주세요.`,
          component: "quick_reply",
          options: ["처음으로 돌아가기", "다른 도움이 필요해요"],
        };
        setTimeout(() => {
          addMessage(aiMessage);
          setCurrentStepId("consultation_complete");
          setIsWaitingForResponse(false);
        }, 1000);
        return;
      }
    }

    // 예약 확인에서 취소 선택 처리
    if (currentStepId === "user_next_action") {
      const userMessage = {
        speaker: "User",
        bubble: "right",
        message: optionText,
      };
      setMessages((prev) => [...prev, userMessage]);

      if (optionText === "예약 취소하기") {
        // 취소 로직으로 이동
        setTimeout(() => {
          moveToNextStep("ai_redirect_to_cancel");
        }, 1000);
      } else if (optionText === "메인으로 돌아가기") {
        // 감사 인사로 이동
        setTimeout(() => {
          moveToNextStep("ai_goodbye");
        }, 1000);
      }
      return;
    }

    // 골프장 선택 처리
    if (currentStepId === "user_select_golf_course") {
      const userMessage = {
        speaker: "User",
        bubble: "right",
        message: optionText,
      };
      setMessages((prev) => [...prev, userMessage]);

      let detailStepId;

      // 10만원 이하 골프장들 (가격 포함)
      if (optionText.includes("스카이힐CC") && optionText.includes("8만원")) {
        detailStepId = "ai_show_skyhill_under_10_detail";
      } else if (
        optionText.includes("마운틴뷰CC") &&
        optionText.includes("9만원")
      ) {
        detailStepId = "ai_show_mountainview_under_10_detail";
      } else if (
        optionText.includes("리버사이드CC") &&
        optionText.includes("7만원")
      ) {
        detailStepId = "ai_show_riverside_under_10_detail";
      }
      // 10-20만원 골프장들 (가격 포함)
      else if (
        optionText.includes("그린힐CC") &&
        optionText.includes("15만원")
      ) {
        detailStepId = "ai_show_greenhill_10_20_detail";
      } else if (
        optionText.includes("썬밸리CC") &&
        optionText.includes("18만원")
      ) {
        detailStepId = "ai_show_sunvalley_10_20_detail";
      } else if (
        optionText.includes("레이크사이드CC") &&
        optionText.includes("13만원")
      ) {
        detailStepId = "ai_show_lakeside_10_20_detail";
      }
      // 20만원 이상 골프장들 (가격 포함)
      else if (
        optionText.includes("프리미엄CC") &&
        optionText.includes("25만원")
      ) {
        detailStepId = "ai_show_premium_20_detail";
      } else if (
        optionText.includes("골든밸리CC") &&
        optionText.includes("28만원")
      ) {
        detailStepId = "ai_show_goldenvalley_20_detail";
      } else if (
        optionText.includes("엘리트CC") &&
        optionText.includes("22만원")
      ) {
        detailStepId = "ai_show_elite_20_detail";
      }

      if (detailStepId) {
        setTimeout(() => {
          moveToNextStep(detailStepId);
        }, 1000);
      } else {
        // 동적으로 골프장 상세 정보 생성
        const golfCourseInfo = getGolfCourseInfo(optionText);
        if (golfCourseInfo) {
          setTimeout(() => {
            const aiMessage = {
              speaker: "AI",
              bubble: "left",
              component: "card",
              message: golfCourseInfo.message,
              options: ["예약을 도와드릴까요?"],
            };
            addMessage(aiMessage);
            setIsWaitingForResponse(false);
          }, 1000);
        }
      }
      return;
    }

    // 입금 관련 처리
    if (currentStepId === "user_payment_action") {
      const userMessage = {
        speaker: "User",
        bubble: "right",
        message: optionText,
      };
      setMessages((prev) => [...prev, userMessage]);

      if (optionText === "입금하러가기") {
        setTimeout(() => {
          moveToNextStep("ai_payment_guide");
        }, 1000);
      } else if (optionText === "메인으로 돌아가기") {
        handleRestart();
      }
      return;
    }

    if (currentStepId === "user_payment_complete") {
      const userMessage = {
        speaker: "User",
        bubble: "right",
        message: optionText,
      };
      setMessages((prev) => [...prev, userMessage]);

      if (optionText === "입금완료") {
        setTimeout(() => {
          moveToNextStep("ai_payment_confirmed");
        }, 1000);
      } else if (optionText === "메인으로 돌아가기") {
        handleRestart();
      }
      return;
    }

    // 예산 선택에 따른 추천 처리 (어떤 단계에서든 예산 선택 가능)
    if (
      optionText === "10만원 이하" ||
      optionText === "10-20만원" ||
      optionText === "20만원 이상"
    ) {
      const userMessage = {
        speaker: "User",
        bubble: "right",
        message: optionText,
      };
      setMessages((prev) => [...prev, userMessage]);

      let recommendationStepId;
      if (optionText === "10만원 이하") {
        recommendationStepId = "ai_show_recommendations_under_10";
      } else if (optionText === "10-20만원") {
        recommendationStepId = "ai_show_recommendations_10_20";
      } else if (optionText === "20만원 이상") {
        recommendationStepId = "ai_show_recommendations_over_20";
      }

      if (recommendationStepId) {
        setCurrentStepId("user_select_price");
        setTimeout(() => {
          moveToNextStep(recommendationStepId);
        }, 1000);
      }
      return;
    }

    // 일반 응답 처리
    const userMessage = {
      speaker: "User",
      bubble: "right",
      message: optionText,
    };

    setMessages((prev) => [...prev, userMessage]);

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

      if (nextStep.speaker === "AI") {
        setTimeout(() => {
          addMessage(nextStep);
          // AI 메시지가 추가된 후 응답 대기 상태 해제
          setTimeout(() => {
            setIsWaitingForResponse(false);
          }, 100);
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
    setCurrentStepId("intro");

    const introStep = firstScenario.steps.find((step) => step.id === "intro");
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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
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
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5">
          <p className="text-gray-400 text-sm">메시지를 입력해주세요.</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
