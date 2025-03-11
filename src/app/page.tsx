"use client";

import dynamic from "next/dynamic";

const SwordEnhancementGame = dynamic(
  () =>
    import("@/features/sword-enhancement/ui/sword-enhancement-game").then(
      (mod) => mod.SwordEnhancementGame
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-64">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">게임 로딩 중...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">검 키우기</h1>
      <SwordEnhancementGame />
    </main>
  );
}
