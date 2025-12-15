# 기술 컨텍스트

## 사용 중인 기술

- **React**: 18.x (최신)
- **Vite**: 5.x (빌드 도구)
- **Three.js**: 0.160.x (3D 라이브러리)
- **TypeScript**: 5.3.x (타입 안정성)

## 개발 설정

- **Node.js**: 18.x 이상 권장
- **패키지 매니저**: npm 또는 yarn
- **개발 서버**: Vite dev server (포트 5173)
- **빌드**: Vite build

## 기술적 제약사항

- 웹 브라우저 호환성 고려 (최신 브라우저 대상)
- 성능 최적화 필요 (3D 렌더링, 60fps 목표)
- WebGL 지원 브라우저 필수

## 의존성

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "three": "^0.160.0",
  "vite": "^5.0.8",
  "@vitejs/plugin-react": "^4.2.1",
  "typescript": "^5.3.3",
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17",
  "@types/three": "^0.160.0"
}
```

## 도구 사용 패턴

- **메모리 뱅크**: 프로젝트 컨텍스트 관리
- **Git**: 커밋 단위로 작업 진행
- **Vite HMR**: 빠른 개발 피드백
