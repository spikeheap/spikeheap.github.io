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
JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config.build.yml

# We need a CircleCI config otherwise we'll get a warning email for every deploy
cp -r .circleci _site/

# navigate into the build output directory
cd _site/

git init
git checkout -b main
git add -A
git commit -m "Build output from ./bin/deploy.sh using commit ${COMMIT_SHA1}"

echo "Push to the generated_site branch from whatever we're on at the moment"
git push -f git@github.com:spikeheap/spikeheap.github.io.git main:generated_site

cd -
