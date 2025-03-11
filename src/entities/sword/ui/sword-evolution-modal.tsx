"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Sword } from "@/shared/api/types";
import { SwordCanvas } from "./sword-canvas";

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
    // 진화 단계 진행
    const timer1 = setTimeout(() => {
      setEvolutionStage(1);
    }, 1000);

    const timer2 = setTimeout(() => {
      setEvolutionStage(2);
    }, 2000);

    const timer3 = setTimeout(() => {
      setEvolutionStage(3);

      // 진화된 검 생성
      const newSword = { ...sword, stage: sword.stage + 1 };
      setEvolvedSword(newSword);
    }, 3000);

    const timer4 = setTimeout(() => {
      // 진화 완료
      setIsComplete(true);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  // 진화 완료 처리
  const handleComplete = () => {
    if (evolvedSword) {
      onComplete(evolvedSword);
    }
  };

  // 진화 단계별 메시지
  const getEvolutionMessage = () => {
    switch (evolutionStage) {
      case 0:
        return "진화 준비 중...";
      case 1:
        return "에너지 충전 중...";
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
      onClose={() => (!isEvolving || isComplete ? onClose() : null)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white shadow-xl overflow-hidden">
          <div className="p-6">
            <Dialog.Title className="text-2xl font-bold text-center text-indigo-800 mb-4">
              검 진화
            </Dialog.Title>

            <div className="relative w-full h-96 bg-gradient-to-b from-indigo-50 to-blue-100 rounded-lg overflow-hidden mb-6">
              {/* 진화 효과 배경 */}
              <div className="absolute inset-0 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-red-500/30 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-white/30 animate-ping"></div>
                </div>
              </div>

              {/* 검 모델 - 항상 표시 */}
              <div className="relative z-10 w-full h-full">
                <SwordCanvas
                  sword={evolvedSword || sword}
                  height="100%"
                  autoRotate={true}
                  isEvolving={true}
                />
              </div>

              {/* 진화 단계 표시 */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-white/80 px-4 py-2 rounded-full text-indigo-800 font-bold">
                  {getEvolutionMessage()}
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              {isComplete ? (
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:scale-105 transform duration-200"
                >
                  진화 완료!
                </button>
              ) : (
                <button
                  disabled={!isComplete}
                  onClick={onClose}
                  className={`px-6 py-3 ${
                    !isComplete
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white rounded-lg transition-colors shadow-lg`}
                >
                  {!isComplete ? "진화 중..." : "취소"}
                </button>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
