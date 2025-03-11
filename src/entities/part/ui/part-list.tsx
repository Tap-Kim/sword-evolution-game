"use client";

import { Part, PartType } from "@/shared/api/types";
import { PartCard } from "./part-card";
import { filterPartsByType, isPartUnlocked } from "../lib/part-utils";
import { getPartTypeName } from "@/entities/sword/lib/sword-utils";

interface PartListProps {
  parts: Part[];
  selectedPartId?: string;
  partType: PartType;
  currentStage: number;
  onSelectPart: (part: Part) => void;
}

export function PartList({
  parts,
  selectedPartId,
  partType,
  currentStage,
  onSelectPart,
}: PartListProps) {
  // 현재 타입에 맞는 파츠만 필터링
  const filteredParts = filterPartsByType(parts, partType);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {getPartTypeName(partType)} 선택
      </h3>

      {filteredParts.length === 0 ? (
        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
          사용 가능한 {getPartTypeName(partType)}이(가) 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {filteredParts.map((part) => {
            const unlocked = isPartUnlocked(part, currentStage);

            return (
              <PartCard
                key={part.id}
                part={part}
                isSelected={part.id === selectedPartId}
                isUnlocked={unlocked}
                onClick={() => unlocked && onSelectPart(part)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
