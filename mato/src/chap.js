function execute(url) {
    let response = fetch(url);
    if (!response.ok) return Response.error('Không tải được chương');

    let chapter = response.json();
    return Response.success(chapter.pages);
}
