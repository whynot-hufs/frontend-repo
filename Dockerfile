# 베이스 이미지로 Node.js 20 사용
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package.json package-lock.json* ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 서비스 포트 설정 (React의 기본 개발 서버 포트)
EXPOSE 3000

# npm start로 애플리케이션 실행
CMD ["npm", "start"]
