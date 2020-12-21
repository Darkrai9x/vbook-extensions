local url = ...
local htp = http:get(url)
local doc = htp:html()
local newUrl = htp:url()
if text:contains(newUrl, "metruyenchu.com") then
    if doc ~= nil then
        local book = {}
        book["name"] = doc:select("h1.h3"):text()
        book["cover"] = doc:select("div.nh-thumb img"):attr("src")
        book["host"] = "https://metruyenchu.com"
        book["author"] = doc:select("div.page-content div.media-body ul li"):first():text()
        book["description"] = doc:select("div#nav-intro .content"):html()
        local detail = ""
        local el = doc:select("div.page-content div.media-body ul"):first():select("li")
        for i = 0, el:size() - 1 do
            detail = detail .. el:get(i):text() .. "<br>"
        end
        book["detail"] = detail
        book["url"] = newUrl
        book["ongoing"] = text:contains(detail, "Đang ra")
        return response:success(book)
    end
elseif text:contains(newUrl, "nuhiep.com") then
    if doc ~= nil then
        local book = {}
        book["name"] = doc:select("h1.h3"):text()
        book["cover"] = doc:select("div.nh-thumb img"):attr("src")
        book["host"] = "https://nuhiep.com"
        book["author"] = doc:select("div.page-content div.media-body ul li"):first():text()
        book["description"] = doc:select("div#nav-intro .content"):html()
        local detail = ""
        local el = doc:select("div.page-content div.media-body ul"):first():select("li")
        for i = 0, el:size() - 1 do
            detail = detail .. el:get(i):text() .. "<br>"
        end
        book["detail"] = detail
        book["url"] = newUrl
        book["ongoing"] = text:contains(detail, "Đang ra")
        return response:success(book)
    end
elseif text:contains(newUrl, "vtruyen.com") then
    if doc ~= nil then
        local book = {}
        book["name"] = doc:select("h1.h3"):text()
        book["cover"] = doc:select("div.nh-thumb img"):attr("src")
        book["host"] = "https://vtruyen.com"
        book["author"] = doc:select("div.page-content div.media-body ul li"):first():text()
        book["description"] = doc:select("div#nav-intro .content"):html()
        local detail = ""
        local el = doc:select("div.page-content div.media-body ul"):first():select("li")
        for i = 0, el:size() - 1 do
            detail = detail .. el:get(i):text() .. "<br>"
        end
        book["detail"] = detail
        book["url"] = newUrl
        book["ongoing"] = text:contains(detail, "Đang ra")
        return response:success(book)
    end
else
    if doc ~= nil then
        local book = {}
        book["name"] = doc:select("h1.title"):text()
        book["cover"] = doc:select("div.thumb img.img-responsive"):attr("src")
        book["host"] = "https://truyencv.com"
        book["author"] = doc:select("div.info div.item a"):first():text()
        book["description"] = doc:select("div.brief"):html()
        local detail = ""
        local el = doc:select("div.info div.list div.item")
        for i = 0, el:size() - 1 do
            detail = detail .. el:get(i):text() .. "<br>"
        end
        book["detail"] = detail
        book["url"] = newUrl
        book["ongoing"] = text:contains(detail, "Đang ra")
        return response:success(book)
    end
end

return nil