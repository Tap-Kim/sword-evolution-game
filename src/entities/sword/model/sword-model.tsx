"use client";

import { useRef, Suspense } from "react";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, MeshStandardMaterial } from "three";
import * as THREE from "three";
import { Sword } from "@/shared/api/types";
import { SwordEffects } from "../model/sword-effects";

// 타입 정의
interface SwordModelProps {
  sword: Sword;
  autoRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  isEvolving?: boolean;
}

// 상수 정의
const MODEL_PATH = "/basic_sword.glb";

// 모델 미리 로드
useGLTF.preload(MODEL_PATH);

/**
 * 검 모델을 생성하는 함수 - 단계별로 다른 모델 반환
 */
function getSwordModel(stage: number) {
  // 기본 롱소드 모델 생성 (1단계)
  const createBasicLongSword = () => {
    const group = new THREE.Group();

    // 검신 생성 - 이미지와 유사한 형태
    const bladeGeometry = new THREE.Shape();
    // 검신 형태 정의 (위에서 아래로) - 더 날카롭게 수정
    bladeGeometry.moveTo(0, 2.0); // 검 끝부분 (위)
    bladeGeometry.lineTo(0.12, 1.8);
    bladeGeometry.lineTo(0.12, 0.1);
    bladeGeometry.lineTo(0, 0); // 검 손잡이 연결부분 (아래)
    bladeGeometry.lineTo(-0.12, 0.1);
    bladeGeometry.lineTo(-0.12, 1.8);
    bladeGeometry.lineTo(0, 2.0);

    const extrudeSettings = {
      steps: 1,
      depth: 0.03, // 더 얇게
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3,
    };

    // 검신 메쉬 생성 - 회색 메탈
    const blade = new THREE.Mesh(
      new THREE.ExtrudeGeometry(bladeGeometry, extrudeSettings),
      new THREE.MeshStandardMaterial({
        color: 0xaaaaaa, // 회색
        metalness: 0.8,
        roughness: 0.3,
      })
    );

    // 검이 캔버스 중앙에 오도록 위치 조정
    blade.position.set(0, -1.0, 0);

    // 가드 생성 (십자 모양)
    const guardMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513, // 갈색
      metalness: 0.6,
      roughness: 0.4,
    });

    // 가드 가로 부분
    const guardHorizontal = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.08, 0.08),
      guardMaterial
    );
    guardHorizontal.position.set(0, -1.0, 0);

    // 손잡이 생성
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16),
      new THREE.MeshStandardMaterial({
        color: 0x5c4033, // 어두운 갈색
        metalness: 0.3,
        roughness: 0.7,
      })
    );
    handle.position.set(0, -1.25, 0);

    // 손잡이 끝 장식
    const pommel = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 16),
      guardMaterial
    );
    pommel.position.set(0, -1.45, 0);

    // 그룹에 모든 파츠 추가
    group.add(blade);
    group.add(guardHorizontal);
    group.add(handle);
    group.add(pommel);

    return group;
  };

  // 황금색 검 모델 생성 (이미지와 유사하게) - 고급 단계
  const createGoldenSword = () => {
    const group = new THREE.Group();

    // 검신 생성 - 이미지와 유사한 형태
    const bladeGeometry = new THREE.Shape();
    // 검신 형태 정의 (위에서 아래로) - 더 날카롭게 수정
    bladeGeometry.moveTo(0, 2.0); // 검 끝부분 (위)
    bladeGeometry.lineTo(0.15, 1.8);
    bladeGeometry.lineTo(0.15, 0.1);
    bladeGeometry.lineTo(0, 0); // 검 손잡이 연결부분 (아래)
    bladeGeometry.lineTo(-0.15, 0.1);
    bladeGeometry.lineTo(-0.15, 1.8);
    bladeGeometry.lineTo(0, 2.0);

    const extrudeSettings = {
      steps: 1,
      depth: 0.04, // 더 얇게
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    };

    // 검신 메쉬 생성
    const blade = new THREE.Mesh(
      new THREE.ExtrudeGeometry(bladeGeometry, extrudeSettings),
      new THREE.MeshStandardMaterial({
        color: 0xffd700, // 황금색
        metalness: 1,
        roughness: 0.2,
        emissive: 0xffaa00,
        emissiveIntensity: 0.3,
      })
    );

    // 검이 캔버스 중앙에 오도록 위치 조정
    blade.position.set(0, -1.0, 0);

    // 검신 중앙 라인 (이미지의 밝은 부분)
    const centerLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 1.8, 0.06),
      new THREE.MeshStandardMaterial({
        color: 0xffffaa,
        emissive: 0xffffaa,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.9,
      })
    );
    centerLine.position.set(0, 0.0, 0.03);

    // 가드 생성 (십자 모양)
    const guardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2,
    });

    // 가드 가로 부분
    const guardHorizontal = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.1, 0.1),
      guardMaterial
    );
    guardHorizontal.position.set(0, -1.0, 0);

    // 가드 세로 부분 (작은 원형)
    const guardVertical = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16),
      guardMaterial
    );
    guardVertical.rotation.x = Math.PI / 2;
    guardVertical.position.set(0, -1.0, 0);

    // 손잡이 생성
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16),
      new THREE.MeshStandardMaterial({
        color: 0xaa7700,
        metalness: 0.5,
        roughness: 0.5,
      })
    );
    handle.position.set(0, -1.25, 0);

    // 손잡이 끝 장식
    const pommel = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      guardMaterial
    );
    pommel.position.set(0, -1.45, 0);

    // 그룹에 모든 파츠 추가
    group.add(blade);
    group.add(centerLine);
    group.add(guardHorizontal);
    group.add(guardVertical);
    group.add(handle);
    group.add(pommel);

    return group;
  };

  // 녹색 불꽃 검 모델 생성 (이미지의 두 번째 검)
  const createGreenFlameSword = () => {
    const group = new THREE.Group();

    // 검신 생성 - 불꽃 형태
    const bladeGeometry = new THREE.Shape();
    // 불규칙한 불꽃 형태의 검신 - 더 날카롭게 수정
    bladeGeometry.moveTo(0, 2.0); // 검 끝부분 (위)
    bladeGeometry.lineTo(0.12, 1.7);
    bladeGeometry.lineTo(0.08, 1.5);
    bladeGeometry.lineTo(0.18, 1.3);
    bladeGeometry.lineTo(0.12, 1.0);
    bladeGeometry.lineTo(0.2, 0.7);
    bladeGeometry.lineTo(0.12, 0.3);
    bladeGeometry.lineTo(0, 0); // 검 손잡이 연결부분 (아래)
    bladeGeometry.lineTo(-0.12, 0.3);
    bladeGeometry.lineTo(-0.2, 0.7);
    bladeGeometry.lineTo(-0.12, 1.0);
    bladeGeometry.lineTo(-0.18, 1.3);
    bladeGeometry.lineTo(-0.08, 1.5);
    bladeGeometry.lineTo(-0.12, 1.7);
    bladeGeometry.lineTo(0, 2.0);

    const extrudeSettings = {
      steps: 1,
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    };

    // 검신 메쉬 생성
    const blade = new THREE.Mesh(
      new THREE.ExtrudeGeometry(bladeGeometry, extrudeSettings),
      new THREE.MeshStandardMaterial({
        color: 0x33ff33, // 녹색
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x33ff33,
        emissiveIntensity: 0.5,
      })
    );

    // 검이 캔버스 중앙에 오도록 위치 조정
    blade.position.set(0, -1.0, 0);

    // 가드 생성
    const guardMaterial = new THREE.MeshStandardMaterial({
      color: 0x009900, // 어두운 녹색
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x009900,
      emissiveIntensity: 0.3,
    });

    // 가드 (나선형)
    const guardGeometry = new THREE.TorusGeometry(0.1, 0.03, 16, 16);
    const guard = new THREE.Mesh(guardGeometry, guardMaterial);
    guard.position.set(0, -1.0, 0);

    // 손잡이 생성 (나선형)
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16),
      new THREE.MeshStandardMaterial({
        color: 0x006600, // 어두운 녹색
        metalness: 0.5,
        roughness: 0.5,
      })
    );
    handle.position.set(0, -1.25, 0);

    // 손잡이 장식 (뾰족한 끝)
    const pommel = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.12, 16),
      guardMaterial
    );
    pommel.rotation.x = Math.PI; // 뒤집기
    pommel.position.set(0, -1.45, 0);

    // 그룹에 모든 파츠 추가
    group.add(blade);
    group.add(guard);
    group.add(handle);
    group.add(pommel);

    return group;
  };

  // 푸른 수정 검 모델 생성 (이미지의 세 번째 검)
  const createBlueCrystalSword = () => {
    const group = new THREE.Group();

    // 검신 생성 - 결정체 형태
    const bladeGeometry = new THREE.Shape();
    // 각진 결정체 형태의 검신 - 더 날카롭게 수정
    bladeGeometry.moveTo(0, 2.0); // 검 끝부분 (위)
    bladeGeometry.lineTo(0.15, 1.6);
    bladeGeometry.lineTo(0.1, 1.2);
    bladeGeometry.lineTo(0.2, 0.8);
    bladeGeometry.lineTo(0.1, 0.4);
    bladeGeometry.lineTo(0, 0); // 검 손잡이 연결부분 (아래)
    bladeGeometry.lineTo(-0.1, 0.4);
    bladeGeometry.lineTo(-0.2, 0.8);
    bladeGeometry.lineTo(-0.1, 1.2);
    bladeGeometry.lineTo(-0.15, 1.6);
    bladeGeometry.lineTo(0, 2.0);

    const extrudeSettings = {
      steps: 1,
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    };

    // 검신 메쉬 생성
    const blade = new THREE.Mesh(
      new THREE.ExtrudeGeometry(bladeGeometry, extrudeSettings),
      new THREE.MeshStandardMaterial({
        color: 0x66ccff, // 하늘색
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x3399ff,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9,
      })
    );

    // 검이 캔버스 중앙에 오도록 위치 조정
    blade.position.set(0, -1.0, 0);

    // 가드 생성 (날개 모양)
    const guardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // 흰색
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xffffff,
      emissiveIntensity: 0.2,
    });

    // 가드 (날개 형태)
    const guardGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.05);
    const guard = new THREE.Mesh(guardGeometry, guardMaterial);
    guard.position.set(0, -1.0, 0);

    // 손잡이 생성
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16),
      new THREE.MeshStandardMaterial({
        color: 0x3366cc, // 파란색
        metalness: 0.7,
        roughness: 0.3,
      })
    );
    handle.position.set(0, -1.25, 0);

    // 손잡이 끝 장식
    const pommel = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x3399ff, // 밝은 파란색
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x3399ff,
        emissiveIntensity: 0.5,
      })
    );
    pommel.position.set(0, -1.45, 0);

    // 그룹에 모든 파츠 추가
    group.add(blade);
    group.add(guard);
    group.add(handle);
    group.add(pommel);

    return group;
  };

  // 단계에 따라 다른 모델 반환
  let model;

  if (stage <= 1) {
    // 1단계: 기본 회색 롱소드
    model = createBasicLongSword();
  } else if (stage === 2) {
    // 2단계: 황금색 검
    model = createGoldenSword();
  } else if (stage === 3) {
    // 3단계: 녹색 불꽃 검
    model = createGreenFlameSword();
  } else {
    // 4단계 이상: 푸른 수정 검
    model = createBlueCrystalSword();
  }

  // 단계에 따른 효과 적용
  applyStageEffects(model, stage);

  return model;
}

/**
 * 검 단계에 따른 효과 적용
 */
function applyStageEffects(group: Group, stage: number) {
  // 단계에 따른 색상 및 효과 설정
  if (stage <= 1) {
    // 1단계: 기본 회색 검
    group.traverse((child) => {
      if (child instanceof Mesh) {
        const material = child.material as MeshStandardMaterial;
        // 기본 메탈 효과만 적용
        if (material.emissive) {
          material.emissiveIntensity = 0;
        }
      }
    });
  } else {
    // 2단계 이상: 단계가 높을수록 더 밝게 빛나도록 설정
    const intensity = 0.2 + (stage - 1) * 0.2;

    // 모든 메쉬에 효과 적용
    group.traverse((child) => {
      if (child instanceof Mesh) {
        const material = child.material as MeshStandardMaterial;

        // 발광 효과 적용
        if (material.emissive) {
          material.emissiveIntensity = intensity;
        }
      }
    });
  }

  // 단계에 따른 크기 조정
  const scale = 1 + stage * 0.05;
  group.scale.set(scale, scale, scale);
}

/**
 * 대체 검 모델 (로딩 실패 시)
 */
function FallbackSwordModel() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 2, 0.1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

/**
 * 모델 로더 컴포넌트
 */
function ModelLoader({
  sword,
  isEvolving,
}: {
  sword: Sword;
  isEvolving?: boolean;
}) {
  const modelRef = useRef<Group | null>(null);

  // 모델 생성
  const model = getSwordModel(sword.stage);

  // 진화 효과 애니메이션
  useFrame((state: { clock: { getElapsedTime: () => number } }) => {
    if (modelRef.current && isEvolving) {
      // 진화 중일 때 빠른 회전 애니메이션
      modelRef.current.rotation.y += 0.1; // 회전 속도 증가

      // 위아래로 움직이는 애니메이션
      const time = state.clock.getElapsedTime();
      modelRef.current.position.y = Math.sin(time * 4) * 0.3; // 움직임 폭 증가

      // 크기 변화 애니메이션
      const scale = 1 + Math.sin(time * 3) * 0.15; // 크기 변화 폭 증가
      modelRef.current.scale.set(scale, scale, scale);

      // 추가 회전 효과
      modelRef.current.rotation.x = Math.sin(time * 2) * 0.1;
      modelRef.current.rotation.z = Math.cos(time * 2) * 0.1;
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={model} />
      <SwordEffects sword={sword} modelRef={modelRef} isEvolving={isEvolving} />

      {/* 진화 중일 때 추가 빛 효과 */}
      {isEvolving && (
        <>
          <pointLight position={[0, 0, 2]} intensity={2} color="#FFFFFF" />
          <pointLight position={[2, 0, 0]} intensity={1} color="#FFFF00" />
          <pointLight position={[-2, 0, 0]} intensity={1} color="#00FFFF" />
        </>
      )}
    </group>
  );
}

/**
 * 검 모델 컴포넌트
 */
export function SwordModel({
  sword,
  autoRotate = false,
  enableZoom = true,
  enablePan = false,
  isEvolving = false,
}: SwordModelProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      <Suspense fallback={<FallbackSwordModel />}>
        <ModelLoader sword={sword} isEvolving={isEvolving} />
      </Suspense>

      <OrbitControls
        enableZoom={enableZoom && !isEvolving}
        enablePan={enablePan && !isEvolving}
        autoRotate={autoRotate && !isEvolving}
        autoRotateSpeed={2}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
        enabled={!isEvolving} // 진화 중에는 컨트롤 비활성화
      />
    </>
  );
}
