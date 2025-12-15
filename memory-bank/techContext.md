# 기술 컨텍스트

## 사용 중인 기술

- **React**: 18.3.1 (함수형 컴포넌트)
- **Vite**: 6.0.3 (빌드 도구)
- **Three.js**: 0.171.0 (3D 라이브러리)
- **TypeScript**: 5.6.2 (타입 안정성)

## 개발 설정

- **Node.js**: 18.x 이상 권장
- **패키지 매니저**: npm
- **개발 서버**: `npm run dev` (포트 5173)
- **빌드**: `npm run build`

## 기술적 제약사항

- 웹 브라우저 WebGL 지원 필수
- 최신 브라우저 대상 (Chrome, Firefox, Safari, Edge)
- 모바일 브라우저 지원 (터치 제스처)
- 성능 최적화 고려 (3D 렌더링, 60fps 목표)

## 의존성

### 프로덕션
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "three": "^0.171.0"
}
```

### 개발
```json
{
  "@vitejs/plugin-react": "^4.3.4",
  "typescript": "~5.6.2",
  "@types/react": "^18.3.12",
  "@types/react-dom": "^18.3.1",
  "@types/three": "^0.171.0",
  "vite": "^6.0.3"
}
```

## 도구 사용 패턴

### Vite
- 빠른 HMR(Hot Module Replacement) 활용
- TypeScript 기본 지원
- 프로덕션 빌드 최적화

### Three.js
- React useEffect로 씬 초기화
- useRef로 Three.js 객체 참조 관리
- OrbitControls로 카메라 조작
- requestAnimationFrame으로 렌더링 루프

### TypeScript
- 엄격한 타입 체크 활성화
- Three.js 타입 정의 활용
- React Props 인터페이스 정의

### CSS
- 파일별 CSS 분리
- Flexbox 레이아웃
- 미디어 쿼리로 반응형 구현

### Git
- 커밋 단위로 작업 진행
- 의미 있는 커밋 메시지
