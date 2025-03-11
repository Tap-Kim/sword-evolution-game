"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Box,
  Cylinder,
  Sphere,
  Torus,
  Html,
} from "@react-three/drei";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { Sword } from "@/lib/types/schema";

// 타입 정의
interface SwordModelProps {
  sword: Sword;
  autoRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  isEvolving?: boolean;
}

/**
 * 검의 진화 단계별 모델 반환
 */
function getSwordModel(stage: number) {
  switch (stage) {
    case 1: // 기본 숏소드 - 날카로운 디자인
      return (
        <group>
          {/* 검신 - 날카로운 형태 */}
          <group position={[0, 0.3, 0]}>
            <Box args={[0.08, 0.7, 0.02]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#c0c0c0"
                metalness={0.8}
                roughness={0.2}
              />
            </Box>
            {/* 검 끝 부분 - 날카로운 삼각형 */}
            <Box
              args={[0.08, 0.15, 0.02]}
              position={[0, 0.425, 0]}
              rotation={[0, 0, Math.PI / 4]}
            >
              <meshStandardMaterial
                color="#d0d0d0"
                metalness={0.9}
                roughness={0.1}
              />
            </Box>
            {/* 검신 중앙 홈 */}
            <Box args={[0.01, 0.6, 0.03]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#a0a0a0"
                metalness={0.7}
                roughness={0.3}
              />
            </Box>
          </group>
          {/* 손잡이 */}
          <Cylinder args={[0.025, 0.025, 0.3, 16]} position={[0, -0.15, 0]}>
            <meshStandardMaterial
              color="#5c3c10"
              metalness={0.3}
              roughness={0.7}
            />
          </Cylinder>
          {/* 가드 - 날개 모양 */}
          <group position={[0, 0, 0]}>
            <Box
              args={[0.22, 0.04, 0.04]}
              position={[0, 0, 0]}
              rotation={[0, 0, Math.PI / 12]}
            >
              <meshStandardMaterial
                color="#888888"
                metalness={0.6}
                roughness={0.4}
              />
            </Box>
            <Box
              args={[0.22, 0.04, 0.04]}
              position={[0, 0, 0]}
              rotation={[0, 0, -Math.PI / 12]}
            >
              <meshStandardMaterial
                color="#888888"
                metalness={0.6}
                roughness={0.4}
              />
            </Box>
          </group>
          {/* 손잡이 끝 장식 */}
          <Sphere args={[0.04, 16, 16]} position={[0, -0.3, 0]}>
            <meshStandardMaterial
              color="#777777"
              metalness={0.6}
              roughness={0.4}
            />
          </Sphere>
        </group>
      );
    case 2: // 롱소드 - 푸른 빛 이펙트
      return (
        <group>
          {/* 검신 - 길고 날카로운 형태 */}
          <group position={[0, 0.45, 0]}>
            <Box args={[0.1, 1.0, 0.025]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#6699cc"
                metalness={0.8}
                roughness={0.2}
                emissive="#3366aa"
                emissiveIntensity={0.3}
              />
            </Box>
            {/* 검 끝 부분 - 날카로운 삼각형 */}
            <Box
              args={[0.1, 0.2, 0.025]}
              position={[0, 0.6, 0]}
              rotation={[0, 0, Math.PI / 4]}
            >
              <meshStandardMaterial
                color="#88aadd"
                metalness={0.9}
                roughness={0.1}
                emissive="#3366aa"
                emissiveIntensity={0.4}
              />
            </Box>
            {/* 검신 중앙 홈 - 빛나는 효과 */}
            <Box args={[0.02, 0.9, 0.03]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#3366aa"
                metalness={0.9}
                roughness={0.1}
                emissive="#3366aa"
                emissiveIntensity={0.6}
              />
            </Box>
          </group>
          {/* 손잡이 */}
          <Cylinder args={[0.03, 0.03, 0.4, 16]} position={[0, -0.2, 0]}>
            <meshStandardMaterial
              color="#2c2c2c"
              metalness={0.5}
              roughness={0.5}
            />
          </Cylinder>
          {/* 가드 - 십자 모양 */}
          <group position={[0, 0, 0]}>
            <Box args={[0.35, 0.06, 0.06]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#4c4c4c"
                metalness={0.7}
                roughness={0.3}
                emissive="#3366aa"
                emissiveIntensity={0.2}
              />
            </Box>
            <Box args={[0.06, 0.15, 0.06]} position={[0, -0.05, 0]}>
              <meshStandardMaterial
                color="#4c4c4c"
                metalness={0.7}
                roughness={0.3}
                emissive="#3366aa"
                emissiveIntensity={0.2}
              />
            </Box>
          </group>
          {/* 손잡이 끝 장식 - 빛나는 보석 */}
          <Sphere args={[0.05, 16, 16]} position={[0, -0.4, 0]}>
            <meshStandardMaterial
              color="#3366aa"
              emissive="#3366aa"
              emissiveIntensity={0.7}
              metalness={1.0}
              roughness={0.0}
            />
          </Sphere>
        </group>
      );
    case 3: // 화염검 - 불꽃 이펙트
      return (
        <group>
          {/* 검신 - 불꽃 형태 */}
          <group position={[0, 0.5, 0]}>
            <Box args={[0.12, 1.1, 0.03]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#ff6600"
                metalness={0.7}
                roughness={0.3}
                emissive="#ff3300"
                emissiveIntensity={0.5}
              />
            </Box>
            {/* 검 끝 부분 - 불꽃 모양 */}
            <group position={[0, 0.6, 0]}>
              <Box
                args={[0.12, 0.15, 0.03]}
                position={[0, 0, 0]}
                rotation={[0, 0, Math.PI / 6]}
              >
                <meshStandardMaterial
                  color="#ff9900"
                  metalness={0.8}
                  roughness={0.2}
                  emissive="#ff6600"
                  emissiveIntensity={0.8}
                />
              </Box>
              <Box
                args={[0.12, 0.15, 0.03]}
                position={[0, 0, 0]}
                rotation={[0, 0, -Math.PI / 6]}
              >
                <meshStandardMaterial
                  color="#ff9900"
                  metalness={0.8}
                  roughness={0.2}
                  emissive="#ff6600"
                  emissiveIntensity={0.8}
                />
              </Box>
              <Box
                args={[0.08, 0.2, 0.03]}
                position={[0, 0.1, 0]}
                rotation={[0, 0, 0]}
              >
                <meshStandardMaterial
                  color="#ffcc00"
                  metalness={0.8}
                  roughness={0.2}
                  emissive="#ffcc00"
                  emissiveIntensity={1.0}
                />
              </Box>
            </group>
            {/* 검신 중앙 불꽃 문양 */}
            <Box args={[0.03, 0.9, 0.04]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#ffcc00"
                metalness={0.8}
                roughness={0.2}
                emissive="#ffcc00"
                emissiveIntensity={0.9}
              />
            </Box>
          </group>
          {/* 손잡이 */}
          <Cylinder args={[0.035, 0.035, 0.45, 16]} position={[0, -0.25, 0]}>
            <meshStandardMaterial
              color="#330000"
              metalness={0.6}
              roughness={0.4}
              emissive="#ff3300"
              emissiveIntensity={0.2}
            />
          </Cylinder>
          {/* 가드 - 불꽃 날개 모양 */}
          <group position={[0, 0, 0]}>
            <Box
              args={[0.4, 0.08, 0.06]}
              position={[0, 0, 0]}
              rotation={[0, 0, Math.PI / 12]}
            >
              <meshStandardMaterial
                color="#cc3300"
                metalness={0.7}
                roughness={0.3}
                emissive="#ff3300"
                emissiveIntensity={0.4}
              />
            </Box>
            <Box
              args={[0.4, 0.08, 0.06]}
              position={[0, 0, 0]}
              rotation={[0, 0, -Math.PI / 12]}
            >
              <meshStandardMaterial
                color="#cc3300"
                metalness={0.7}
                roughness={0.3}
                emissive="#ff3300"
                emissiveIntensity={0.4}
              />
            </Box>
          </group>
          {/* 손잡이 끝 장식 - 불꽃 보석 */}
          <Sphere args={[0.06, 16, 16]} position={[0, -0.45, 0]}>
            <meshStandardMaterial
              color="#ff6600"
              emissive="#ff6600"
              emissiveIntensity={0.8}
              metalness={1.0}
              roughness={0.0}
            />
          </Sphere>
          {/* 가드 장식 - 불꽃 고리 */}
          <Torus
            args={[0.12, 0.02, 16, 32]}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial
              color="#ff9900"
              emissive="#ff9900"
              emissiveIntensity={0.7}
              metalness={0.8}
              roughness={0.2}
            />
          </Torus>
        </group>
      );
    case 4: // 마법검 - 신비한 에너지
      return (
        <group>
          {/* 검신 - 곡선형 */}
          <group position={[0, 0.55, 0]}>
            <Box
              args={[0.14, 1.2, 0.035]}
              position={[0, 0, 0]}
              rotation={[0, 0, 0.05]}
            >
              <meshStandardMaterial
                color="#9966cc"
                metalness={0.8}
                roughness={0.2}
                emissive="#6633cc"
                emissiveIntensity={0.5}
              />
            </Box>
            {/* 검 끝 부분 - 마법 결정체 */}
            <group position={[0, 0.65, 0]}>
              <Box
                args={[0.14, 0.15, 0.035]}
                position={[0, 0, 0]}
                rotation={[0, 0, Math.PI / 4]}
              >
                <meshStandardMaterial
                  color="#cc99ff"
                  metalness={0.9}
                  roughness={0.1}
                  emissive="#9966cc"
                  emissiveIntensity={0.7}
                />
              </Box>
              <Box
                args={[0.14, 0.15, 0.035]}
                position={[0, 0, 0]}
                rotation={[0, 0, -Math.PI / 4]}
              >
                <meshStandardMaterial
                  color="#cc99ff"
                  metalness={0.9}
                  roughness={0.1}
                  emissive="#9966cc"
                  emissiveIntensity={0.7}
                />
              </Box>
            </group>
            {/* 검신 중앙 마법 문양 */}
            <Box args={[0.03, 1.0, 0.04]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#cc99ff"
                metalness={0.9}
                roughness={0.1}
                emissive="#cc99ff"
                emissiveIntensity={0.8}
              />
            </Box>
          </group>
          {/* 손잡이 */}
          <Cylinder args={[0.04, 0.04, 0.5, 16]} position={[0, -0.3, 0]}>
            <meshStandardMaterial
              color="#330066"
              metalness={0.7}
              roughness={0.3}
              emissive="#6633cc"
              emissiveIntensity={0.3}
            />
          </Cylinder>
          {/* 가드 - 날개 모양 */}
          <group position={[0, 0, 0]}>
            <Box
              args={[0.45, 0.1, 0.05]}
              position={[0, 0, 0]}
              rotation={[0, 0, Math.PI / 12]}
            >
              <meshStandardMaterial
                color="#6633cc"
                metalness={0.8}
                roughness={0.2}
                emissive="#6633cc"
                emissiveIntensity={0.4}
              />
            </Box>
            <Box
              args={[0.45, 0.1, 0.05]}
              position={[0, 0, 0]}
              rotation={[0, 0, -Math.PI / 12]}
            >
              <meshStandardMaterial
                color="#6633cc"
                metalness={0.8}
                roughness={0.2}
                emissive="#6633cc"
                emissiveIntensity={0.4}
              />
            </Box>
          </group>
          {/* 손잡이 끝 장식 - 마법 보석 */}
          <Sphere args={[0.07, 16, 16]} position={[0, -0.55, 0]}>
            <meshStandardMaterial
              color="#9966cc"
              emissive="#9966cc"
              emissiveIntensity={0.9}
              metalness={1.0}
              roughness={0.0}
            />
          </Sphere>
          {/* 검신 장식 - 마법 문양 */}
          <group>
            <Torus
              args={[0.07, 0.01, 16, 32]}
              position={[0, 0.3, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial
                color="#cc99ff"
                emissive="#cc99ff"
                emissiveIntensity={0.9}
                metalness={0.9}
                roughness={0.1}
              />
            </Torus>
            <Torus
              args={[0.07, 0.01, 16, 32]}
              position={[0, 0.5, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial
                color="#cc99ff"
                emissive="#cc99ff"
                emissiveIntensity={0.9}
                metalness={0.9}
                roughness={0.1}
              />
            </Torus>
            <Torus
              args={[0.07, 0.01, 16, 32]}
              position={[0, 0.7, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial
                color="#cc99ff"
                emissive="#cc99ff"
                emissiveIntensity={0.9}
                metalness={0.9}
                roughness={0.1}
              />
            </Torus>
          </group>
        </group>
      );
    case 5: // 신화급 검 - 황금 대검
      return (
        <group>
          {/* 검신 - 넓은 대검 */}
          <group position={[0, 0.7, 0]}>
            <Box args={[0.2, 1.5, 0.04]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#ffcc33"
                metalness={1.0}
                roughness={0.0}
                emissive="#ffaa00"
                emissiveIntensity={0.6}
              />
            </Box>
            {/* 검 끝 부분 - 황금 화살촉 */}
            <group position={[0, 0.8, 0]}>
              <Box
                args={[0.2, 0.2, 0.04]}
                position={[0, 0, 0]}
                rotation={[0, 0, Math.PI / 4]}
              >
                <meshStandardMaterial
                  color="#ffdd55"
                  metalness={1.0}
                  roughness={0.0}
                  emissive="#ffcc33"
                  emissiveIntensity={0.8}
                />
              </Box>
              <Box
                args={[0.2, 0.2, 0.04]}
                position={[0, 0, 0]}
                rotation={[0, 0, -Math.PI / 4]}
              >
                <meshStandardMaterial
                  color="#ffdd55"
                  metalness={1.0}
                  roughness={0.0}
                  emissive="#ffcc33"
                  emissiveIntensity={0.8}
                />
              </Box>
            </group>
            {/* 검신 중앙 황금 문양 */}
            <Box args={[0.05, 1.3, 0.05]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#ffffff"
                metalness={1.0}
                roughness={0.0}
                emissive="#ffffff"
                emissiveIntensity={0.9}
              />
            </Box>
          </group>
          {/* 손잡이 */}
          <Cylinder args={[0.05, 0.05, 0.6, 16]} position={[0, -0.35, 0]}>
            <meshStandardMaterial
              color="#cc9900"
              metalness={0.9}
              roughness={0.1}
              emissive="#ffaa00"
              emissiveIntensity={0.5}
            />
          </Cylinder>
          {/* 가드 - 화려한 장식 */}
          <group position={[0, 0, 0]}>
            <Box args={[0.5, 0.15, 0.1]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#cc9900"
                metalness={1.0}
                roughness={0.0}
                emissive="#ffaa00"
                emissiveIntensity={0.6}
              />
            </Box>
            <Torus
              args={[0.15, 0.03, 16, 32]}
              position={[0.2, 0, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial
                color="#ffcc33"
                emissive="#ffcc33"
                emissiveIntensity={0.9}
                metalness={1.0}
                roughness={0.0}
              />
            </Torus>
            <Torus
              args={[0.15, 0.03, 16, 32]}
              position={[-0.2, 0, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial
                color="#ffcc33"
                emissive="#ffcc33"
                emissiveIntensity={0.9}
                metalness={1.0}
                roughness={0.0}
              />
            </Torus>
          </group>
          {/* 손잡이 끝 장식 - 황금 보석 */}
          <Sphere args={[0.08, 16, 16]} position={[0, -0.65, 0]}>
            <meshStandardMaterial
              color="#ffcc33"
              emissive="#ffcc33"
              emissiveIntensity={1.2}
              metalness={1.0}
              roughness={0.0}
            />
          </Sphere>
          {/* 검신 장식 - 황금 보석 */}
          <Sphere args={[0.05, 16, 16]} position={[0, 1.3, 0]}>
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={1.5}
              metalness={1.0}
              roughness={0.0}
            />
          </Sphere>
        </group>
      );
    default:
      return (
        <group>
          <Box args={[0.1, 0.5, 0.02]} position={[0, 0.3, 0]}>
            <meshStandardMaterial color="#888888" />
          </Box>
          <Cylinder args={[0.02, 0.02, 0.3, 16]} position={[0, -0.2, 0]}>
            <meshStandardMaterial color="#555555" />
          </Cylinder>
        </group>
      );
  }
}

/**
 * 모델 로딩 오류 시 폴백 컴포넌트
 */
function FallbackSwordModel() {
  return (
    <group>
      {/* 검신 */}
      <Box args={[0.1, 0.5, 0.02]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#888888" />
      </Box>
      {/* 손잡이 */}
      <Cylinder
        args={[0.02, 0.02, 0.3, 16]}
        position={[0, -0.4, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#555555" />
      </Cylinder>
    </group>
  );
}

/**
 * 검 이펙트 컴포넌트 - 검 단계에 따른 시각적 효과 적용
 */
function SwordEffects({
  sword,
  modelRef,
  isEvolving,
}: {
  sword: Sword;
  modelRef: React.RefObject<Group | null>;
  isEvolving?: boolean;
}) {
  // 애니메이션 효과
  useFrame((state) => {
    if (!modelRef.current) return;

    // 진화 중일 때 빠르게 회전
    if (isEvolving) {
      modelRef.current.rotation.y += 0.15;
      // 위아래로 움직임
      modelRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 8) * 0.15;
      // 크기 변화
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 12) * 0.15;
      modelRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
    // 일반 상태일 때 단계에 따른 효과
    else if (sword.stage >= 3) {
      // 3단계 이상일 때 미세하게 위아래로 움직임
      modelRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 2) * 0.05;

      // 4단계 이상일 때 미세하게 회전
      if (sword.stage >= 4) {
        modelRef.current.rotation.y += 0.005;
      }

      // 5단계일 때 크기 변화
      if (sword.stage >= 5) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.03;
        modelRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  // 파츠 효과 색상 계산
  const getPartsEffectColor = () => {
    // 파츠 효과 색상 계산
    let effectColor = 0xffffff;

    // 검신 효과
    if (sword.parts.blade?.includes("blade-2")) {
      effectColor = 0x3366aa; // 푸른색
    }

    // 가드 효과
    if (sword.parts.guard?.includes("guard-2")) {
      effectColor = 0xff6600; // 주황색
    }

    // 손잡이 효과
    if (sword.parts.handle?.includes("handle-2")) {
      effectColor = 0x6633cc; // 보라색
    }

    // 보석 효과
    if (sword.parts.gem?.includes("gem-2")) {
      effectColor = 0xffcc33; // 황금색
    }

    return effectColor;
  };

  // 단계별 이펙트 색상
  const getEffectColor = () => {
    if (isEvolving) {
      // 진화 중일 때는 흰색과 황금색이 번갈아 나타나는 효과
      return Math.sin(Date.now() * 0.005) > 0 ? 0xffffff : 0xffcc33;
    }

    switch (sword.stage) {
      case 2:
        return 0x3366aa; // 푸른색
      case 3:
        return 0xff6600; // 주황색
      case 4:
        return 0x6633cc; // 보라색
      case 5:
        return 0xffcc33; // 황금색
      default:
        return getPartsEffectColor(); // 파츠 효과 색상
    }
  };

  // 단계별 이펙트 강도
  const getEffectIntensity = () => {
    if (isEvolving) return 3;

    // 파츠 효과 강도 계산
    let partsIntensity = 0;
    if (sword.parts.blade?.includes("blade-2")) partsIntensity += 0.5;
    if (sword.parts.guard?.includes("guard-2")) partsIntensity += 0.5;
    if (sword.parts.handle?.includes("handle-2")) partsIntensity += 0.5;
    if (sword.parts.gem?.includes("gem-2")) partsIntensity += 0.5;

    // 단계 효과와 파츠 효과 합산
    return sword.stage * 0.5 + partsIntensity;
  };

  // 파츠 효과 여부 확인
  const hasPartsEffect = () => {
    return (
      sword.parts.blade?.includes("blade-2") ||
      sword.parts.guard?.includes("guard-2") ||
      sword.parts.handle?.includes("handle-2") ||
      sword.parts.gem?.includes("gem-2")
    );
  };

  return (
    <>
      {/* 검 주변 이펙트 (단계에 따라 다른 이펙트 적용) */}
      {(sword.stage >= 2 || hasPartsEffect() || isEvolving) && (
        <pointLight
          position={[0, 0, 0]}
          intensity={getEffectIntensity()}
          distance={3}
          color={getEffectColor()}
        />
      )}

      {/* 진화 중일 때 추가 이펙트 */}
      {isEvolving && (
        <>
          <pointLight
            position={[0, 0.5, 0]}
            intensity={4}
            distance={2}
            color={0xffffff}
          />
          <pointLight
            position={[0, -0.5, 0]}
            intensity={4}
            distance={2}
            color={0xffffff}
          />
          {/* 진화 중 에너지 파티클 효과 */}
          <group>
            {[...Array(8)].map((_, i) => (
              <Sphere
                key={i}
                args={[0.05, 8, 8]}
                position={[
                  Math.sin(Date.now() * 0.001 + i) * 0.8,
                  Math.cos(Date.now() * 0.001 + i) * 0.8,
                  Math.sin(Date.now() * 0.002 + i) * 0.8,
                ]}
              >
                <meshBasicMaterial
                  color={i % 2 === 0 ? 0xffffff : 0xffcc33}
                  transparent
                  opacity={0.8}
                />
              </Sphere>
            ))}
          </group>
        </>
      )}

      {/* 파츠 효과 */}
      {hasPartsEffect() && !isEvolving && (
        <group>
          {/* 검신 효과 */}
          {sword.parts.blade?.includes("blade-2") && (
            <pointLight
              position={[0, 0.5, 0]}
              intensity={1.5}
              distance={1.5}
              color={0x3366aa}
            />
          )}

          {/* 가드 효과 */}
          {sword.parts.guard?.includes("guard-2") && (
            <pointLight
              position={[0, 0, 0]}
              intensity={1.5}
              distance={1.5}
              color={0xff6600}
            />
          )}

          {/* 손잡이 효과 */}
          {sword.parts.handle?.includes("handle-2") && (
            <pointLight
              position={[0, -0.3, 0]}
              intensity={1.5}
              distance={1.5}
              color={0x6633cc}
            />
          )}

          {/* 보석 효과 */}
          {sword.parts.gem?.includes("gem-2") && (
            <>
              <pointLight
                position={[0, -0.5, 0]}
                intensity={1.5}
                distance={1.5}
                color={0xffcc33}
              />
              {/* 보석 파티클 효과 */}
              {[...Array(4)].map((_, i) => (
                <Sphere
                  key={i}
                  args={[0.03, 8, 8]}
                  position={[
                    Math.sin(Date.now() * 0.0005 + (i * Math.PI) / 2) * 0.3,
                    -0.5 +
                      Math.cos(Date.now() * 0.0005 + (i * Math.PI) / 2) * 0.1,
                    Math.sin(Date.now() * 0.001 + (i * Math.PI) / 2) * 0.3,
                  ]}
                >
                  <meshBasicMaterial
                    color={0xffcc33}
                    transparent
                    opacity={0.6}
                  />
                </Sphere>
              ))}
            </>
          )}
        </group>
      )}
    </>
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
  const modelRef = useRef<Group>(null);
  const [evolutionProgress, setEvolutionProgress] = useState(0);
  const [displayStage, setDisplayStage] = useState(sword.stage);

  // 진화 중일 때 진행 상태 업데이트
  useEffect(() => {
    if (isEvolving) {
      setEvolutionProgress(0);
      const interval = setInterval(() => {
        setEvolutionProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 60);

      return () => clearInterval(interval);
    }
  }, [isEvolving]);

  // 검 단계 변경 시 표시 단계 업데이트
  useEffect(() => {
    if (!isEvolving) {
      setDisplayStage(sword.stage);
    }
  }, [sword.stage, isEvolving]);

  // 검 단계에 따른 이펙트 설정
  useEffect(() => {
    if (!modelRef.current) return;

    // 검 모델의 모든 메시를 찾아서 단계에 따라 이펙트 적용
    modelRef.current.traverse((child) => {
      if (
        child instanceof Mesh &&
        child.material instanceof MeshStandardMaterial
      ) {
        // 단계에 따라 발광 효과 증가
        if (sword.stage >= 2) {
          child.material.emissive.set(0x0088ff);
          child.material.emissiveIntensity = 0.2 * (sword.stage - 1);
        }
      }
    });
  }, [sword.stage]);

  //   if (hasError) {
  //     return <FallbackSwordModel />;
  //   }

  // 검 이름에 따라 기본 모델 결정
  const getBaseModelFromName = (name: string): number => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("숏소드")) return 1;
    if (lowerName.includes("롱소드")) return 2;
    if (lowerName.includes("화염검")) return 3;
    if (lowerName.includes("마법검")) return 4;
    if (lowerName.includes("대검")) return 5;
    return displayStage;
  };

  // 검 이름에 따라 기본 모델 결정 (단계가 1일 때만)
  const modelStage =
    displayStage === 1 ? getBaseModelFromName(sword.name) : displayStage;

  // 커스텀 모델 사용
  return (
    <group ref={modelRef}>
      {getSwordModel(modelStage)}
      <SwordEffects sword={sword} modelRef={modelRef} isEvolving={isEvolving} />

      {/* 진화 중일 때 진행 상태 표시 */}
      {isEvolving && (
        <Html position={[0, -1.5, 0]} center>
          <div className="w-32 bg-white bg-opacity-30 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-100"
              style={{ width: `${evolutionProgress}%` }}
            />
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * 조명 컴포넌트
 */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.3}
        color="#ffffff"
      />
    </>
  );
}

/**
 * 메인 검 모델 컴포넌트
 */
export function SwordModel({
  sword,
  autoRotate = false,
  enableZoom = true,
  enablePan = false,
  isEvolving = false,
}: SwordModelProps) {
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 서버 사이드 렌더링 시 빈 컴포넌트 반환
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* 카메라 컨트롤 */}
      <OrbitControls
        enableZoom={enableZoom}
        enablePan={enablePan}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
      />

      {/* 조명 */}
      <Lighting />

      {/* 모델 로딩 */}
      <Suspense fallback={<FallbackSwordModel />}>
        <ModelLoader sword={sword} isEvolving={isEvolving} />
      </Suspense>
    </>
  );
}
