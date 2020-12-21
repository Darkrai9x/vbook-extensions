local doc = html:parse("<a href=\"danh-sach/truyen-moi/\">Truyện mới cập nhật</a><a href=\"danh-sach/truyen-hot/\">Truyện Hot</a><a href=\"danh-sach/tien-hiep-hay/\">Tiên Hiệp Hay</a><a href=\"danh-sach/kiem-hiep-hay/\">Kiếm Hiệp Hay</a><a href=\"danh-sach/truyen-teen-hay/\">Truyện Teen Hay</a><a href=\"danh-sach/ngon-tinh-hay/\">Ngôn Tình Hay</a><a href=\"danh-sach/ngon-tinh-sac/\">Ngôn Tình Sắc</a><a href=\"danh-sach/ngon-tinh-nguoc/\">Ngôn Tình Ngược</a><a href=\"danh-sach/ngon-tinh-sung/\">Ngôn Tình Sủng</a><a href=\"danh-sach/ngon-tinh-hai/\">Ngôn Tình Hài</a><a href=\"danh-sach/dam-my-hai/\">Đam Mỹ Hài</a><a href=\"danh-sach/dam-my-hay/\">Đam Mỹ Hay</a><a href=\"danh-sach/dam-my-h-van/\">Đam Mỹ H Văn</a><a href=\"danh-sach/dam-my-sac/\">Đam Mỹ Sắc</a><a href=\"the-loai/tien-hiep/\">Tiên Hiệp</a><a href=\"the-loai/kiem-hiep/\">Kiếm Hiệp</a><a href=\"the-loai/ngon-tinh/\">Ngôn Tình</a><a href=\"the-loai/do-thi/\">Đô Thị</a><a href=\"the-loai/quan-truong/\">Quan Trường</a><a href=\"the-loai/vong-du/\">Võng Du</a><a href=\"the-loai/khoa-huyen/\">Khoa Huyễn</a><a href=\"the-loai/huyen-huyen/\">Huyền Huyễn</a><a href=\"the-loai/di-gioi/\">Dị Giới</a><a href=\"the-loai/di-nang/\">Dị Năng</a><a href=\"the-loai/quan-su/\">Quân Sự</a><a href=\"the-loai/lich-su/\">Lịch Sử</a><a href=\"the-loai/xuyen-khong/\">Xuyên Không</a><a href=\"the-loai/trong-sinh/\">Trọng Sinh</a><a href=\"the-loai/trinh-tham/\">Trinh Thám</a><a href=\"the-loai/tham-hiem/\">Thám Hiểm</a><a href=\"the-loai/linh-di/\">Linh Dị</a><a href=\"the-loai/sac/\">Sắc</a><a href=\"the-loai/nguoc/\">Ngược</a><a href=\"the-loai/sung/\">Sủng</a><a href=\"the-loai/cung-dau/\">Cung Đấu</a><a href=\"the-loai/nu-cuong/\">Nữ Cường</a><a href=\"the-loai/gia-dau/\">Gia Đấu</a><a href=\"the-loai/dong-phuong/\">Đông Phương</a><a href=\"the-loai/dam-my/\">Đam Mỹ</a><a href=\"the-loai/bach-hop/\">Bách Hợp</a><a href=\"the-loai/hai-huoc/\">Hài Hước</a><a href=\"the-loai/dien-van/\">Điền Văn</a><a href=\"the-loai/co-dai/\">Cổ Đại</a><a href=\"the-loai/mat-the/\">Mạt Thế</a><a href=\"the-loai/truyen-teen/\">Truyện Teen</a><a href=\"the-loai/phuong-tay/\">Phương Tây</a><a href=\"the-loai/nu-phu/\">Nữ Phụ</a><a href=\"the-loai/light-novel/\">Light Novel</a><a href=\"the-loai/viet-nam/\">Việt Nam</a><a href=\"the-loai/doan-van/\">Đoản Văn</a><a href=\"the-loai/khac/\">Khác</a>")

local genre = {}
if doc ~= nil then
    local el = doc:select("a")
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local link = {}
        link["title"] = e:text()
        link["input"] = "https://truyenfull.vn/" .. e:attr("href")
        link["script"] = "gen.lua"
        table.insert(genre, link)
        local linkHoan = {}
        linkHoan["title"] = e:text() .. " (Hoàn)"
        linkHoan["input"] = "https://truyenfull.vn/" .. e:attr("href") .. "hoan"
        linkHoan["script"] = "gen.lua"
        table.insert(genre, linkHoan)
    end
    return response:success(genre)
end

return nil