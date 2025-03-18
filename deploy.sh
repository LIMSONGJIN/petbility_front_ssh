#!/bin/bash

echo "📥 GitHub에서 최신 코드 가져오는 중..."
git pull origin main

echo "📦 의존성 설치 확인 중..."
npm install

echo "🔨 Next.js 빌드 중..."
npm run build

echo "🚀 서버 재시작 중..."
pm2 restart pet-metashopping-app

echo "✅ 배포 완료!"
