import * as THREE from "three";

/**
 * 6축 로봇 팔의 각 관절 길이 (미터 단위)
 * 실제 산업용 로봇 팔 비율로 조정
 */
const JOINT_LENGTHS = {
  base: 0.4, // 베이스 높이 (더 크게)
  shoulder: 1.0, // 어깨-팔꿈치 링크 길이 (더 길게)
  elbow: 0.9, // 팔꿈치-손목1 링크 길이 (더 길게)
  wrist1: 0.15, // 손목1 관절 높이
  wrist1Link: 0.3, // 손목1-손목2 사이 링크 길이 (더 길게)
  wrist2: 0.12, // 손목2 관절 높이
  wrist2Link: 0.25, // 손목2-손목3 사이 링크 길이 (더 길게)
  wrist3: 0.1, // 손목3 관절 높이
};

/**
 * 관절 반지름 (더 크게 - 실제 로봇처럼)
 */
const JOINT_RADIUS = 0.15;

/**
 * 링크 반지름 (원통형 링크 - 1.5배 증가)
 */
const LINK_RADIUS = 0.195;

/**
 * 색상 정의 (하얀색 베이스 + 회색 관절로 구별)
 */
const COLORS = {
  link: 0xffffff, // 하얀색 링크
  joint: 0x666666, // 어두운 회색 관절 (구별용)
  jointCap: 0xffffff, // 하얀색 관절 캡
  base: 0xffffff, // 하얀색 베이스
  gripper: 0xffffff, // 하얀색 집게
};

/**
 * 관절 메시 생성 (실제 로봇처럼 - 원통형)
 * @param radius 관절 반지름
 * @param height 관절 높이/길이
 * @param color 색상
 * @param axis 관절이 회전하는 축 ('x', 'y', 'z') - 이 축 방향으로 원통이 놓임
 */
function createJointMesh(
  radius: number,
  height: number,
  color: number,
  axis: 'x' | 'y' | 'z' = 'y'
): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.5,
    roughness: 0.4,
  });
  const mesh = new THREE.Mesh(geometry, material);
  
  // 회전축 방향으로 원통을 배치
  if (axis === 'x') {
    mesh.rotation.z = Math.PI / 2; // X축 방향으로 눕힘
  } else if (axis === 'z') {
    mesh.rotation.x = Math.PI / 2; // Z축 방향으로 눕힘
  }
  // Y축은 기본 방향이므로 회전 불필요
  
  return mesh;
}

/**
 * 관절 캡 생성 (회전축 주위를 감싸는 링)
 * @param rotationAxis 회전축 ('x', 'y', 'z')
 */
function createJointCapMesh(rotationAxis: 'x' | 'y' | 'z' = 'y'): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(LINK_RADIUS, LINK_RADIUS, 0.03, 32);
  const material = new THREE.MeshStandardMaterial({
    color: COLORS.jointCap,
    metalness: 0.3,
    roughness: 0.7,
  });
  const mesh = new THREE.Mesh(geometry, material);
  
  // 회전축 방향으로 캡을 정렬 (축 주위를 감싸도록)
  if (rotationAxis === 'x') {
    mesh.rotation.z = Math.PI / 2; // X축 방향으로 원통이 놓이도록
  } else if (rotationAxis === 'z') {
    mesh.rotation.x = Math.PI / 2; // Z축 방향으로 원통이 놓이도록
  }
  // Y축은 기본 방향이므로 회전 불필요
  
  return mesh;
}

/**
 * 관절 연결부 생성 (링크가 관절 안으로 들어가는 부분)
 */
function createJointConnector(radius: number, height: number): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
  const material = new THREE.MeshStandardMaterial({
    color: COLORS.joint,
    metalness: 0.5,
    roughness: 0.4,
  });
  return new THREE.Mesh(geometry, material);
}

/**
 * 링크 메시 생성 (원통형 링크)
 * @param length 링크 길이
 * @param radius 링크 반지름
 * @param axis 링크가 뻗어나가는 방향 ('x', 'y', 'z')
 */
function createLinkMesh(
  length: number,
  radius: number,
  axis: 'x' | 'y' | 'z' = 'y'
): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 32);
  const material = new THREE.MeshStandardMaterial({
    color: COLORS.link,
    metalness: 0.6,
    roughness: 0.3,
  });
  const mesh = new THREE.Mesh(geometry, material);
  
  // 링크 방향 조정 (기본은 Y축)
  if (axis === 'x') {
    mesh.rotation.z = Math.PI / 2; // X축 방향 (옆으로)
  } else if (axis === 'z') {
    mesh.rotation.x = Math.PI / 2; // Z축 방향 (앞뒤로)
  }
  
  return mesh;
}


/**
 * 로봇 집게(Gripper) 생성 (2배 크기)
 * @returns Gripper 그룹
 */
function createGripper(): THREE.Group {
  const gripperGroup = new THREE.Group();

  // 집게 베이스 (손목에 연결되는 부분 - 2배)
  const gripperBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.30, 0.12, 0.2),
    new THREE.MeshStandardMaterial({
      color: COLORS.gripper,
      metalness: 0.5,
      roughness: 0.4,
    })
  );
  gripperBase.position.y = 0.06;
  gripperGroup.add(gripperBase);

  // 왼쪽 집게 핑거 (2배)
  const leftFinger = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.30, 0.08),
    new THREE.MeshStandardMaterial({
      color: COLORS.gripper,
      metalness: 0.4,
      roughness: 0.5,
    })
  );
  leftFinger.position.set(-0.10, 0.24, 0);
  gripperGroup.add(leftFinger);

  // 오른쪽 집게 핑거 (2배)
  const rightFinger = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.30, 0.08),
    new THREE.MeshStandardMaterial({
      color: COLORS.gripper,
      metalness: 0.4,
      roughness: 0.5,
    })
  );
  rightFinger.position.set(0.10, 0.24, 0);
  gripperGroup.add(rightFinger);

  // 집게 안쪽면 (고무 패드 - 2배)
  const leftPad = new THREE.Mesh(
    new THREE.BoxGeometry(0.036, 0.24, 0.07),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.8,
    })
  );
  leftPad.position.set(-0.08, 0.24, 0);
  gripperGroup.add(leftPad);

  const rightPad = new THREE.Mesh(
    new THREE.BoxGeometry(0.036, 0.24, 0.07),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.8,
    })
  );
  rightPad.position.set(0.08, 0.24, 0);
  gripperGroup.add(rightPad);

  return gripperGroup;
}

/**
 * 좌표계 헬퍼 생성 (각 관절에 표시)
 * @param size 좌표계 크기
 * @returns AxesHelper 그룹
 */
function createCoordinateSystem(size: number = 0.15): THREE.Group {
  const group = new THREE.Group();
  
  // X축 (빨강)
  const xAxis = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, 0),
    size,
    0xff0000,
    size * 0.3,
    size * 0.15
  );
  group.add(xAxis);
  
  // Y축 (초록)
  const yAxis = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 0),
    size,
    0x00ff00,
    size * 0.3,
    size * 0.15
  );
  group.add(yAxis);
  
  // Z축 (파랑)
  const zAxis = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, 0),
    size,
    0x0000ff,
    size * 0.3,
    size * 0.15
  );
  group.add(zAxis);
  
  return group;
}

/**
 * 6축 로봇 팔 생성 (실제 산업용 로봇 팔처럼)
 * @returns 로봇 팔 그룹
 */
export function createRobotArm(): THREE.Group {
  const robotArm = new THREE.Group();

  // Base (J0) - 회전 관절
  const baseJoint = new THREE.Group();

  // 베이스 원판 (그리드 위에 - 더 크게)
  const basePlate = createJointMesh(JOINT_RADIUS * 3.0, 0.12, COLORS.base, 'y');
  basePlate.position.y = 0.06;
  baseJoint.add(basePlate);

  // 베이스 본체 (수직 원통 - 더 크게, Y축 회전이므로 Y축 방향)
  const baseMesh = createJointMesh(
    JOINT_RADIUS * 2.2,
    JOINT_LENGTHS.base,
    COLORS.joint,
    'y'
  );
  baseMesh.position.y = JOINT_LENGTHS.base / 2 + 0.12;
  baseJoint.add(baseMesh);

  // 베이스 상단 캡 (Y축 회전)
  const baseCap = createJointCapMesh('y');
  baseCap.position.y = JOINT_LENGTHS.base + 0.12;
  baseJoint.add(baseCap);

  // 베이스 좌표계
  const baseAxes = createCoordinateSystem(0.2);
  baseAxes.position.y = JOINT_LENGTHS.base + 0.12;
  baseJoint.add(baseAxes);

  robotArm.add(baseJoint);

  // Shoulder (J1) - 상하 관절
  const shoulderRadius = JOINT_RADIUS * 1.8;
  const shoulderHeight = 0.25;
  
  const shoulderJoint = new THREE.Group();
  // Group의 위치를 회전 중심(관절 중심)으로 설정
  shoulderJoint.position.y = JOINT_LENGTHS.base + 0.12 + shoulderRadius;

  // Shoulder 관절 본체 (X축 회전이므로 X축 방향으로 눕힘)
  const shoulderMesh = createJointMesh(shoulderRadius, shoulderHeight, COLORS.joint, 'x');
  // 관절 중심이 Group 원점이므로 y = 0
  shoulderMesh.position.y = 0;
  shoulderJoint.add(shoulderMesh);

  // Shoulder Link (수직 원통형 링크 - 관절 위에서 시작)
  const shoulderLink = createLinkMesh(JOINT_LENGTHS.shoulder, LINK_RADIUS, 'y');
  // 관절 중심(0)에서 위쪽으로
  shoulderLink.position.y = shoulderRadius + JOINT_LENGTHS.shoulder / 2;
  shoulderJoint.add(shoulderLink);

  // Shoulder 관절 하단 연결부 (X축 회전 관절은 제거)

  // Shoulder 관절 좌표계
  const shoulderAxes = createCoordinateSystem(0.15);
  shoulderAxes.position.y = 0; // 회전 중심
  shoulderJoint.add(shoulderAxes);

  baseJoint.add(shoulderJoint);

  // Elbow (J2) - 상하 관절
  const elbowRadius = JOINT_RADIUS * 1.7;
  const elbowHeight = 0.22;
  
  const elbowJoint = new THREE.Group();
  // shoulderJoint 기준 상대 위치: 링크 끝 + elbow 반지름
  const shoulderLinkEnd = shoulderRadius + JOINT_LENGTHS.shoulder;
  elbowJoint.position.y = shoulderLinkEnd + elbowRadius;

  // Elbow 관절 본체 (X축 회전이므로 X축 방향으로 눕힘)
  const elbowMesh = createJointMesh(elbowRadius, elbowHeight, COLORS.joint, 'x');
  // 관절 중심이 Group 원점이므로 y = 0
  elbowMesh.position.y = 0;
  elbowJoint.add(elbowMesh);

  // Elbow Link (수직 원통형 링크 - 관절 위에서 시작)
  const elbowLink = createLinkMesh(JOINT_LENGTHS.elbow, LINK_RADIUS * 0.95, 'y');
  // 관절 중심(0)에서 위쪽으로
  elbowLink.position.y = elbowRadius + JOINT_LENGTHS.elbow / 2;
  elbowJoint.add(elbowLink);

  // Elbow 관절 하단 연결부 (X축 회전 관절은 제거)

  // Elbow 관절 좌표계
  const elbowAxes = createCoordinateSystem(0.15);
  elbowAxes.position.y = 0; // 회전 중심
  elbowJoint.add(elbowAxes);

  shoulderJoint.add(elbowJoint);

  // Wrist1 (J3) - 회전 관절
  const wrist1Joint = new THREE.Group();
  // elbowJoint 기준 상대 위치: 링크 끝
  const elbowLinkEnd = elbowRadius + JOINT_LENGTHS.elbow;
  wrist1Joint.position.y = elbowLinkEnd;

  // Wrist1 관절 본체 (Y축 회전이므로 Y축 방향 - 세로로 유지)
  const wrist1Mesh = createJointMesh(
    JOINT_RADIUS * 1.5,
    JOINT_LENGTHS.wrist1,
    COLORS.joint,
    'y'
  );
  wrist1Mesh.position.y = JOINT_LENGTHS.wrist1 / 2;
  wrist1Joint.add(wrist1Mesh);

  // Wrist1 상단 캡 (Y축 회전)
  const wrist1Cap = createJointCapMesh('y');
  wrist1Cap.position.y = JOINT_LENGTHS.wrist1;
  wrist1Joint.add(wrist1Cap);

  // Wrist1 관절 하단 연결부
  const wrist1Connector = createJointConnector(JOINT_RADIUS * 1.3, 0.08);
  wrist1Connector.position.y = -0.04;
  wrist1Joint.add(wrist1Connector);

  // Wrist1-Wrist2 사이 링크 (회색 원통 - 관절 안으로 들어가서 연결되도록)
  const wrist1LinkLength = JOINT_LENGTHS.wrist1Link;
  const wrist1Link = createLinkMesh(wrist1LinkLength, LINK_RADIUS * 0.9, 'y');
  // 링크가 Wrist1 관절 상단에서 시작하도록 위치 조정
  wrist1Link.position.y = JOINT_LENGTHS.wrist1 + wrist1LinkLength / 2;
  wrist1Joint.add(wrist1Link);

  // Wrist1 관절 좌표계
  const wrist1Axes = createCoordinateSystem(0.12);
  wrist1Axes.position.y = JOINT_LENGTHS.wrist1 / 2;
  wrist1Joint.add(wrist1Axes);

  elbowJoint.add(wrist1Joint);

  // Wrist2 (J4) - 상하 관절
  const wrist2Radius = JOINT_RADIUS * 1.3;
  const wrist2Height = JOINT_LENGTHS.wrist2;
  
  const wrist2Joint = new THREE.Group();
  // wrist1Joint 기준 상대 위치: wrist1 높이 + 링크 + wrist2 반지름
  const wrist1ToWrist2Distance = JOINT_LENGTHS.wrist1 + wrist1LinkLength + wrist2Radius;
  wrist2Joint.position.y = wrist1ToWrist2Distance;

  // Wrist2 관절 본체 (X축 회전이므로 X축 방향으로 눕힘)
  const wrist2Mesh = createJointMesh(wrist2Radius, wrist2Height, COLORS.joint, 'x');
  // 관절 중심이 Group 원점이므로 y = 0
  wrist2Mesh.position.y = 0;
  wrist2Joint.add(wrist2Mesh);

  // Wrist2 관절 하단 연결부 (X축 회전 관절은 제거)

  // Wrist2-Wrist3 사이 링크 (회색 원통 - 관절 위에서 시작)
  const wrist2LinkLength = JOINT_LENGTHS.wrist2Link;
  const wrist2Link = createLinkMesh(wrist2LinkLength, LINK_RADIUS * 0.85, 'y');
  // 관절 중심(0)에서 위쪽으로
  wrist2Link.position.y = wrist2Radius + wrist2LinkLength / 2;
  wrist2Joint.add(wrist2Link);

  // Wrist2 관절 좌표계
  const wrist2Axes = createCoordinateSystem(0.12);
  wrist2Axes.position.y = 0; // 회전 중심
  wrist2Joint.add(wrist2Axes);

  wrist1Joint.add(wrist2Joint);

  // Wrist3 (J5) - 회전 관절 (End Effector)
  const wrist3Joint = new THREE.Group();
  // wrist2Joint 기준 상대 위치: 반지름 + 링크
  const wrist2ToWrist3Distance = wrist2Radius + wrist2LinkLength;
  wrist3Joint.position.y = wrist2ToWrist3Distance;

  // Wrist3 관절 본체 (Y축 회전이므로 Y축 방향 - 세로로 유지)
  const wrist3Mesh = createJointMesh(
    JOINT_RADIUS * 1.2,
    JOINT_LENGTHS.wrist3,
    COLORS.joint,
    'y'
  );
  wrist3Mesh.position.y = JOINT_LENGTHS.wrist3 / 2;
  wrist3Joint.add(wrist3Mesh);

  // Wrist3 상단 캡 (Y축 회전)
  const wrist3Cap = createJointCapMesh('y');
  wrist3Cap.position.y = JOINT_LENGTHS.wrist3;
  wrist3Joint.add(wrist3Cap);

  // Wrist3 관절 하단 연결부
  const wrist3Connector = createJointConnector(JOINT_RADIUS * 1.0, 0.05);
  wrist3Connector.position.y = -0.02;
  wrist3Joint.add(wrist3Connector);

  // Gripper (집게) 추가
  const gripperGroup = createGripper();
  gripperGroup.position.y = JOINT_LENGTHS.wrist3;
  wrist3Joint.add(gripperGroup);

  // End Effector 좌표계 (TCP 좌표계 - 집게 중심)
  const endEffectorAxes = createCoordinateSystem(0.12);
  endEffectorAxes.position.y = JOINT_LENGTHS.wrist3 + 0.06;
  wrist3Joint.add(endEffectorAxes);

  wrist2Joint.add(wrist3Joint);

  return robotArm;
}
