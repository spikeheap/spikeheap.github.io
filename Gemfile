# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

gem "jekyll"

# github-pages is disabled becuse the github-metadata plugin overrides baseUrl and
# _cannot_ be used for sites that run at the root of the domain.
# See https://github.com/jekyll/github-metadata/issues/190
gem 'github-pages', group: :jekyll_plugins

gem "webrick", "~> 1.8"

gem "minimal-mistakes-jekyll", "~> 4.24"

gem "jekyll-include-cache", "~> 0.2.1"

# gem "kramdown-parser-gfm", "~> 1.1"
