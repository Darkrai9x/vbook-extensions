local url, page = ...
if text:is_empty(page) then
    page = '0'
end

local doc = http:post("https://truy.in/wp-admin/admin-ajax.php"):params({
    ["action"] = "madara_load_more",
    ["page"] = page,
    ["template"] = "madara-core/content/content-archive",
    ["vars[paged]"] = "1",
    ["vars[orderby]"] = "meta_value_num",
    ["vars[template]"] = "archive",
    ["vars[sidebar]"] = "full",
    ["vars[post_type]"] = "wp-manga",
    ["vars[post_status]"] = "publish",
    ["vars[meta_key]"] = url,
    ["vars[manga_archives_item_layout]"] = "default"
}):html()

if doc ~= nil then
    local el = doc:select(".page-item-detail.manga")
    local novelList = {}
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {
            ["name"] = e:select("h5 a"):text(),
            ["link"] = e:select("h5 a"):first():attr("href"),
            ["cover"] = e:select("img"):first():attr("src"),
            ["host"] = "https://truy.in"
        }
        table.insert(novelList, novel)
    end

    return response:success(novelList, num:to_int(page) + 1)
end

return nil