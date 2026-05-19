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

    # `month_year("2026-03")` → "Mar 2026"
    # `month_year("2012-12-16")` → "Dec 2012"
    # `month_year("2002")` → "2002"
    # `month_year("present")` / `month_year(nil)` → "present"
    helper :month_year do |value|
      s = value.to_s.strip
      if s.empty? || s == "present"
        "present"
      else
        parts = s.split("-")
        if parts.length < 2
          s
        else
          months = %w[Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec]
          idx = parts[1].to_i - 1
          if idx < 0 || idx > 11
            s
          else
            "#{months[idx]} #{parts[0]}"
          end
        end
      end
    end
  end
end
