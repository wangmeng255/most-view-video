var React = require('react');
var actions = require('../actions/actions');
var connect = require('react-redux').connect;

var Search = React.createClass({
    Search: function(event) {
        event.preventDefault();
        var keyword = this.refs.search.value.trim();
        this.refs.search.value = '';
        this.props.dispatch(actions.searchVideos(keyword));
    },
    playVideo: function(event) {
        event.preventDefault();
        var isView = event.target.text === 'View'? true: false;
        var index = $("li").index(event.target.closest("li"));
        if(isView) this.props.dispatch(actions.playVideo(index));
        else this.props.dispatch(actions.closeVideo(index));
    },
    render: function() {
        var results = <Results list={this.props.list} keyword={this.props.keyword} 
                               index={this.props.index} onClick={this.playVideo}/>;
        if(this.props.error) results = <p>{this.props.error}</p>;
        return (
            <div>
                <h2>
                    <img id="logo" src="/images/YouTube-logo-full_color.png" 
                     alt={"YouTube Logo"} 
                     title={"YouTube Logo"} />
                     Top 10 Viewed Videos
                </h2>
                <form onSubmit={this.Search}>
                    <input id="search" type="search" ref="search" placeholder='e.g., "dogs" or "dogs|cats"' />
                    <button id="go" type="submit">
                        go
                    </button>
                </form>
                {results}
            </div>
        );
    }
});

var Results = function(props) {
    var resultList = [];
    for(var i = 0; i < props.list.length; i++) {
        if(props.index.indexOf(i) !== -1) {
            var player = <PlayVideo videoId={props.list[i].id.videoId} />;
            resultList.push(
                <li key={i}>
                    <Snippet snippet={props.list[i].snippet} onClick={props.onClick} anchorText={"Close"} videoId={props.list[i].id.videoId}/>
                    <div className="player">
                        {player}
                    </div>
                </li>
            );
        }
        else {
            resultList.push(
                <li key={i}>
                    <Snippet snippet={props.list[i].snippet} onClick={props.onClick} anchorText={"View"} videoId={props.list[i].id.videoId}/>
                    <div className="player">
                    </div>
                </li> 
            );
        }
        
    }
    var resultHeader;
    if(props.list.length) 
        if(!props.keyword) resultHeader = <h3>{"Most viewed videos"}</h3>;
        else  resultHeader = <h3>Results for "{props.keyword}"</h3>;
    return (
        <ul>
            {resultHeader}
            {resultList}
        </ul>
    );
};

var Snippet = function(props) {
    return (
        <div className="video-info">
            <img src={props.snippet.thumbnails.default.url} 
                 alt={props.snippet.title} 
                 width={props.snippet.thumbnails.default.width} 
                 height={props.snippet.thumbnails.default.height} 
                 title={props.snippet.title} />
            <div>
                <h4><a href={"https://www.youtube.com/watch?v=" + props.videoId} target="_blank">{props.snippet.title}</a></h4>
                <p>{props.snippet.description}</p>
                <div>
                    <span>published by </span>
                    <a className="channel-id" href={"https://www.youtube.com/channel/" + props.snippet.channelId} target="_blank">
                        {props.snippet.channelTitle}
                    </a>
                    <span> in </span>
                    <span className="publish-date-time">{props.snippet.publishedAt.split("T")[0]}</span>
                    <a href="#" onClick={props.onClick}>
                        {props.anchorText}
                    </a>
                </div>
            </div>
        </div>
    );
};

var PlayVideo = function(props) {
    var url = "//www.youtube.com/embed/" + props.videoId + "?enablejsapi=1";
    return (
        <iframe className="player" type="text/html" width="640" height="390"
          src={url} frameBorder="0"></iframe>
    );
};

var mapStateToProps = function(state, props) {
    return {
        keyword: state.keyword,
        list: state.list,
        index: state.index,
        error: state.error
    };
};

var Container = connect(mapStateToProps)(Search);

exports.Container = Container;
exports.Results = Results;
exports.PlayVideo = PlayVideo;