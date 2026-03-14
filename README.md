# Nafal (나팔) - 경매 플랫폼 MVP

믿을 수 있는 가치 플랫폼. 갖고 싶은 한정판 제품은 다 나팔에서.

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Nest.js 11, TypeScript, Prisma ORM
- **Database**: PostgreSQL 17 (Docker)
- **Deployment**: Railway

## 시작하기

```bash
# DB 실행
docker-compose up -d

# Backend
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```
