# 병특.com

병역지정업체 검색 서비스인 **병특.com**의 소스코드 저장소입니다. 병역지정업체를 쉽고 빠르게 검색할 수 있는 웹 애플리케이션과 SDK를 제공합니다.

## 🎯 서비스 소개

병특.com은 병역지정업체를 다양한 조건으로 검색할 수 있는 서비스입니다. 복무형태, 기업규모, 업종, 지역 등 다양한 필터를 활용하여 원하는 병역지정업체를 찾을 수 있습니다.

## 📁 프로젝트 구조

이 프로젝트는 Turborepo를 사용하는 Monorepo 구조로 구성되어 있습니다.

```
.
├── apps/
│   └── web/              # Next.js 웹 애플리케이션
├── packages/
│   ├── mma-sdk/          # 병역지정업체 검색 SDK
│   └── ui/               # 공유 UI 컴포넌트 (shadcn/ui 기반)
└── turbo.json            # Turborepo 설정
```

### 주요 패키지

- **`apps/web`**: 병특.com 웹 애플리케이션 (Next.js 14)
- **`packages/mma-sdk`**: 병역지정업체 검색을 위한 TypeScript SDK
- **`packages/ui`**: 공유 UI 컴포넌트 라이브러리

## 🚀 시작하기

### 필수 요구사항

- Node.js 16 이상
- pnpm 8 이상

### 설치

```bash
# 의존성 설치
pnpm install

# 모든 패키지 빌드
pnpm build
```

### 개발 서버 실행

```bash
# 개발 서버 시작
pnpm dev
```

개발 서버가 실행되면 `http://localhost:3000`에서 웹 애플리케이션을 확인할 수 있습니다.

## ✨ 주요 기능

### 웹 애플리케이션

- 🔍 **다양한 검색 필터**
  - 복무형태 (복무형태별)
  - 기업규모 (기업별)
  - 업종 선택 (업종선택)
  - 지역 검색 (시도/시군구)
  - 업체명 검색
  - 채용공고 유무
  - 배정인원 유무 (현역/보충역)

- 📊 **검색 결과 표시**
  - 검색 결과 목록/테이블 뷰
  - 페이지네이션
  - 검색 히스토리 관리
  - 반응형 디자인

- 🎨 **사용자 경험**
  - 직관적인 검색 폼
  - 빠른 검색 (Quick Search)
  - 고급 검색 옵션
  - 검색 결과 자동 스크롤

### MMA SDK

MMA SDK는 병역지정업체 검색을 위한 TypeScript SDK입니다.

**주요 기능:**

- `getServiceTypes()` - 복무형태 목록 조회
- `getCompanySizes()` - 기업규모 목록 조회
- `getIndustryTypes()` - 업종 목록 조회
- `getProvinces()` - 시도 목록 조회
- `getCities(provinceCode)` - 시군구 목록 조회
- `searchCompanies(params)` - 업체 검색

**사용 예시:**

```typescript
import { MMAClient } from 'mma-sdk';

const client = new MMAClient();

// 업체 검색
const result = await client.searchCompanies({
  eopjong_gbcd: '01',        // 복무형태
  gegyumo_cd: '01',          // 기업규모
  eopjong_cd: ['01', '02'],  // 업종
  eopche_nm: '삼성',         // 업체명
  sido_addr: '서울특별시',   // 시도
  sigungu_addr: '강남구',    // 시군구
  chaeyongym: 'Y',           // 채용공고 유무
  bjinwonym: ['H'],          // 배정인원 유무 (H: 현역, B: 보충역)
  pageIndex: 1               // 페이지 번호
});
```

## 🛠 기술 스택

- **프레임워크**: Next.js 14, React 18
- **언어**: TypeScript 5
- **빌드 도구**: Turborepo
- **패키지 관리**: pnpm
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn/ui
- **HTTP 클라이언트**: Axios
- **HTML 파싱**: Cheerio
- **테스팅**: Vitest
- **분석**: Vercel Analytics

## 📝 스크립트

### 루트 레벨 스크립트

```bash
# 개발 서버 실행
pnpm dev

# 모든 패키지 빌드
pnpm build

# 린트 실행
pnpm lint

# 테스트 실행
pnpm test

# 코드 포맷팅
pnpm format
```

### 개별 패키지 스크립트

각 패키지의 `package.json`에서 개별 스크립트를 확인할 수 있습니다.

## 📦 패키지별 상세 정보

### apps/web

Next.js 기반 웹 애플리케이션으로, 병역지정업체 검색 UI를 제공합니다.

**주요 컴포넌트:**
- `SearchForm` - 검색 폼
- `CompanyList` - 검색 결과 목록
- `CompanyTable` - 검색 결과 테이블
- `CompanyDetails` - 업체 상세 정보
- `Pagination` - 페이지네이션
- `SearchHistory` - 검색 히스토리

**주요 훅:**
- `useSearch` - 검색 로직 관리
- `useFormData` - 폼 데이터 관리
- `useSearchHistory` - 검색 히스토리 관리

### packages/mma-sdk

병역지정업체 검색을 위한 TypeScript SDK입니다.

**주요 클래스:**
- `MMAClient` - MMA API 클라이언트
- `HTTPClient` - HTTP 요청 처리

**타입:**
- `CompanySearchParams` - 검색 파라미터
- `SearchResult` - 검색 결과
- `Company` - 업체 정보
- `ServiceType`, `CompanySize`, `IndustryType` 등

### packages/ui

shadcn/ui 기반 공유 UI 컴포넌트 라이브러리입니다.

**제공 컴포넌트:**
- `Button`
- `Select`
- `Checkbox`

## 🔧 개발 가이드

### 새로운 기능 추가

1. 기능에 맞는 패키지 선택 (`apps/web` 또는 `packages/mma-sdk`)
2. 필요한 경우 공유 UI 컴포넌트를 `packages/ui`에 추가
3. 타입 정의는 각 패키지의 `types` 디렉토리에 추가

### 코드 스타일

- TypeScript 사용
- ESLint 및 Prettier 설정 준수
- 함수는 최소 단위로 분리
- 주석은 한국어로 작성

## 📄 라이선스

MIT

## 🤝 기여

이슈 및 풀 리퀘스트를 환영합니다. 프로젝트에 기여하기 전에 먼저 이슈를 열어 변경 사항을 논의해 주세요.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해 주세요.
