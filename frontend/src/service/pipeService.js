import Vue from 'vue'

var pipeService = new Vue({
    data: {
        TESTEVENT: 'test_event',
		VideoTime: "video_time",
		PlayVideo: "play_video",
		PersonId: "person_id",
		SessionId: "session_id",
		VideoId: "video_id",
		StartMsg: "start_msg",
		InteractionMsg: "interaction_msg"
    },
    methods: {
        emitTestEvent: function(msg) {
            this.$emit(this.TESTEVENT, msg)
        },
        onTestEvent: function(callback) {
            this.$on(this.TESTEVENT, function(msg) {
                callback(msg)
            })
        },
		emitSeekFromTime: function(msg) {
			this.$emit(this.VideoTime, msg)
		},
		onSeekFromTime: function(callback) {
			this.$on(this.VideoTime, function(msg) {
				callback(msg)
			})
		},
		emitVideo: function(msg) {
			console.log(this.PlayVideo, msg)
			this.$emit(this.PlayVideo, msg)
		},
		onVideo: function(callback) {
			this.$on(this.PlayVideo, function(msg) {
				callback(msg)
			})
		},
		emitPersonid: function(msg) {
			this.$emit(this.PersonId, msg)
		},
		onPersonid: function(callback){
			this.$on(this.PersonId, function(msg) {
				callback(msg)
			})
		},
		emitSessionid: function(msg) {
			this.$emit(this.SessionId, msg)
		},
		onSessionid: function(callback){
			this.$on(this.SessionId, function(msg) {
				callback(msg)
			})
		},
		emitVideoid: function(msg) {
			this.$emit(this.VideoId, msg)
		},
		onVideoid: function(callback){
			this.$on(this.VideoId, function(msg) {
				callback(msg)
			})
		},
		emitStart: function(msg) {
			this.$emit(this.StartMsg, msg)
		},
		onStart: function(callback){
			this.$on(this.StartMsg, function(msg) {
				callback(msg)
			})
		},
		emitInteraction: function(msg) {
			this.$emit(this.InteractionMsg, msg)
		},
		onInteraction: function(callback){
			this.$on(this.InteractionMsg, function(msg) {
				callback(msg)
			})
		}
    }
})
export default pipeService