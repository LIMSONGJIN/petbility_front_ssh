# petbility_front

반려동물 종합 플랫폼 - 프론트엔드

./deploy.sh

## API 연동 방법

백엔드 API와의 연동은 다음과 같은 방법으로 구현되어 있습니다:

1. **API 클라이언트 설정**: `/src/lib/api-client.ts` 파일에서 API 클라이언트를 설정하며, 요청 시 인증 토큰을 자동으로 포함합니다.

2. **API 서비스**: `/src/services/api.ts` 파일에 각 API 엔드포인트에 대한 함수가 정의되어 있습니다.

3. **비즈니스 관련 API**: `/src/api/business/` 디렉토리에 추가적인 비즈니스 관련 API 함수가 정의되어 있습니다.

4. **타입 정의**: `/src/types/api.ts` 파일에 백엔드와 일치하는 타입 정의가 있습니다.

5. **인증 처리**: Supabase를 통한 인증 토큰이 API 요청에 자동으로 포함되도록 설정되어 있습니다.

## 주요 API 연동 포인트

- 사용자 관리: `/users` 엔드포인트에서 사용자 정보를 관리합니다.
- 반려동물 관리: `/pets` 엔드포인트에서 반려동물 정보를 관리합니다.
- 예약 관리: `/user/reservations` 및 `/business/reservations` 엔드포인트에서 예약을 관리합니다.
- 알림 관리: `/notifications` 엔드포인트에서 알림을 관리합니다.
- 비즈니스 서비스 관리: `/business/services` 엔드포인트에서 서비스를 관리합니다.

## 환경변수

다음과 같은 환경변수를 설정해야 합니다:

- `NEXT_PUBLIC_API_URL`: 백엔드 API URL (기본값: http://localhost:4000)
