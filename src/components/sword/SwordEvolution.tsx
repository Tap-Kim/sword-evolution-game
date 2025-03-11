"use client";

import { useState } from "react";
import { Sword } from "@/lib/types/schema";

interface SwordEvolutionProps {
  sword?: Sword;
  onEvolve?: (sword: Sword) => void;
}

/**
 * 검 진화 정보를 가져오는 함수
 */
function getStageInfo(stage: number) {
  const stages = [
    {
      name: "기본 검",
      description: "평범한 검입니다.",
      color: "#888888",
      textColor: "#ffffff",
      buttonColor: "bg-gray-500 hover:bg-gray-600",
    },
    {
      name: "강화된 검",
      description: "기본적인 강화가 된 검입니다.",
      color: "#3366aa",
      textColor: "#e6f0ff",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "화염의 검",
      description: "불꽃의 힘이 깃든 검입니다.",
      color: "#ff6600",
      textColor: "#fff3e6",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
    },
    {
      name: "마법의 검",
      description: "마법의 힘이 깃든 검입니다.",
      color: "#6633cc",
      textColor: "#f0e6ff",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
    },
    {
      name: "전설의 검",
      description: "전설적인 힘을 가진 검입니다.",
      color: "#ffcc33",
      textColor: "#fff9e6",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    },
  ];

  return stages[stage] || stages[0];
}

/**
 * 파츠 정보를 가져오는 함수
 */
function getPartInfo(partType: string, partId: string | undefined) {
  if (!partId)
    return {
      name: "없음",
      description: "장착된 파츠가 없습니다.",
      color: "#888888",
    };

  const parts: Record<
    string,
    Record<string, { name: string; description: string; color: string }>
  > = {
    blade: {
      "blade-1": {
        name: "기본 검날",
        description: "평범한 검날입니다.",
        color: "#888888",
      },
      "blade-2": {
        name: "강화된 검날",
        description: "강화된 검날로 더 날카롭습니다.",
        color: "#3366aa",
      },
    },
    guard: {
      "guard-1": {
        name: "기본 가드",
        description: "평범한 가드입니다.",
        color: "#888888",
      },
      "guard-2": {
        name: "강화된 가드",
        description: "강화된 가드로 더 튼튼합니다.",
        color: "#ff6600",
      },
    },
    handle: {
      "handle-1": {
        name: "기본 손잡이",
        description: "평범한 손잡이입니다.",
        color: "#888888",
      },
      "handle-2": {
        name: "강화된 손잡이",
        description: "강화된 손잡이로 더 편안합니다.",
        color: "#6633cc",
      },
    },
    gem: {
      "gem-1": {
        name: "기본 보석",
        description: "평범한 보석입니다.",
        color: "#888888",
      },
      "gem-2": {
        name: "강화된 보석",
        description: "강화된 보석으로 더 빛납니다.",
        color: "#ffcc33",
      },
    },
  };

  return (
    parts[partType]?.[partId] || {
      name: "알 수 없음",
      description: "알 수 없는 파츠입니다.",
      color: "#888888",
    }
  );
}

export function SwordEvolution({ sword, onEvolve }: SwordEvolutionProps) {
  const [isEvolving, setIsEvolving] = useState(false);
  const stageInfo = getStageInfo(sword?.stage || 0);
  const maxStage = 5;

  if (!sword) {
    return <div>검 데이터를 불러오는 중...</div>;
  }

  // 진화 가능 여부 확인
  const canEvolve = !isEvolving && sword.stage < maxStage;

  // 진화 처리
  const handleEvolve = () => {
    if (!canEvolve) return;

    setIsEvolving(true);

    // 진화 애니메이션 효과를 위한 타임아웃
    setTimeout(() => {
      setIsEvolving(false);
      if (onEvolve) {
        onEvolve(sword);
      }
    }, 3000);
  };

  // 파츠 업그레이드 여부 확인
  const hasUpgradedParts = () => {
    return (
      sword.parts.blade?.includes("blade-2") ||
      sword.parts.guard?.includes("guard-2") ||
      sword.parts.handle?.includes("handle-2") ||
      sword.parts.gem?.includes("gem-2")
    );
  };

  // 파츠 정보 표시
  const renderPartInfo = (partType: string, partId: string | undefined) => {
    const partInfo = getPartInfo(partType, partId);

    return (
      <div className="mb-2">
        <div className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: partInfo.color }}
          ></div>
          <span className="font-medium">{partInfo.name}</span>
        </div>
        <p className="text-xs text-gray-500 ml-5">{partInfo.description}</p>
      </div>
    );
  };

  return (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-5 w-full max-w-md">
      <h2 className="text-xl font-bold mb-3" style={{ color: stageInfo.color }}>
        {stageInfo.name} (레벨 {sword.stage + 1})
      </h2>
      <p className="text-gray-600 mb-4">{stageInfo.description}</p>

      {/* 진화 진행 바 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>진화 진행도</span>
          <span>
            {sword.stage} / {maxStage}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${(sword.stage / maxStage) * 100}%`,
              backgroundColor: stageInfo.color,
            }}
          ></div>
        </div>
      </div>

      {/* 파츠 정보 */}
      <div className="mb-4 bg-gray-50 p-3 rounded-md">
        <h3 className="text-md font-semibold mb-2">장착된 파츠</h3>
        {renderPartInfo("blade", sword.parts.blade)}
        {renderPartInfo("guard", sword.parts.guard)}
        {renderPartInfo("handle", sword.parts.handle)}
        {renderPartInfo("gem", sword.parts.gem)}

        {hasUpgradedParts() && (
          <div className="mt-3 text-sm text-blue-600 bg-blue-50 p-2 rounded">
            <span className="font-medium">✨ 강화된 파츠 효과:</span> 검의
            외형과 능력치가 향상됩니다.
          </div>
        )}
      </div>

      {/* 진화 버튼 */}
      <button
        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-all ${
          sword.stage >= maxStage
            ? "bg-gray-400 cursor-not-allowed"
            : isEvolving
              ? "bg-yellow-500 cursor-wait"
              : stageInfo.buttonColor
        }`}
        onClick={handleEvolve}
        disabled={sword.stage >= maxStage || isEvolving}
      >
        {sword.stage >= maxStage
          ? "최대 단계 도달"
          : isEvolving
            ? "진화 중..."
            : "검 진화하기"}
      </button>
    </div>
  );
}
