# 검 키우기

검 키우기는 플레이어가 환상적인 검을 획득하여 시간 경과나 선택에 따라 진화시켜 나가는 방치형 RPG 웹 애플리케이션입니다.

## 주요 기능

- **3D 검 모델 렌더링**: Three.js와 React Three Fiber를 사용하여 화려한 3D 검 모델을 렌더링합니다.
- **360도 회전 가능한 검 모델**: 마우스 드래그 또는 터치로 검을 360도 회전시켜 다양한 각도에서 감상할 수 있습니다.
- **단계별 검의 진화**: 검이 여러 단계를 거쳐 점점 강력하고 화려하게 변화합니다.
- **검의 부분별 파츠로 구성**: 검신, 가드, 손잡이, 보석 등 다양한 파츠를 조합하여 자신만의 검을 만들 수 있습니다.
- **방치/광고를 통한 파츠 및 진화 획득**: 시간이 지나면 자동으로 자원이 쌓이고, 광고 시청을 통해 보상을 얻을 수 있습니다.
- **검의 이름, 부위별 설정, 검마다 깊은 스토리**: 각 검은 고유한 이름과 설정, 스토리를 가지고 있습니다.
- **유저의 선택이 검의 성장 및 스토리에 영향**: 플레이어의 선택에 따라 검의 진화 방향과 스토리가 달라집니다.
- **검을 소셜 미디어 및 게임 내 공유**: 자신이 키운 검을 다른 사람들과 공유할 수 있습니다.
- **로그인, 프로필, 랭킹 시스템**: 사용자 계정 시스템과 랭킹 기능을 제공합니다.
- **PvP 등 유저 간 검 비교 및 경쟁**: 다른 플레이어와 검을 비교하고 경쟁할 수 있습니다.

## 기술 스택

### 프론트엔드

- **프레임워크**: Next.js 14, React 18
- **언어**: TypeScript
- **스타일링**: Tailwind CSS, Tamagui
- **상태 관리**: Zustand
- **데이터 페칭**: TanStack Query v5
- **3D 렌더링**: Three.js, React Three Fiber, Drei
- **애니메이션**: GSAP
<!-- - **국제화**: i18next, react-i18next -->

### 백엔드

- **인프라**: Supabase
  - 인증
  - PostgreSQL 데이터베이스
  - 실시간 구독
  - Edge Functions
  - Storage
- **결제**: Stripe (구독 모델)

### 개발 도구

- **모노레포**: Turborepo
- **타입 검증**: Zod
- **코드 품질**:
  - ESLint
  - Prettier
  - TypeScript strict 모드

## 시작하기

### 사전 요구사항

- Node.js 18.0.0 이상
- pnpm 8.0.0 이상
- Supabase 계정
- Stripe 계정 (선택사항)

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/sword-raising.git
cd sword-raising

# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local
```

### 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 설정하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (선택사항)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 개발 서버 실행

```bash
# 개발 서버 실행
pnpm dev

# 특정 앱만 실행
pnpm dev --filter=web
pnpm dev --filter=docs
```

### 빌드

```bash
# 전체 워크스페이스 빌드
pnpm build

# 특정 앱만 빌드
pnpm build --filter=web
```

## 프로젝트 구조

```
.
├── apps/
│   ├── expo/          # React Native 앱
│   ├── next/          # Next.js 웹 앱
│   └── docs/          # 문서 사이트
├── packages/
│   ├── api/           # 백엔드 API 및 타입
│   ├── config/        # 공유 설정
│   ├── ui/            # UI 컴포넌트
│   └── utils/         # 유틸리티 함수
├── .env.example       # 환경 변수 예시
├── turbo.json         # Turborepo 설정
└── package.json       # 워크스페이스 설정
```

### 주요 디렉토리

```
apps/next/
├── src/
│   ├── app/           # Next.js 앱 라우터
│   ├── components/    # 리액트 컴포넌트
│   │   ├── sword/    # 검 관련 컴포넌트
│   │   └── ui/       # UI 컴포넌트
│   ├── lib/          # 유틸리티 함수 및 훅
│   │   ├── supabase/ # Supabase 클라이언트
│   │   ├── store/    # Zustand 스토어
│   │   ├── types/    # TypeScript 타입
│   │   ├── hooks/    # 커스텀 훅
│   │   └── utils/    # 유틸리티 함수
│   └── assets/       # 정적 에셋
│       └── models/   # 3D 모델 파일
└── public/           # 정적 파일
    └── parts/        # 검 파츠 모델 파일
```

## 기여하기

1. 이 저장소를 포크합니다
2. 새 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'feat: add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
