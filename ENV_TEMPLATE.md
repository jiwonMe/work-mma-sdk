# 환경변수 설정 가이드 (Vercel)

## 1. Vercel KV 설정

Vercel 대시보드에서 KV 스토어를 생성하면 환경변수가 자동으로 설정됩니다.

### 설정 방법

1. [Vercel 대시보드](https://vercel.com/dashboard) → 프로젝트 선택
2. **Storage** 탭 클릭
3. **Create Database** → **KV** 선택
4. 데이터베이스 이름 입력 후 생성
5. 프로젝트에 연결 (Connect to Project)

### 자동 설정되는 환경변수

| 변수명 | 설명 |
|--------|------|
| `KV_REST_API_URL` | Vercel KV REST API URL |
| `KV_REST_API_TOKEN` | Vercel KV REST API 토큰 |
| `KV_REST_API_READ_ONLY_TOKEN` | 읽기 전용 토큰 |
| `KV_URL` | Redis 호환 URL |

## 2. 로컬 개발 환경

Vercel CLI를 사용하여 환경변수를 로컬에서 사용할 수 있습니다.

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 연결
vercel link

# 환경변수 가져오기
vercel env pull .env.local
```

또는 `apps/web/.env.local` 파일을 직접 생성:

```bash
# Vercel KV 환경변수 (Vercel 대시보드에서 복사)
KV_REST_API_URL=https://xxxx.kv.vercel-storage.com
KV_REST_API_TOKEN=xxxx

# Next.js 환경
NODE_ENV=development
```

## 3. 환경변수 목록

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `KV_REST_API_URL` | ✅ | Vercel KV REST API URL |
| `KV_REST_API_TOKEN` | ✅ | Vercel KV REST API 토큰 |
| `NODE_ENV` | ❌ | 실행 환경 (자동 설정) |

## 4. 빠른 시작

```bash
# 1. Vercel CLI로 환경변수 가져오기
vercel link
vercel env pull apps/web/.env.local

# 2. 의존성 설치
pnpm install

# 3. 개발 서버 실행
pnpm dev

# 4. Vercel 배포
vercel --prod
```

## 5. 주의사항

- Vercel KV는 **Vercel Pro** 이상 플랜에서 사용 가능합니다
- 무료 플랜은 월 30,000 요청 제한이 있습니다
- 로컬 개발 시에도 실제 Vercel KV에 연결됩니다 (개발용 KV 별도 생성 권장)
