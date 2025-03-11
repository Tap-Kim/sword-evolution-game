"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Sword } from "@/shared/api/types";
import dynamic from "next/dynamic";

// SwordCanvas를 동적으로 임포트
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

interface SwordEvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (evolvedSword: Sword) => void;
  sword: Sword;
}

export function SwordEvolutionModal({
  isOpen,
  onClose,
  onComplete,
  sword,
}: SwordEvolutionModalProps) {
  // 진화 단계 상태
  const [evolutionStage, setEvolutionStage] = useState(0);
  // 진화된 검 상태
  const [evolvedSword, setEvolvedSword] = useState<Sword | null>(null);
  // 진화 효과 활성화 상태 - 모달이 열리면 즉시 활성화
  const [isEvolving, setIsEvolving] = useState(true);
  // 진화 완료 상태
  const [isComplete, setIsComplete] = useState(false);

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      console.log("진화 모달 열림");
      setEvolutionStage(0);
      setEvolvedSword(null);
      // 즉시 진화 효과 활성화
      setIsEvolving(true);
      setIsComplete(false);

      // 진화 시작 (즉시)
      startEvolution();
    }
  }, [isOpen, sword]);

  // 진화 시작
  const startEvolution = () => {
    console.log("진화 시작");
    // 진화 단계 업데이트 (0 -> 1 -> 2 -> 3)
    const evolutionInterval = setInterval(() => {
      setEvolutionStage((prev) => {
        const nextStage = prev + 1;
        console.log("진화 단계 업데이트:", nextStage);

        // 진화 완료 (3단계에 도달)
        if (nextStage >= 3) {
          clearInterval(evolutionInterval);

          // 진화된 검 생성 (단계 증가 및 스탯 향상은 handleEvolutionComplete에서 처리)
          const newSword = {
            ...sword,
            // 여기서는 아직 단계를 증가시키지 않음
            stats: {
              attack: sword.stats.attack,
              defense: sword.stats.defense,
              magic: sword.stats.magic,
            },
          };
          console.log("진화 준비된 검 생성:", newSword);
          setEvolvedSword(newSword);

          // 진화 완료 상태로 변경
          setTimeout(() => {
            setIsComplete(true);
            setIsEvolving(false);
            console.log("진화 애니메이션 완료");
          }, 1000);
        }

        return nextStage;
      });
    }, 1200); // 약간 더 빠르게 진행
  };

  // 완료 버튼 핸들러
  const handleComplete = () => {
    console.log("완료 버튼 클릭");
    if (evolvedSword) {
      console.log("진화 완료 처리:", evolvedSword);
      onComplete(evolvedSword);
    } else {
      console.log("진화된 검이 없음, 모달 닫기");
      onClose();
    }
  };

  // 진화 단계별 메시지
  const getEvolutionMessage = () => {
    switch (evolutionStage) {
      case 0:
        return "진화 준비 중...";
      case 1:
        return "에너지 주입 중...";
      case 2:
        return "형태 변환 중...";
      case 3:
        return "진화 완료!";
      default:
        return "진화 중...";
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => !isEvolving && onClose()}
      className="relative z-50"
    >
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      {/* 모달 컨테이너 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl p-6 mx-auto bg-white rounded-xl">
          <Dialog.Title className="text-2xl font-bold text-center text-gray-800">
            검 진화
          </Dialog.Title>

          {/* 진화 효과 표시 영역 */}
          <div
            className="mt-4 overflow-hidden bg-gray-100 rounded-lg"
            style={{ height: "400px" }}
          >
            {/* 검 모델 (항상 표시) */}
            <SwordCanvas sword={sword} isEvolving={isEvolving} />
          </div>

          {/* 진화 상태 메시지 */}
          <div className="mt-4 text-xl font-semibold text-center text-purple-700">
            {getEvolutionMessage()}
          </div>

          {/* 진행 상태 표시 */}
          {!isComplete && (
            <div className="w-full h-2 mt-4 overflow-hidden bg-gray-200 rounded-full">
              <div
                className="h-full bg-purple-600 transition-all duration-500"
                style={{ width: `${(evolutionStage / 3) * 100}%` }}
              ></div>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-center mt-6">
            {isComplete ? (
              <button
                className="px-6 py-3 font-bold text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
                onClick={handleComplete}
              >
                진화 완료
              </button>
            ) : (
              <button
                className="px-6 py-3 font-bold text-white transition-colors bg-gray-400 rounded-lg cursor-not-allowed"
                disabled
              >
                진화 중...
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
