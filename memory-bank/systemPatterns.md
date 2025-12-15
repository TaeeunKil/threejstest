# 시스템 패턴

## 시스템 아키텍처

- React + Vite 기반 SPA
- Three.js를 React 컴포넌트로 통합
- 컴포넌트 기반 아키텍처

## 주요 기술 결정

- **프레임워크**: React + Vite
- **3D 라이브러리**: Three.js (최신 버전)
- **스타일링**: CSS Modules 또는 Styled Components (추후 결정)
- **상태 관리**: React useState/useRef (필요시 Context API)

## 사용 중인 디자인 패턴

- **컴포넌트 패턴**: React 함수형 컴포넌트
- **커스텀 훅**: Three.js 로직을 커스텀 훅으로 분리
- **관심사 분리**: 3D 렌더링 로직과 UI 로직 분리

## 구성 요소 관계

```
App
├── RobotVisualization (Three.js 씬 관리)
│   ├── RobotArm (6축 로봇 팔 모델)
│   ├── CoordinateSystem (좌표계 표시)
│   └── TCPIndicator (TCP 위치 표시)
└── ControlPanel (UI 컨트롤)
    ├── JointSliders (관절 각도 조절)
    └── StatusDisplay (상태 정보 표시)
```

## 중요한 구현 경로

- Three.js 씬을 React useEffect로 초기화
- useRef를 사용하여 Three.js 객체 참조 관리
- requestAnimationFrame을 통한 렌더링 루프
- 관절 각도 변경 시 Forward Kinematics 계산
