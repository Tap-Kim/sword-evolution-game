import { Part, PartType } from "@/shared/api/types";

/**
 * 파츠 타입별 필터링
 */
export function filterPartsByType(parts: Part[], type: PartType): Part[] {
  return parts.filter((part) => part.type === type);
}

/**
 * 파츠 잠금 해제 여부 확인
 */
export function isPartUnlocked(part: Part, currentStage: number): boolean {
  if (!part.unlockCondition) return true;
  if (part.unlockCondition.stage && part.unlockCondition.stage > currentStage)
    return false;
  return true;
}

/**
 * 파츠 스탯 효과 텍스트 생성
 */
export function getPartStatsEffectText(part: Part): string {
  const { attack, defense, magic } = part.statsEffect;
  const effects = [];

  if (attack > 0) effects.push(`공격력 +${attack}`);
  if (defense > 0) effects.push(`방어력 +${defense}`);
  if (magic > 0) effects.push(`마법력 +${magic}`);

  return effects.join(", ");
}

/**
 * 파츠 타입별 색상 가져오기
 */
export function getPartTypeColor(type: PartType): string {
  switch (type) {
    case "blade":
      return "bg-red-100 text-red-800";
    case "guard":
      return "bg-blue-100 text-blue-800";
    case "handle":
      return "bg-yellow-100 text-yellow-800";
    case "gem":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
