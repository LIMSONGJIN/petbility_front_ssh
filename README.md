# Petbility - 반려동물 종합 플랫폼

Petbility는 반려동물을 위한 종합 서비스 플랫폼입니다. 반려동물 관련 서비스 예약, 관리, 커뮤니티 기능을 제공하는 웹 애플리케이션입니다.

## 주요 기능

- 반려동물 서비스 예약 시스템
- 사용자 및 반려동물 프로필 관리
- 실시간 알림 시스템
- 결제 시스템 연동
- 위치 기반 서비스 검색
- 커뮤니티 기능

## 기술 스택

### 프론트엔드

- **프레임워크**: Next.js 15.1.7
- **언어**: TypeScript
- **상태 관리**: Redux Toolkit, Zustand
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**:
  - shadcn/ui
  - Radix UI
  - Framer Motion
- **차트**: Chart.js
- **지도**: Leaflet
- **폼 관리**: React Hook Form
- **API 통신**: Axios, React Query

### 백엔드 연동

- **인증**: Supabase, NextAuth.js
- **데이터베이스**: Prisma ORM
- **결제**: Toss Payments
- **실시간 통신**: Socket.io

### 개발 도구

- **패키지 매니저**: npm
- **타입 체크**: TypeScript
- **코드 품질**: ESLint
- **스타일링**: PostCSS

## 프로젝트 구조

```
src/
├── api/          # API 관련 코드
├── components/   # 재사용 가능한 컴포넌트
├── lib/          # 유틸리티 함수 및 설정
├── services/     # 비즈니스 로직
├── types/        # TypeScript 타입 정의
└── pages/        # 페이지 컴포넌트
```

## 시작하기

1. 저장소 클론

```bash
git clone [repository-url]
```

2. 의존성 설치

```bash
npm install
```

3. 개발 서버 실행

```bash
npm run dev
```

4. 빌드

```bash
npm run build
```

## 환경 변수 설정

프로젝트를 실행하기 위해 다음 환경 변수를 설정해야 합니다:

- `NEXT_PUBLIC_API_URL`: 백엔드 API URL
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anonymous Key
- `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`: Toss Payments Client Key

## 배포

배포는 `./deploy.sh` 스크립트를 통해 자동화되어 있습니다.

## API 연동

백엔드 API와의 연동은 다음과 같은 방법으로 구현되어 있습니다:

1. **API 클라이언트 설정**: `/src/lib/api-client.ts`
2. **API 서비스**: `/src/services/api.ts`
3. **비즈니스 관련 API**: `/src/api/business/`
4. **타입 정의**: `/src/types/api.ts`
5. **인증 처리**: Supabase를 통한 인증 토큰 자동 포함

## 주요 API 엔드포인트

- 사용자 관리: `/users`
- 반려동물 관리: `/pets`
- 예약 관리: `/user/reservations`, `/business/reservations`
- 알림 관리: `/notifications`
- 비즈니스 서비스 관리: `/business/services`
