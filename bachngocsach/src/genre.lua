local doc = http:get("https://bachngocsach.com/reader/theloai"):html()

local genre = {}
if doc ~= nil then
    local el = doc:select("div.view-content .theloai-row a")
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local link = {}
        link["title"] = e:text()
        link["input"] = "https://bachngocsach.com" .. e:attr("href")
        link["script"] = "gen.lua"
        table.insert(genre, link)
    end
    return response:success(genre)
end

return nil