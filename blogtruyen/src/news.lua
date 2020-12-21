local url, page = ...
if text:is_empty(page) then
    page = 1
end

local doc = http:get(url ..  "-"  .. page):html()

if doc ~= nil then
    local el = doc:select(".list-mainpage .storyitem")
    local novelList = {}
    local next

    local last = doc:select(".pagination"):select("li:has(.glyphicon-step-forward)"):last():select("a")
    if last ~= nil then
        next = regexp:find(last, "-(\\d+)")
    end
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {
            ["name"] = e:select(".title a"):attr("title"),
            ["link"] = e:select(".title a"):first():attr("href"),
            ["description"] = e:select(".statictis"):last():text(),
            ["cover"] = e:select("img"):first():attr("src"),
            ["host"] = "https://blogtruyen.vn"
        }
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil