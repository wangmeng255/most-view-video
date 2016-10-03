var React = require('react');
var actions = require('./actions/actions');
var connect = require('react-redux').connect;
var Form = require('react-router-form');

var Search = React.createClass({
    Search: function(event) {
        event.preventDefault();
        var keyword = this.refs.search.value.trim();
        this.refs.search.value = '';
        this.props.dispatch(actions.searchVideos(keyword));
        if(keyword === '') keyword = 'the most viewed video';
    },
    playVideo: function(event) {
        event.preventDefault();
        var isView = event.target.text === 'View'? true: false;
        var index = $("li").index(event.target.closest("li"));
        if(isView) this.props.dispatch(actions.playVideo(index));
        else this.props.dispatch(actions.closeVideo(index));
    },
    render: function() {
        return (
            <div>
                <Form to={'/search/' + this.props.keyword} method="POST" onSubmit={this.Search}>
                    <label>Search in youtube top 10 viewed videos</label><br />
                    <input type="search" ref="search" placeholder='e.g., "dogs" or "dogs|cats"' />
                    <button type="submit">
                        go
                    </button>
                </Form>
                <Results list={this.props.list} keyword={this.props.keyword} 
                         index={this.props.index} onClick={this.playVideo}/>
            </div>
        );
    }
});

var Results = function(props) {
    var resultList = [];
    var j = 0;
    for(var i = 0; i < props.list.length; i++) {
        if(props.index[j] === i) {
            var player = <PlayVideo videoId={props.list[i].id.videoId} />;
            j++;
            resultList.push(
                <li key={i}>
                    <img src={props.list[i].snippet.thumbnails.default.url} 
                         alt={props.list[i].snippet.title} 
                         width={props.list[i].snippet.thumbnails.default.width} 
                         height={props.list[i].snippet.thumbnails.default.height} 
                         title={props.list[i].snippet.title} />
                    <h4>{props.list[i].snippet.title}</h4>
                    <p>{props.list[i].snippet.description}</p>
                    <a href="#" onClick={props.onClick}>
                        Close
                    </a>
                    <div className="player">
                        {player}
                    </div>
                </li> 
            );
        }
        else {
            resultList.push(
                <li key={i}>
                    <img src={props.list[i].snippet.thumbnails.default.url} 
                         alt={props.list[i].snippet.title} 
                         width={props.list[i].snippet.thumbnails.default.width} 
                         height={props.list[i].snippet.thumbnails.default.height} 
                         title={props.list[i].snippet.title} />
                    <h4>{props.list[i].snippet.title}</h4>
                    <p>{props.list[i].snippet.description}</p>
                    <a href="#" onClick={props.onClick}>
                        View
                    </a>
                    <div className="player">
                    </div>
                </li> 
            );
        }
        
    }
    if(resultList.length) var resultHeader = <h3>Results for "{props.keyword}"</h3>;
    return (
        <ul>
            {resultHeader}
            {resultList}
        </ul>
    );
};

var PlayVideo = function(props) {
    var url = "http://www.youtube.com/embed/" + props.videoId + "?enablejsapi=1";
    return (
        <iframe className="player" type="text/html" width="640" height="390"
          src={url} frameBorder="0"></iframe>
    );
};

var mapStateToProps = function(state, props) {
    return {
        keyword: state.keyword,
        list: state.list,
        index: state.index
    };
};

var Container = connect(mapStateToProps)(Search);

exports.Container = Container;
exports.Results = Results;
exports.PlayVideo = PlayVideo;