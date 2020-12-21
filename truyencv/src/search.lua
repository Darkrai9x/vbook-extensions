local key, page = ...
if text:is_empty(page) then
    page = 1
end

local doc = http:get("http://truyencv.com/tim-kiem/all/" .. key .. "/trang-" .. page):html()
local list = {}
if doc ~= nil then
    local el = doc:select("div.block-content ul.list-group li")
    if el ~= nil then
        for i = 0, el:size() - 1 do
            local e = el:get(i)
            local item = {}
            item["name"] = e:select("h2.title a"):text()
            item["link"] = e:select("h2.title a"):attr("href")
            item["cover"] = text:replace(e:select("a.thumb img"):attr("src"), "30x40", "100x150")
            item["description"] = e:select("div.chap"):text()
            item["host"] = "http://truyencv.com"
            table.insert(list, item)
        end
        local pageNext = doc:select("li.active + li"):text()
        if not num:is_int(pageNext) then
            pageNext = ""
        end
        return response:success(list, pageNext)
    end
end
return nil
