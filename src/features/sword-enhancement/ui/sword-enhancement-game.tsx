"use client";

import { useState, useEffect } from "react";
import { Part, PartType, Sword } from "@/shared/api/types";
import dynamic from "next/dynamic";
import { SwordStats } from "@/entities/sword/ui/sword-stats";
import { SwordPartSelector } from "@/entities/sword/ui/sword-part-selector";
import { StepPreview } from "./step-preview";
import {
  getUpdatedSwordName,
  getCanvasHeight,
  getPartTypeName,
} from "@/entities/sword/lib/sword-utils";

// SwordCanvas를 동적으로 임포트 (클라이언트 사이드에서만 렌더링)
const SwordCanvas = dynamic(
  () =>
    import("@/entities/sword/ui/sword-canvas").then((mod) => mod.SwordCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">검 모델 로딩 중...</p>
        </div>
      </div>
    ),
  }
);

// SwordEvolutionModal을 동적으로 임포트
const SwordEvolutionModal = dynamic(
  () =>
    import("@/features/sword-evolution/ui/sword-evolution-modal").then(
      (mod) => mod.SwordEvolutionModal
    ),
  {
    ssr: false,
    loading: () => <div className="hidden">모달 로딩 중...</div>,
  }
);

export function SwordEnhancementGame() {
  // 초기 파츠 데이터
  const initialMockParts = [
    {
      id: "blade-1",
      type: "blade" as PartType,
      name: "기본 검날",
      description: "평범한 검날입니다.",
      modelAsset: "basic-blade",
      statsEffect: {
        attack: 5,
        defense: 0,
        magic: 0,
      },
    },
    {
      id: "blade-2",
      type: "blade" as PartType,
      name: "강화된 검날",
      description: "강화 처리된 검날입니다.",
      modelAsset: "enhanced-blade",
      unlockCondition: {
        stage: 2,
      },
      statsEffect: {
        attack: 10,
        defense: 0,
        magic: 0,
      },
    },
    {
      id: "blade-3",
      type: "blade" as PartType,
      name: "마법 검날",
      description: "마법의 힘이 깃든 검날입니다.",
      modelAsset: "magic-blade",
      unlockCondition: {
        stage: 3,
      },
      statsEffect: {
        attack: 15,
        defense: 0,
        magic: 5,
      },
    },
    {
      id: "guard-1",
      type: "guard" as PartType,
      name: "기본 가드",
      description: "평범한 가드입니다.",
      modelAsset: "basic-guard",
      statsEffect: {
        attack: 0,
        defense: 5,
        magic: 0,
      },
    },
    {
      id: "guard-2",
      type: "guard" as PartType,
      name: "강화된 가드",
      description: "강화 처리된 가드입니다.",
      modelAsset: "enhanced-guard",
      unlockCondition: {
        stage: 2,
      },
      statsEffect: {
        attack: 0,
        defense: 10,
        magic: 0,
      },
    },
    {
      id: "handle-1",
      type: "handle" as PartType,
      name: "기본 손잡이",
      description: "평범한 손잡이입니다.",
      modelAsset: "basic-handle",
      statsEffect: {
        attack: 2,
        defense: 2,
        magic: 0,
      },
    },
    {
      id: "handle-2",
      type: "handle" as PartType,
      name: "강화된 손잡이",
      description: "강화 처리된 손잡이입니다.",
      modelAsset: "enhanced-handle",
      unlockCondition: {
        stage: 2,
      },
      statsEffect: {
        attack: 3,
        defense: 5,
        magic: 0,
      },
    },
    {
      id: "gem-1",
      type: "gem" as PartType,
      name: "기본 보석",
      description: "평범한 보석입니다.",
      modelAsset: "basic-gem",
      statsEffect: {
        attack: 0,
        defense: 0,
        magic: 5,
      },
    },
    {
      id: "gem-2",
      type: "gem" as PartType,
      name: "마법 보석",
      description: "마법의 힘이 깃든 보석입니다.",
      modelAsset: "magic-gem",
      unlockCondition: {
        stage: 3,
      },
      statsEffect: {
        attack: 0,
        defense: 0,
        magic: 15,
      },
    },
  ];

  // 초기 검 데이터
  const initialSword: Sword = {
    id: "sword-1",
    ownerId: "user-1",
    name: getUpdatedSwordName(1),
    stage: 1,
    parts: {
      blade: "blade-1",
      guard: "guard-1",
      handle: "handle-1",
    },
    storyProgress: {
      chapter: 1,
      choices: {},
    },
    stats: {
      attack: 10,
      defense: 5,
      magic: 0,
    },
  };

  // 상태 관리
  const [sword, setSword] = useState<Sword>(initialSword);
  const [parts] = useState<Part[]>(initialMockParts);
  const [selectedPartType, setSelectedPartType] = useState<PartType | null>(
    null
  );
  const [steps, setSteps] = useState<Sword[]>([initialSword]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // 파츠 교체 가이드 상태 추가
  const [nextPartTypeGuide, setNextPartTypeGuide] = useState<PartType | null>(
    "blade"
  );

  // 컴포넌트 마운트 시 로딩 상태 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 파츠 타입 선택 핸들러
  const handlePartTypeSelect = (partType: PartType | null) => {
    setSelectedPartType(partType);
  };

  // 파츠 선택 핸들러
  const handlePartSelect = (part: Part) => {
    // 이미 선택된 파츠인 경우 무시
    if (sword.parts[part.type] === part.id) return;

    // 새로운 검 상태 생성
    const newSword = { ...sword };

    // 이전 파츠의 스탯 효과 제거 (이전에 선택된 파츠가 있는 경우)
    if (newSword.parts[part.type]) {
      const oldPart = parts.find((p) => p.id === newSword.parts[part.type]);
      if (oldPart) {
        newSword.stats.attack -= oldPart.statsEffect.attack;
        newSword.stats.defense -= oldPart.statsEffect.defense;
        newSword.stats.magic -= oldPart.statsEffect.magic;
      }
    }

    // 새 파츠 설정
    newSword.parts[part.type] = part.id;

    // 새 파츠의 스탯 효과 적용
    newSword.stats.attack += part.statsEffect.attack;
    newSword.stats.defense += part.statsEffect.defense;
    newSword.stats.magic += part.statsEffect.magic;

    // 검 이름 업데이트 (단계는 변경하지 않음)
    newSword.name = getUpdatedSwordName(newSword.stage);

    // 상태 업데이트 - 현재 단계의 검 상태만 업데이트
    // 새로운 단계를 추가하지 않고 현재 단계의 검 상태만 변경
    setSword(newSword);

    // 현재 단계의 steps 배열 항목 업데이트
    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = newSword;
    setSteps(updatedSteps);

    // 다음 파츠 타입 가이드 업데이트
    updateNextPartTypeGuide(newSword);

    // 파츠 교체 시에는 자동으로 진화 조건을 확인하지 않음
    // 사용자가 직접 진화 버튼을 클릭해야 진화 가능
  };

  // 다음 파츠 타입 가이드 업데이트
  const updateNextPartTypeGuide = (currentSword: Sword) => {
    // 파츠 타입 순서: blade -> guard -> handle -> gem
    if (!currentSword.parts.blade) {
      setNextPartTypeGuide("blade");
    } else if (!currentSword.parts.guard) {
      setNextPartTypeGuide("guard");
    } else if (!currentSword.parts.handle) {
      setNextPartTypeGuide("handle");
    } else if (!currentSword.parts.gem) {
      setNextPartTypeGuide("gem");
    } else {
      setNextPartTypeGuide(null); // 모든 파츠가 장착됨
    }

    // 다음 파츠 타입으로 자동 선택
    if (selectedPartType) {
      // 현재 선택된 파츠 타입이 있으면 다음 파츠 타입으로 자동 전환
      const partTypes: PartType[] = ["blade", "guard", "handle", "gem"];
      const currentIndex = partTypes.indexOf(selectedPartType);
      if (currentIndex < partTypes.length - 1) {
        setSelectedPartType(partTypes[currentIndex + 1]);
      } else {
        setSelectedPartType(null); // 모든 파츠 타입을 순회했으면 선택 해제
      }
    }
  };

  // 단계 선택 핸들러
  const handleStepSelect = (index: number) => {
    setCurrentStepIndex(index);
    setSword(steps[index]);
  };

  // 진화 조건 확인
  const checkEvolutionCondition = (currentSword: Sword) => {
    console.log("진화 조건 확인 시작");

    // 모든 필수 파츠가 장착되어 있는지 확인
    const hasAllParts =
      currentSword.parts.blade &&
      currentSword.parts.guard &&
      currentSword.parts.handle;

    // 스탯 합계 계산
    const totalStats =
      currentSword.stats.attack +
      currentSword.stats.defense +
      currentSword.stats.magic;

    // 진화 조건: 모든 필수 파츠 장착 + 스탯 합계가 특정 값 이상 + 현재 단계가 최대 단계 미만
    // 필수 파츠: blade, guard, handle (gem은 선택사항)
    // 스탯 요구치: 15 * 단계 (더 쉽게 진화 가능하도록 조정)
    const requiredStats = 15 * currentSword.stage;
    const canEvolve =
      hasAllParts && totalStats >= requiredStats && currentSword.stage < 5;

    console.log("진화 조건 확인:", {
      hasAllParts,
      totalStats,
      requiredStats,
      stage: currentSword.stage,
      canEvolve,
    });

    // 진화 가능하면 모달 표시
    if (canEvolve) {
      console.log("진화 가능! 모달 열기");
      setIsEvolutionModalOpen(true);
    } else {
      console.log("진화 조건 미충족");
      // 조건 미충족 시 사용자에게 알림
      if (currentSword.stage < 5) {
        alert(`진화 조건 미충족:
        - 필수 파츠(검날, 가드, 손잡이) 장착: ${hasAllParts ? "완료" : "미완료"}
        - 필요 스탯 합계: ${totalStats}/${requiredStats}
        - 현재 단계: ${currentSword.stage}/5`);
      } else {
        alert("이미 최대 단계에 도달했습니다.");
      }
    }
  };

  // 진화 완료 핸들러
  const handleEvolutionComplete = (evolvedSword: Sword) => {
    console.log("진화 완료 처리", evolvedSword);

    // 단계 증가
    evolvedSword.stage += 1;

    // 검 이름 업데이트
    evolvedSword.name = getUpdatedSwordName(evolvedSword.stage);

    // 스탯 보너스 적용
    evolvedSword.stats.attack += 10;
    evolvedSword.stats.defense += 5;
    evolvedSword.stats.magic += 3;

    console.log("진화 후 검 상태:", evolvedSword);

    // 새로운 단계 추가 (진화 시에만 새 단계 추가)
    const newSteps = [...steps, evolvedSword];

    // 상태 업데이트
    setSword(evolvedSword);
    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
    setIsEvolutionModalOpen(false);

    // 진화 성공 메시지
    setTimeout(() => {
      alert(`축하합니다! 검이 ${evolvedSword.stage}단계로 진화했습니다!`);
    }, 500);
  };

  return (
    <div className="container p-4 mx-auto">
      {/* 파츠 교체 가이드 */}
      {nextPartTypeGuide && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-center text-blue-700">
            <span className="font-bold">다음 단계:</span>{" "}
            {getPartTypeName(nextPartTypeGuide)}을(를) 선택하여 장착하세요.
          </p>
        </div>
      )}

      {/* 진화 가능 알림 */}
      {sword.stage < 5 &&
        sword.parts.blade &&
        sword.parts.guard &&
        sword.parts.handle && (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-center text-purple-700">
              <span className="font-bold">진화 가능:</span> 모든 필수 파츠가
              장착되었습니다. 아래의 &quot;검 진화하기&quot; 버튼을 클릭하여
              진화를 시도하세요.
            </p>
          </div>
        )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* 왼쪽 영역: 검 모델 */}
        <div className="md:col-span-2">
          <div className="p-4 bg-white rounded-xl shadow-md">
            {/* 검 이름 표시 */}
            <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
              {sword.name}
            </h2>

            {/* 검 모델 표시 */}
            <div
              className="w-full overflow-hidden bg-gray-100 rounded-lg"
              style={{ height: getCanvasHeight(selectedPartType !== null) }}
            >
              {isLoaded ? (
                <SwordCanvas
                  sword={sword}
                  isPartSelectionActive={selectedPartType !== null}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-center">
                    <div className="inline-block w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">로딩 중...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 단계 미리보기 */}
          <div className="mt-4">
            <StepPreview
              steps={steps}
              currentStepIndex={currentStepIndex}
              onSelectStep={handleStepSelect}
            />
          </div>
        </div>

        {/* 오른쪽 영역: 검 정보 및 파츠 선택 */}
        <div className="space-y-4">
          {/* 검 스탯 */}
          <SwordStats sword={sword} />

          {/* 파츠 선택 */}
          <SwordPartSelector
            sword={sword}
            parts={parts}
            selectedPartType={selectedPartType}
            onSelectPartType={handlePartTypeSelect}
            onSelectPart={handlePartSelect}
            nextPartTypeGuide={nextPartTypeGuide}
          />

          {/* 진화 버튼 (조건 충족 시) */}
          {sword.stage < 5 && (
            <button
              className={`
                w-full px-4 py-3 font-bold text-white transition-colors rounded-lg
                ${
                  sword.parts.blade && sword.parts.guard && sword.parts.handle
                    ? "bg-purple-600 hover:bg-purple-700 animate-pulse"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
              onClick={() => {
                console.log("진화 버튼 클릭");
                checkEvolutionCondition(sword);
              }}
              disabled={
                !(sword.parts.blade && sword.parts.guard && sword.parts.handle)
              }
            >
              검 진화하기
            </button>
          )}
        </div>
      </div>

      {/* 진화 모달 */}
      <SwordEvolutionModal
        isOpen={isEvolutionModalOpen}
        onClose={() => setIsEvolutionModalOpen(false)}
        onComplete={handleEvolutionComplete}
        sword={sword}
      />
    </div>
  );
}
