# 시스템 패턴

## 시스템 아키텍처

- React + Vite + TypeScript 기반 SPA
- Three.js를 React 컴포넌트로 통합
- 컴포넌트 기반 아키텍처
- 프로그래밍 방식으로 3D 모델 생성

## 주요 기술 결정

- **프레임워크**: React + Vite + TypeScript
- **3D 라이브러리**: Three.js (최신 버전)
- **3D 모델**: 프로그래밍 방식으로 생성 (외부 파일 없음)
- **스타일링**: 순수 CSS (파일별 분리)
- **상태 관리**: React useState/useRef
- **카메라 컨트롤**: OrbitControls (마우스 + 터치)

## 사용 중인 디자인 패턴

- **컴포넌트 패턴**: React 함수형 컴포넌트
- **useEffect 패턴**: Three.js 씬 초기화 및 정리
- **useRef 패턴**: Three.js 객체 참조 관리
- **관심사 분리**: 
  - `robotArm.ts`: 로봇 팔 생성 로직
  - `RobotVisualization`: Three.js 씬 관리
  - `JointSliders`: UI 컨트롤
- **계층 구조 패턴**: Three.js Group으로 부모-자식 관계 구현

## 구성 요소 관계

```
App (상태 관리)
├── RobotVisualization (Three.js 씬 관리)
│   ├── Scene, Camera, Renderer
│   ├── Lights (Ambient + Directional)
│   ├── GridHelper
│   ├── OrbitControls
│   └── RobotArm (createRobotArm으로 생성)
│       ├── Base (J0) - Y축 회전
│       ├── Shoulder (J1) - X축 회전
│       ├── Elbow (J2) - X축 회전
│       ├── Wrist1 (J3) - Y축 회전
│       ├── Wrist2 (J4) - X축 회전
│       └── Wrist3 (J5) + Gripper - Y축 회전
└── JointSliders (UI 컨트롤)
    ├── 6개 슬라이더 (각 관절용)
    ├── 직접 입력 필드
    └── 리셋 버튼
```

## 중요한 구현 경로

### Three.js 씬 초기화
```typescript
useEffect(() => {
  // Scene, Camera, Renderer 생성
  // Lights 추가
  // OrbitControls 설정
  // 로봇 팔 생성 및 관절 찾기
  // 애니메이션 루프 시작
  // Cleanup 함수로 리소스 정리
}, [])
```

### 로봇 팔 생성 (robotArm.ts)
- `createRobotArm()`: 전체 로봇 팔 생성
- `createJointMesh()`: 관절 원통 생성 (회전축에 따라 방향 조정)
- `createLinkMesh()`: 링크 원통 생성
- `createJointCapMesh()`: 관절 캡 생성
- `createGripper()`: 집게 생성
- `createCoordinateSystem()`: 좌표계 생성

### 관절 회전 업데이트
```typescript
useEffect(() => {
  updateJointAngles(joints, jointAngles)
}, [jointAngles])
```

### 계층 구조 활용
- Group의 position이 회전 중심
- 부모 회전 시 모든 자식도 함께 회전
- `updateMatrixWorld(true)`로 변환 강제 업데이트

## 반응형 레이아웃

### 데스크톱
```
+------------------+----------+
|                  |          |
|   3D View        | Sliders  |
|   (flex: 1)      | (300px)  |
|                  |          |
+------------------+----------+
```

### 모바일 (768px 이하)
```
+------------------+
|                  |
|   3D View        |
|   (60%)          |
|                  |
+------------------+
|   Sliders        |
|   (40%)          |
+------------------+
```
