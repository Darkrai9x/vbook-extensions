local doc = html:parse("<a href=\"/sach-truyen-full\">Truyện Full</a><a href=\"/tu-sang-tac.html\">Tự sáng tác</a><a href=\"/gac-chuyen-ngu.html\">Gác chuyển ngữ</a><a href=\"/van-hoc-viet-nam.html\">Văn học Việt Nam</a><a href=\"/van-hoc-nuoc-ngoai.html\">Văn học nước ngoài</a><a href=\"/ngon-tinh-trung-quoc.html\">Ngôn tình Trung Quốc</a><a href=\"/van-hoc-nhat-ban.html\">Văn học Nhật Bản</a><a href=\"/vo-hiep.html\">Võ Hiệp</a><a href=\"/van-hoc-kinh-dien.html\">Văn học kinh điển</a><a href=\"/tieu-thuyet-tinh-yeu.html\">Tiểu thuyết tình yêu</a><a href=\"/sach-teen.html\">Sách Teen</a><a href=\"/ky-ao.html\">Kỳ Ảo</a><a href=\"/truyen-ma-kinh-di.html\">Truyện ma - Kinh dị</a><a href=\"/trinh-tham.html\">Trinh thám</a><a href=\"/lich-su-hoi-ky.html\">Lịch sử - Hồi ký</a><a href=\"/kinh-te.html\">Kinh tế</a><a href=\"/van-hoa-xa-hoi.html\">Văn hóa - Xã hội</a><a href=\"/khoa-hoc-ki-thuat.html\">Khoa học - Kĩ thuật</a><a href=\"/ky-nang-song.html\">Kỹ năng sống</a><a href=\"/tam-li-gioi-tinh.html\">Tâm lí - Giới tính</a><a href=\"/tu-khoa/sach-hiem.html\">Sách hiếm</a><a href=\"/tuyen-tap.html\">Tuyển tập</a>")
local genre = {}
if doc ~= nil then
    local el = doc:select("a")
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local link = {}
        link["title"] = e:text()
        link["input"] = "https://gacsach.com" .. e:attr("href")
        link["script"] = "gen.lua"
        table.insert(genre, link)
    end
    return response:success(genre)
end

return nil