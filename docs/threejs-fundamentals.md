# Three.js 기본 개념

이 문서는 Three.js의 핵심 개념을 정리한 학습 자료입니다.  
공식 문서: https://threejs.org/docs/

## 목차

1. [Three.js란?](#threejs란)
2. [핵심 구성 요소](#핵심-구성-요소)
3. [기본 씬 생성](#기본-씬-생성)
4. [Geometry (지오메트리)](#geometry-지오메트리)
5. [Material (머티리얼)](#material-머티리얼)
6. [Mesh (메시)](#mesh-메시)
7. [Light (조명)](#light-조명)
8. [Camera (카메라)](#camera-카메라)
9. [Renderer (렌더러)](#renderer-렌더러)
10. [애니메이션 루프](#애니메이션-루프)
11. [좌표계](#좌표계)
12. [Transform (변환)](#transform-변환)

---

## Three.js란?

Three.js는 웹 브라우저에서 3D 그래픽을 구현할 수 있게 해주는 JavaScript 라이브러리입니다. WebGL을 추상화하여 더 쉽게 3D 장면을 만들 수 있게 해줍니다.

### 주요 특징

- **WebGL 기반**: 브라우저의 WebGL API를 활용
- **크로스 플랫폼**: 모든 최신 브라우저에서 동작
- **강력한 기능**: 조명, 그림자, 텍스처, 애니메이션 등 다양한 기능 제공
- **활발한 커뮤니티**: 많은 예제와 자료 제공

---

## 핵심 구성 요소

Three.js의 기본 구조는 다음 3가지로 구성됩니다:

```
Scene (씬)
  └── Camera (카메라) - 장면을 보는 시점
  └── Renderer (렌더러) - 화면에 그리는 도구
  └── Objects (객체들) - Mesh, Light 등
```

### 1. Scene (씬)

씬은 모든 3D 객체, 조명, 카메라를 담는 컨테이너입니다.

```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // 검은색 배경
```

**주요 메서드:**

- `scene.add(object)` - 객체 추가
- `scene.remove(object)` - 객체 제거
- `scene.children` - 자식 객체 배열

### 2. Camera (카메라)

카메라는 장면을 어떤 시점에서 볼지를 결정합니다.

#### PerspectiveCamera (원근 카메라)

가장 많이 사용되는 카메라입니다. 원근감이 있어 멀리 있는 물체가 작게 보입니다.

```javascript
// 공식 문서 권장 파라미터
const fov = 45; // Field of View (시야각) - 일반적으로 45-75도
const aspect = 2; // 종횡비 (canvas 기본값 또는 window.innerWidth / window.innerHeight)
const near = 0.1; // 근접 클리핑 평면
const far = 5; // 원거리 클리핑 평면 (필요에 따라 100, 1000 등으로 설정)

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// 카메라 위치 설정
camera.position.set(0, 1, 2); // x, y, z 좌표
camera.lookAt(0, 0, 0); // 특정 점을 바라봄
```

**파라미터 설명:**

- **FOV (Field of View)**: 시야각이 클수록 넓게 보임
  - 일반적으로 45-75도 사용
  - 75도: 넓은 시야각 (게임 등)
  - 45도: 자연스러운 시야각 (일반적인 용도)
- **Aspect**: 화면의 가로/세로 비율
  - `window.innerWidth / window.innerHeight` 또는 canvas의 종횡비
- **Near/Far**: 이 범위 밖의 객체는 렌더링되지 않음
  - 너무 큰 far 값은 성능에 영향을 줄 수 있음
  - 필요한 만큼만 설정하는 것이 좋음

**중요**: 화면 크기가 변경되면 카메라의 aspect를 업데이트하고 `updateProjectionMatrix()`를 호출해야 합니다.

#### OrthographicCamera (직교 카메라)

원근감이 없는 카메라입니다. 모든 거리에서 같은 크기로 보입니다.

```javascript
const camera = new THREE.OrthographicCamera(
  -5,
  5, // left, right
  -5,
  5, // top, bottom
  0.1, // near
  1000 // far
);
```

### 3. Renderer (렌더러)

렌더러는 Scene과 Camera를 기반으로 최종 이미지를 생성하여 웹 페이지에 표시합니다.  
**공식 문서**: Renderer는 Scene과 Camera를 받아서 카메라의 frustum 내부에 있는 3D 장면의 일부를 2D 이미지로 렌더링합니다.

```javascript
// Canvas 요소 선택 (선택사항)
const canvas = document.querySelector("#c");

// WebGL Renderer 생성
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 안티앨리어싱 (선을 부드럽게)
  canvas: canvas, // 특정 canvas 사용 (없으면 자동 생성)
});

renderer.setSize(window.innerWidth, window.innerHeight); // 크기 설정
renderer.setPixelRatio(window.devicePixelRatio); // 고해상도 디스플레이 대응

// DOM에 추가 (canvas를 지정하지 않은 경우)
if (!canvas) {
  document.body.appendChild(renderer.domElement);
}
```

**주요 메서드:**

- `renderer.render(scene, camera)` - 장면 렌더링
- `renderer.setSize(width, height)` - 크기 설정
- `renderer.setClearColor(color)` - 배경색 설정
- `renderer.setAnimationLoop(callback)` - 애니메이션 루프 설정 (공식 권장)

---

## Geometry (지오메트리)

지오메트리는 3D 객체의 **형상(shape)**을 정의합니다. 정점(vertices)들의 집합입니다.

### 기본 지오메트리

```javascript
// 박스
const boxGeometry = new THREE.BoxGeometry(1, 1, 1); // width, height, depth

// 구
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32); // radius, widthSegments, heightSegments

// 원기둥
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32); // radiusTop, radiusBottom, height, radialSegments

// 평면
const planeGeometry = new THREE.PlaneGeometry(5, 5); // width, height

// 원뿔
const coneGeometry = new THREE.ConeGeometry(1, 2, 32); // radius, height, radialSegments
```

### 커스텀 지오메트리

직접 정점을 정의하여 만들 수 있습니다.

```javascript
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  -1.0,
  -1.0,
  1.0, // 정점 1
  1.0,
  -1.0,
  1.0, // 정점 2
  1.0,
  1.0,
  1.0, // 정점 3
  -1.0,
  1.0,
  1.0, // 정점 4
]);

geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
```

---

## Material (머티리얼)

머티리얼은 3D 객체의 **외관(appearance)**을 정의합니다. 색상, 반사, 투명도 등을 설정합니다.

### 주요 머티리얼 타입

#### MeshBasicMaterial

**공식 문서**: 단순한 음영(flat 또는 wireframe) 방식으로 지오메트리를 그리는 머티리얼입니다.  
**조명의 영향을 받지 않습니다.**

```javascript
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00, // 색상 (16진수 또는 문자열 'green')
  wireframe: false, // 와이어프레임 모드
  transparent: true, // 투명도 사용
  opacity: 0.5, // 투명도 값 (0-1)
});
```

**색상 지정 방법:**

```javascript
// 16진수
color: 0x00ff00;

// 문자열 (CSS 색상)
color: "green";
color: "#00ff00";
color: "rgb(0, 255, 0)";

// THREE.Color 객체
color: new THREE.Color(0x00ff00);
```

#### MeshStandardMaterial

물리 기반 렌더링(PBR) 머티리얼입니다. 조명의 영향을 받고 현실적인 외관을 제공합니다.

```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0.5, // 금속성 (0-1)
  roughness: 0.5, // 거칠기 (0-1)
  envMap: envMap, // 환경 맵 (반사)
});
```

#### MeshPhongMaterial

Phong 조명 모델을 사용합니다. 반사 하이라이트가 있습니다.

```javascript
const material = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  shininess: 100, // 광택
  specular: 0x111111, // 반사 색상
});
```

#### MeshLambertMaterial

Lambert 조명 모델을 사용합니다. 부드러운 음영을 제공합니다.

```javascript
const material = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
});
```

---

## Mesh (메시)

**공식 문서**: Mesh는 특정 Geometry를 특정 Material로 그리는 것을 나타냅니다.  
Mesh는 세 가지 필수 구성 요소의 조합입니다:

1. **Geometry** (지오메트리) - 객체의 형상
2. **Material** (머티리얼) - 객체를 그리는 방법 (색상, 광택 등)
3. **Position, Orientation, Scale** - 부모에 대한 위치, 방향, 크기

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
```

### Geometry와 Material 공유

**중요**: Geometry와 Material은 여러 Mesh 객체에서 **공유**할 수 있습니다.  
예를 들어, 두 개의 파란색 큐브를 다른 위치에 그리려면:

- Geometry 1개 (큐브 형상 데이터)
- Material 1개 (파란색)
- Mesh 2개 (각각 다른 위치와 방향)

```javascript
// Geometry와 Material은 공유
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });

// Mesh는 각각 독립적으로 생성
const cube1 = new THREE.Mesh(geometry, material);
cube1.position.x = -2;
scene.add(cube1);

const cube2 = new THREE.Mesh(geometry, material);
cube2.position.x = 2;
scene.add(cube2);
```

**메모리 관리**: Mesh를 Scene에서 제거해도 Geometry와 Material은 자동으로 dispose되지 않습니다.  
명시적으로 `dispose()`를 호출해야 합니다.

### Transform (변환)

메시의 위치, 회전, 크기를 변경할 수 있습니다.

```javascript
// 위치 (Position)
mesh.position.set(2, 0, 0); // x, y, z
mesh.position.x = 2;
mesh.position.y = 0;
mesh.position.z = 0;

// 회전 (Rotation) - 라디안 단위
mesh.rotation.x = Math.PI / 4; // 45도
mesh.rotation.y = Math.PI / 2; // 90도
mesh.rotation.z = 0;

// 크기 (Scale)
mesh.scale.set(2, 2, 2); // 2배 확대
mesh.scale.x = 2;
```

**각도 변환:**

```javascript
// 도(degree)를 라디안(radian)으로 변환
const radians = THREE.MathUtils.degToRad(45);
const degrees = THREE.MathUtils.radToDeg(Math.PI / 4);
```

---

## Light (조명)

조명은 장면에 빛을 추가하여 객체의 색상과 그림자를 조절합니다.

### AmbientLight (환경광)

모든 방향에서 균일하게 비추는 조명입니다. 그림자를 만들지 않습니다.

```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // color, intensity
scene.add(ambientLight);
```

### DirectionalLight (방향광)

태양광처럼 특정 방향에서 비추는 조명입니다. 그림자를 만들 수 있습니다.

```javascript
// 공식 문서 예제
const color = 0xffffff;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

// 그림자 활성화
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 50;
```

**DirectionalLight의 target**: 방향광은 target 속성을 가지며, target의 위치를 설정하여 빛의 방향을 제어할 수 있습니다.

```javascript
light.target.position.set(-5, 0, 0);
scene.add(light.target); // target도 scene에 추가해야 함
```

### PointLight (점광)

한 점에서 모든 방향으로 빛을 발산합니다.

```javascript
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);
```

### SpotLight (스포트라이트)

손전등처럼 원뿔 모양의 빛을 발산합니다.

```javascript
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 10, 0);
spotLight.angle = Math.PI / 4; // 빛의 각도
scene.add(spotLight);
```

### HemisphereLight (반구광)

하늘과 땅에서 오는 빛을 시뮬레이션합니다.

```javascript
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
// skyColor, groundColor, intensity
scene.add(hemisphereLight);
```

---

## 애니메이션 루프

Three.js에서 애니메이션은 두 가지 방법으로 구현할 수 있습니다:

### 방법 1: setAnimationLoop (공식 권장)

```javascript
function animate() {
  // 애니메이션 로직
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  // 렌더링
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate); // 시작
```

### 방법 2: requestAnimationFrame (전통적인 방법)

```javascript
function animate() {
  requestAnimationFrame(animate); // 다음 프레임 요청

  // 애니메이션 로직
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  // 렌더링
  renderer.render(scene, camera);
}

animate(); // 시작
```

**차이점**: `setAnimationLoop`는 VR/AR 애플리케이션에서도 올바르게 동작하며, 공식 문서에서 권장하는 방법입니다.

### Clock 사용

시간 기반 애니메이션을 위해 Clock을 사용할 수 있습니다.

```javascript
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime(); // 경과 시간 (초)

  mesh.rotation.y = elapsedTime; // 시간에 따라 회전

  renderer.render(scene, camera);
}
```

---

## 좌표계

Three.js는 **오른손 좌표계**를 사용합니다.

```
    Y (위)
    |
    |
    |____ X (오른쪽)
   /
  /
 Z (앞)
```

- **X축**: 오른쪽이 양수
- **Y축**: 위쪽이 양수
- **Z축**: 앞쪽이 양수 (카메라 기준)

### 좌표 변환

```javascript
// 월드 좌표를 로컬 좌표로 변환
const localPosition = new THREE.Vector3();
mesh.worldToLocal(localPosition);

// 로컬 좌표를 월드 좌표로 변환
const worldPosition = new THREE.Vector3();
mesh.localToWorld(worldPosition);
```

---

## Transform (변환)

### 위치 (Position)

```javascript
mesh.position.set(x, y, z);
mesh.position.x = 5;
mesh.position.y = 0;
mesh.position.z = -5;
```

### 회전 (Rotation)

회전은 **라디안(radian)** 단위를 사용합니다.

```javascript
// 라디안으로 직접 설정
mesh.rotation.x = Math.PI / 4; // 45도

// 도(degree)를 라디안으로 변환
mesh.rotation.y = THREE.MathUtils.degToRad(90);

// 오일러 각도 (Euler angles)
mesh.rotation.set(0, Math.PI / 2, 0); // x, y, z
```

### 크기 (Scale)

```javascript
mesh.scale.set(2, 2, 2); // 모든 축 2배
mesh.scale.x = 1.5; // X축만 1.5배
```

### LookAt

특정 점을 바라보도록 설정합니다.

```javascript
mesh.lookAt(0, 0, 0); // 원점을 바라봄
mesh.lookAt(camera.position); // 카메라를 바라봄
```

---

## 기본 씬 생성

완전한 예제 (공식 문서 기준):

```javascript
import * as THREE from "three";

function main() {
  // 1. Canvas 요소 선택 및 Renderer 생성
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  // 2. Camera 생성 (공식 문서 권장 파라미터)
  const fov = 75; // Field of View (시야각)
  const aspect = 2; // 종횡비 (canvas 기본값)
  const near = 0.1; // 근접 클리핑 평면
  const far = 5; // 원거리 클리핑 평면
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  // 3. Scene 생성
  const scene = new THREE.Scene();

  // 4. Geometry와 Material 생성
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 }); // greenish blue

  // 5. Mesh 생성 및 Scene에 추가
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // 6. 렌더링
  renderer.render(scene, camera);
}

main();
```

### 애니메이션이 있는 완전한 예제:

```javascript
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate); // 공식 문서 권장 방법
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
```

### 리사이즈 처리 포함 예제:

```javascript
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 중요: 카메라 업데이트 필요
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

---

## 참고 자료

- **공식 문서**: https://threejs.org/docs/
- **예제**: https://threejs.org/examples/
- **GitHub**: https://github.com/mrdoob/three.js
- **한국어 가이드**: https://threejs.org/docs/index.html#manual/ko/introduction/Creating-a-scene

---

## 다음 단계

이제 기본 개념을 이해했으니, 다음을 학습해보세요:

1. **텍스처(Texture)**: 이미지를 객체에 적용
2. **로더(Loader)**: 3D 모델 파일 불러오기
3. **그림자(Shadow)**: 현실적인 그림자 구현
4. **후처리(Post-processing)**: 효과 추가
5. **물리 엔진**: Cannon.js, Rapier 등과 통합
