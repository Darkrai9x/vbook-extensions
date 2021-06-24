function execute() {
    return Response.success([
        {title: "Mới cập nhật", script: "gen.js", input: "https://www.wattpad.com/api/v3/stories?filter=new"}
    ]);
}
