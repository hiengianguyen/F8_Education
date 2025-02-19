function extractVideoIdFromUrl(url) {
    var urlYoutubeDefault = "youtube.com/watch?v="
    
    return url
        .split(urlYoutubeDefault)[1]
        .split("&")[0];
} 

module.exports = extractVideoIdFromUrl;
