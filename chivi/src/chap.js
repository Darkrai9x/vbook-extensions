function execute(url) {
    url = url.replace("/chivi.app/api/","/chivi.app/_db/")

    url = url.split("/")
    let total_parts = url.pop();
    total_parts =  parseInt(total_parts, 10) + 1;
    url = url.join("/")
    console.log(url)
    console.log(total_parts)
    let cvdata = "";
    for(let i = 0; i < total_parts; i++){
        let response_parts = fetch(url+"/"+i);
        console.log(url+"/"+i)
        if (response_parts.ok) {
            let cvdata_i = response_parts.json().cvdata;
            cvdata = cvdata + locRac(cvdata_i, total_parts);
        }
    }
    if(cvdata){
        // let heading = cvdata.split("<br>")[0];
        // cvdata = cvdata.replace(heading + "<br>","");
        return Response.success(cvdata);
    }
    return null;
}

function locRac(content, total_parts) {
    content = content.replace(/〉/g,"").replace(/〈/g,"");
    const regex1 = /\ǀ(\d+)\ǀ(\d+)\ǀ(\d+)\t/g;
    const regex2 = /(\d+)\t/g;
    const regex3 = /\ǀ(\d+)\ǀ(\d+)\ǀ(\d+)\n/g;
    content = content.replace(regex1, "").replace(regex2, "").replace(regex3, "<br>")
    content = content.split("$\t$\t$\n")[0];
    content = content.replace(/\n/g,"<br>").replace(/\t/g,"");
    let heading = content.split("<br>")[0];
    if(heading.includes("/"+total_parts+"]")){
        content = content.replace(heading + "<br>","");
    }
    return content;
}
