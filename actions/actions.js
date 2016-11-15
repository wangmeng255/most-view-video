require('isomorphic-fetch');

var SEARCH_VIDEOS_SUCCESS = 'SEARCH_VIDEOS_SUCCESS';
var searchVideosSuccess = function(keyword, after, before, list, path) {
    return {
        type: SEARCH_VIDEOS_SUCCESS,
        keyword: keyword,
        after: after,
        before: before,
        list: list,
        path: path
    }
};

var SEARCH_VIDEOS_ERROR = 'SEARCH_VIDEOS_ERROR';
var searchVideosError = function(keyword, after, before, error) {
    return {
        type: SEARCH_VIDEOS_ERROR,
        keyword: keyword,
        after: after,
        before: before,
        error: error
    }
};

var PLAY_VIDEO = 'PLAY_VIDEO';
var playVideo = function(index) {
    return {
        type: PLAY_VIDEO,
        index: index
    }
};

var CLOSE_VIDEO = 'CLOSE_VIDEO';
var closeVideo = function(index) {
    return {
        type: CLOSE_VIDEO,
        index: index
    }
};

var CLICK_BAR = 'CLICK_BAR';
var clickBar = function(path) {
    return {
        type: CLICK_BAR,
        path: path
    }
};

var CLEAR = 'CLEAR';
var clear = function() {
    return {
        type: CLEAR
    }
};

var searchVideos = function(keyword, after, before, path) {
    var url = 'https://www.googleapis.com/youtube/v3/search?';
    var publishedAfter ='';
    var publishedBefore = '';
    var q  = '';
    if(after) publishedAfter = '&publishedAfter=' + after + 'T00%3A00%3A00Z';
    if(before) publishedBefore = '&publishedBefore=' + before + 'T00%3A00%3A00Z';
    if(keyword) q = '&q=' + keyword;
    
    url += 'part=snippet&maxResults=50&order=viewCount' + publishedAfter + publishedBefore + q + 
                  '&type=video&key=AIzaSyD5l0YZstcpguzjY7MMCG3UywVRXQEm5DA';
    return function(dispatch) {
        return fetch(url).then(function(response) {
            if (response.status < 200 || response.status >= 300) {
                var error = new Error(response.statusText)
                error.response = response
                throw error;
            }
            return response;
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var items = data.items;
            return dispatch(
                searchVideosSuccess(keyword, after, before, items, path)
            );
        })
        .catch(function(error) {
            return dispatch(
                searchVideosError(keyword, after, before, error)
            );
        });
    }
};

exports.SEARCH_VIDEOS_SUCCESS = SEARCH_VIDEOS_SUCCESS;
exports.searchVideosSuccess = searchVideosSuccess;
exports.SEARCH_VIDEOS_ERROR = SEARCH_VIDEOS_ERROR;
exports.searchVideosError = searchVideosError;
exports.PLAY_VIDEO = PLAY_VIDEO;
exports.playVideo = playVideo;
exports.CLOSE_VIDEO = CLOSE_VIDEO;
exports.closeVideo = closeVideo;
exports.CLICK_BAR = CLICK_BAR;
exports.clickBar = clickBar;
exports.searchVideos = searchVideos;
exports.CLEAR = CLEAR;
exports.clear = clear;