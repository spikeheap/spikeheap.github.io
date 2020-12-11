#!/usr/bin/env sh

#
# Deploy to GitHub Pages
# Based on https://vuepress.vuejs.org/guide/deploy.html#github-pages
#

# abort on errors
set -e

# Attempt to use CircleCI's environment variables, else pull from git
COMMIT_SHA1=${CIRCLE_SHA1:-`git rev-parse --short HEAD`}

# build
npm run build

cp -r .circleci src/.vuepress/dist/

# navigate into the build output directory
cd src/.vuepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m "Build output from ./bin/deploy.sh using commit ${COMMIT_SHA1}"

echo "Push to the generated_site branch from whatever we're on at the moment"
git push -f git@github.com:spikeheap/spikeheap.github.io.git main:generated_site

cd -