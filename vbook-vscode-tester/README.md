# vBook VSCode Tester

![vBook Tester](media/vbooktester.png)

Tiện ích mở rộng VS Code để kiểm thử, đóng gói và cài đặt extension vBook trực tiếp từ môi trường phát triển.

## Tổng quan

`vBook VSCode Tester` cung cấp một giao diện sidebar nhỏ gọn, cho phép bạn:

- Chọn thư mục extension trong workspace.
- Chọn script từ thư mục `src/`.
- Cấu hình server URL của vBook local API.
- Truyền tham số vào script.
- Xem phản hồi JSON trực tiếp.
- Lưu lại lịch sử các lần chạy gần nhất.
- Build và cài đặt extension từ VS Code.

## Tính năng chính

- Mở được panel `vBook Tester` trong sidebar của VS Code.
- Quét workspace để tìm tất cả thư mục extension hợp lệ có `plugin.json` và `src/`.
- Hiển thị các script tồn tại trong `src/` để chọn nhanh.
- Tự động sinh form tham số từ chữ ký `execute(...)` nếu có.
- Chạy script theo hai chế độ API: **Cũ** hoặc **Mới**.
- Bật/tắt tự động mở Output khi chạy trực tiếp trên giao diện.
- Ghi nhớ Server URL, thư mục, script và các tham số.
- Lưu tham số riêng biệt theo từng thư mục/script.
- Tự động bắt lỗi chi tiết hơn khi chạy `TestAll`.
- Hiển thị thông báo lỗi trực quan trên giao diện.

## Cách sử dụng

1. Trong cửa sổ VS Code, mở workspace chứa extension vBook của bạn.

2. Mở `vBook Tester` từ Activity Bar hoặc chạy lệnh:

   ```text
   vBook: Open Tester
   ```

3. Trong panel:

    Nhập **Server** là địa chỉ vBook API.

    Mặc định:

    ```text
    http://127.0.0.1:8080
    ```

    Chọn **Thư mục extension** cần kiểm thử.
    Chọn **Script** trong danh sách file nguồn.
    Nhập tham số vào phần **Tham số**.
    Chọn từ **Lịch sử** nếu muốn dùng lại input trước đó.
    Nhấn **Chạy** để thực hiện script và xem kết quả ở khung phản hồi.

4. Dùng **Gói** để xuất `plugin.zip`, hoặc **Cài** để cài extension lên thiết bị/giả lập.

## Các nút chức năng

### Out

Mở bảng Output, hay Output Channel, của `vBook Tester` để xem log chi tiết các tiến trình đang chạy.

### TestAll

Chạy toàn bộ bước kiểm thử chỉ với một lần bấm.

Quá trình sẽ tự động tuần tự chạy:

```text
home.js -> gen.js -> detail.js -> page.js -> toc.js -> chap.js -> track.js
```

Hệ thống cũng hỗ trợ tự động tìm và chạy các script phụ như:

- `gen.js`
- `suggests.js`
- `comment.js`
- Các script phụ khác nằm trong cấu trúc trả về của `detail.js`

Nếu có bước nào thất bại, tiến trình sẽ chủ động dừng và báo lỗi chi tiết trên màn hình.

### Gói

Build package `plugin.zip` từ thư mục extension.

### Cài

Cài extension lên server vBook.

### Chạy

Gửi request thực thi script và trả về dữ liệu.

## Cấu hình

Bạn có thể thay đổi các thiết lập sau trong Settings của VS Code:

### `vbookTester.defaultServerUrl`

URL mặc định cho server local.

Mặc định:

```text
http://127.0.0.1:8080
```

### `vbookTester.maxHistory`

Số lượng lịch sử chạy gần nhất được lưu lại để gợi ý trên giao diện.

Mặc định:

```text
15
```

## Ghi chú

- Extension hợp lệ khi thư mục chứa cả file `plugin.json` và thư mục `src/`.
- Nếu có file `icon.png`, extension sẽ tự động nén icon này cùng payload khi build/install.
- Người dùng có thể chuyển đổi ngôn ngữ hiển thị **VI / EN** hoặc phiên bản API ngay trên panel thông qua các nút chip.