# 커밋 컨벤션

## 커밋 메시지 형식

```
<type>: <subject>

<body>

<footer>
```

## Type 종류

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
- **refactor**: 코드 리팩토링
- **test**: 테스트 코드 추가/수정
- **chore**: 빌드 업무 수정, 패키지 매니저 설정 등

## Subject 규칙

- 50자 이내로 작성
- 첫 글자는 대문자
- 마침표(.) 사용하지 않음
- 명령형으로 작성 (예: "Add", "Fix", "Update", "Remove")
- 영어로 작성

## Body 규칙 (선택사항)

- 72자마다 줄바꿈
- 무엇을, 왜 변경했는지 설명
- 어떻게 변경했는지는 코드로 확인 가능하므로 생략 가능
- 영어로 작성

## Footer 규칙 (선택사항)

- 이슈 번호 참조: `Closes #123`
- Breaking changes: `BREAKING CHANGE: 설명`

## 커밋 예시

### 초기 설정

```
feat: Initialize React + Vite project

- Create React project with Vite
- Add Three.js dependency
- Set up basic project structure
```

### 기능 추가

```
feat: Implement 6-axis robot arm 3D model

- Create robot arm mesh using Three.js
- Apply transform for each joint
- Render default pose
```

### UI 추가

```
feat: Add joint angle control sliders

- Implement 6 joint angle slider components
- Connect real-time robot arm pose updates
```

### 버그 수정

```
fix: Fix joint angle range limit error

- Add validation for min/max angle range of each joint
- Display warning message when range exceeded
```

### 리팩토링

```
refactor: Extract Three.js logic into custom hook

- Create useThreeScene hook
- Separate scene initialization logic
- Simplify component code
```

## 커밋 규칙

1. **작은 단위로 커밋**: 하나의 커밋은 하나의 작업만
2. **의미 있는 커밋**: "작업 중" 같은 메시지 지양
3. **커밋 전 테스트**: 최소한 빌드 오류는 없어야 함
4. **자주 커밋**: 작업 단위마다 커밋

## 브랜치 전략

- `main`: 안정적인 버전
- `develop`: 개발 중인 버전 (필요시)
- 기능 브랜치: `feature/기능명` (필요시)
