"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Sword } from "@/shared/api/types";
import { SwordModel } from "../model/sword-model";

/**
 * 검 캔버스 컴포넌트 - 3D 검 모델을 렌더링
 */
interface SwordCanvasProps {
  sword: Sword;
  height?: string;
  autoRotate?: boolean;
  background?: string;
  showEnvironment?: boolean;
  showShadow?: boolean;
  isEvolving?: boolean;
  isPartSelectionActive?: boolean; // 파츠 교체 영역 활성화 여부
}

/**
 * 검 캔버스 컴포넌트
 */
export function SwordCanvas({
  sword,
  height = "400px",
  autoRotate = true,
  background = "linear-gradient(135deg, #e0f2ff 0%, #c7d8f0 50%, #a8c0e0 100%)",
  showEnvironment = true,
  showShadow = true,
  isEvolving = false,
  isPartSelectionActive = false, // 파츠 교체 영역 활성화 여부
}: SwordCanvasProps) {
  // 파츠 교체 영역이 활성화되면 캔버스 높이를 더 크게 설정
  const canvasHeight = isPartSelectionActive ? "100%" : height;

  return (
    <div
      style={{
        width: "100%",
        height: canvasHeight,
        background,
        borderRadius: "12px",
        overflow: "hidden",
        transition: "height 0.3s ease-in-out", // 높이 변경 시 부드러운 전환 효과
      }}
    >
      <Canvas
        shadows={showShadow}
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true }}
      >
        <SwordModel
          sword={sword}
          autoRotate={autoRotate}
          enableZoom={true}
          enablePan={false}
          isEvolving={isEvolving}
        />

        {showEnvironment && <Environment preset="sunset" />}
      </Canvas>
    </div>
  );
}
