local url = ...

local doc = http:get(url):html()
if doc ~= nil then
    local list = {}
    local name = text:replace(doc:select("title"):text(), "\\s*\\|\\s*BlogTruyen.Com", "")
    local el = doc:select("#list-chapters .title a")
    for i = el:size() - 1, 0, -1 do
        local e = el:get(i)
        local chap = {
            ["name"] = text:replace(e:text(), "^" .. name .. " ", ""),
            ["url"] = e:attr("href"),
            ["host"] = "https://blogtruyen.vn",
        }
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil