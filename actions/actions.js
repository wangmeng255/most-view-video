require('isomorphic-fetch');

var SEARCH_VIDEOS_SUCCESS = 'SEARCH_VIDEOS_SUCCESS';
var searchVideosSuccess = function(keyword, list) {
    return {
        type: SEARCH_VIDEOS_SUCCESS,
        keyword: keyword,
        list: list
    }
};

var SEARCH_VIDEOS_ERROR = 'SEARCH_VIDEOS_ERROR';
var searchVideosError = function(keyword, error) {
    return {
        type: SEARCH_VIDEOS_ERROR,
        keyword: keyword,
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

var searchVideos = function(keyword) {
    var url = 'https://www.googleapis.com/youtube/v3/search?';
    if(keyword === '') url += 'part=snippet&maxResults=10&order=viewCount' +
                  '&type=video&key=AIzaSyD5l0YZstcpguzjY7MMCG3UywVRXQEm5DA'
    else url += 'part=snippet&maxResults=10&order=viewCount&q=' + 
                 keyword + 
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
                searchVideosSuccess(keyword, items)
            );
        })
        .catch(function(error) {
            return dispatch(
                searchVideosError(keyword, error)
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
exports.searchVideos = searchVideos;