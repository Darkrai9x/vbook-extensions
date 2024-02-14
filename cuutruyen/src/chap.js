load('config.js');
load('image_decode.js');

function execute(url) {
    let chapterId = /chapters\/(\d+)\/?/.exec(url)[1];
    let response = fetch(BASE_URL + "/api/v2/chapters/" + chapterId);


    if (response.ok) {
        let json = response.json();

        let images = [];
        let drmData = [];
        let pages = json.data.pages;
        pages.forEach(item => {
            drmData.push(item.drm_data.replace(/\n/g, ""))
        });
        
        let decryptData = JSON.parse(imageDecode(JSON.stringify(drmData)));

        for (let i = 0; i < pages.length; i++) {
            images.push({
                link: pages[i].image_url + " " + JSON.stringify(decryptData[i]),
                script: "image.js"
            })
        }
        return Response.success(images);
    }

    return null;
}