# frozen_string_literal: true

require "bridgetown"
require "date"
require "fileutils"

Bridgetown.load_tasks

# ----------------------------------------------------------------------------
# Scaffolding tasks
# ----------------------------------------------------------------------------

POSTS_DIR      = File.expand_path("src/_posts", __dir__)
PAGES_DIR      = File.expand_path("src/_pages", __dir__)
TYPST_TEMPLATE = File.expand_path("typst/cv.typ", __dir__)
TYPST_FONTS    = File.expand_path("typst/fonts", __dir__)
# PDFs deliberately land outside src/ so Bridgetown never copies them
# into the public site build. They're distributed as private GitHub
# release artefacts instead.
PDF_OUTPUT_DIR = File.expand_path("tmp/cv", __dir__)

def slugify(text)
  text
    .to_s
    .downcase
    .gsub(/[^a-z0-9]+/, "-")
    .gsub(/\A-|-\z/, "")
end

def require_title!
  title = ENV["title"]
  return title if title && !title.strip.empty?

  abort "usage: rake #{Rake.application.top_level_tasks.first} title=\"Post title\""
end

namespace :post do
  desc 'Create a new post. Usage: rake post:new title="Post title" [slug="custom-slug"] [tags="tag1,tag2"]'
  task :new do
    title = require_title!
    slug = ENV["slug"]&.strip
    slug = slugify(slug && !slug.empty? ? slug : title)
    date = Date.today
    filename = "#{date.iso8601}-#{slug}.md"
    path = File.join(POSTS_DIR, filename)

    abort "refusing to overwrite #{path}" if File.exist?(path)

    tag_lines = (ENV["tags"] || "")
      .split(",")
      .map(&:strip)
      .reject(&:empty?)
    tags_block = tag_lines.empty? ? "  - " : tag_lines.map { |t| "  - #{t}" }.join("\n")

    contents = <<~FRONTMATTER
      ---
      title: "#{title.gsub('"', '\\"')}"
      date: #{date.iso8601}
      tags:
      #{tags_block}
      description: >-

      # mastodon: https://ruby.social/@spikeheap/<toot-id>
      ---


    FRONTMATTER

    FileUtils.mkdir_p(POSTS_DIR)
    File.write(path, contents)
    puts "Created #{path}"
  end
end

namespace :cv do
  # Compiles the CV variants into tmp/cv/. These PDFs contain personal
  # contact data and are intentionally kept out of the public site build;
  # CI uploads them as GitHub release artefacts on the private repository.
  desc "Compile both CV PDFs from the Typst template → tmp/cv/."
  task :pdf do
    unless system("command -v typst > /dev/null 2>&1")
      abort "typst not found on PATH. Install with: brew install typst"
    end

    FileUtils.mkdir_p(PDF_OUTPUT_DIR)

    {
      "tech_leadership"     => "cv.pdf",
      "security_leadership" => "cv-security.pdf",
    }.each do |view, filename|
      output = File.join(PDF_OUTPUT_DIR, filename)
      puts "Compiling #{view} → #{output}"
      ok = system(
        "typst", "compile",
        "--root", __dir__,
        "--font-path", TYPST_FONTS,
        TYPST_TEMPLATE,
        output,
        "--input", "view=#{view}",
      )
      abort "typst compile failed for view=#{view}" unless ok
    end
  end
end

namespace :page do
  desc 'Create a new page. Usage: rake page:new title="Page title" [slug="custom-slug"] [permalink="/path"]'
  task :new do
    title = require_title!
    slug = ENV["slug"]&.strip
    slug = slugify(slug && !slug.empty? ? slug : title)
    permalink = ENV["permalink"]&.strip
    permalink = "/#{slug}.html" if permalink.nil? || permalink.empty?
    path = File.join(PAGES_DIR, "#{slug}.md")

    abort "refusing to overwrite #{path}" if File.exist?(path)

    contents = <<~FRONTMATTER
      ---
      title: "#{title.gsub('"', '\\"')}"
      permalink: #{permalink}
      layout: page
      ---


    FRONTMATTER

    FileUtils.mkdir_p(PAGES_DIR)
    File.write(path, contents)
    puts "Created #{path}"
  end
end
