"use client";

import { Part } from "@/shared/api/types";
import { getPartTypeColor } from "../lib/part-utils";
import { getPartTypeName } from "@/entities/sword/lib/sword-utils";

interface PartCardProps {
  part: Part;
  isSelected?: boolean;
  isUnlocked?: boolean;
  onClick?: () => void;
}

export function PartCard({
  part,
  isSelected = false,
  isUnlocked = true,
  onClick,
}: PartCardProps) {
  const typeColorClass = getPartTypeColor(part.type);

  return (
    <div
      className={`
        relative p-3 bg-white border rounded-lg shadow-sm transition-all duration-300
        ${isSelected ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200 hover:border-blue-300"}
        ${isUnlocked ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
      `}
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* 파츠 타입 배지 */}
      <div
        className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${typeColorClass}`}
      >
        {getPartTypeName(part.type)}
      </div>

      {/* 파츠 이름 */}
      <h4 className="mt-1 mb-2 text-lg font-semibold text-gray-800">
        {part.name}
      </h4>

      {/* 파츠 설명 */}
      <p className="text-sm text-gray-600">{part.description}</p>

      {/* 파츠 스탯 효과 */}
      <div className="mt-2 space-y-1">
        {part.statsEffect.attack > 0 && (
          <div className="text-sm text-red-600">
            공격력 +{part.statsEffect.attack}
          </div>
        )}
        {part.statsEffect.defense > 0 && (
          <div className="text-sm text-blue-600">
            방어력 +{part.statsEffect.defense}
          </div>
        )}
        {part.statsEffect.magic > 0 && (
          <div className="text-sm text-purple-600">
            마법력 +{part.statsEffect.magic}
          </div>
        )}
      </div>

      {/* 잠금 표시 */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
          <div className="p-2 text-sm font-medium text-white bg-gray-800 rounded">
            {part.unlockCondition?.stage
              ? `${part.unlockCondition.stage}단계 필요`
              : "잠김"}
          </div>
        </div>
      )}

      {/* 선택 표시 */}
      {isSelected && (
        <div className="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
