"use client";

import { Part, PartType, Sword } from "@/shared/api/types";
import { getPartTypeName } from "../lib/sword-utils";
import { PartList } from "@/entities/part/ui/part-list";

interface SwordPartSelectorProps {
  sword: Sword;
  parts: Part[];
  selectedPartType: PartType | null;
  onSelectPartType: (partType: PartType | null) => void;
  onSelectPart: (part: Part) => void;
  nextPartTypeGuide?: PartType | null;
}

export function SwordPartSelector({
  sword,
  parts,
  selectedPartType,
  onSelectPartType,
  onSelectPart,
  nextPartTypeGuide,
}: SwordPartSelectorProps) {
  // 파츠 타입 목록
  const partTypes: PartType[] = ["blade", "guard", "handle", "gem"];

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h3 className="mb-4 text-xl font-bold text-center text-gray-800">
        파츠 교체
      </h3>

      {/* 파츠 타입 선택 탭 */}
      <div className="flex mb-4 space-x-1 overflow-x-auto">
        {partTypes.map((type) => (
          <button
            key={type}
            className={`
              px-3 py-2 text-sm font-medium rounded-lg flex-1 min-w-[80px] transition-colors
              ${
                selectedPartType === type
                  ? "bg-blue-500 text-white"
                  : nextPartTypeGuide === type
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
            onClick={() =>
              onSelectPartType(selectedPartType === type ? null : type)
            }
          >
            {getPartTypeName(type)}
            {nextPartTypeGuide === type && (
              <span className="ml-1 text-xs">▶</span>
            )}
          </button>
        ))}
      </div>

      {/* 선택된 파츠 타입에 따른 파츠 목록 */}
      {selectedPartType && (
        <PartList
          parts={parts}
          selectedPartId={sword.parts[selectedPartType]}
          partType={selectedPartType}
          currentStage={sword.stage}
          onSelectPart={onSelectPart}
        />
      )}

      {/* 파츠 타입이 선택되지 않았을 때 안내 메시지 */}
      {!selectedPartType && (
        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
          {nextPartTypeGuide
            ? `다음 단계: ${getPartTypeName(nextPartTypeGuide)}을(를) 선택하세요.`
            : "교체할 파츠 타입을 선택하세요."}
        </div>
      )}
    </div>
  );
}
