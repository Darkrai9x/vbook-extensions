local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local book = {}
    book["name"] =  doc:select("h1"):text()
    book["cover"] = doc:select("div.book-img img"):attr("src")
    book["author"] = doc:select("div.book-information div.book-info a"):first():text()
    book["description"] = doc:select("div.book-info-detail div.book-intro"):html()
    book["detail"] = text:replace(doc:select("p.tag"):html(), "(</[a-z]+>)", "$1<br>")
    book["host"] = "https://truyen.tangthuvien.vn"
    book["ongoing"] = text:contains(doc:select("p.tag"):html(), ">Đang ra<")
    return response:success(book)
end
return nil