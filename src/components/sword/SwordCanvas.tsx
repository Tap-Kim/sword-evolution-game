"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ContactShadows,
  useProgress,
  Html,
} from "@react-three/drei";
import { SwordModel } from "./SwordModel";
import { Sword } from "@/lib/types/schema";

// 타입 정의
interface SwordCanvasProps {
  sword: Sword;
  width?: string;
  height?: string;
  background?: string;
  autoRotate?: boolean;
  showEnvironment?: boolean;
  showShadow?: boolean;
}

/**
 * 로딩 컴포넌트 - 모델 로딩 중 표시
 */
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-medium text-gray-600">
          {progress.toFixed(0)}% 로딩 중
        </p>
      </div>
    </Html>
  );
}

/**
 * 환경 및 그림자 컴포넌트
 */
function SceneEnvironment({
  showEnvironment,
  showShadow,
}: {
  showEnvironment: boolean;
  showShadow: boolean;
}) {
  return (
    <>
      {/* 환경 조명 */}
      {showEnvironment && <Environment preset="sunset" />}

      {/* 그림자 */}
      {showShadow && (
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
          color="#000000"
        />
      )}
    </>
  );
}

/**
 * 검 장면 컴포넌트 - 실제 3D 장면 구성
 */
function SwordScene({
  sword,
  autoRotate,
  showEnvironment,
  showShadow,
  isEvolving,
}: {
  sword: Sword;
  autoRotate: boolean;
  showEnvironment: boolean;
  showShadow: boolean;
  isEvolving?: boolean;
}) {
  return (
    <Suspense fallback={<Loader />}>
      {/* 오빗 컨트롤 (드래그로 회전) */}
      <OrbitControls
        enableZoom
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />

      {/* 검 모델 */}
      <SwordModel
        sword={sword}
        autoRotate={autoRotate}
        isEvolving={isEvolving}
      />

      {/* 환경 및 그림자 */}
      <SceneEnvironment
        showEnvironment={showEnvironment}
        showShadow={showShadow}
      />
    </Suspense>
  );
}

/**
 * 검 캔버스 컴포넌트 - 3D 검 모델을 표시하는 메인 컴포넌트
 */
export function SwordCanvas({
  sword,
  width = "100%",
  height = "100%",
  background = "linear-gradient(135deg, #e0f2ff 0%, #c7d8f0 50%, #a8c0e0 100%)",
  autoRotate = false,
  showEnvironment = true,
  showShadow = true,
  isEvolving = false,
}: SwordCanvasProps & { isEvolving?: boolean }) {
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        borderRadius: "0.75rem",
        overflow: "hidden",
        background,
      }}
      className="shadow-lg"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} shadows>
        <SwordScene
          sword={sword}
          autoRotate={autoRotate}
          showEnvironment={showEnvironment}
          showShadow={showShadow}
          isEvolving={isEvolving}
        />
      </Canvas>
    </div>
  );
}
