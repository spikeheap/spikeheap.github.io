# frozen_string_literal: true

# Template helpers available to ERB layouts.
class Builders::Helpers < SiteBuilder
  def build
    # `ordinal_date(date)`              → "22nd January 2026"
    # `ordinal_date(date, year: false)` → "22nd January"
    #
    # 11/12/13 always take "th"; otherwise the last digit picks st/nd/rd/th.
    helper :ordinal_date do |date, year: true|
      d = date.respond_to?(:to_date) ? date.to_date : date
      day = d.day
      suffix = if (11..13).include?(day)
                 "th"
               else
                 { 1 => "st", 2 => "nd", 3 => "rd" }.fetch(day % 10, "th")
               end
      fmt = year ? "%B %Y" : "%B"
      "#{day}#{suffix} #{d.strftime(fmt)}"
    end
  end
end
