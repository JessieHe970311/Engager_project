/* global d3 $ */
import videojs from 'video.js'
import pipeService from '../../service/pipeService.js'

let DrawVideo = function (id) {
    this.svgWidth = $(id).width()
    this.svgHeight = $(id).height()

    this.refreshIntervalId = -1
    this.setupVideo('my-player')
}


DrawVideo.prototype.setupVideo = function (id) {
    const _this = this
    this.myPlayer = videojs(id, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        language: 'en',
        playbackRates: [0.2, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0],
        inactivityTimeout: 0, // Note: showing the control bars once the video is loaded.
        height: this.svgHeight,
        width: this.svgWidth,
    });

    pipeService.onSeekFromTime((timeRange) => {
        this.startTime = timeRange['start']
        this.endTime = timeRange['end']
        console.log('start: ', this.startTime)
        console.log('end: ', this.endTime)
        this.myPlayer.currentTime(this.startTime)

        this.myPlayer.on('timeupdate', function () {
            if (_this.myPlayer.currentTime() >= _this.endTime) {
                _this.myPlayer.pause()
                _this.endTime = Infinity
            }
        })
        this.myPlayer.play()
    })

    this.myPlayer.ready(function () {
        // console.log('myPlayer is ready: ', _this.myPlayer)
        _this.myPlayer.pause()
        _this.myPlayer.currentTime(0)

        _this.myPlayer.on('ended', function () {
        })

        _this.myPlayer.on('pause', function () {
            // clear the timer
            // clearInterval(_this.refreshIntervalId)
            let curTime = _this.myPlayer.currentTime()
            console.log('curTime: ', curTime)
            // _this.curTimeToLabeledFrame(curTime)
            // _this.updateDrawingLabelPoses(_this.arrayIdx)
        })

        _this.myPlayer.on('play', function () {
            // console.log('_this.myPlayer.currentTime(): ', _this.myPlayer.currentTime())
            if (_this.myPlayer.currentTime() > _this.endTime) {
                _this.myPlayer.pause()
            }
            // _this.removeDrawingLabelPoses()
        })

        _this.myPlayer.on('seeking', function () {
            let curTime = parseFloat(_this.myPlayer.currentTime().toFixed(2))
            // if (curTime !== _this.seekTime) {
            //     _this.curTimeToLabeledFrame(curTime)
            //     _this.myPlayer.currentTime(_this.seekTime)  // add for solve the problem?
            // }

            // if (_this.myPlayer.paused()) {
            //     // _this.updateDrawingLabelPoses(_this.arrayIdx)
            // } else {
            //     // _this.removeDrawingLabelPoses()
            // }
            console.log('curTime: ', curTime)
        })
    })
}

DrawVideo.prototype.updateVideo = function (url) {
    const _this = this
    this.myPlayer.src({type: 'video/mp4', src: url})

    _this.myPlayer.on('click', function () {
        if (_this.myPlayer.readyState() < 1) {
            // do not have metadata yet so loadedmetadata event not fired yet (I presume)
            // wait for loadedmetdata event
            _this.myPlayer.one('loadedmetadata', onLoadedMetadata)
        }
        else {
            // metadata already loaded
            onLoadedMetadata()
        }
    })
    
    function onLoadedMetadata() {
        _this.endTime = _this.myPlayer.duration()
    }

}

DrawVideo.prototype.layout = function (id, videoInfo, url) {
    d3.select(id).selectAll('*').remove()
    this.videoHeight = videoInfo['videoHeight']
    this.videoWidth = videoInfo['videoWidth']
    this.fps = videoInfo['fps']

    console.log('url: ', url)
    this.myPlayer.src({type: 'video/mp4', src: url})

    // // seek to corresponding video clip
    // pipeService.emitSeekFromTime({
    //     'start': videoInfo['start'],
    //     'end': videoInfo['end']
    // })

    // layout
    let containerRatio = this.svgWidth / this.svgHeight
    let videoRatio = this.videoWidth / this.videoHeight

    if (videoRatio > containerRatio) {
        this.videoScreenWidth = this.svgWidth
        this.videoScreenHeight = this.svgWidth / videoRatio
    } else {
        this.videoScreenHeight = this.svgHeight
        this.videoScreenWidth = this.svgHeight * videoRatio
    }

    // setup label environment
    let xOffset = (this.svgWidth - this.videoScreenWidth) / 2
    let yOffset = (this.svgHeight - this.videoScreenHeight) / 2

    this.margin = { top: yOffset, right: xOffset, bottom: yOffset, left: xOffset }

    // console.log('this.margin: ', this.margin)

    this.svg = d3.select(id).append('svg')
        .attr('class', 'videoSvg')
        .attr('height', this.svgHeight)
        .attr('width', this.svgWidth)

    this.graphContainer = this.svg.append('g')
        .attr('class', 'g_main')
        .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')
}


export default DrawVideo
