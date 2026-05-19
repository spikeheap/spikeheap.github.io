# frozen_string_literal: true

# Replaces jekyll-redirect-from. For every resource carrying a `redirect_from`
# frontmatter entry, generates a stub HTML page at the listed URL that meta-
# refreshes and JS-redirects to the canonical URL.
class Builders::Redirects < SiteBuilder
  def build
    generator do
      site.collections.values.each do |collection|
        next unless collection.resources.respond_to?(:each)
        collection.resources.each do |resource|
          Array(resource.data.redirect_from).each do |from_url|
            create_redirect_resource(from_url, resource.relative_url)
          end
        end
      end
    end
  end

  private

  def create_redirect_resource(from_url, target_url)
    html = redirect_html(target_url)
    # Each redirect stub is a synthetic page added to the `pages` collection.
    # The path argument is internal and just needs to be unique.
    synthetic_path = "redirects/#{from_url.gsub(%r{[^a-z0-9]+}i, "_").gsub(%r{^_|_$}, "")}.html"
    add_resource :pages, synthetic_path do
      permalink from_url
      content html
    end
  end

  def redirect_html(target_relative)
    canonical_url = "#{site.metadata.url}#{target_relative}"
    target_json = canonical_url.to_json
    <<~HTML
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="utf-8">
      <title>Redirecting…</title>
      <meta http-equiv="refresh" content="0; url=#{canonical_url}">
      <link rel="canonical" href="#{canonical_url}">
      <meta name="robots" content="noindex">
      <script>location.replace(#{target_json});</script>
      </head>
      <body>
      <h1>Redirecting…</h1>
      <p><a href="#{canonical_url}">Continue to #{canonical_url}</a></p>
      </body>
      </html>
    HTML
  end
end
