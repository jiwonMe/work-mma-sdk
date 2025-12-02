# 환경변수 설정 가이드

## 1. 로컬 개발 환경

`apps/web/.env.local` 파일을 생성하고 아래 내용을 복사하세요:

```bash
# Redis 연결 URL
REDIS_URL=redis://default:YOUR_PASSWORD@YOUR_HOST:PORT
```

## 2. Vercel 배포 환경

Vercel 대시보드에서 환경변수를 설정하세요:

1. [Vercel 대시보드](https://vercel.com/dashboard) → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 아래 환경변수 추가:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `REDIS_URL` | `redis://...` | Redis 연결 URL |

## 3. Redis 서비스 옵션

### Redis Cloud (추천)
- https://redis.com/cloud/
- 무료 티어: 30MB 제공
- URL 형식: `redis://default:PASSWORD@HOST:PORT`

### Upstash
- https://upstash.com/
- 서버리스 Redis
- Vercel 통합 지원

### Railway
- https://railway.app/
- Redis 플러그인 제공

## 4. 환경변수 목록

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `REDIS_URL` | ✅ | Redis 연결 URL |
| `NODE_ENV` | ❌ | 실행 환경 (자동 설정) |

## 5. 빠른 시작

```bash
# 1. 환경변수 설정
cp apps/web/.env.local.example apps/web/.env.local
# .env.local 파일에 REDIS_URL 설정

# 2. 의존성 설치
pnpm install

# 3. 패키지 빌드
pnpm --filter ui build && pnpm --filter mma-sdk build

# 4. 개발 서버 실행
pnpm dev

# 5. Vercel 배포
vercel --prod
```
