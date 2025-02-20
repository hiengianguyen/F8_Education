function extractVideoIdFromUrl(url) {
    var urlYoutubeDefault = "youtube.com/watch?v="
    
    if (url) {
        return url
        .split(urlYoutubeDefault)[1]
        .split("&")[0];
    }
} 

module.exports = extractVideoIdFromUrl;
