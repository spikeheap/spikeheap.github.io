# frozen_string_literal: true

# Custom permalink placeholder so we preserve the legacy Jekyll URL shape
# `/posts/YYYY-MM-DD-slug` in a single path segment. Bridgetown splits
# permalinks by `/`, so combining year/month/day/title with hyphens needs
# a single token.
Bridgetown::Resource::PermalinkProcessor.register_placeholder(
  :dated_slug,
  ->(resource) {
    date_part = resource.date.strftime("%Y-%m-%d")
    name = resource.basename_without_ext.to_s
    # Strip any leading YYYY-MM-DD[-_] from the filename to recover the title.
    title_part = name.sub(/\A\d{4}-\d{2}-\d{2}[-_]/, "")
    "#{date_part}-#{title_part}"
  }
)

Bridgetown.configure do |config|
  # Placeholder for future hand-rolled builders (sitemap, feed, redirect stubs)
  # when they need Ruby code.
end
