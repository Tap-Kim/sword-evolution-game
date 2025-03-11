"use client";

import { useState } from "react";
import { useSwordStore } from "@/lib/store/swordStore";
import { PartType } from "@/lib/types/schema";

interface PartSelectorProps {
  partType: PartType;
  onSelect?: (partId: string) => void;
}

export function PartSelector({ partType, onSelect }: PartSelectorProps) {
  const { currentSword, availableParts, changePart, isLoading } =
    useSwordStore();
  const [isChanging, setIsChanging] = useState(false);

  if (!currentSword) {
    return (
      <div className="p-4 text-center text-gray-500">
        검을 먼저 선택해주세요.
      </div>
    );
  }

  // 현재 파츠 타입에 맞는 파츠만 필터링
  const filteredParts = availableParts.filter((part) => part.type === partType);

  // 현재 장착된 파츠 ID
  const currentPartId = currentSword.parts[partType];

  // 파츠 타입에 따른 표시 이름
  const getPartTypeName = () => {
    switch (partType) {
      case "blade":
        return "검신";
      case "guard":
        return "가드";
      case "handle":
        return "손잡이";
      case "gem":
        return "보석";
      default:
        return "파츠";
    }
  };

  // 파츠 변경 처리
  const handlePartChange = async (partId: string) => {
    if (isLoading || isChanging) return;

    setIsChanging(true);

    try {
      await changePart(partType, partId);

      // 파츠 변경 애니메이션 효과 (1초 후 완료)
      setTimeout(() => {
        setIsChanging(false);
        if (onSelect) {
          onSelect(partId);
        }
      }, 1000);
    } catch {
      setIsChanging(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-2">{getPartTypeName()} 선택</h3>

      {filteredParts.length === 0 ? (
        <p className="text-sm text-gray-500">
          사용 가능한 {getPartTypeName()}이(가) 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {filteredParts.map((part) => (
            <div
              key={part.id}
              onClick={() => handlePartChange(part.id)}
              className={`
                p-3 rounded-md cursor-pointer transition-all
                ${
                  currentPartId === part.id
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-white hover:bg-gray-50 border border-gray-200"
                }
                ${
                  isLoading || isChanging ? "opacity-50 cursor-not-allowed" : ""
                }
              `}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                  {/* 실제로는 파츠 이미지 표시 */}
                  <span className="text-xs">
                    {part.type.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{part.name}</h4>
                  <div className="flex space-x-1 mt-1">
                    {part.statsEffect.attack > 0 && (
                      <span className="text-xs px-1 bg-red-100 text-red-700 rounded">
                        공격 +{part.statsEffect.attack}
                      </span>
                    )}
                    {part.statsEffect.defense > 0 && (
                      <span className="text-xs px-1 bg-blue-100 text-blue-700 rounded">
                        방어 +{part.statsEffect.defense}
                      </span>
                    )}
                    {part.statsEffect.magic > 0 && (
                      <span className="text-xs px-1 bg-purple-100 text-purple-700 rounded">
                        마법 +{part.statsEffect.magic}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
