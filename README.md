# Most View Video
Thinkful (https://www.thinkful.com/) Portfolio Exercise - a responsive React app to search top 50 viewed videos in YouTube Api. The app also analyzes the results based on published time.

![YouTube most view video Api](https://github.com/wangmeng255/most-view-video/blob/master/img/YouTube-Api.png "YouTube most view video Api")

## Background

I built this app drawing on my experience from searching videos in YouTube. Although YouTube provides date filter for searching results, it only provides most recent 24 hours, week, month, or year filters. My app provides a simple analysis for searching results. It sorts searching results in five equal time span.

## Use Case

Why is this app useful? you can find videos with your searching keyword in which time span is most popular. You can watch the video or channel by clicking link in the app, or watch the video in the app.

##Initial UX

The initial mobile and desktop wireframes can be seen below:

![YouTube most view video Api Initial](https://github.com/wangmeng255/most-view-video/blob/master/img/YouTube-Api-init.png "YouTube most view video Api Inital")

##Working Prototype

You can access a working prototype of the app here: [working prototype link](https://most-view-video.herokuapp.com/)

##Functionality

The app's functionality includes:

* Searching 50 most viewed videos by keywords and published date span.
* Analysis and Charting searching results based on published date.
* Filtering searching results by published date.
* Detailing the thunmbnail, title, description, published data, and channel of videos.
* Watching video by clicking view button.
* Providing links of videos and channels.
* Sharing app links in Facebook, Twitter, Linkedin, Google+, and Pinterest.

##Technical

The app is built entirely in React and makes use of Fetch calls to The YouTube API to return the data. All data is held in memory during the user's session. It has been built to be fully responsive across mobile, tablet and desktop screen resolutions.

##Development Roadmap

This is v1.0 of the app, but future enhancements are expected to include:

* Extending the app to analyse other information (e.g. language etc) which is offered by YouTube API.
* Adding related video links for each video.
* Adding search options (e.g. caption and location) to app.