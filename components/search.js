var React = require('react');
var actions = require('../actions/actions');
var connect = require('react-redux').connect;

var Search = React.createClass({
    Search: function(event) {
        event.preventDefault();
        var keyword = this.refs.search.value.trim();
        var after = this.refs.after.value;
        var before = this.refs.before.value;
        if(keyword) {
            this.props.dispatch(actions.searchVideos(keyword, after, before));
        }
    },
    playVideo: function(event) {
        event.preventDefault();
        var isView = event.target.text === 'View'? true: false;
        var index = $('li').index(event.target.closest('li'));
        if(isView) this.props.dispatch(actions.playVideo(index));
        else this.props.dispatch(actions.closeVideo(index));
    },
    render: function() {
        var results = <Results list={this.props.list} keyword={this.props.keyword} 
                               index={this.props.index} onClick={this.playVideo}
                               after={this.props.after} before={this.props.before} 
                               error={this.props.error} />;;
        
        var now = new Date;
        var month = String(now.getUTCMonth() + 1);
        if(month.length < 2) month = '0' + month;
        var day = String(now.getUTCDate());
        if(day.length < 2) day = '0' + day;
        
        return (
            <div>
                <h2>
                    <img id="logo" src="YouTube-logo-full_color.png" 
                     alt={"YouTube Logo"} 
                     title={"YouTube Logo"} />
                     Top 50 Viewed Videos
                </h2>
                <form onSubmit={this.Search}>
                    <label htmlFor="keyword">Search Phrase</label>
                    <input id="keyword" type="search" ref="search" placeholder='e.g., "dogs" or "dogs|cats"' onChange={this.Search}/>
                    <div>
                        <label htmlFor="after"> After (UTC Time): </label>
                        <input type="date" id="after" ref="after" min="2005-04-23" max={now.getUTCFullYear() + "-" + month + "-" + day} onChange={this.Search} />
                        <label htmlFor="before">Before (UTC Time): </label>
                        <input type="date" id="before" ref="before" min="2005-04-23" max={now.getUTCFullYear() + "-" + month + "-" + day} onChange={this.Search}/>
                    </div>
                </form>
                {results}
            </div>
        );
    }
});

var Results = function(props) {
    if(props.error) {
        return (
            <div id="error">
                <h3>Oh, we have got error Code: "{props.error.response.status}"</h3>
                <p>Error at <a href={props.error.response.url} target={props.error.response.url}>{props.error.response.url}</a> Type is "<strong>{props.error.response.type}</strong>"
                </p>
            </div>
        );
    }
    
    var chart = <Chart list={props.list} after={props.after} before={props.before} 
                 keyword={props.keyword} onClick={props.onClick} index={props.index} />;
    return (
        <section>
            {chart}
        </section>
    );
};

var Chart = React.createClass({
    getInitialState: function() {
        return {
            clickedBar: null
        };
    },
    filter: function(event) {
        this.setState({
            clickedBar: $('#q-graph tr').index($(event.target).closest('tr'))
        });
    },
    render: function() {
        //chart
        if(!this.props.list.length) return null;
        var timeList = [];
        var minDate, maxDate;
        
        for(var i = 0; i < this.props.list.length; i++) {
            var date = new Date(this.props.list[i].snippet.publishedAt);
            timeList.push({i: i, milliseconds: date.getTime()});
            if(i === 0) {minDate = date.getTime(); maxDate = date.getTime();}
            if(minDate > date) minDate = date;
            if(maxDate < date) maxDate = date;
        }
        var spanDate = (maxDate - minDate)/5;
        
        var value = [];
        for(i = 0; i < 5; i++) {
            value.push([]);
        }
        for(i = 0; i < timeList.length; i++) {
            if(timeList[i].milliseconds === maxDate.getTime()) {value[4].push(timeList[i]); continue;}
            var index = Math.floor((timeList[i].milliseconds - minDate.getTime()) / spanDate);
            value[index].push(timeList[i]);
        }
        
        var maxLength = 0;
        for(i = 0; i < value.length; i++) {
            if(maxLength < value[i].length) maxLength = value[i].length;
        }
        
        var spanLength = Math.ceil(maxLength/4);
        for(i = 0; i < value.length; i++) {
            value[i].barHeight = {height: String(value[i].length/spanLength * 3) + 'rem'};
            var date = new Date(spanDate * i + minDate.getTime());
            value[i].time = date.toISOString().substring(0, date.toISOString().length - 5).replace('-', '/') + ' - ';
            date = new Date(spanDate * (i + 1) + minDate.getTime());
            value[i].time += date.toISOString().substring(0, date.toISOString().length - 5).replace('-', '/');
        }
        //header
        var header = '';
        var resultHeader;
        if(this.props.list.length) {
            if(!this.props.keyword) header = 'Most viewed videos ';
            else  header = '"' + this.props.keyword + '"';
            
            if(this.props.after) header = header + ' after ' + this.props.after;
            if(this.props.before) header = header + ' before ' + this.props.before;
            resultHeader = <h3>Results for {header}</h3>;
        }
        //result
        var resultList = [];
        var list = [];
        if(this.state.clickedBar !== null) {
            for(i = 0; i < value[this.state.clickedBar].length; i++) {
                list.push(this.props.list[value[this.state.clickedBar][i].i]);
            }
        }
        else list = this.props.list;
        
        for(i = 0; i < list.length; i++) {
            if(this.props.index.indexOf(i) !== -1) {
                var player = <PlayVideo videoId={list[i].id.videoId} />;
                resultList.push(
                    <li key={i}>
                        <Snippet snippet={list[i].snippet} onClick={this.props.onClick} anchorText={"Close"} 
                                 videoId={list[i].id.videoId}/>
                        <div className="player">
                            {player}
                        </div>
                    </li>
                );
            }
            else {
                resultList.push(
                    <li key={i}>
                        <Snippet snippet={list[i].snippet} onClick={this.props.onClick} anchorText={"View"} 
                                 videoId={list[i].id.videoId}/>
                        <div className="player">
                        </div>
                    </li> 
                );
            }
        }
        
        return (
            <div>
                <div className="chart">
                    <table id="q-graph">
                        <tbody>
                            <tr className="qtr" id="q1" onClick={this.filter}>
                                <th scope="row">{value[0].time}</th>
                                <td className="value bar" style={value[0].barHeight}><p>{value[0].length}</p></td>
                            </tr>
                            <tr className="qtr" id="q2" onClick={this.filter}>
                                <th scope="row">{value[1].time}</th>
                                <td className="value bar" style={value[1].barHeight}><p>{value[1].length}</p></td>
                            </tr>
                            <tr className="qtr" id="q3" onClick={this.filter}>
                                <th scope="row">{value[2].time}</th>
                                <td className="value bar" style={value[2].barHeight}><p>{value[2].length}</p></td>
                            </tr>
                            <tr className="qtr" id="q4" onClick={this.filter}>
                                <th scope="row">{value[3].time}</th>
                                <td className="value bar" style={value[3].barHeight}><p>{value[3].length}</p></td>
                            </tr>
                            <tr className="qtr" id="q5" onClick={this.filter}>
                                <th scope="row">{value[4].time}</th>
                                <td className="value bar" style={value[4].barHeight}><p>{value[4].length}</p></td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div id="ticks">
                    <div className="tick"><p>{spanLength * 5}</p></div>
                    <div className="tick"><p>{spanLength * 4}</p></div>
                    <div className="tick"><p>{spanLength * 3}</p></div>
                    <div className="tick"><p>{spanLength * 2}</p></div>
                    <div className="tick"><p>{spanLength * 1}</p></div>
                    <div className="tick"><p>0</p></div>
                    </div>
                </div>
                <ul>
                    {resultHeader}
                    {resultList}
                </ul>
            </div>
        );
    }
});

var Snippet = function(props) {
    return (
        <div className="video-info">
            <img src={props.snippet.thumbnails.default.url} 
                 alt={props.snippet.title} 
                 width={props.snippet.thumbnails.default.width} 
                 height={props.snippet.thumbnails.default.height} 
                 title={props.snippet.title} />
            <div>
                <h4><a href={"https://www.youtube.com/watch?v=" + props.videoId} target={props.videoId}>{props.snippet.title}</a></h4>
                <p>{props.snippet.description}</p>
                <div>
                    <span>published by </span>
                    <a className="channel-id" href={"https://www.youtube.com/channel/" + props.snippet.channelId} target={props.snippet.channelId}>
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
        after: state.after,
        before: state.before,
        list: state.list,
        index: state.index,
        error: state.error
    };
};

var Container = connect(mapStateToProps)(Search);

exports.Container = Container;
exports.Results = Results;
exports.PlayVideo = PlayVideo;