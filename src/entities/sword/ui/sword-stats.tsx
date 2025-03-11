"use client";

import { Sword } from "@/shared/api/types";

interface SwordStatsProps {
  sword: Sword;
  className?: string;
}

export function SwordStats({ sword, className = "" }: SwordStatsProps) {
  return (
    <div className={`p-4 bg-white rounded-xl shadow-md ${className}`}>
      <h3 className="mb-3 text-xl font-bold text-center text-gray-800">
        {sword.name}
      </h3>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 text-center bg-red-50 rounded-lg">
          <div className="text-sm text-gray-600">공격력</div>
          <div className="text-xl font-bold text-red-600">
            {sword.stats.attack}
          </div>
        </div>

        <div className="p-2 text-center bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">방어력</div>
          <div className="text-xl font-bold text-blue-600">
            {sword.stats.defense}
          </div>
        </div>

        <div className="p-2 text-center bg-purple-50 rounded-lg">
          <div className="text-sm text-gray-600">마법력</div>
          <div className="text-xl font-bold text-purple-600">
            {sword.stats.magic}
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm text-center text-gray-500">
        단계: {sword.stage}
      </div>
    </div>
  );
}
