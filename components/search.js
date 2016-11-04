var React = require('react');
var router = require('react-router');
var Link = router.Link;
var Form = require('react-router-form');
var actions = require('../actions/actions');
var connect = require('react-redux').connect;

var Search = React.createClass({
    //do searching keyword in YouTube API
    Search: function(event) {
        event.preventDefault();
        var keyword = this.refs.search.value.trim();
        var after = this.refs.after.value;
        var before = this.refs.before.value;
        if(keyword) {
            this.props.dispatch(actions.searchVideos(keyword, after, before));
            var path = this.getURLpath(keyword, after, before);
            this.props.history.push(path);
        }
    },
    //click on 'View' or 'Close' button to open or close video
    playVideo: function(event) {
        event.preventDefault();
        var isView = event.target.text === 'View'? true: false;
        var index = event.target.getAttribute('data-index');
        if(isView) this.props.dispatch(actions.playVideo(parseInt(index)));
        else this.props.dispatch(actions.closeVideo(parseInt(index)));
    },
    //do filter basedon published date
    filter: function(event) {
        var i = parseInt(event.target.getAttribute('data-index'));
        var after = this.value[i].timeStart;
        var before;
        if(i < 4) before = this.value[i + 1].timeStart;
        else before = this.maxDateISO;
        this.props.dispatch(actions.clickBar(i));
        var path = this.getURLpath(this.props.keyword, after, before);
        this.props.history.push(path);
    },
    getURLpath: function(keyword, after, before) {
        var path = '';
        if(keyword) {
            path = '/?search/q=' + keyword;
        if(after && !before) 
            path += '&span=' + after + '-present';
        else if(!after && before) 
            path += '&span=2005-04-23' + after;
        else if(after && before) 
            path += '&span=' + before + '-'+ after;
        }
        return path;
    },
    calcChartValue: function() {
        var timeList = [];
        var minDate;
        //split published date in 5 span
        var date = new Date(this.props.list[0].snippet.publishedAt);
        minDate = date.getTime(); this.maxDate = date.getTime();
        for(var i = 1; i < this.props.list.length; i++) {
            date = new Date(this.props.list[i].snippet.publishedAt);
            timeList.push({i: i, milliseconds: date.getTime()});
            if(minDate > date) minDate = date;
            if(this.maxDate < date) this.maxDate = date;
        }
        var spanDate = (this.maxDate - minDate)/5;
        //count videos in each span
        this.value = [];
        for(i = 0; i < 5; i++) {
            this.value.push([]);
        }
        for(i = 0; i < timeList.length; i++) {
            if(timeList[i].milliseconds === this.maxDate.getTime()) {this.value[4].push(timeList[i]); continue;}
            var index = Math.floor((timeList[i].milliseconds - minDate.getTime()) / spanDate);
            this.value[index].push(timeList[i]);
        }
        //split height of column in 5 span
        var maxLength = 0;
        for(i = 0; i < this.value.length; i++) {
            if(maxLength < this.value[i].length) maxLength = this.value[i].length;
        }
        //calculate height of each date span
        this.spanLength = Math.ceil(maxLength/4);
        for(i = 0; i < this.value.length; i++) {
            this.value[i].barHeight = {height: String(this.value[i].length/this.spanLength * 3) + 'rem'};
            date = new Date(spanDate * i + minDate.getTime());
            var tempDate = date.toUTCString().split(' ');
            this.value[i].time = tempDate[2] + ' ' + tempDate[1] + ' ' + tempDate[3] + ' ' + tempDate[4];
            this.value[i].timeStart = date.toISOString().split('T')[0];
        }
        tempDate = this.maxDate.toUTCString().split(' ');
        this.maxDateISO = this.maxDate.toISOString().split('T')[0];
        this.maxDate = (tempDate[2] + ' ' + tempDate[1] + ' ' + tempDate[3] + ' ' + tempDate[4]);
    },
    //run component
    render: function() {
        //pass results list to Results component
        if(this.props.list.length) this.calcChartValue();
        var results = <Results list={this.props.list} keyword={this.props.keyword} 
                               index={this.props.index} onClick={this.playVideo}
                               after={this.props.after} before={this.props.before} 
                               error={this.props.error} clickedBar={this.props.clickedBar}
                               filter={this.filter} maxDate={this.maxDate} maxDateISO={this.maxDateISO} 
                               value={this.value} spanLength={this.spanLength} />;;
        //calculate current date to set max for date input
        var now = new Date;
        var month = String(now.getUTCMonth() + 1);
        if(month.length < 2) month = '0' + month;
        var day = String(now.getUTCDate());
        if(day.length < 2) day = '0' + day;
        
        var path = this.getURLpath(this.props.keyword, this.props.after, this.props.before);
        
        return (
            <div>
                <h2>
                    <img id="logo" src="YouTube-logo-full_color.png" 
                     alt={"YouTube Logo"} 
                     title={"YouTube Logo"} />
                     Top 50 Viewed Videos
                </h2>
                <p>Explore trending YouTube videos by published date.</p>
                <Form to={path} method="POST">
                    <input id="keyword" type="search" ref="search" placeholder='Search for "dogs" or "dogs|cats"' onChange={this.Search}/>
                    <div>
                        <label htmlFor="after">Time span: </label>
                        <input type="date" id="after" ref="after" min="2005-04-23" max={now.getUTCFullYear() + "-" + month + "-" + day} onChange={this.Search} />
                        <label htmlFor="before"> --- </label>
                        <input type="date" id="before" ref="before" min="2005-04-23" max={now.getUTCFullYear() + "-" + month + "-" + day} onChange={this.Search}/>
                    </div>
                </Form>
                {results}
            </div>
        );
    }
});

var Results = function(props) {
    //return error
    if(props.error) {
        return (
            <div id="error">
                <h3>Oh, we have got error Code: "{props.error.response.status}"</h3>
                <p>Error at <a href={props.error.response.url} target={props.error.response.url}>{props.error.response.url}</a> Type is "<strong>{props.error.response.type}</strong>"
                </p>
            </div>
        );
    }
    // return chart and results
    var chart = <Chart list={props.list} after={props.after} before={props.before} 
                 keyword={props.keyword} onClick={props.onClick} index={props.index} 
                 clickedBar={props.clickedBar} filter={props.filter} maxDate={props.maxDate}
                 maxDateISO={props.maxDateISO} value={props.value} spanLength={props.spanLength} />;
    return (
        <section>
            {chart}
        </section>
    );
};

var Chart = React.createClass({
    render: function() {
        //chart
        if(!this.props.list.length) return null;
        
        //header for results
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
        if((this.props.clickedBar !== null) && (this.props.clickedBar !== undefined)) {
            for(var i = 0; i < this.props.value[this.props.clickedBar].length; i++) {
                list.push(this.props.list[this.props.value[this.props.clickedBar][i].i]);
            }
        }
        else list = this.props.list;
        
        for(i = 0; i < list.length; i++) {
            if(this.props.index.indexOf(i) !== -1) {
                var player = <PlayVideo videoId={list[i].id.videoId} />;
                resultList.push(//for open video li
                    <li key={i}>
                        <Snippet snippet={list[i].snippet} anchorText={"Close"} 
                                 videoId={list[i].id.videoId} data_index={i} onClick={this.props.onClick}/>
                        <div className="player">
                            {player}
                        </div>
                    </li>
                );
            }
            else {//for close video li
                resultList.push(
                    <li key={i}>
                        <Snippet snippet={list[i].snippet} anchorText={"View"} 
                                 videoId={list[i].id.videoId} data_index={i} onClick={this.props.onClick}/>
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
                        <caption>Videos Filtered by Published Date</caption>
                        <tbody>
                            <tr className="qtr" id="q1" onClick={this.props.filter}>
                                <th scope="row">{this.props.value[0].time}</th>
                                <td className="value bar" style={this.props.value[0].barHeight} data-index="0">
                                    <Link to={"/?search/q=" + this.props.keyword + "&span=" + this.props.value[0].timeStart + ',' + this.props.value[1].timeStart} >
                                        <p data-index="0">{this.props.value[0].length}</p>
                                    </Link>
                                </td>
                            </tr>
                            <tr className="qtr" id="q2" onClick={this.props.filter}>
                                <th scope="row">{this.props.value[1].time}</th>
                                <td className="value bar" style={this.props.value[1].barHeight} data-index="1">
                                    <Link to={"/?search/q=" + this.props.keyword + "&span=" + this.props.value[1].timeStart + ',' + this.props.value[2].timeStart} >
                                        <p data-index="1">{this.props.value[1].length}</p>
                                    </Link>
                                </td>
                            </tr>
                            <tr className="qtr" id="q3" onClick={this.props.filter}>
                                <th scope="row">{this.props.value[2].time}</th>
                                <td className="value bar" style={this.props.value[2].barHeight} data-index="2">
                                    <Link to={"/?search/q=" + this.props.keyword + "&span=" + this.props.value[2].timeStart + ',' + this.props.value[3].timeStart} >
                                        <p data-index="2">{this.props.value[2].length}</p>
                                    </Link>
                                </td>
                            </tr>
                            <tr className="qtr" id="q4" onClick={this.props.filter}>
                                <th scope="row">{this.props.value[3].time}</th>
                                <td className="value bar" style={this.props.value[3].barHeight} data-index="3">
                                    <Link to={"/?search/q=" + this.props.keyword + "&span=" + this.props.value[3].timeStart + ',' + this.props.value[4].timeStart} >
                                        <p data-index="3">{this.props.value[3].length}</p>
                                    </Link>
                                </td>
                            </tr>
                            <tr className="qtr" id="q5" onClick={this.props.filter}>
                                <th scope="row">{this.props.value[4].time}</th>
                                <th scope="row">{this.props.maxDate}</th>
                                <td className="value bar" style={this.props.value[4].barHeight} data-index="4">
                                    <Link to={"/?search/q=" + this.props.keyword + "&span=" + this.props.value[4].timeStart + ',' + this.props.maxDateISO} >
                                        <p data-index="4">{this.props.value[4].length}</p>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div id="ticks">
                    <div className="tick"><p>{this.props.spanLength * 5}</p></div>
                    <div className="tick"><p>{this.props.spanLength * 4}</p></div>
                    <div className="tick"><p>{this.props.spanLength * 3}</p></div>
                    <div className="tick"><p>{this.props.spanLength * 2}</p></div>
                    <div className="tick"><p>{this.props.spanLength * 1}</p></div>
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
            <a href={"https://www.youtube.com/watch?v=" + props.videoId} target={props.videoId}>
                <img src={props.snippet.thumbnails.default.url} alt={props.snippet.title} 
                        width={props.snippet.thumbnails.default.width} 
                        height={props.snippet.thumbnails.default.height} 
                        title={props.snippet.title} />
            </a>
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
                    <a href="#" onClick={props.onClick} data-index={props.data_index}>
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
        clickedBar: state.clickedBar,
        error: state.error
    };
};

var Container = connect(mapStateToProps)(Search);

exports.Container = Container;
exports.Results = Results;
exports.Snippet = Snippet;
exports.PlayVideo = PlayVideo;