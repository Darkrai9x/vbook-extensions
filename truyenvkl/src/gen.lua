local url, page = ...
local doc
if text:is_empty(page) then
    page = 1
    doc = http:get(url):html():select(".theloai-thumlist")
else
    local slug = regexp:find(url, "keyword/(.*?)$")
    doc = http:post("https://truyenvkl.com/wp-admin/admin-ajax.php")
              :params({ ["action"] = "load_more_tax",
                        ["keyword_check"] = "",
                        ["current_page_tax"] = page,
                        ["max_page_tax"] = "23",
                        ["option_keyword_tax"] = "new-chap",
                        ["term[taxonomy]"] = "keyword",
                        ["term[slug]"] = slug })
              :html()
end

if doc ~= nil then
    local el = doc:select("li")
    local novelList = {}
    local next = num:to_int(page) + 1
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {}
        local cover = e:select(".thumbnail img"):attr("data-src")
        if text:is_empty(page) then
            cover = e:select(".thumbnail img"):attr("src")
        end
        novel["name"] = e:select("h2"):text()
        novel["link"] = e:select("h2 a"):attr("href")
        novel["description"] = e:select(".content p"):first():text()
        novel["cover"] = cover
        novel["host"] = "https://truyenvkl.com"
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil