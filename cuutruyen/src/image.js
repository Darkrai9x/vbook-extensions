function execute(url) {
    let parts = url.split(" ");
    let response = fetch(parts[0]);

    if (response.ok) {
        let imageb64 = response.base64();
        let image = Graphics.createImage(imageb64);
        let imgWidth = image.width;
        let imgHeight = image.height;
        let canvas = Graphics.createCanvas(imgWidth, imgHeight);

        JSON.parse(parts[1]).forEach(part => {
            let sx = part[0];
            let sy = part[1];
            let sHeight = part[3];
            let dx = part[4];
            let dy = part[5];
            let dHeight = part[7];
            canvas.drawImage(image, sx, sy, imgWidth, sHeight, dx, dy, imgWidth, dHeight);
        })

        return canvas.capture();
    }
    return null;

}

