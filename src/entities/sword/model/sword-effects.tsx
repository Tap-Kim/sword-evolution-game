"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Trail, Float, Stars } from "@react-three/drei";
import { Group } from "three";
import { Sword } from "@/shared/api/types";

/**
 * 검 이펙트 컴포넌트 - 검 단계에 따른 시각적 효과 적용
 */
export function SwordEffects({
  sword,
  modelRef,
  isEvolving,
}: {
  sword: Sword;
  modelRef: React.RefObject<Group | null>;
  isEvolving?: boolean;
}) {
  const particlesRef = useRef<Group>(null);
  const glowRef = useRef<Group>(null);

  // 검 단계에 따른 효과 색상 및 강도 결정
  const { color, intensity, particleCount, particleSize } = useMemo(() => {
    let color = "#888888";
    let intensity = 1.0;
    let particleCount = 20;
    let particleSize = 0.5;

    // 단계별 색상 및 효과 설정
    if (sword.stage <= 1) {
      // 기본 검 - 회색 효과
      color = "#888888";
      intensity = isEvolving ? 1.5 : 0.8;
      particleCount = isEvolving ? 50 : 20;
    } else if (sword.stage === 2) {
      // 2단계 - 금색 효과
      color = "#FFD700";
      intensity = isEvolving ? 2.0 : 1.2;
      particleCount = isEvolving ? 80 : 30;
      particleSize = 0.6;
    } else if (sword.stage === 3) {
      // 3단계 - 녹색 불꽃 효과
      color = "#00FF88";
      intensity = isEvolving ? 2.5 : 1.5;
      particleCount = isEvolving ? 100 : 40;
      particleSize = 0.7;
    } else {
      // 4-5단계 - 푸른 크리스탈 효과
      color = "#00AAFF";
      intensity = isEvolving ? 3.0 : 1.8;
      particleCount = isEvolving ? 150 : 60;
      particleSize = 0.8;
    }

    // 진화 중일 때 효과 강화
    if (isEvolving) {
      intensity *= 1.5;
      particleSize *= 1.3;
    }

    return { color, intensity, particleCount, particleSize };
  }, [sword.stage, isEvolving]);

  // 애니메이션 효과
  useFrame((state) => {
    if (!modelRef.current) return;

    const time = state.clock.getElapsedTime();

    if (particlesRef.current) {
      // 파티클 회전 효과
      particlesRef.current.rotation.y = time * 0.2;

      if (isEvolving) {
        // 진화 중 파티클 효과 강화
        particlesRef.current.rotation.y = time * 0.5;
        particlesRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
      }
    }

    if (glowRef.current) {
      // 빛나는 효과 애니메이션
      glowRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.2);

      if (isEvolving) {
        // 진화 중 빛 효과 강화
        glowRef.current.scale.setScalar(1.2 + Math.sin(time * 4) * 0.4);
      }
    }
  });

  // 효과 표시 여부
  const shouldShowEffects = sword.stage >= 2 || isEvolving;

  // 효과가 없으면 렌더링하지 않음
  if (!shouldShowEffects) return null;

  return (
    <>
      {/* 기본 파티클 효과 */}
      <group ref={particlesRef}>
        <Sparkles
          count={particleCount}
          scale={3}
          size={particleSize}
          speed={0.3}
          color={color}
          opacity={isEvolving ? 0.8 : 0.5}
        />
      </group>

      {/* 검 주변 빛나는 효과 */}
      <group ref={glowRef}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.15 * intensity}
            />
          </mesh>
        </Float>
      </group>

      {/* 단계별 특수 효과 */}
      {sword.stage >= 2 && (
        <Trail
          width={0.5}
          length={8}
          color={color}
          attenuation={(width) => width * width}
        >
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </Trail>
      )}

      {/* 진화 중일 때만 나타나는 효과 */}
      {isEvolving && (
        <>
          {/* 별 효과 */}
          <Stars
            radius={20}
            depth={50}
            count={500}
            factor={4}
            saturation={1}
            fade
            speed={2}
          />

          {/* 추가 파티클 효과 */}
          <Sparkles
            count={200}
            scale={8}
            size={1.5}
            speed={1}
            color={sword.stage >= 3 ? "#FFFFFF" : color}
            opacity={0.7}
          />

          {/* 진화 빛 효과 */}
          <pointLight
            position={[0, 0, 0]}
            intensity={intensity * 2}
            color={color}
            distance={10}
          />

          {/* 고급 단계 추가 효과 */}
          {sword.stage >= 3 && (
            <>
              <Trail
                width={1}
                length={10}
                color={"#FFFFFF"}
                attenuation={(width) => width * width}
              >
                <mesh position={[0, 0, 0]}>
                  <sphereGeometry args={[0.2, 8, 8]} />
                  <meshBasicMaterial color={"#FFFFFF"} />
                </mesh>
              </Trail>

              {/* 최고 단계 특수 효과 */}
              {sword.stage >= 4 && (
                <Float speed={5} rotationIntensity={2} floatIntensity={2}>
                  <mesh>
                    <torusGeometry args={[1.5, 0.2, 16, 32]} />
                    <meshBasicMaterial
                      color={"#00FFFF"}
                      transparent
                      opacity={0.3}
                    />
                  </mesh>
                </Float>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
