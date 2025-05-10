# 빌드 단계
FROM node:20-alpine as build
# 작업 디렉토리 설정
WORKDIR /app
# 의존성 파일 복사
COPY package.json package-lock.json* ./
# 의존성 설치
RUN npm install
# 소스 코드 복사
COPY . .
# 프로덕션 빌드 실행
RUN npm run build

# 실행 단계 - 간단한 정적 파일 서버 사용
FROM node:20-alpine
WORKDIR /app
# 빌드 단계에서 생성된 빌드 폴더 복사
COPY --from=build /app/build ./build
# serve 패키지 전역 설치
RUN npm install -g serve
# 포트 80 노출
EXPOSE 80
# serve를 사용하여 정적 파일 제공 (포트 80)
CMD ["serve", "-s", "build", "-l", "80"]`
