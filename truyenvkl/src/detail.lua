local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local book = {}
    book["name"] =  doc:select("h1"):text()
    book["cover"] = doc:select(".book3d img"):first():attr("data-src")
    book["host"] = "https://truyenvkl.com"
    book["author"] = doc:select(".thong_tin a"):first():text()
    book["description"] = doc:select(".gioi_thieu"):html()
    book["detail"] = doc:select(".thong_tin p"):html()
    book["ongoing"] = text:contains(doc:select(".thong_tin"):html(), "Đang Cập Nhật")
    return response:success(book)
end
return nil