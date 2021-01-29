local url = ...
local new_url = url .. "/content"

local list = {}

while (new_url ~= nil) do
    local doc = http:get(new_url):html()
    local el = doc:select("div.chlist._page li a")

    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local chap = {
            ["name"] = e:text(),
            ["url"] = e:attr("href"),
            ["host"] = "https://chivi.xyz/"
        }
        table.insert(list, chap)
    end

    local page = doc:select(".pagi"):select("a._primary._disable + a"):text()

    if text:is_empty(page) then
        new_url = nil
    else
        new_url = url .. doc:select(".pagi"):select("a._primary._disable + a"):attr("href")
    end
end
return response:success(list)

