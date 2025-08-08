import * as htmlToImage from "html-to-image";

const DownloadImage = (ref) => {
    if (ref){
        htmlToImage.toPng(ref,)
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'bracket.png';
                link.href = dataUrl;
                link.click();
            })
            .catch(function (error) {
                console.error('an error occured:', error);
            });
    }
}

export { DownloadImage };