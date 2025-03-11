import { z } from "zod";

// 파츠 타입 정의
export const PartTypeEnum = z.enum(["blade", "guard", "handle", "gem"]);
export type PartType = z.infer<typeof PartTypeEnum>;

// 파츠 스키마
export const PartSchema = z.object({
  id: z.string(),
  type: PartTypeEnum,
  name: z.string(),
  description: z.string(),
  modelAsset: z.string(),
  unlockCondition: z
    .object({
      stage: z.number().optional(),
      quest: z.string().optional(),
    })
    .optional(),
  statsEffect: z
    .object({
      attack: z.number().default(0),
      defense: z.number().default(0),
      magic: z.number().default(0),
    })
    .default({}),
  createdAt: z.string().datetime().optional(),
});

export type Part = z.infer<typeof PartSchema>;

// 검 스키마
export const SwordSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  stage: z.number().default(1),
  parts: z
    .object({
      blade: z.string().optional(),
      guard: z.string().optional(),
      handle: z.string().optional(),
      gem: z.string().optional(),
    })
    .default({}),
  storyProgress: z
    .object({
      chapter: z.number().default(1),
      choices: z.record(z.string()).default({}),
    })
    .default({}),
  stats: z
    .object({
      attack: z.number().default(10),
      defense: z.number().default(5),
      magic: z.number().default(0),
    })
    .default({}),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Sword = z.infer<typeof SwordSchema>;

// 사용자 스키마
export const UserSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  email: z.string().email().optional(),
  profileImage: z.string().url().optional(),
  joinDate: z.string().datetime(),
  lastLogin: z.string().datetime(),
  totalPlayTime: z.number().default(0),
  currentSwordId: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

// 사용자 파츠 스키마
export const UserPartSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  partId: z.string(),
  ownedAt: z.string().datetime(),
  quantity: z.number().default(1),
});

export type UserPart = z.infer<typeof UserPartSchema>;
