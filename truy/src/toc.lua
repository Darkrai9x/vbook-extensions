local url = ...

local doc = http:get(url):html()
if doc ~= nil then
    local list = {}
    local el = doc:select(".c-page__content .wp-manga-chapter a")
    for i = el:size() - 1, 0, -1 do
        local e = el:get(i)
        local name = e:text()
        if (text:matches(name, "\\d+")) then
            name = "Chương " .. name
        end
        local chap = {
            ["name"] = name,
            ["url"] = e:attr("href"),
            ["host"] = "https://truy.in",
        }
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil