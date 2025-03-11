"use client";

import { useState, useEffect } from "react";
import { PartType } from "@/lib/types/schema";
import dynamic from "next/dynamic";

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

// 파츠 타입 이름 가져오기
function getPartTypeName(partType: PartType): string {
  switch (partType) {
    case "blade":
      return "검날";
    case "guard":
      return "가드";
    case "handle":
      return "손잡이";
    case "gem":
      return "보석";
    default:
      return "알 수 없음";
  }
}

// 파츠 효과 설명 가져오기
function getPartEffect(partType: PartType): string {
  switch (partType) {
    case "blade":
      return "공격력이 증가합니다";
    case "guard":
      return "방어력이 증가합니다";
    case "handle":
      return "조작성이 향상됩니다";
    case "gem":
      return "마법 효과가 추가됩니다";
    default:
      return "";
  }
}

// 검 타입 정의
interface SwordType {
  id: string;
  ownerId: string;
  name: string;
  stage: number;
  parts: {
    blade?: string;
    guard?: string;
    handle?: string;
    gem?: string;
  };
  storyProgress: {
    chapter: number;
    choices: Record<string, string>;
  };
  stats: {
    attack: number;
    defense: number;
    magic: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function SwordGame() {
  // 초기 파츠 데이터
  const initialMockParts = [
    {
      id: "blade-1",
      type: "blade" as PartType,
      name: "기본 검날",
      description: "평범한 검날입니다.",
      statsEffect: { attack: 0, defense: 0, magic: 0 },
    },
    {
      id: "blade-2",
      type: "blade" as PartType,
      name: "강화된 검날",
      description: "강화된 검날로 더 날카롭습니다.",
      statsEffect: { attack: 5, defense: 0, magic: 0 },
    },
    {
      id: "guard-1",
      type: "guard" as PartType,
      name: "기본 가드",
      description: "평범한 가드입니다.",
      statsEffect: { attack: 0, defense: 0, magic: 0 },
    },
    {
      id: "guard-2",
      type: "guard" as PartType,
      name: "강화된 가드",
      description: "강화된 가드로 더 튼튼합니다.",
      statsEffect: { attack: 0, defense: 5, magic: 0 },
    },
    {
      id: "handle-1",
      type: "handle" as PartType,
      name: "기본 손잡이",
      description: "평범한 손잡이입니다.",
      statsEffect: { attack: 0, defense: 0, magic: 0 },
    },
    {
      id: "handle-2",
      type: "handle" as PartType,
      name: "강화된 손잡이",
      description: "강화된 손잡이로 더 편안합니다.",
      statsEffect: { attack: 2, defense: 2, magic: 2 },
    },
    {
      id: "gem-1",
      type: "gem" as PartType,
      name: "기본 보석",
      description: "평범한 보석입니다.",
      statsEffect: { attack: 0, defense: 0, magic: 0 },
    },
    {
      id: "gem-2",
      type: "gem" as PartType,
      name: "강화된 보석",
      description: "강화된 보석으로 더 빛납니다.",
      statsEffect: { attack: 0, defense: 0, magic: 5 },
    },
  ];

  // 검 상태
  const [currentSword, setCurrentSword] = useState<SwordType>({
    id: "sword-1",
    ownerId: "user-1",
    name: "기본 검",
    stage: 0,
    parts: {
      blade: "blade-1",
      guard: "guard-1",
      handle: "handle-1",
      gem: "gem-1",
    },
    storyProgress: {
      chapter: 1,
      choices: {},
    },
    stats: {
      attack: 10,
      defense: 5,
      magic: 2,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // UI 상태
  const [storyText, setStoryText] = useState(
    "당신의 검을 강화하고 진화시키세요!"
  );
  const [selectedPartType, setSelectedPartType] = useState<PartType | null>(
    null
  );
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [previewStage, setPreviewStage] = useState<number | null>(null);
  const [animateStats, setAnimateStats] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 컴포넌트 마운트 시 로딩 상태 설정
  useEffect(() => {
    // 약간의 지연 후 로딩 완료 상태로 설정 (Three.js 초기화 시간 고려)
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 검 이름 업데이트 함수
  const getUpdatedSwordName = (newSword: SwordType) => {
    // 단계별 검 이름 접두사
    const stagePrefix = [
      "일반", // 1단계
      "강화된", // 2단계
      "마법의", // 3단계
      "전설의", // 4단계
      "신화의", // 5단계
    ];

    // 검 유형에 따른 이름
    let baseName = "롱소드";

    // 단계에 따른 이름 변경
    if (newSword.stage >= 4) {
      baseName = "신의 검";
    } else if (newSword.stage === 3) {
      baseName = "마법검";
    } else if (newSword.stage === 2) {
      baseName = "황금검";
    } else if (newSword.stage === 1) {
      baseName = "롱소드";
    } else {
      baseName = "검";
    }

    // 최종 이름 조합
    return `${stagePrefix[newSword.stage]} ${baseName}`;
  };

  // 파츠 선택 처리
  const handlePartSelect = (partType: PartType, partId: string) => {
    // 새 검 객체 생성 (불변성 유지)
    const newSword = {
      ...currentSword,
      parts: {
        ...currentSword.parts,
        [partType]: partId,
      },
    };

    // 스탯 업데이트
    if (partId.includes("part-2")) {
      // 고급 파츠는 더 높은 스탯 제공
      newSword.stats = {
        ...newSword.stats,
        attack:
          partType === "blade"
            ? newSword.stats.attack + 5
            : newSword.stats.attack,
        defense:
          partType === "guard"
            ? newSword.stats.defense + 5
            : newSword.stats.defense,
        magic:
          partType === "gem" ? newSword.stats.magic + 5 : newSword.stats.magic,
      };
    } else {
      // 기본 파츠는 낮은 스탯 제공
      newSword.stats = {
        ...newSword.stats,
        attack:
          partType === "blade"
            ? newSword.stats.attack + 2
            : newSword.stats.attack,
        defense:
          partType === "guard"
            ? newSword.stats.defense + 2
            : newSword.stats.defense,
        magic:
          partType === "gem" ? newSword.stats.magic + 2 : newSword.stats.magic,
      };
    }

    // 검 이름 업데이트
    newSword.name = getUpdatedSwordName(newSword);

    // 스탯 애니메이션 활성화
    setAnimateStats(true);
    setTimeout(() => setAnimateStats(false), 1000);

    // 현재 검 업데이트
    setCurrentSword(newSword);

    // 스토리 텍스트 업데이트
    setStoryText(
      `${getPartTypeName(partType)}을(를) 교체했습니다. ${getPartEffect(partType)}`
    );

    // 선택된 파츠 타입 초기화
    setSelectedPartType(null);
  };

  // 진화 처리
  const handleEvolve = () => {
    setShowEvolutionModal(true);
  };

  // 진화 완료 처리
  const handleEvolutionComplete = (evolvedSword: SwordType) => {
    // 단계 증가
    evolvedSword.stage += 1;

    // 검 이름 업데이트
    evolvedSword.name = getUpdatedSwordName(evolvedSword);

    // 스탯 증가
    evolvedSword.stats = {
      attack: evolvedSword.stats.attack + 10,
      defense: evolvedSword.stats.defense + 10,
      magic: evolvedSword.stats.magic + 10,
    };

    // 현재 검 업데이트
    setCurrentSword(evolvedSword);

    // 스탯 애니메이션 활성화
    setAnimateStats(true);
    setTimeout(() => setAnimateStats(false), 1000);

    // 스토리 텍스트 업데이트
    setStoryText(
      `검이 진화했습니다! 이제 ${evolvedSword.name}이(가) 되었습니다.`
    );

    // 모달 닫기
    setShowEvolutionModal(false);
  };

  // 이전 단계 미리보기
  const handleStagePreview = (stage: number | null) => {
    setPreviewStage(stage);
  };

  // 캔버스 높이 계산
  const getCanvasHeight = () => {
    return selectedPartType ? "600px" : "500px";
  };

  // 로딩 화면
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg animate-fadeIn">
          <div className="inline-block w-20 h-20 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <h2 className="mt-6 text-2xl font-bold text-gray-800">
            검 강화 시뮬레이터 로딩 중...
          </h2>
          <p className="mt-2 text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 검 모델 영역 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <div
            className="relative transition-all duration-500"
            style={{ height: getCanvasHeight() }}
          >
            <SwordCanvas
              sword={
                previewStage !== null
                  ? { ...currentSword, stage: previewStage }
                  : currentSword
              }
              height="100%"
              autoRotate={true}
              showEnvironment={true}
              showShadow={true}
              isPartSelectionActive={!!selectedPartType}
            />

            {/* 단계 미리보기 컨트롤 */}
            {currentSword.stage > 0 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
                {Array.from({ length: currentSword.stage + 1 }).map(
                  (_, index) => (
                    <button
                      key={index}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 transform ${
                        previewStage === index
                          ? "bg-blue-500 text-white scale-110 shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"
                      }`}
                      onMouseEnter={() => handleStagePreview(index)}
                      onMouseLeave={() => handleStagePreview(null)}
                    >
                      {index + 1}
                    </button>
                  )
                )}
              </div>
            )}

            {/* 검 이름 표시 */}
            <div className="absolute top-4 left-0 right-0 text-center">
              <div className="inline-block bg-gray-800 bg-opacity-70 text-white px-4 py-2 rounded-full text-lg font-medium">
                {previewStage !== null
                  ? `${currentSword.name} (단계 ${previewStage + 1})`
                  : `${currentSword.name} (단계 ${currentSword.stage + 1})`}
              </div>
            </div>
          </div>
        </div>

        {/* 검 정보 영역 */}
        <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentSword.name}
            </h2>
            <p className="text-gray-600">단계: {currentSword.stage + 1}</p>
          </div>

          {/* 스탯 정보 */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3 text-lg">스탯</h3>
            <div className="grid grid-cols-3 gap-4">
              <div
                className={`bg-red-50 p-4 rounded-lg transition-all duration-300 ${animateStats ? "animate-pulse shadow-md" : ""}`}
              >
                <p className="text-sm text-gray-600 mb-1">공격력</p>
                <p className="text-xl font-bold text-red-700">
                  {currentSword.stats.attack}
                </p>
              </div>
              <div
                className={`bg-blue-50 p-4 rounded-lg transition-all duration-300 ${animateStats ? "animate-pulse shadow-md" : ""}`}
              >
                <p className="text-sm text-gray-600 mb-1">방어력</p>
                <p className="text-xl font-bold text-blue-700">
                  {currentSword.stats.defense}
                </p>
              </div>
              <div
                className={`bg-purple-50 p-4 rounded-lg transition-all duration-300 ${animateStats ? "animate-pulse shadow-md" : ""}`}
              >
                <p className="text-sm text-gray-600 mb-1">마법</p>
                <p className="text-xl font-bold text-purple-700">
                  {currentSword.stats.magic}
                </p>
              </div>
            </div>
          </div>

          {/* 스토리 텍스트 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-700 italic">{storyText}</p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={handleEvolve}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105 font-medium shadow-md"
            >
              검 진화하기
            </button>
          </div>

          {/* 파츠 선택 영역 */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-lg">
              파츠 교체
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(["blade", "guard", "handle", "gem"] as PartType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setSelectedPartType(
                        selectedPartType === type ? null : type
                      )
                    }
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform ${
                      selectedPartType === type
                        ? "bg-blue-500 text-white shadow-md scale-105"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:scale-105"
                    }`}
                  >
                    {getPartTypeName(type)}
                  </button>
                )
              )}
            </div>

            {/* 선택된 파츠 타입에 따른 파츠 목록 */}
            {selectedPartType && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn">
                <h4 className="font-medium text-gray-700 mb-3">
                  {getPartTypeName(selectedPartType)} 선택
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {initialMockParts
                    .filter((part) => part.type === selectedPartType)
                    .map((part) => (
                      <div
                        key={part.id}
                        onClick={() =>
                          handlePartSelect(selectedPartType, part.id)
                        }
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                          currentSword.parts[selectedPartType] === part.id
                            ? "bg-blue-100 border border-blue-300 shadow-md"
                            : "bg-white border border-gray-200 hover:bg-gray-100 hover:shadow"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">
                            {part.name}
                          </span>
                          <div className="flex space-x-2">
                            {part.statsEffect.attack > 0 && (
                              <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium">
                                +{part.statsEffect.attack} 공격
                              </span>
                            )}
                            {part.statsEffect.defense > 0 && (
                              <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium">
                                +{part.statsEffect.defense} 방어
                              </span>
                            )}
                            {part.statsEffect.magic > 0 && (
                              <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs font-medium">
                                +{part.statsEffect.magic} 마법
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {part.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 진화 모달 */}
      <SwordEvolutionModal
        isOpen={showEvolutionModal}
        onClose={() => setShowEvolutionModal(false)}
        sword={currentSword}
        onComplete={handleEvolutionComplete}
      />
    </div>
  );
}
