# 티샷 AI 챗봇 (Teeshot AI Chatbot)

React WebView 기반 카카오톡 스타일 골프 예약 챗봇 애플리케이션

![Preview](https://img.shields.io/badge/React-18.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC) ![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)

## 프로젝트 개요

- **이름**: 티샷 AI 챗봇
- **목적**: 골프장 예약 관련 고객 서비스를 버튼 기반 대화형 인터페이스로 제공
- **특징**: 자연어 입력 없이 버튼 클릭만으로 대화가 진행되는 티키타카 방식

## 주요 기능

### ✅ 완료된 기능

1. **예약 취소 시나리오** (8단계)
   - 현재 예약 내역 조회
   - 예약 상세 정보 확인
   - 취소 확인 프로세스
   - 취소 수수료 안내
   - 환불 처리 안내

2. **예약 확인 시나리오** (9단계)
   - 전체/이번 달/다음 달 예약 조회
   - 예약 상세 정보 확인
   - 날짜, 시간, 요금 정보 표시
   - 추가 작업 선택 가능

3. **골프장 추천 시나리오** (13단계)
   - 날짜 선택 (이번 주말/다음 주말/다다음 주말)
   - 지역 선택 (경기도/강원도/충청도)
   - 예산 범위 선택
   - AI 기반 골프장 추천
   - 골프장 상세 정보 제공
   - 직접 예약 연동

### 🎨 UI/UX 특징

- **카카오톡 스타일**: 친숙한 말풍선 채팅 인터페이스
- **Tailwind CSS**: 현대적이고 깔끔한 디자인
- **틸(Teal) 그라데이션**: 헤더 배경색
- **AI 아바타**: 🤖 이모지 아바타
- **노란색 말풍선**: 사용자 메시지 (#FFE812)
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **부드러운 애니메이션**: 메시지 슬라이드 인 효과
- **자동 스크롤**: 새 메시지 자동 스크롤

## 기술 스택

- **프레임워크**: React 18
- **빌드 도구**: Vite 5
- **스타일링**: Tailwind CSS v3
- **상태 관리**: React Hooks (useState, useEffect, useRef)
- **프로세스 관리**: PM2

## 프로젝트 구조

```
webapp/
├── src/
│   ├── components/
│   │   ├── ChatBubble.jsx      # Tailwind 기반 말풍선 컴포넌트
│   │   └── ChatContainer.jsx   # 카카오톡 스타일 컨테이너
│   ├── data/
│   │   └── scenarios.json      # 3가지 대화 시나리오 정의
│   ├── App.jsx                 # 메인 앱 컴포넌트
│   ├── App.css                 # 커스텀 애니메이션
│   ├── index.css               # Tailwind directives
│   └── main.jsx                # 엔트리 포인트
├── public/                     # 정적 파일
├── tailwind.config.js          # Tailwind 설정
├── postcss.config.js           # PostCSS 설정
├── ecosystem.config.cjs        # PM2 설정
├── vite.config.js              # Vite 설정
└── package.json
```

## 시나리오 구조

각 시나리오는 다음과 같은 JSON 구조로 정의됩니다:

```json
{
  "scenario_id": "AIJOIN00X",
  "title": "시나리오 제목",
  "description": "시나리오 설명",
  "steps": [
    {
      "id": "step_id",
      "speaker": "AI" | "User",
      "bubble": "left" | "right",
      "message": "메시지 내용",
      "component": "quick_reply" | "card",
      "options": ["선택지1", "선택지2"],
      "delay": 1500,
      "next": "다음_step_id"
    }
  ]
}
```

## 개발 서버 실행

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (브라우저 자동 열림)
npm start
# 또는
npm run dev

# PM2로 실행 (프로덕션 모드)
pm2 start ecosystem.config.cjs

# PM2 상태 확인
pm2 list

# 로그 확인
pm2 logs teeshot-chatbot --nostream
```

### 문제 해결

Tailwind CSS가 로드되지 않는 경우:

```bash
# 클린 설치
rm -rf node_modules
npm install

# 캐시 삭제
rm -rf node_modules/.vite

# 재시작
npm start
```

## 사용 방법

1. 챗봇 화면이 로드되면 "티샷 AI"가 인사 메시지를 표시합니다
2. 3가지 옵션 중 하나를 선택합니다:
   - 예약취소
   - 예약확인
   - 추천 받는 라운딩
3. AI가 제시하는 버튼을 클릭하여 대화를 진행합니다
4. 모든 대화는 버튼 클릭으로만 진행되며, 직접 입력은 불가합니다
5. "처음으로" 버튼을 클릭하면 대화를 재시작할 수 있습니다

## 대화 플로우 특징

- **최소 5턴 이상**: 각 시나리오는 5번 이상의 상호작용으로 구성
- **자연스러운 대화**: 50대 이상 사용자를 위한 친근하고 공손한 말투
- **짧은 문장**: 1초 내로 읽을 수 있는 간결한 문장
- **명확한 선택지**: 2~3개의 명확한 선택 옵션 제공
- **자동 진행**: AI 메시지는 1.5초 딜레이 후 자동 표시

## 디자인 가이드

### 색상 팔레트

```css
--kakao-bg: #F7F8FA      /* 배경색 */
--kakao-yellow: #FFE812  /* 사용자 말풍선 */
--kakao-gray: #E5E5EA    /* 버튼 배경 */
--bot-bubble: #FFFFFF    /* AI 말풍선 */
--btn-gray: #F2F3F5      /* Quick Reply 버튼 */
```

### 컴포넌트

- **헤더**: 틸(Teal) 그라데이션 (`from-teal-500 to-teal-600`)
- **AI 말풍선**: 흰색 배경 + 왼쪽 정렬 + 🤖 아바타
- **사용자 말풍선**: 노란색 배경 + 오른쪽 정렬
- **Quick Reply**: 회색 배경의 둥근 버튼
- **Card Options**: 흰색 배경 + 테두리 버튼

## 향후 개발 계획

### 미구현 기능

- [ ] 실제 골프장 DB 연동
- [ ] 사용자 인증 시스템
- [ ] 실시간 예약 가능 여부 확인
- [ ] 결제 시스템 통합
- [ ] 예약 알림 기능
- [ ] 마이페이지
- [ ] 예약 히스토리
- [ ] 리뷰 시스템

### 추천 개선 사항

1. **백엔드 API 개발**
   - 실제 골프장 데이터베이스 구축
   - 예약 시스템 API 연동
   - 사용자 관리 시스템

2. **추가 시나리오**
   - 날씨 정보 제공
   - 골프장 리뷰 확인
   - 동반자 초대 기능
   - 카카오톡/문자 알림

3. **UI/UX 개선**
   - 로딩 애니메이션 추가
   - 타이핑 효과 구현
   - 이미지 카드 지원
   - 다크/라이트 모드 토글

4. **성능 최적화**
   - 메시지 가상화 (긴 대화 시)
   - 이미지 레이지 로딩
   - PWA 지원

## 라이선스

MIT

## 개발자

티샷 AI 개발팀

---

**최종 업데이트**: 2025-10-22  
**프로젝트 상태**: ✅ 개발 완료 (프로토타입)  
**배포 상태**: ✅ 활성화  
**스타일**: Tailwind CSS v3
