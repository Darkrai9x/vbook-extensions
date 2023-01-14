function execute(key, page) {
    let response = fetch("https://kakarot.cuutruyen.net/api/v2/mangas/quick_search?q=" + key);

    if (response.ok) {
        let json = response.json();
        let novels = [];
        json.data.forEach(item => {
            novels.push({
                name: item.name,
                link: "https://cuutruyen.net/mangas/" + item.id,
                cover: item.cover_url,
                description: "C. " + item.newest_chapter_number
            })
        });

        return Response.success(novels);
    }

    return null;
}