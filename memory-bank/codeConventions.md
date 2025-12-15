# 코드 컨벤션

## 파일 명명 규칙

- **컴포넌트**: PascalCase (예: `RobotVisualization.jsx`)
- **유틸리티/훅**: camelCase (예: `useThreeScene.js`)
- **상수**: UPPER_SNAKE_CASE (예: `ROBOT_CONFIG.js`)
- **파일 확장자**: `.jsx` (React 컴포넌트), `.js` (일반 JavaScript)

## 컴포넌트 구조

```jsx
// 1. Import 문
import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

// 2. 컴포넌트 정의
const ComponentName = ({ prop1, prop2 }) => {
  // 3. Hooks
  const [state, setState] = useState(initialValue);
  const ref = useRef(null);

  // 4. Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);

  // 5. Helper 함수
  const handleSomething = () => {
    // logic
  };

  // 6. Render
  return <div>{/* JSX */}</div>;
};

export default ComponentName;
```

## 변수 및 함수 명명

- **변수**: camelCase (예: `robotArm`, `jointAngles`)
- **함수**: camelCase, 동사로 시작 (예: `calculateForwardKinematics`, `updateRobotPose`)
- **컴포넌트**: PascalCase (예: `RobotArm`, `ControlPanel`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_JOINT_ANGLE`, `DEFAULT_CONFIG`)

## 주석 규칙

```javascript
// 한 줄 주석: 간단한 설명
const angle = 45; // 관절 각도

/**
 * 여러 줄 주석: 복잡한 로직 설명
 * @param {number} jointAngle - 관절 각도 (도 단위)
 * @returns {THREE.Matrix4} 변환 행렬
 */
const calculateTransform = (jointAngle) => {
  // 구현
};
```

## Three.js 관련 컨벤션

- Three.js 객체는 `THREE.` 네임스페이스 사용
- 씬, 카메라, 렌더러는 `useRef`로 관리
- `useEffect` 내에서 Three.js 초기화 및 cleanup
- `requestAnimationFrame`을 사용한 렌더링 루프

## 스타일링

- CSS Modules 또는 인라인 스타일 사용
- 다크 테마 색상 팔레트:
  - 배경: `#1a1a1a` ~ `#2d2d2d`
  - 텍스트: `#ffffff` ~ `#e0e0e0`
  - 강조: `#4a9eff` (파란색)
  - 경고: `#ff4444` (빨간색)

## 코드 포맷팅

- 들여쓰기: 2 spaces
- 세미콜론: 사용
- 따옴표: 작은따옴표 (`'`) 사용
- 최대 줄 길이: 100자 (가능한 한)

## 에러 처리

- try-catch 블록으로 에러 처리
- 콘솔 에러 로깅 (개발 환경)
- 사용자 친화적인 에러 메시지 표시
