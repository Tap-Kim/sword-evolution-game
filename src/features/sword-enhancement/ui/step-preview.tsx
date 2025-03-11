"use client";

import { Sword } from "@/shared/api/types";

interface StepPreviewProps {
  steps: Sword[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
}

export function StepPreview({
  steps,
  currentStepIndex,
  onSelectStep,
}: StepPreviewProps) {
  if (steps.length <= 1) return null;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h3 className="mb-3 text-lg font-semibold text-gray-800">
        진화 단계 보기
      </h3>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <button
            key={index}
            className={`
              min-w-[80px] p-2 text-center rounded-lg transition-all duration-300
              ${
                index === currentStepIndex
                  ? "bg-blue-500 text-white font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
            onClick={() => onSelectStep(index)}
          >
            <div className="font-bold">{step.stage}단계</div>
            <div className="text-xs mt-1 opacity-80">{step.name}</div>
          </button>
        ))}
      </div>

      {currentStepIndex > 0 && (
        <div className="mt-3 text-sm text-center text-gray-500">
          현재 진화 단계: {steps[currentStepIndex].stage}단계 / 총{" "}
          {steps.length}개 단계
        </div>
      )}
    </div>
  );
}
