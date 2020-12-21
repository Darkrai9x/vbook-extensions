local url = ...

local doc = http:get(url):html()
if doc ~= nil then
    local detail = doc:select(".profile-manga")
    local book = {
        ["name"] = detail:select(".post-title h3"):text(),
        ["cover"] = detail:select(".summary_image img"):first():attr("data-src"),
        ["host"] = "https://truy.in",
        ["author"] = detail:select("a.org"):text(),
        ["detail"] = detail:select(".post-content .post-content_item"):html(),
        ["ongoing"] = text:contains(detail:select(".post-status .summary-content"):text(), "OnGoing")
    }
    return response:success(book)
end
return nil