# 베이스 이미지로 Node.js 20 사용
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package.json package-lock.json* ./

# 의존성 설치 (해커톤 환경이므로 개발 의존성도 포함하여 설치)
RUN npm install

# 소스 코드 복사
COPY . .

# React 기본 포트 노출
EXPOSE 3000

# 컨테이너 내부에서 외부 접근이 가능하도록 호스트 설정
ENV HOST=0.0.0.0

# npm start로 애플리케이션 실행
CMD ["npm", "start"]
