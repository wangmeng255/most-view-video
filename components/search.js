import actions from '../actions/actions';
import {connect} from 'react-redux';
import Form from 'react-router-form';
import React from 'react';
import {Link} from 'react-router';

var Search = React.createClass({
    calcChartValue: function () {
        var timeList = [];
        var minDate;
        //split published date in 5 span
        var date = new Date(this.props.list[0].snippet.publishedAt);
        minDate = date.getTime(); this.maxDate = date.getTime();
        for (let i = 1; i < this.props.list.length; i++) {
            date = new Date(this.props.list[i].snippet.publishedAt);
            timeList.push({i: i, milliseconds: date.getTime()});
            if (minDate > date) minDate = date;
            if (this.maxDate < date) this.maxDate = date;
        }
        const spanDate = (this.maxDate - minDate)/5;
        //count videos in each span
        this.value = [];
        for (let i = 0; i < 5; i++) {
            this.value.push([]);
        }
        for (let i = 0; i < timeList.length; i++) {
            if (timeList[i].milliseconds === this.maxDate.getTime()) {this.value[4].push(timeList[i]); continue;}
            var index = Math.floor((timeList[i].milliseconds - minDate.getTime()) / spanDate);
            this.value[index].push(timeList[i]);
        }
        //split height of column in 5 span
        var maxLength = 0;
        for (let i = 0; i < this.value.length; i++) {
            if (maxLength < this.value[i].length) maxLength = this.value[i].length;
        }
        //calculate height of each date span
        this.spanLength = Math.ceil(maxLength/4);
        for (let i = 0; i < this.value.length; i++) {
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
    componentDidMount: function () {
        const params = this.getURLparams(this.props.location.query);
        const keyword = params.keyword;
        const after = params.after;
        const before = params.before;
        const filter = params.filter;
        
        if (keyword) {
            this.refs.search.value = keyword;
            if (after) this.refs.after.value = after;
            if (before) this.refs.before.value = before;
            var path = this.getURLpath(keyword, after, before, filter);
            this.props.dispatch(actions.searchVideos(keyword, after, before, path));
        }
        else this.props.dispatch(actions.searchVideos('javascript', '', '', '/'));
    },
    componentWillUpdate: function (nextProps, nextState) {
        var path;
        if (this.props.path !== nextProps.path) {
            this.props.history.push(nextProps.path);
        }
        if (this.props.path && (this.props.path === nextProps.path) && (this.props.path !== (nextProps.location.pathname + nextProps.location.search))) {
            path = nextProps.location.pathname + nextProps.location.search;
            if (!nextProps.location.query.q) 
            {
                this.props.dispatch(actions.clear());
                this.refs.search.value = '';
                this.refs.after.value = '';
                this.refs.before.value = '';
            }
            else {
                const params = this.getURLparams(nextProps.location.query);
                const keyword = params.keyword;
                const after = params.after;
                const before = params.before;
                const filter = params.filter;
                
                if (keyword === this.props.keyword && after === this.props.after && before === this.props.before) {
                    if (filter === undefined) {
                        this.props.dispatch(actions.searchVideosSuccess(keyword, after, before, this.props.list, path));
                    }
                    else {
                        this.props.dispatch(actions.clickBar(path));
                    }
                }
                
                if (keyword !== this.props.keyword || after !== this.props.after || before !== this.props.before) {
                    this.props.dispatch(actions.searchVideos(keyword, after, before, path));
                }
            }
        }
    },
    Filter: function (event) {
        this.clickedBar = parseInt(event.target.closest('tr').getAttribute('data-index'));
        const after = this.props.after;
        const before = this.props.before;
        const path = this.getURLpath(this.props.keyword, after, before, this.clickedBar);
        this.props.dispatch(actions.clickBar(path));
    },
    //do filter basedon published date
    getURLpath: function (keyword, after, before, filter) {
        var path = '';
        path = '/search?q=' + keyword;
        if (after && !before) 
            path += '&after=' + after + '&before=present';
        else if (!after && before) 
            path += '&after=2005-04-23&before=' + before;
        else if (after && before) 
            path += '&after=' + after + '&before='+ before;
        if (filter !== null && filter !== undefined) path += '&filter=' + filter;
        return path;
    },
    getURLparams: function (query) {
        var params = {};
        params.keyword = query.q;
        params.after = query.after;
        params.before = query.before;
        if (query.filter) params.filter = parseInt(query.filter);
        
        if (params.after === undefined || params.after === '2005-04-23') params.after = '';
        if (params.before === undefined || params.before === 'present') params.before = '';
        
        return params;
    },
    //click on 'View' or 'Close' button to open or close video
    playVideo: function (event) {
        event.preventDefault();
        const isView = event.target.text === 'View'? true: false;
        const index = event.target.getAttribute('data-index');
        if (isView) this.props.dispatch(actions.playVideo(parseInt(index)));
        else this.props.dispatch(actions.closeVideo(parseInt(index)));
    },
    //do searching keyword in YouTube API
    Search: function (event) {
        event.preventDefault();
        var keyword = this.refs.search.value.trim();
        var after = this.refs.after.value.trim();
        var before = this.refs.before.value.trim();
        
        if (after) after = after.match(/(20\d\d)-(0\d|1[0-2])-([0-2][0-9]|3[0,1])/g);
        if (before) before = before.match(/(20\d\d)-(0\d|1[0-2])-([0-2][0-9]|3[0,1])/g);
        
        var popupAfter = this.refs.afterPopuptext;
        var popupBefore = this.refs.beforePopuptext;
        
        if (after === null || before === null) {
            if (after === null) {
                popupAfter.classList.add('show');
            }
            if (before === null) {
                popupBefore.classList.add('show');
            }
        }
        else {
            if (after === '') popupAfter.classList.remove('show');
            else if (after) {
                after = after[0];
                var afterDate = new Date(after);
                if (afterDate.toString() !== 'Invalid Date') {
                    popupAfter.classList.remove('show');
                }
            }
                
            if (before === '') popupBefore.classList.remove('show');
            else if (before) {
                before = before[0];
                var beforeDate;
                if (before) beforeDate = new Date(before);
                if (beforeDate.toString() !== 'Invalid Date' && beforeDate > afterDate) {
                    popupBefore.classList.remove('show');
                }
            }
            
            if (!keyword && !before && !after) {
                if (this.props.list.length) this.props.dispatch(actions.clear());
            }
            else {
                let path = this.getURLpath(keyword, after, before, undefined);
                this.props.dispatch(actions.searchVideos(keyword, after, before, path));
            }
        }
    },
    Share: function (event) {
        const url = encodeURIComponent(window.location.href);
        const title = document.title;
        const shareUrl = {
            Facebook: "https://www.facebook.com/sharer/sharer.php?u=" + url,
            GooglePlus: "https://plus.google.com/share?url=" + url,
            Linkedin: "https://www.linkedin.com/shareArticle?mini=true&url=" + url,
            Pinterest: "https://pinterest.com/pin/create/link/?url=" + url,
            Twitter: "https://twitter.com/home?status=" + url + " " + title
        };
        const webTitle = event.target.closest('a').getAttribute('title');
        const webName = webTitle.split(' ');
        event.target.closest('a').setAttribute('href', shareUrl[webName[2]]);
    },
    Show: function () {
        this.refs.menu.show();
        var share = document.getElementById('share');
        if (screen.width > 480) share.style.left = '-3rem';
        else share.style.left = '-5rem';
        share.style.transition = 'left ease 250ms';
    },
    //run component
    render: function () {
        const params = this.getURLparams(this.props.location.query);
        const keyword = params.keyword;
        const after = params.after;
        const before = params.before;
        const filter = params.filter;
        
        //pass results list to Results component
        if (this.props.list.length) this.calcChartValue();
        const results = <Results list={this.props.list} keyword={keyword} index={this.props.index} onClick={this.playVideo}
                               after={after} before={before} error={this.props.error} clickedBar={filter}
                               Filter={this.Filter} maxDate={this.maxDate} maxDateISO={this.maxDateISO} 
                               value={this.value} spanLength={this.spanLength} />;;
        //calculate current date to set max for date input
        const now = new Date;
        var month = String(now.getUTCMonth() + 1);
        if (month.length < 2) month = '0' + month;
        var day = String(now.getUTCDate());
        if (day.length < 2) day = '0' + day;
        
        const path = this.getURLpath(keyword,after, before, this.clickedBar);
        
        return (
            <div>
                <h1>
                    <img id="logo" src="YouTube-logo-light.png" 
                     alt={"YouTube Logo"} 
                     title={"YouTube Logo"} />
                     Top 50 Viewed Videos
                </h1>
                <p>Explore trending YouTube videos by published date.</p>
                <Form to={path} method="POST">
                    <label htmlFor="keyword">Search Phrase</label>
                    <input id="keyword" type="search" ref="search" placeholder="javascript" onChange={this.Search} />
                    <div>
                        <label>Time span: </label>
                        <label htmlFor="after">From </label>
                        <div className="popup">
                            <input type="date" id="after" ref="after" min="2005-04-23" max={now.getUTCFullYear() + "-" + month + "-" + day} 
                                onChange={this.Search} placeholder="yyyy-mm-dd" />
                            <span className="popuptext" ref="afterPopuptext">Invalid date</span>
                        </div>
                        <label htmlFor="before"> To </label>
                        <div className="popup">
                            <input type="date" id="before" ref="before" min="2005-04-23" max={now.getUTCFullYear() + "-" + month + "-" + day} 
                                onChange={this.Search} placeholder="yyyy-mm-dd" />
                            <span className="popuptext" ref="beforePopuptext">Invalid date</span>
                        </div>
                    </div>
                </Form>
                <button id="share" ref="share" onClick={this.Show}>Share</button>
                <Menu ref="menu" Share={this.Share} showButton={this.refs.share}/>
                {results}
            </div>
        );
    }
});

var Menu = React.createClass({
    getInitialState: function () {
        return {
            visible: false  
        };
    },
    show: function () {
        this.setState({ visible: true });
        document.addEventListener("click", this.hide);
    },
    hide: function () {
        document.removeEventListener("click", this.hide);
        this.setState({ visible: false });
        var share = document.getElementById('share');
        if (screen.width > 480) share.style.left  = '-1rem';
        else share.style.left = '-2rem';
    },
    render: function () {
        var name = 'mn-social-bottom-c ' + (this.state.visible ? 'visible' : '');
        return (
            <div className={name}>
                <a className="mn-social-bottom" title="Share on Facebook" target="_blank" onClick={this.props.Share}>
                    <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"/></svg>
                </a>
                <a className="mn-social-bottom" title="Share on Twitter" target="_blank" onClick={this.props.Share}>
                    <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z"/></svg>
                </a>
                <a className="mn-social-bottom" title="Share on Linkedin" target="_blank" onClick={this.props.Share}>
                    <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z"/></svg>
                </a>
                <a className="mn-social-bottom" title="Share on GooglePlus" target="_blank" onClick={this.props.Share}>
                    <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1181 913q0 208-87 370.5t-248 254-369 91.5q-149 0-285-58t-234-156-156-234-58-285 58-285 156-234 234-156 285-58q286 0 491 192l-199 191q-117-113-292-113-123 0-227.5 62t-165.5 168.5-61 232.5 61 232.5 165.5 168.5 227.5 62q83 0 152.5-23t114.5-57.5 78.5-78.5 49-83 21.5-74h-416v-252h692q12 63 12 122zm867-122v210h-209v209h-210v-209h-209v-210h209v-209h210v209h209z"/></svg>
                </a>
                <a className="mn-social-bottom" title="Share on Pinterest" target="_blank" onClick={this.props.Share}>
                    <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M256 597q0-108 37.5-203.5t103.5-166.5 152-123 185-78 202-26q158 0 294 66.5t221 193.5 85 287q0 96-19 188t-60 177-100 149.5-145 103-189 38.5q-68 0-135-32t-96-88q-10 39-28 112.5t-23.5 95-20.5 71-26 71-32 62.5-46 77.5-62 86.5l-14 5-9-10q-15-157-15-188 0-92 21.5-206.5t66.5-287.5 52-203q-32-65-32-169 0-83 52-156t132-73q61 0 95 40.5t34 102.5q0 66-44 191t-44 187q0 63 45 104.5t109 41.5q55 0 102-25t78.5-68 56-95 38-110.5 20-111 6.5-99.5q0-173-109.5-269.5t-285.5-96.5q-200 0-334 129.5t-134 328.5q0 44 12.5 85t27 65 27 45.5 12.5 30.5q0 28-15 73t-37 45q-2 0-17-3-51-15-90.5-56t-61-94.5-32.5-108-11-106.5z"/></svg>
                </a>
            </div>
        );
    }
});

var Results = function (props) {
    //return error
    if (props.error) {
        return (
            <div id="error">
                <h2>Oh, we have got error Code: "{props.error.response.status}"</h2>
                <p>Error at <a href={props.error.response.url} target={props.error.response.url}>{props.error.response.url}</a> Type is "<strong>{props.error.response.type}</strong>"
                </p>
            </div>
        );
    }
    // return chart and results
    var chart = <Chart list={props.list} after={props.after} before={props.before} 
                 keyword={props.keyword} onClick={props.onClick} index={props.index} 
                 clickedBar={props.clickedBar} Filter={props.Filter} maxDate={props.maxDate} 
                 maxDateISO={props.maxDateISO} value={props.value} spanLength={props.spanLength} />;
    return (
        <section>
            {chart}
        </section>
    );
};

var Chart = React.createClass({
    render: function () {
        //chart
        if (!this.props.list.length) return null;
        
        //header for results
        var header = '';
        var resultHeader;
        if (this.props.list.length) {
            if (!this.props.keyword) header = '"javascript"';
            else  header = '"' + this.props.keyword + '"';
            
            if (this.props.after) header = header + ' after ' + this.props.after;
            if (this.props.before) header = header + ' before ' + this.props.before;
            resultHeader = <h2>Results for {header}</h2>;
        }
        //result
        var resultList = [];
        var list = [];
        if ((this.props.clickedBar !== null) && (this.props.clickedBar !== undefined)) {
            for (let i = 0; i < this.props.value[this.props.clickedBar].length; i++) {
                list.push(this.props.list[this.props.value[this.props.clickedBar][i].i]);
            }
        }
        else list = this.props.list;
        
        for (let i = 0; i < list.length; i++) {
            if (this.props.index.indexOf(i) !== -1) {
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
                            <tr className="qtr" id="q1" onClick={this.props.Filter} data-index="0">
                                <th scope="row">{this.props.value[0].time}</th>
                                <td className="value bar" style={this.props.value[0].barHeight}>
                                    <Link to={"/search?q=" + this.props.keyword + "&after=" + this.props.after + '&before=' + this.props.before + '&filter=0'} >
                                        <p>{this.props.value[0].length}</p>
                                    </Link>
                                </td>
                            </tr>
                            <tr className="qtr" id="q2" onClick={this.props.Filter} data-index="1">
                                <th scope="row">{this.props.value[1].time}</th>
                                <td className="value bar" style={this.props.value[1].barHeight}>
                                    <Link to={"/search?q=" + this.props.keyword + "&after=" + this.props.after + '&before=' + this.props.before + '&filter=1'} >
                                        <p>{this.props.value[1].length}</p>
                                    </Link>
                                </td>
                            </tr>
                            <tr className="qtr" id="q3" onClick={this.props.Filter} data-index="2">
                                <th scope="row">{this.props.value[2].time}</th>
                                <td className="value bar" style={this.props.value[2].barHeight}>
                                    <Link to={"/search?q=" + this.props.keyword + "&after=" + this.props.after + '&before=' + this.props.before + '&filter=2'} >
                                        <p>{this.props.value[2].length}</p>
                                    </Link>
                                </td>
                            </tr>
                            <tr className="qtr" id="q4" onClick={this.props.Filter} data-index="3">
                                <th scope="row">{this.props.value[3].time}</th>
                                <td className="value bar" style={this.props.value[3].barHeight}>
                                    <Link to={"/search?q=" + this.props.keyword + "&after=" + this.props.after + '&before=' + this.props.before + '&filter=3'} >
                                        <p>{this.props.value[3].length}</p>
                                    </Link>
                                </td>
                            </tr>
                            <tr className="qtr" id="q5" onClick={this.props.Filter} data-index="4">
                                <th scope="row">{this.props.value[4].time}</th>
                                <th scope="row">{this.props.maxDate}</th>
                                <td className="value bar" style={this.props.value[4].barHeight}>
                                    <Link to={"/search?q=" + this.props.keyword + "&after=" + this.props.after + '&before=' + this.props.before + '&filter=4'} >
                                        <p>{this.props.value[4].length}</p>
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
var Snippet = function (props) {
    return (
        <div className="video-info">
            <a href={"https://www.youtube.com/watch?v=" + props.videoId} target={props.videoId}>
                <img src={props.snippet.thumbnails.default.url} alt={props.snippet.title} 
                        width={props.snippet.thumbnails.default.width} 
                        height={props.snippet.thumbnails.default.height} 
                        title={props.snippet.title} />
            </a>
            <div>
                <h3><a href={"https://www.youtube.com/watch?v=" + props.videoId} target={props.videoId}>{props.snippet.title}</a></h3>
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

var PlayVideo = function (props) {
    var url = "//www.youtube.com/embed/" + props.videoId + "?enablejsapi=1";
    return (
        <iframe className="player" type="text/html" width="640" height="390"
          src={url} frameBorder="0"></iframe>
    );
};

var mapStateToProps = function (state, props) {
    return {
        keyword: state.keyword,
        after: state.after,
        before: state.before,
        list: state.list,
        path: state.path,
        index: state.index,
        error: state.error
    };
};

var Container = connect(mapStateToProps)(Search);

exports.Container = Container;
exports.Results = Results;
exports.Snippet = Snippet;
exports.PlayVideo = PlayVideo;