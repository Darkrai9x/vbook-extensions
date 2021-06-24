function execute() {
    var genre = [];
    var htm = "<li id=\"54\">16+</li><li id=\"45\">18+</li><li id=\"1\">Action</li><li id=\"2\">Adult</li><li id=\"3\">Adventure</li><li id=\"4\">Anime</li><li id=\"5\">Comedy</li><li id=\"6\">Comic</li><li id=\"7\">Doujinshi</li><li id=\"49\">Drama</li><li id=\"48\">Ecchi</li><li id=\"60\">Event BT</li><li id=\"50\">Fantasy</li><li id=\"64\">Full màu</li><li id=\"61\">Game</li><li id=\"51\">Gender Bender</li><li id=\"12\">Harem</li><li id=\"13\">Historical</li><li id=\"14\">Horror</li><li id=\"63\">Isekai/Dị giới/Trọng sinh</li><li id=\"15\">Josei</li><li id=\"16\">Live action</li><li id=\"46\">Magic</li><li id=\"55\">manga</li><li id=\"17\">Manhua</li><li id=\"18\">Manhwa</li><li id=\"19\">Martial Arts</li><li id=\"20\">Mature</li><li id=\"21\">Mecha</li><li id=\"22\">Mystery</li><li id=\"56\">Nấu Ăn</li><li id=\"65\">Ngôn Tình</li><li id=\"62\">NTR</li><li id=\"23\">One shot</li><li id=\"24\">Psychological</li><li id=\"25\">Romance</li><li id=\"26\">School Life</li><li id=\"27\">Sci-fi</li><li id=\"28\">Seinen</li><li id=\"29\">Shoujo</li><li id=\"30\">Shoujo Ai</li><li id=\"31\">Shounen</li><li id=\"32\">Shounen Ai</li><li id=\"33\">Slice of life</li><li id=\"34\">Smut</li><li id=\"35\">Soft Yaoi</li><li id=\"36\">Soft Yuri</li><li id=\"37\">Sports</li><li id=\"38\">Supernatural</li><li id=\"39\">Tạp chí truyện tranh</li><li id=\"40\">Tragedy</li><li id=\"58\">Trap (Crossdressing)</li><li id=\"57\">Trinh Thám</li><li id=\"41\">Truyện scan</li><li id=\"66\">Tu chân - tu tiên</li><li id=\"53\">Video Clip</li><li id=\"42\">VnComic</li><li id=\"52\">Webtoon</li><li id=\"59\">Yuri</li>";

    var el = Html.parse(htm).select("li");
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        genre.push({
            title: e.text(),
            input: e.attr("id"),
            script: "gen.js"
        });
    }

    return Response.success(genre);
}
