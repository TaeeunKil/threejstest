import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createRobotArm } from "../utils/robotArm";
import "./RobotVisualization.css";

interface RobotVisualizationProps {
  jointAngles?: number[];
}

export default function RobotVisualization({
  jointAngles = [0, 0, 0, 0, 0, 0],
}: RobotVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const jointsRef = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // 초기 크기 확인
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Scene 생성
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera 생성
    const fov = 50;
    const aspect = width / height;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(3, 2.5, 6);
    camera.lookAt(0, 1.5, 0);
    cameraRef.current = camera;

    // Renderer 생성
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // 그리드 헬퍼 추가
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);

    // OrbitControls 추가
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0); // 로봇 팔 중앙 높이
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 15;

    // 마우스 버튼 설정
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE, // 왼쪽 버튼: 회전
      MIDDLE: THREE.MOUSE.DOLLY, // 휠: 줌
      RIGHT: THREE.MOUSE.PAN, // 오른쪽 버튼: 이동
    };

    // 터치 제스처 설정 (모바일)
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE, // 한 손가락: 회전
      TWO: THREE.TOUCH.DOLLY_PAN, // 두 손가락: 줌 + 이동
    };

    controls.update();
    controlsRef.current = controls;

    // 프로그래밍 방식으로 로봇 팔 생성 (관절 구조 명확)
    const robotArm = createRobotArm();

    // 관절 찾기 (계층 구조 기반)
    const joints = findJoints(robotArm);
    jointsRef.current = joints;
    console.log(
      `Found ${joints.length} joints:`,
      joints.map((j, i) => `J${i}: ${j.name || "unnamed"}`)
    );

    scene.add(robotArm);

    // 카메라 위치 조정
    const box = new THREE.Box3().setFromObject(robotArm);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);

    camera.position.set(
      center.x,
      center.y + maxSize * 0.8,
      center.z + maxSize * 2
    );
    controls.target.set(center.x, center.y + maxSize * 0.2, center.z);
    controls.update();

    // 애니메이션 루프
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // 리사이즈 핸들러
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;

      const newWidth = containerRef.current.clientWidth || 800;
      const newHeight = containerRef.current.clientHeight || 600;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 관절 각도 업데이트
  useEffect(() => {
    if (jointsRef.current.length === 0) return;

    updateJointAngles(jointsRef.current, jointAngles);
  }, [jointAngles]);

  return <div ref={containerRef} className="robot-visualization" />;
}

/**
 * 프로그래밍 방식으로 생성된 로봇 팔에서 관절 찾기
 * 계층 구조를 따라 각 관절 Group을 찾습니다.
 */
function findJoints(robotArm: THREE.Group): THREE.Object3D[] {
  const joints: THREE.Object3D[] = [];

  // 프로그래밍 방식 모델의 계층 구조:
  // robotArm (Group)
  //   └─ baseJoint (Group) - J0
  //       └─ shoulderJoint (Group) - J1
  //           └─ elbowJoint (Group) - J2
  //               └─ wrist1Joint (Group) - J3
  //                   └─ wrist2Joint (Group) - J4
  //                       └─ wrist3Joint (Group) - J5

  if (robotArm.children.length === 0) return joints;

  // Base (J0)
  const baseJoint = robotArm.children[0] as THREE.Group;
  if (baseJoint) {
    joints.push(baseJoint);

    // Shoulder (J1)
    if (baseJoint.children.length > 1) {
      // children[0]은 basePlate, baseMesh 등이므로 children[1]부터 확인
      // 실제로는 shoulderJoint가 baseJoint의 자식 중 하나
      const shoulderJoint = baseJoint.children.find(
        (child) =>
          child instanceof THREE.Group &&
          child.children.some((c) => c instanceof THREE.Mesh)
      ) as THREE.Group;

      if (shoulderJoint) {
        joints.push(shoulderJoint);

        // Elbow (J2) - shoulderJoint의 자식 중 Group 찾기
        const elbowJoint = shoulderJoint.children.find(
          (child) =>
            child instanceof THREE.Group && child !== shoulderJoint.children[0] // 첫 번째는 shoulderMesh
        ) as THREE.Group;

        if (elbowJoint) {
          joints.push(elbowJoint);

          // Wrist1 (J3)
          const wrist1Joint = elbowJoint.children.find(
            (child) =>
              child instanceof THREE.Group && child !== elbowJoint.children[0]
          ) as THREE.Group;

          if (wrist1Joint) {
            joints.push(wrist1Joint);

            // Wrist2 (J4)
            const wrist2Joint = wrist1Joint.children.find(
              (child) =>
                child instanceof THREE.Group &&
                child !== wrist1Joint.children[0]
            ) as THREE.Group;

            if (wrist2Joint) {
              joints.push(wrist2Joint);

              // Wrist3 (J5)
              const wrist3Joint = wrist2Joint.children.find(
                (child) =>
                  child instanceof THREE.Group &&
                  child !== wrist2Joint.children[0]
              ) as THREE.Group;

              if (wrist3Joint) {
                joints.push(wrist3Joint);
              }
            }
          }
        }
      }
    }
  }

  // 더 간단한 방법: 계층 구조를 순회하며 Group만 찾기
  if (joints.length < 6) {
    const foundJoints: THREE.Object3D[] = [];

    function traverseForGroups(obj: THREE.Object3D, depth: number) {
      if (depth > 6) return;

      obj.children.forEach((child) => {
        if (child instanceof THREE.Group && foundJoints.length < 6) {
          // 좌표계가 아닌 실제 관절만 찾기 (좌표계는 createCoordinateSystem으로 생성됨)
          const hasNonAxesChildren = child.children.some(
            (c) => !(c instanceof THREE.ArrowHelper)
          );

          if (hasNonAxesChildren) {
            foundJoints.push(child);
            traverseForGroups(child, depth + 1);
          }
        }
      });
    }

    traverseForGroups(robotArm, 0);

    // 순서대로 정렬 (계층 구조 순서)
    if (foundJoints.length >= 6) {
      return foundJoints.slice(0, 6);
    }
  }

  return joints;
}

/**
 * 로봇 팔의 관절 각도를 업데이트하는 헬퍼 함수
 * Three.js의 계층 구조를 활용하여 부모 관절을 회전시키면 자식 부품도 함께 회전합니다.
 */
function updateJointAngles(joints: THREE.Object3D[], jointAngles: number[]) {
  if (joints.length === 0) return;

  // 각 관절에 회전 적용
  // 일반적인 6축 로봇 팔 회전 축:
  // J0: Y축 (Base 회전) - 전체 로봇 회전
  // J1: X축 또는 Z축 (Shoulder 상하) - 어깨 관절
  // J2: X축 또는 Z축 (Elbow 상하) - 팔꿈치 관절
  // J3: Y축 (Wrist1 회전) - 손목1 회전
  // J4: X축 또는 Z축 (Wrist2 상하) - 손목2 상하
  // J5: Y축 (Wrist3 회전) - 손목3 회전

  const rotationAxes = ["y", "x", "x", "y", "x", "y"];

  joints.forEach((joint, index) => {
    if (index >= jointAngles.length) return;

    const angle = THREE.MathUtils.degToRad(jointAngles[index]);
    const axis = rotationAxes[index] || "y";

    // 관절 객체를 회전시키면 Three.js의 계층 구조에 의해
    // 해당 관절의 모든 자식 객체(하위 부품)도 함께 회전합니다.
    if (axis === "x") {
      joint.rotation.x = angle;
    } else if (axis === "y") {
      joint.rotation.y = angle;
    } else if (axis === "z") {
      joint.rotation.z = angle;
    }

    // 회전 업데이트 강제 (필요한 경우)
    joint.updateMatrixWorld(true);
  });
}
