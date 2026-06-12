var BASE_URL = "https://truyennet.org";
var USER_AGENT = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) vBook TruyenNet/1.0";

function execute() {
  return Response.success([
    { title: "Truyện hot", input: BASE_URL + "/danh-sach/truyen-hot", script: "list.js" },
    { title: "Truyện full", input: BASE_URL + "/danh-sach/truyen-full", script: "list.js" },
    { title: "Ngôn tình hay", input: BASE_URL + "/danh-sach/truyen-ngon-tinh-hay", script: "list.js" },
    { title: "Huyền huyễn", input: BASE_URL + "/the-loai/huyen-huyen", script: "list.js" }
  ]);
}