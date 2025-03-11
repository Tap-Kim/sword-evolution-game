import { PartType, Sword } from "@/shared/api/types";

/**
 * 파츠 타입 이름 가져오기
 */
export function getPartTypeName(partType: PartType): string {
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

/**
 * 파츠 효과 설명 가져오기
 */
export function getPartEffect(partType: PartType): string {
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

/**
 * 검 이름 업데이트
 */
export function getUpdatedSwordName(stage: number): string {
  // 단계별 접두사
  const prefixes = [
    "", // 0단계
    "견습생의 ", // 1단계
    "숙련된 ", // 2단계
    "마법의 ", // 3단계
    "전설의 ", // 4단계
    "신화의 ", // 5단계
  ];

  // 단계별 기본 이름
  let baseName = "검";
  if (stage >= 2) baseName = "장검";
  if (stage >= 3) baseName = "마검";
  if (stage >= 4) baseName = "성검";
  if (stage >= 5) baseName = "신검";

  // 접두사와 기본 이름 조합
  return `${prefixes[stage]}${baseName}`;
}

/**
 * 캔버스 높이 계산
 */
export function getCanvasHeight(isPartSelectionActive: boolean): string {
  return isPartSelectionActive ? "600px" : "500px";
}

/**
 * 검 스탯 업데이트
 */
export function updateSwordStats(
  sword: Sword,
  partType: PartType,
  statChange: number
): Sword {
  const newSword = { ...sword };

  switch (partType) {
    case "blade":
      newSword.stats.attack += statChange;
      break;
    case "guard":
      newSword.stats.defense += statChange;
      break;
    case "handle":
      // 손잡이는 공격과 방어를 조금씩 증가
      newSword.stats.attack += Math.floor(statChange / 2);
      newSword.stats.defense += Math.floor(statChange / 2);
      break;
    case "gem":
      newSword.stats.magic += statChange;
      break;
  }

  return newSword;
}
