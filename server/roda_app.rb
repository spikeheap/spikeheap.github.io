class RodaApp < Roda
  plugin :bridgetown_server

  route do |r|
    # Match GitHub Pages' "pretty URL" precedence: for a no-extension request
    # like `/now`, prefer `now.html` over `now/index.html`. Bridgetown's
    # default SSG plugin checks the directory's index.html first, which would
    # cause our redirect stubs at `<page>/index.html` to shadow the canonical
    # `<page>.html` files and trigger an infinite redirect loop.
    if r.path != "/" && !r.path.end_with?("/") && File.extname(r.path).empty?
      output_dir = self.class.opts[:bridgetown_preloaded_config].destination
      html_path = File.join(output_dir, "#{r.path}.html")
      if File.file?(html_path)
        response["Content-Type"] = "text/html; charset=utf-8"
        next File.read(html_path)
      end
    end

    r.bridgetown
  end
end
