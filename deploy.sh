#!/bin/bash

echo "📥 GitHub에서 최신 코드 가져오는 중..."

# 로컬 변경사항이 있으면 자동 스태시
if [[ -n $(git status --porcelain) ]]; then
  echo "⚠️  로컬 변경사항이 있습니다. 자동으로 스태시합니다."
  git stash save "auto-stash-before-pull"
fi

# pull 시도
git pull origin main

# 스태시 복원
if git stash list | grep -q "auto-stash-before-pull"; then
  echo "🔄 변경사항 복원 중..."
  git stash pop
fi

echo "📦 의존성 설치 확인 중..."
npm install

echo "🔨 Next.js 빌드 중..."
npm run build

echo "🚀 서버 재시작 중..."
pm2 restart pet-metashopping-app

echo "✅ 배포 완료!"
