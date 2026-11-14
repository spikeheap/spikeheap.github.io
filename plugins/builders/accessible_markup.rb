# frozen_string_literal: true

# Post-processes rendered HTML for accessibility.
#
# Code blocks scroll horizontally, so they need to be keyboard focusable
# (WCAG 2.1.1). Kramdown and Rouge don't emit `tabindex`, so add it here.
#
# Kramdown's footnote back-links contain only an arrow, so give them a name.
class Builders::AccessibleMarkup < SiteBuilder
  def build
    hook :resources, :post_render do |resource|
      next unless resource.destination&.output_ext == ".html"

      resource.output = resource.output
        .gsub(/<pre(?![^>]*\btabindex=)(?=[\s>])/, '<pre tabindex="0"')
        .gsub(/<a href="#fnref:([^"]+)" class="reversefootnote"/) do
          %(<a href="#fnref:#{Regexp.last_match(1)}" class="reversefootnote" aria-label="Back to reference #{Regexp.last_match(1)}")
        end
    end
  end
end
