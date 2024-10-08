import dataService from '../../service/dataService.js'
import pipeService from '../../service/pipeService.js';
import DrawVideo from "./drawVideo.js"
import * as d3 from 'd3'
import $ from 'jquery'

export default {
	name: 'DetailView',
	components: {},
	props: {},
	computed: {},
	data() {
		return {
			speakcolor: "#ebe7fe",
			//"#d8e9f1",
			//"#ebe7fe",
			speakbackgroundcolor: "#dee2e6",
			namecolor: "#9a8c98",
			highlightcolor: "#b56576",
			utterance_pointer: 1,
			id_pointer: 1,
			iconcolor: "#8a817c",
			valencecolor: "#e63946",
			arousalcolor: "#457b9d",
			iconsize: 15,
			selectcolor: '#bcb8b1',
			annotationsize: 10,
			behaviorclick: ["smile", "nod", "hand", "look", "closer", "away"],
			emotionclick: [],
			speechclick: [],
			clip_select: 0,
			condition: 0,
			condition_list: [],
			chat: [285, 286, 287, 288, 289, 290, 291]
		}
	},
	watch: {
		condition: function () {
			const _this = this
			d3.select(".detail").selectAll(".click").remove()
			d3.select(".detail").selectAll("#glyph_name").remove()
			for (let i = 0; i < 3; i++) {
				if (_this.condition == i) {
					$(".detailLegend" + i).css("fill", _this.namecolor)
				} else {
					$(".detailLegend" + i).css("fill", "white")
				}
			}
			_this.drawUtteranceAndBehavior2(_this.clip_select)
			// speech
			const speechList = ["pitch", "volume_up", "volume_down", "chat_room"]
			if (this.speechclick.length == 4) {
				$(".fa.speech").css("visibility", "visible")
			} else {
				for (let i = 0; i < speechList.length; i++) {
					if (this.speechclick.includes(speechList[i])) {
						$(".fa.speech." + speechList[i]).css("visibility", "visible")
					} else {
						$(".fa.speech." + speechList[i]).css("visibility", "hidden")
					}
				}
			}

			//emotion
			const emotionList = ["valence", "arousal"]
			if (this.emotionclick.length == 2) {
				$(".valence").css("visibility", "visible")
				$(".arousal").css("visibility", "visible")
			} else {
				for (let i = 0; i < emotionList.length; i++) {
					if (this.emotionclick.includes(emotionList[i])) {
						$("." + emotionList[i]).css("visibility", "visible")
					} else {
						$("." + emotionList[i]).css("visibility", "hidden")
					}
				}
			}

			//behavior
			const behaviorList = ["smile", "nod", "hand", "look", "closer", "away"]
			if (this.behaviorclick.length == 4) {
				$(".far.behavior.smile").css("visibility", "visible")
				$(".fa.behavior.nod").css("visibility", "visible")
				$(".far.behavior.hand").css("visibility", "visible")
				$(".fa.behavior.look").css("visibility", "visible")
				$(".fa.behavior.closer").css("visibility", "visible")
				$(".fa.behavior.away").css("visibility", "visible")
			} else {
				for (let i = 0; i < behaviorList.length; i++) {
					if (this.behaviorclick.includes(behaviorList[i])) {
						// if (i % 2 == 0) {
						// 	//console.log("1.far.bcb8b1." + behaviorList[i])
						// 	$(".far.behavior." + behaviorList[i]).css("visibility", "visible")
						// } else {
						// 	//console.log("2.fa.behavior." + behaviorList[i])
						// 	$(".fa.behavior." + behaviorList[i]).css("visibility", "visible")
						// }
						$(".far.behavior." + behaviorList[i]).css("visibility", "visible")
						$(".fa.behavior." + behaviorList[i]).css("visibility", "visible")
					} else {
						// if (i % 2 == 0) {
						// 	//console.log("3.far.behavior." + behaviorList[i])
						// 	$(".far.behavior." + behaviorList[i]).css("visibility", "hidden")
						// } else {
						// 	//console.log("4.fa.behavior." + behaviorList[i])
						// 	$(".fa.behavior." + behaviorList[i]).css("visibility", "hidden")
						// }
						$(".far.behavior." + behaviorList[i]).css("visibility", "hidden")
						$(".fa.behavior." + behaviorList[i]).css("visibility", "hidden")
					}
				}
			}
			_this.condition_list.push(_this.condition)
		},
		speechclick: function () {
			const speechList = ["pitch", "volume_up", "volume_down", "chat_room"]
			if (this.speechclick.length == 4) {
				$(".fa.speech").css("visibility", "visible")
			} else {
				for (let i = 0; i < speechList.length; i++) {
					if (this.speechclick.includes(speechList[i])) {
						$(".fa.speech." + speechList[i]).css("visibility", "visible")
					} else {
						$(".fa.speech." + speechList[i]).css("visibility", "hidden")
					}
				}
			}
		},
		emotionclick: function () {
			//console.log(this.emotionclick)
			const emotionList = ["valence", "arousal"]
			if (this.emotionclick.length == 2) {
				$(".valence").css("visibility", "visible")
				$(".arousal").css("visibility", "visible")
			} else {
				for (let i = 0; i < emotionList.length; i++) {
					if (this.emotionclick.includes(emotionList[i])) {
						$("." + emotionList[i]).css("visibility", "visible")
					} else {
						$("." + emotionList[i]).css("visibility", "hidden")
					}
				}
			}
		},
		behaviorclick: function () {
			//console.log(this.behaviorclick)
			const behaviorList = ["smile", "nod", "hand", "look", "closer", "away"]
			if (this.behaviorclick.length == 4) {
				$(".far.behavior.smile").css("visibility", "visible")
				$(".fa.behavior.nod").css("visibility", "visible")
				$(".far.behavior.hand").css("visibility", "visible")
				$(".fa.behavior.look").css("visibility", "visible")
				$(".fa.behavior.closer").css("visibility", "visible")
				$(".fa.behavior.away").css("visibility", "visible")
			} else {
				for (let i = 0; i < behaviorList.length; i++) {
					if (this.behaviorclick.includes(behaviorList[i])) {
						// if (i % 2 == 0) {
						// 	//console.log("1.far.bcb8b1." + behaviorList[i])
						// 	$(".far.behavior." + behaviorList[i]).css("visibility", "visible")
						// } else {
						// 	//console.log("2.fa.behavior." + behaviorList[i])
						// 	$(".fa.behavior." + behaviorList[i]).css("visibility", "visible")
						// }
						$(".far.behavior." + behaviorList[i]).css("visibility", "visible")
						$(".fa.behavior." + behaviorList[i]).css("visibility", "visible")
					} else {
						// if (i % 2 == 0) {
						// 	//console.log("3.far.behavior." + behaviorList[i])
						// 	$(".far.behavior." + behaviorList[i]).css("visibility", "hidden")
						// } else {
						// 	//console.log("4.fa.behavior." + behaviorList[i])
						// 	$(".fa.behavior." + behaviorList[i]).css("visibility", "hidden")
						// }
						$(".far.behavior." + behaviorList[i]).css("visibility", "hidden")
						$(".fa.behavior." + behaviorList[i]).css("visibility", "hidden")
					}
				}
			}
		}
	},
	mounted: function () {
		const _this = this
		pipeService.onSessionid(function (msg) {
			d3.select(".detail").selectAll("*").remove()
			const svg_video = d3.select(".detail")
				.append("svg")
				.attr("width", 300)
				.attr("height", 150)
				.style("position", "absolute")
				.style("z-index", "9999")
				.attr("transform", "translate(120, 150)")//截图video的时候可以调整这一个位置
				.attr("class", 'video_place')
			_this.clip_select = parseInt(msg)
			_this.condition_lis = []
			_this.drawUtteranceAndBehavior1(parseInt(msg))
		})
		pipeService.onPersonid(function (msg) {
			d3.select(".detail").selectAll("*").remove()
		})
		_this.drawLegend()
	},
	methods: {
		drawLegend() {
			const _this = this
			const _y = 5
			const _y_text = 14
			const svg = d3.select(".legendCanvas2")
				.append("svg")
				.attr("width", 400)
				.attr("height", 30)
				.append("g")

			svg.append("rect")
				.attr("x", 10)
				.attr("y", _y)
				.attr("width", 10)
				.attr("height", 10)
				.style("stroke", _this.selectcolor)
				.style("fill", _this.selectcolor)
				.attr("class", "detailLegend0")
				.on("click", function () {
					_this.condition = 0
				})

			svg.append("text")
				.attr("x", 22)
				.attr("y", _y_text)
				.attr("fill", _this.selectcolor)
				.attr("font-size", 12)
				.text("Behavior")

			svg.append("rect")
				.attr("x", 78)
				.attr("y", _y)
				.attr("width", 10)
				.attr("height", 10)
				.style("stroke", _this.selectcolor)
				.style("fill", "white")
				.attr("class", "detailLegend1")
				.on("click", function () {
					_this.condition = 1
				})

			svg.append("text")
				.attr("x", 90)
				.attr("y", _y_text)
				.attr("fill", _this.selectcolor)
				.attr("font-size", 12)
				.text("Emotion")

			svg.append("rect")
				.attr("x", 142)
				.attr("y", _y)
				.attr("width", 10)
				.attr("height", 10)
				.style("stroke", _this.selectcolor)
				.style("fill", "white")
				.attr("class", "detailLegend2")
				.on("click", function () {
					_this.condition = 2
				})

			svg.append("text")
				.attr("x", 154)
				.attr("y", _y_text)
				.attr("fill", _this.selectcolor)
				.attr("font-size", 12)
				.text("Verbal")

			svg.append("rect")
				.attr("x", 194)
				.attr("y", 0)
				.attr("width", 80)
				.attr("height", 17)
				.style("stroke", _this.selectcolor)
				.style("fill", "white")
				.attr("class", "detailLegend3")

			svg.append("text")
				.attr("x", 200)
				.attr("y", 12)
				.attr("fill", _this.selectcolor)
				.attr("font-size", 10)
				.text("Threshold")
				.attr("opacity", 0.5)

		},
		drawUtteranceAndBehavior1(clip_num) {
			const _this = this
			const data = require('../../assets/detailview_data.json')
			const valence_data = require('../../assets/detailview_valence.json')
			const arousal_data = require('../../assets/detailview_arousal.json')
			var clip_data = []
			var xtime = [0]
			var utterance_number = []
			var time_calculation = 0
			for (let i = 0; i < data.length; i++) {
				if (parseInt(data[i]['clip_id']) == clip_num) {
					clip_data.push(data[i])
					time_calculation += data[i].time
					xtime.push(time_calculation)
					//console.log('detailview-data[i]', data[i].utterance_id)
					utterance_number.push(data[i].utterance_id)
				}
			}
			//console.log("detailview-utterance_number:", utterance_number)
			var behavior_calculation = []
			var speech_calculation = []
			for (let j = 0; j < 9; j++) {
				let temp = []
				for (let i = 0; i < utterance_number.length; i++) {
					temp.push(0)
					if (j == 0) {
						speech_calculation.push(0)
					}
				}
				behavior_calculation.push(temp)

			}
			_this.utterance_pointer = utterance_number[0]
			var id_order = []
			const engagement_data = require('../../assets/userpanel_data.json')

			for (let i = 0; i < engagement_data.length; i++) {
				if (parseInt(engagement_data[i].clip) == clip_num && parseInt(engagement_data[i].id) != 1) {
					id_order.push({
						"id": parseInt(engagement_data[i].id),
						"score": parseFloat(engagement_data[i].score)
					})
				}
			}

			id_order.sort(function (a, b) {
				return (b.score - a.score)
			})
			var id = [1]
			var threshold_position = 10
			var change_mark = 0
			for (let i = 0; i < id_order.length; i++) {
				id.push(id_order[i].id)
				if (id_order[i].score < 0.5 && change_mark == 0) {
					threshold_position = id_order[i].id
					change_mark = -1
				}
			}
			id.push(10)

			const yscale = d3.scaleBand()
				.range([30, 330])
				.domain(id)

			const svg = d3.select(".detail")
				.append("svg")
				.attr("width", 1020)
				.attr("height", 300)
				.append("g")
				.attr("class", "detailsvg")
				.attr('transform','translate(50, 0)')

			// threshold line
			svg.append("line")
				.attr("x1", 10)
				.attr("y1", yscale(threshold_position) - 5)
				.attr("x2", 1050)
				.attr("y2", yscale(threshold_position) - 5)
				.attr('stroke-width', 3)
				.attr('stroke', _this.highlightcolor)
				.style("stroke-dasharray", "5,5")

			const height = 20
			const ydeviation = 15
			const xdeviation = 12
			const xstart = 15
			// calculate pixel/time_last
			const times = parseFloat(900 / xtime[xtime.length - 1])
			//background
			for (let i = 0; i < xtime.length - 1; i++) {
				//console.log('detailview-xtime', xtime[i])
				for (let j = 1; j < 10; j++) {
					let glyphg = svg.append('g')
						.attr("width", 500)
						.attr("height", 300)
					glyphg.append("rect")
						.attr("x", xtime[i] * times + xstart)
						.attr("y", yscale(j))
						.attr("width", (xtime[i + 1] - xtime[i]) * times - 1)
						.attr("height", height)
						.style("fill", _this.speakbackgroundcolor)
						.style("stroke", "white")
						.style("opacity", 0.7)
						.attr("class", "id-utterance " + utterance_number[i] + "_" + j)
				}
			}
			//speaker num
			for (let i = 0; i < 9; i++) {
				let glyphg = svg.append('g')
					.attr("width", 500)
					.attr("height", 300)
				if (i == 0) {
					glyphg.append("text")
						.attr("x", 0)
						.attr("y", yscale(i + 1) + 14)
						.attr("fill", _this.namecolor)
						.attr("font-size", 12)
						.text("T")
				} else {
					glyphg.append("text")
						.attr("x", 0)
						.attr("y", yscale(i + 1) + 14)
						.attr("fill", _this.namecolor)
						.attr("font-size", 12)
						.text(function () {
							return String.fromCharCode(64 + i)
						})
				}

			}
			//speaker

			for (let i = 0; i < clip_data.length; i++) {
				//console.log(clip_data[i])
				let glyphg = svg.append('g')
					.attr("width", 500)
					.attr("height", 300)

				glyphg.append("rect")
					.attr("x", xtime[i] * times + xstart)
					.attr("y", yscale(parseInt(clip_data[i]['speaker'])))
					.attr("width", (xtime[i + 1] - xtime[i]) * times - 1)
					.attr("height", height)
					.style("fill", _this.speakcolor)
					.style("stroke", "white")
					.style("opacity", 0.7)
					.attr("class", "id-utterance2 " + utterance_number[i] + "_" + clip_data[i]['speaker'])

				/*				//close
								for (let j = 0; j < clip_data[i]['close'].length; j++)
								{
									glyphg.append("g")
										.append("text")
										.attr("x", xtime[i]*times + behavior_calculation[parseInt(clip_data[i]['close'][j]) - 1][i] * xdeviation + xstart)
										.attr("y", yscale(parseInt(clip_data[i]['close'][j])) + ydeviation)
										.attr("class", "fa")
										.attr("fill", _this.iconcolor)
										.attr("font-size", _this.iconsize)
										.html("\uf060")
									behavior_calculation[parseInt(clip_data[i]['close'][j]) - 1][i] += 1
								}
								//away
								for (let j = 0; j < clip_data[i]['away'].length; j++)
								{
									glyphg.append("g")
										.append("text")
										.attr("x", xtime[i]*times + behavior_calculation[parseInt(clip_data[i]['away'][j]) - 1][i] * xdeviation + xstart)
										.attr("y", yscale(parseInt(clip_data[i]['away'][j])) + ydeviation)
										.attr("class", "fa")
										.attr("fill", _this.iconcolor)
										.attr("font-size", _this.iconsize)
										.html("\uf061")
									behavior_calculation[parseInt(clip_data[i]['away'][j]) - 1][i] += 1
								}
								*/

				if (_this.condition == 0) {
					//close
					for (let j = 0; j < clip_data[i]['close'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['close'][j]) - 1][i] * xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['close'][j])) + ydeviation)
							.attr("class", "fa behavior closer")
							.attr("fill", "none")
							.attr("stroke", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf192")
						behavior_calculation[parseInt(clip_data[i]['close'][j]) - 1][i] += 1
					}
					//away
					for (let j = 0; j < clip_data[i]['away'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['away'][j]) - 1][i] * xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['away'][j])) + ydeviation)
							.attr("class", "fa behavior away")
							.attr("fill", "none")
							.attr("stroke", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf111")
						behavior_calculation[parseInt(clip_data[i]['away'][j]) - 1][i] += 1
					}
					//smile
					for (let j = 0; j < clip_data[i]['smile'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['smile'][j]) - 1][
								i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['smile'][j])) + ydeviation)
							.attr("class", "far behavior smile")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf582")
						behavior_calculation[parseInt(clip_data[i]['smile'][j] - 1)][i] += 1
					}
					//nod
					for (let j = 0; j < clip_data[i]['nod'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['nod'][j]) - 1][
								i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['nod'][j])) + ydeviation)
							.attr("class", "fa behavior nod")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf338")

						behavior_calculation[parseInt(clip_data[i]['nod'][j]) - 1][i] += 1
					}
					//hand
					for (let j = 0; j < clip_data[i]['hand'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['hand'][j]) - 1][
								i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['hand'][j])) + ydeviation)
							.attr("class", "far behavior hand")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf256")

						behavior_calculation[parseInt(clip_data[i]['hand'][j]) - 1][i] += 1
					}
					//head down
					for (let j = 0; j < clip_data[i]['look'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['look'][j]) - 1][
								i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['look'][j])) + ydeviation)
							.attr("class", "fa behavior look")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf103")

						behavior_calculation[parseInt(clip_data[i]['look'][j]) - 1][i] += 1
					}
				} else if (_this.condition == 1) {
					let utterance_keys = Object.keys(valence_data[1]).map(Number)
					for (let j = 1; j < 10; j++) {
						if (!utterance_keys.includes(clip_data[i]["utterance_id"])) {
							continue
						}
						let valence_temp = valence_data[j][clip_data[i]["utterance_id"]]
						let arousal_temp = arousal_data[j][clip_data[i]["utterance_id"]]
						//line
						let vdata = []
						for (let t = 0; t < valence_temp.length; t++) {
							vdata.push({
								"X": t,
								"Y": valence_temp[t]
							})
						}

						let adata = []
						for (let t = 0; t < arousal_temp.length; t++) {
							adata.push({
								"X": t,
								"Y": arousal_temp[t]
							})
						}

						let linePath = d3.line()
							.x(function (d) {
								return xtime[i] * times + xstart + 3 + d.X / 27 * times
							})
							.y(function (d) {
								return d.Y * 9 + yscale(j) + height / 2
							})

						// glyphg.append('g')
						// 	.append('path')
						// 	.attr('class', 'valence-path')
						// 	.attr('d', linePath(vdata))
						// 	.attr('fill', 'none')
						// 	.attr('stroke-width', 1)
						// 	.attr('stroke', _this.valencecolor)
						// .attr('transform', 'translate(' + width / data.length / 2 + ', 0)')

						for (let t = 0; t < vdata.length; t++) {
							glyphg.append("rect")
								.attr("x", xtime[i] * times + xstart + 3 + vdata[t].X / 27 * times)
								.attr("y", yscale(j) + 5)
								.attr("width", 1)
								.attr("height", 10)
								.style("fill", function () {
									if (vdata[t].Y < 0) {
										return _this.valencecolor
									} else {
										return _this.arousalcolor
									}
								})
								.attr("opacity", function () {
									if (vdata[t].Y < 0) {
										return -vdata[t].Y
									} else {
										return vdata[t].Y
									}
								})
								.attr("class", function () {
									if (vdata[t].Y < 0) {
										return 'valence'
									} else {
										return 'arousal'
									}
								})
						}
						// glyphg.append('g')
						// 	.append('path')
						// 	.attr('class', 'arousal-path')
						// 	.attr('d', linePath(adata))
						// 	.attr('fill', 'none')
						// 	.attr('stroke-width', 1)
						// 	.attr('stroke', _this.arousalcolor)
						// .attr('transform', 'translate(' + width / data.length / 2 + ', 0)')
					}
				} else {
					// pitch
					if (clip_data[i]['pitch'] == 1) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + speech_calculation[i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['speaker'])) + ydeviation)
							.attr("class", "fa speech pitch")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("u")
						speech_calculation[i] += 1
					}
					// volume up
					if (clip_data[i]['volume_up'] == 1) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + speech_calculation[i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['speaker'])) + ydeviation)
							.attr("class", "fa speech volume_up")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf3bf")
						speech_calculation[i] += 1
					}

					// volume down
					if (clip_data[i]['volume_down'] == 1) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + speech_calculation[i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['speaker'])) + ydeviation)
							.attr("class", "fa speech volume_down")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf3be")
						speech_calculation[i] += 1
					}
				}
			}
			if (_this.condition == 0) {
				// anotation
				let glyph_annotation = svg.append('g')
					.attr("width", 500)
					.attr("height", 50)
					.attr("id", "glyph_name")

				glyph_annotation.append("text")
					.attr("x", 40)
					.attr("y", 20)
					.attr("class", "far")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf582")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 60)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("smile")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 180)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf338")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 200)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("nod")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 287)
					.attr("y", 20)
					.attr("class", "far")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf256")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 303)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("hand movements")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 420)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf103")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 440)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("look down")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 533)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", "none")
					.attr("stroke", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf192")
					.attr("id", "glyph_name")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 550)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("closer to the screen")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 663)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", "none")
					.attr("stroke", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf111")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 680)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("away from the screen")
					.attr("id", "glyph_name")
			}
			if (_this.condition == 1) {
				console.log(_this.condition_list)
				let glyph_annotation = svg.append('g')
					.attr("width", 500)
					.attr("height", 50)
					.attr("id", "glyph_name")

				glyph_annotation.append("rect")
					.attr("x", 25)
					.attr("y", 11)
					.attr("width", 8)
					.attr("height", 8)
					.style("fill", _this.valencecolor)
					.style("stroke", _this.valencecolor)
					.attr("id", "glyph_name")

				glyph_annotation.append("text")
					.attr("x", 38)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("negative")
					.attr("id", "glyph_name")

				glyph_annotation.append("rect")
					.attr("x", 125)
					.attr("y", 11)
					.attr("width", 8)
					.attr("height", 8)
					.style("fill", _this.arousalcolor)
					.style("stroke", _this.arousalcolor)
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 138)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("positive")
					.attr("id", "glyph_name")
			}
			if (_this.condition == 2) {
				let glyph_annotation = svg.append('g')
					.attr("width", 500)
					.attr("height", 50)
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 30)
					.attr("y", 20)
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("u")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 50)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("pitch")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 120)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf3bf")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 135)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("volume up")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 215)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf3be")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 228)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("volume down")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 318)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf086")
					.attr("id", "glyph_name")

				glyph_annotation
					.append("text")
					.attr("x", 338)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("chat room")
					.attr("id", "glyph_name")
			}

			//***********************remove************************
			Array.prototype.indexOf = function (val) {
				for (var i = 0; i < this.length; i++) {
					if (this[i] == val) return i;
				}
				return -1;
			}
			Array.prototype.remove = function (val) {
				var index = this.indexOf(val);
				if (index > -1) {
					this.splice(index, 1);
				}
			}
			//***********************remove************************

			if (_this.condition == 0) {
				const behavior_order = ['smile', 'nod', 'hand', 'look', 'closer', 'away']
				// add annotation click <behavior>
				for (let i = 0; i < 6; i++) {
					let glyph_temp = svg.append('g')
						.attr("width", 500)
						.attr("height", 60)

					glyph_temp.append("rect")
						.attr("x", 10 + i * 130)
						.attr("y", 5)
						.attr("width", 120)
						.attr("height", 20)
						.style("fill", _this.highlightcolor) // 最开始默认都点击
						.style("stroke", _this.speakbackgroundcolor)
						.style("opacity", 0.3)
						.attr("class", "click behaviors " + i)
						.on("click", function () {
							if (_this.behaviorclick.includes(behavior_order[i])) {
								_this.behaviorclick.remove(behavior_order[i])
								$(".click.behaviors." + i).css("fill", _this.speakbackgroundcolor)
							} else {
								_this.behaviorclick.push(behavior_order[i])
								$(".click.behaviors." + i).css("fill", _this.highlightcolor)

							}
						})
				}
			} else if (_this.condition == 1) {
				const emotion_order = ['valence', 'arousal']
				// add annotation click <emotion>
				for (let i = 0; i < 2; i++) {
					let glyph_temp = svg.append('g')
						.attr("width", 500)
						.attr("height", 60)

					glyph_temp.append("rect")
						.attr("x", 10 + i * 100)
						.attr("y", 5)
						.attr("width", 80)
						.attr("height", 20)
						.style("fill", _this.speakbackgroundcolor)
						.style("stroke", _this.speakbackgroundcolor)
						.style("opacity", 0.3)
						.attr("class", "click emotions " + i)
						.on("click", function () {
							if (_this.emotionclick.includes(emotion_order[i])) {
								_this.emotionclick.remove(emotion_order[i])
								$(".click.emotions." + i).css("fill", _this.speakbackgroundcolor)
							} else {
								_this.emotionclick.push(emotion_order[i])
								$(".click.emotions." + i).css("fill", _this.highlightcolor)
							}
						})
				}
			} else {
				const speech_order = ['pitch', 'volume_up', 'volume_down', 'chat_room']
				// add annotation click <emotion>
				for (let i = 0; i < 4; i++) {
					let glyph_temp = svg.append('g')
						.attr("width", 500)
						.attr("height", 60)

					glyph_temp.append("rect")
						.attr("x", 10 + i * 100)
						.attr("y", 5)
						.attr("width", 80)
						.attr("height", 20)
						.style("fill", _this.speakbackgroundcolor)
						.style("stroke", _this.speakbackgroundcolor)
						.style("opacity", 0.3)
						.attr("class", "click speech " + i)
						.on("click", function () {
							if (_this.speechclick.includes(speech_order[i])) {
								_this.speechclick.remove(speech_order[i])
								$(".click.speech." + i).css("fill", _this.speakbackgroundcolor)
							} else {
								_this.speechclick.push(speech_order[i])
								$(".click.speech." + i).css("fill", _this.highlightcolor)
							}
						})
				}
			}
			//chat room
			if (_this.condition == 2) {
				for (let i = 0; i < utterance_number.length; i++) {
					for (let j = 0; j < 9; j++) {
						if (_this.chat.includes(utterance_number[i])) {
							let glyphg = svg.append('g')
								.attr("width", 500)
								.attr("height", 60)

							glyphg.append("g")
								.append("text")
								.attr("x", xtime[utterance_number[i] - utterance_number[0]] * times + 17)
								.attr("y", yscale(j + 1) + 15)
								.attr("class", "fa speech chat_room")
								.attr("fill", _this.iconcolor)
								.attr("font-size", _this.iconsize)
								.html("\uf086")
						}
					}
				}

			}

			// click utterance
			$(".id-utterance").click(function () {
				let temp = $(this).attr("class").split(' ')[1].split('_')
				let utterance_temp = parseInt(temp[1])
				let id_temp = parseInt(temp[0])
				_this.drawVideoPlay(id_temp + " " + utterance_temp)
				//console.log("detailview-video_id", ".id-utterance." + id_temp + "_" + utterance_temp)
				//console.log($("detailview-video_id", ".id-utterance." + id_temp + "_" + utterance_temp))
				//console.log("detailview-video_id", ".id-utterance." + id_temp + "." + utterance_temp)
				//console.log("detailview-video_id", _this.id_pointer, _this.utterance_pointer)
				$(".id-utterance." + _this.id_pointer + "_" + _this.utterance_pointer).css("stroke", "white")
				$(".id-utterance2." + _this.id_pointer + "_" + _this.utterance_pointer).css("stroke", "white")
				$(".id-utterance." + id_temp + "_" + utterance_temp).css("stroke", _this.highlightcolor)
				_this.id_pointer = id_temp
				_this.utterance_pointer = utterance_temp
			})

			$(".id-utterance2").click(function () {
				//console.log("detail-utterance_id", $(this).attr("class").split(' '))
				let temp = $(this).attr("class").split(' ')[1].split('_')
				//console.log(temp)
				let utterance_temp = parseInt(temp[1])
				let id_temp = parseInt(temp[0])
				_this.drawVideoPlay(id_temp + " " + utterance_temp)
				//console.log("detailview-video_id", ".id-utterance2." + id_temp + "_" + utterance_temp)
				$(".id-utterance." + _this.id_pointer + "_" + _this.utterance_pointer).css("stroke", "white")
				$(".id-utterance2." + _this.id_pointer + "_" + _this.utterance_pointer).css("stroke", "white")
				$(".id-utterance2." + id_temp + "_" + utterance_temp).css("stroke", _this.highlightcolor)
				_this.id_pointer = id_temp
				_this.utterance_pointer = utterance_temp
			})
		},
		drawVideoPlay(msg) {
			let _this = this
			const videoname = require('../../assets/videoname.json')
			var vname = []
			for (let i = 0; i < videoname.length; i++) {
				vname.push('video/' + videoname[i]['file'])
			}
			//console.log(vname)
			_this.drawVideo = new DrawVideo('.video_place');
			let videoInfo = {
				"videoWidth": 416,
				"videoHeight": 232,
				"fps": 25,
				"videoPath": _this.videoUrl,
				"type": "mp4"
			}
			//console.log("videoview-vname", vname)
	
			var filePath = _this.videoUrl
			for (let i = 0; i < 27; i++) {
				let filePath_temp = 'video/' + msg.split(' ')[1] + '-' + i + '-' + msg.split(' ')[0] +
					'.mp4'
				if (vname.includes(filePath_temp)) {
					console.log("videoview-videofile:", filePath_temp)
					videoInfo.videoPath = filePath_temp
					filePath = filePath_temp
				}
			}
			_this.drawVideo.layout("#video_place", videoInfo, filePath)
			// d3.select("#transcript").selectAll("*").remove()
			// _this.presentTranscript(parseInt(msg.split(' ')[0]))
	
		},
		drawUtteranceAndBehavior2(clip_num) {
			const _this = this
			const data = require('../../assets/detailview_data.json')
			const valence_data = require('../../assets/detailview_valence.json')
			const arousal_data = require('../../assets/detailview_arousal.json')
			var clip_data = []
			var xtime = [0]
			var utterance_number = []
			var time_calculation = 0
			for (let i = 0; i < data.length; i++) {
				if (parseInt(data[i]['clip_id']) == clip_num) {
					clip_data.push(data[i])
					time_calculation += data[i].time
					xtime.push(time_calculation)
					//console.log('detailview-data[i]', data[i].utterance_id)
					utterance_number.push(data[i].utterance_id)
				}
			}
			//console.log("detailview-utterance_number:", utterance_number)
			var behavior_calculation = []
			var speech_calculation = []
			for (let j = 0; j < 9; j++) {
				let temp = []
				for (let i = 0; i < utterance_number.length; i++) {
					temp.push(0)
					if (j == 0) {
						speech_calculation.push(0)
					}
				}
				behavior_calculation.push(temp)

			}
			_this.utterance_pointer = utterance_number[0]
			var id_order = []
			const engagement_data = require('../../assets/userpanel_data.json')

			for (let i = 0; i < engagement_data.length; i++) {
				if (parseInt(engagement_data[i].clip) == clip_num && parseInt(engagement_data[i].id) != 1) {
					id_order.push({
						"id": parseInt(engagement_data[i].id),
						"score": parseFloat(engagement_data[i].score)
					})
				}
			}

			id_order.sort(function (a, b) {
				return (b.score - a.score)
			})
			var id = [1]
			var threshold_position = 10
			var change_mark = 0
			for (let i = 0; i < id_order.length; i++) {
				id.push(id_order[i].id)
				if (id_order[i].score < 0.5 && change_mark == 0) {
					threshold_position = id_order[i].id
					change_mark = -1
				}
			}
			id.push(10)

			const yscale = d3.scaleBand()
				.range([30, 330])
				.domain(id)

			// const svg = d3.select(".detail")
			// 	.append("svg")
			// 	.attr("width", 920)
			// 	.attr("height", 300)
			// 	.append("g")

			// threshold line
			// svg.append("line")
			// 	.attr("x1", 10)
			// 	.attr("y1", yscale(threshold_position) - 5)
			// 	.attr("x2", 1050)
			// 	.attr("y2", yscale(threshold_position) - 5)
			// 	.attr('stroke-width', 3)
			// 	.attr('stroke', _this.highlightcolor)
			// 	.style("stroke-dasharray", "5,5")

			const height = 20
			const ydeviation = 15
			const xdeviation = 12
			const xstart = 15
			// calculate pixel/time_last
			const times = parseFloat(900 / xtime[xtime.length - 1])
			//background
			// for (let i = 0; i < xtime.length - 1; i++) {
			// 	//console.log('detailview-xtime', xtime[i])
			// 	for (let j = 1; j < 10; j++) {
			// 		let glyphg = svg.append('g')
			// 			.attr("width", 500)
			// 			.attr("height", 300)
			// 		glyphg.append("rect")
			// 			.attr("x", xtime[i] * times + xstart)
			// 			.attr("y", yscale(j))
			// 			.attr("width", (xtime[i + 1] - xtime[i]) * times - 1)
			// 			.attr("height", height)
			// 			.style("fill", _this.speakbackgroundcolor)
			// 			.style("stroke", "white")
			// 			.style("opacity", 0.7)
			// 			.attr("class", "id-utterance " + utterance_number[i] + "_" + j)
			// 	}
			// }
			//speaker num
			// for (let i = 0; i < 9; i++) {
			// 	let glyphg = svg.append('g')
			// 		.attr("width", 500)
			// 		.attr("height", 300)
			// 	if (i == 0) {
			// 		glyphg.append("text")
			// 			.attr("x", 0)
			// 			.attr("y", yscale(i + 1) + 14)
			// 			.attr("fill", _this.namecolor)
			// 			.attr("font-size", 12)
			// 			.text("T")
			// 	} else {
			// 		glyphg.append("text")
			// 			.attr("x", 0)
			// 			.attr("y", yscale(i + 1) + 14)
			// 			.attr("fill", _this.namecolor)
			// 			.attr("font-size", 12)
			// 			.text(function() {
			// 				return String.fromCharCode(64 + i)
			// 			})
			// 	}

			// }
			//speaker
			const svg = d3.select('.detailsvg')

			for (let i = 0; i < clip_data.length; i++) {
				//console.log(clip_data[i])
				let glyphg = svg.append('g')
					.attr("width", 500)
					.attr("height", 300)

				// glyphg.append("rect")
				// 	.attr("x", xtime[i] * times + xstart)
				// 	.attr("y", yscale(parseInt(clip_data[i]['speaker'])))
				// 	.attr("width", (xtime[i + 1] - xtime[i]) * times - 1)
				// 	.attr("height", height)
				// 	.style("fill", _this.speakcolor)
				// 	.style("stroke", "white")
				// 	.style("opacity", 0.7)
				// 	.attr("class", "id-utterance2 " + utterance_number[i] + "_" + clip_data[i]['speaker'])

				/*				//close
								for (let j = 0; j < clip_data[i]['close'].length; j++)
								{
									glyphg.append("g")
										.append("text")
										.attr("x", xtime[i]*times + behavior_calculation[parseInt(clip_data[i]['close'][j]) - 1][i] * xdeviation + xstart)
										.attr("y", yscale(parseInt(clip_data[i]['close'][j])) + ydeviation)
										.attr("class", "fa")
										.attr("fill", _this.iconcolor)
										.attr("font-size", _this.iconsize)
										.html("\uf060")
									behavior_calculation[parseInt(clip_data[i]['close'][j]) - 1][i] += 1
								}
								//away
								for (let j = 0; j < clip_data[i]['away'].length; j++)
								{
									glyphg.append("g")
										.append("text")
										.attr("x", xtime[i]*times + behavior_calculation[parseInt(clip_data[i]['away'][j]) - 1][i] * xdeviation + xstart)
										.attr("y", yscale(parseInt(clip_data[i]['away'][j])) + ydeviation)
										.attr("class", "fa")
										.attr("fill", _this.iconcolor)
										.attr("font-size", _this.iconsize)
										.html("\uf061")
									behavior_calculation[parseInt(clip_data[i]['away'][j]) - 1][i] += 1
								}
								*/

				if (_this.condition == 0 && !_this.condition_list.includes(0)) {
					//console.log('*Test-condition_list', _this.condition_list)
					//close
					for (let j = 0; j < clip_data[i]['close'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['close'][j]) - 1][i] * xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['close'][j])) + ydeviation)
							.attr("class", "fa behavior closer")
							.attr("fill", "none")
							.attr("stroke", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf192")
						behavior_calculation[parseInt(clip_data[i]['close'][j]) - 1][i] += 1
					}
					//away
					for (let j = 0; j < clip_data[i]['away'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['away'][j]) - 1][i] * xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['away'][j])) + ydeviation)
							.attr("class", "fa behavior away")
							.attr("fill", "none")
							.attr("stroke", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf111")
						behavior_calculation[parseInt(clip_data[i]['away'][j]) - 1][i] += 1
					}
					//smile
					for (let j = 0; j < clip_data[i]['smile'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['smile'][j]) - 1][
								i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['smile'][j])) + ydeviation)
							.attr("class", "far behavior smile")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf582")
						behavior_calculation[parseInt(clip_data[i]['smile'][j] - 1)][i] += 1
					}
					//nod
					for (let j = 0; j < clip_data[i]['nod'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['nod'][j]) - 1][
								i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['nod'][j])) + ydeviation)
							.attr("class", "fa behavior nod")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf338")

						behavior_calculation[parseInt(clip_data[i]['nod'][j]) - 1][i] += 1
					}
					//hand
					for (let j = 0; j < clip_data[i]['hand'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['hand'][j]) - 1][
								i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['hand'][j])) + ydeviation)
							.attr("class", "far behavior hand")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf256")

						behavior_calculation[parseInt(clip_data[i]['hand'][j]) - 1][i] += 1
					}
					//head down
					for (let j = 0; j < clip_data[i]['look'].length; j++) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + behavior_calculation[parseInt(clip_data[i]['look'][j]) - 1][
								i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['look'][j])) + ydeviation)
							.attr("class", "fa behavior look")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf103")

						behavior_calculation[parseInt(clip_data[i]['look'][j]) - 1][i] += 1
					}
				}
				if (_this.condition == 1 && !_this.condition_list.includes(1)) {
					let utterance_keys = Object.keys(valence_data[1]).map(Number)
					for (let j = 1; j < 10; j++) {
						if (!utterance_keys.includes(clip_data[i]["utterance_id"])) {
							continue
						}
						let valence_temp = valence_data[j][clip_data[i]["utterance_id"]]
						let arousal_temp = arousal_data[j][clip_data[i]["utterance_id"]]
						//line
						let vdata = []
						for (let t = 0; t < valence_temp.length; t++) {
							vdata.push({
								"X": t,
								"Y": valence_temp[t]
							})
						}

						let adata = []
						for (let t = 0; t < arousal_temp.length; t++) {
							adata.push({
								"X": t,
								"Y": arousal_temp[t]
							})
						}

						let linePath = d3.line()
							.x(function (d) {
								return xtime[i] * times + xstart + 3 + d.X / 27 * times
							})
							.y(function (d) {
								return d.Y * 9 + yscale(j) + height / 2
							})

						// glyphg.append('g')
						// 	.append('path')
						// 	.attr('class', 'valence-path')
						// 	.attr('d', linePath(vdata))
						// 	.attr('fill', 'none')
						// 	.attr('stroke-width', 1)
						// 	.attr('stroke', _this.valencecolor)
						// .attr('transform', 'translate(' + width / data.length / 2 + ', 0)')

						for (let t = 0; t < vdata.length; t++) {
							glyphg.append("rect")
								.attr("x", xtime[i] * times + xstart + 3 + vdata[t].X / 27 * times)
								.attr("y", yscale(j) + 5)
								.attr("width", 1)
								.attr("height", 10)
								.style("fill", function () {
									if (vdata[t].Y < 0) {
										return _this.valencecolor
									} else {
										return _this.arousalcolor
									}
								})
								.attr("opacity", function () {
									if (vdata[t].Y < 0) {
										return -vdata[t].Y
									} else {
										return vdata[t].Y
									}
								})
								.attr("class", function () {
									if (vdata[t].Y < 0) {
										return 'valence'
									} else {
										return 'arousal'
									}
								})
						}
						// glyphg.append('g')
						// 	.append('path')
						// 	.attr('class', 'arousal-path')
						// 	.attr('d', linePath(adata))
						// 	.attr('fill', 'none')
						// 	.attr('stroke-width', 1)
						// 	.attr('stroke', _this.arousalcolor)
						// .attr('transform', 'translate(' + width / data.length / 2 + ', 0)')
					}
				}
				if (_this.condition == 2 && !_this.condition_list.includes(2)) {
					// pitch
					if (clip_data[i]['pitch'] == 1) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + speech_calculation[i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['speaker'])) + ydeviation)
							.attr("class", "fa speech pitch")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("u")
						speech_calculation[i] += 1
					}
					// volume up
					if (clip_data[i]['volume_up'] == 1) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + speech_calculation[i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['speaker'])) + ydeviation)
							.attr("class", "fa speech volume_up")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf3bf")
						speech_calculation[i] += 1
					}

					// volume down
					if (clip_data[i]['volume_down'] == 1) {
						glyphg.append("g")
							.append("text")
							.attr("x", xtime[i] * times + speech_calculation[i] *
								xdeviation + xstart)
							.attr("y", yscale(parseInt(clip_data[i]['speaker'])) + ydeviation)
							.attr("class", "fa speech volume_down")
							.attr("fill", _this.iconcolor)
							.attr("font-size", _this.iconsize)
							.html("\uf3be")
						speech_calculation[i] += 1
					}
				}
			}
			if (_this.condition == 0) {
				// anotation
				let glyph_annotation = svg.append('g')
					.attr("width", 500)
					.attr("height", 50)
					.attr("class", 'click')

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 40)
					.attr("y", 20)
					.attr("class", "far")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf582")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 60)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("smile")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 180)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf338")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 200)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("nod")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 287)
					.attr("y", 20)
					.attr("class", "far")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf256")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 303)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("hand movements")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 420)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf103")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 440)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("look down")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 533)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", "none")
					.attr("stroke", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf192")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 550)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("closer to the screen")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 663)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", "none")
					.attr("stroke", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf111")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 680)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("away from the screen")
			} else if (_this.condition == 1) {
				let glyph_annotation = svg.append('g')
					.attr("width", 500)
					.attr("height", 50)
					.attr("class", 'click')

				glyph_annotation.append("rect")
					.attr("x", 25)
					.attr("y", 11)
					.attr("width", 8)
					.attr("height", 8)
					.style("fill", _this.valencecolor)
					.style("stroke", _this.valencecolor)

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 38)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("negative")

				glyph_annotation.append("rect")
					.attr("x", 125)
					.attr("y", 11)
					.attr("width", 8)
					.attr("height", 8)
					.style("fill", _this.arousalcolor)
					.style("stroke", _this.arousalcolor)

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 138)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("positive")
			} else {
				let glyph_annotation = svg.append('g')
					.attr("width", 500)
					.attr("height", 50)
					.attr("class", 'click')

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 30)
					.attr("y", 20)
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("u")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 50)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("pitch")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 120)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf3bf")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 135)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("volume up")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 215)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf3be")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 228)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("volume down")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 318)
					.attr("y", 20)
					.attr("class", "fa")
					.attr("fill", _this.iconcolor)
					.attr("font-size", _this.iconsize)
					.html("\uf086")

				glyph_annotation.append("g")
					.append("text")
					.attr("x", 338)
					.attr("y", 18)
					.attr("font-size", _this.annotationsize)
					.text("chat room")
			}

			//***********************remove************************
			Array.prototype.indexOf = function (val) {
				for (var i = 0; i < this.length; i++) {
					if (this[i] == val) return i;
				}
				return -1;
			}
			Array.prototype.remove = function (val) {
				var index = this.indexOf(val);
				if (index > -1) {
					this.splice(index, 1);
				}
			}
			//***********************remove************************

			if (_this.condition == 0) {
				const behavior_order = ['smile', 'nod', 'hand', 'look', 'closer', 'away']
				// add annotation click <behavior>
				for (let i = 0; i < 6; i++) {
					let glyph_temp = svg.append('g')
						.attr("width", 500)
						.attr("height", 60)

					glyph_temp.append("rect")
						.attr("x", 10 + i * 130)
						.attr("y", 5)
						.attr("width", 120)
						.attr("height", 20)
						.style("fill", _this.highlightcolor) //最开始默认都点击
						.style("stroke", _this.speakbackgroundcolor)
						.style("opacity", 0.3)
						.attr("class", "click behaviors " + i)
						.on("click", function () {
							if (_this.behaviorclick.includes(behavior_order[i])) {
								_this.behaviorclick.remove(behavior_order[i])
								$(".click.behaviors." + i).css("fill", _this.speakbackgroundcolor)
							} else {
								_this.behaviorclick.push(behavior_order[i])
								$(".click.behaviors." + i).css("fill", _this.highlightcolor)

							}
						})
				}
			} else if (_this.condition == 1) {
				const emotion_order = ['valence', 'arousal']
				// add annotation click <emotion>
				for (let i = 0; i < 2; i++) {
					let glyph_temp = svg.append('g')
						.attr("width", 500)
						.attr("height", 60)

					glyph_temp.append("rect")
						.attr("x", 10 + i * 100)
						.attr("y", 5)
						.attr("width", 80)
						.attr("height", 20)
						.style("fill", _this.speakbackgroundcolor)
						.style("stroke", _this.speakbackgroundcolor)
						.style("opacity", 0.3)
						.attr("class", "click emotions " + i)
						.on("click", function () {
							if (_this.emotionclick.includes(emotion_order[i])) {
								_this.emotionclick.remove(emotion_order[i])
								$(".click.emotions." + i).css("fill", _this.speakbackgroundcolor)
							} else {
								_this.emotionclick.push(emotion_order[i])
								$(".click.emotions." + i).css("fill", _this.highlightcolor)
							}
						})
				}
			} else {
				const speech_order = ['pitch', 'volume_up', 'volume_down', 'chat_room']
				// add annotation click <emotion>
				for (let i = 0; i < 4; i++) {
					let glyph_temp = svg.append('g')
						.attr("width", 500)
						.attr("height", 60)

					glyph_temp.append("rect")
						.attr("x", 10 + i * 100)
						.attr("y", 5)
						.attr("width", 80)
						.attr("height", 20)
						.style("fill", _this.speakbackgroundcolor)
						.style("stroke", _this.speakbackgroundcolor)
						.style("opacity", 0.3)
						.attr("class", "click speech " + i)
						.on("click", function () {
							if (_this.speechclick.includes(speech_order[i])) {
								_this.speechclick.remove(speech_order[i])
								$(".click.speech." + i).css("fill", _this.speakbackgroundcolor)
							} else {
								_this.speechclick.push(speech_order[i])
								$(".click.speech." + i).css("fill", _this.highlightcolor)
							}
						})
				}
			}
			//chat room
			if (_this.condition == 2) {
				for (let i = 0; i < utterance_number.length; i++) {
					for (let j = 0; j < 9; j++) {
						if (_this.chat.includes(utterance_number[i])) {
							let glyphg = svg.append('g')
								.attr("width", 500)
								.attr("height", 60)

							glyphg.append("g")
								.append("text")
								.attr("x", xtime[utterance_number[i] - utterance_number[0]] * times + 17)
								.attr("y", yscale(j + 1) + 15)
								.attr("class", "fa speech chat_room")
								.attr("fill", _this.iconcolor)
								.attr("font-size", _this.iconsize)
								.html("\uf086")
						}
					}
				}

			}

			// click utterance
			$(".id-utterance").click(function () {
				let temp = $(this).attr("class").split(' ')[1].split('_')
				let utterance_temp = parseInt(temp[1])
				let id_temp = parseInt(temp[0])
				_this.drawVideoPlay(id_temp + " " + utterance_temp)
				//console.log("detailview-video_id", ".id-utterance." + id_temp + "_" + utterance_temp)
				//console.log($("detailview-video_id", ".id-utterance." + id_temp + "_" + utterance_temp))
				//console.log("detailview-video_id", ".id-utterance." + id_temp + "." + utterance_temp)
				//console.log("detailview-video_id", _this.id_pointer, _this.utterance_pointer)
				$(".id-utterance." + _this.id_pointer + "_" + _this.utterance_pointer).css("stroke", "white")
				$(".id-utterance2." + _this.id_pointer + "_" + _this.utterance_pointer).css("stroke", "white")
				$(".id-utterance." + id_temp + "_" + utterance_temp).css("stroke", _this.highlightcolor)
				_this.id_pointer = id_temp
				_this.utterance_pointer = utterance_temp
			})

			$(".id-utterance2").click(function () {
				//console.log("detail-utterance_id", $(this).attr("class").split(' '))
				let temp = $(this).attr("class").split(' ')[1].split('_')
				//console.log(temp)
				let utterance_temp = parseInt(temp[1])
				let id_temp = parseInt(temp[0])
				_this.drawVideoPlay(id_temp + " " + utterance_temp)
				//console.log("detailview-video_id", ".id-utterance2." + id_temp + "_" + utterance_temp)
				$(".id-utterance." + _this.id_pointer + "_" + _this.utterance_pointer).css("stroke", "white")
				$(".id-utterance2." + _this.id_pointer + "_" + _this.utterance_pointer).css("stroke", "white")
				$(".id-utterance2." + id_temp + "_" + utterance_temp).css("stroke", _this.highlightcolor)
				_this.id_pointer = id_temp
				_this.utterance_pointer = utterance_temp
			})
		},
		presentTranscript(utterance_num) {
			const transcript = require('../../assets/video3_transcript.json')
			const text = transcript[utterance_num - 1]
			const name_map = {
				'Kwong Yue Yang': 1,
				'Lexandra Confiado': 8,
				'Alyson Sosa': 4,
				'Arunabh Singh': 9,
				'Lynette K': 6,
				'David Hsu': 3,
				'Paul Lee': 2,
				'Harish Ashok Mahadik': 7,
				'Sophia Zhu': 5
			}
			const svg = d3.select("#transcript")
				.append("svg")
				.attr("width", 400)
				.attr("height", 102)
				.append("g")
			let name_temp = text.dialogue.split(': ')[0]
			let name_letter = 'T'
			if (Object.keys(name_map).includes(name_temp)) {
				if (name_map[name_temp] != 1) {
					name_letter = String.fromCharCode(63 + name_map[name_temp])
				}
			}
			let content_temp = text.dialogue.split(': ')[1]
			let tdata = this.worddivide(name_letter + ": " + content_temp, 73)

			for (let i = 0; i < tdata.length; i++) {
				svg.append("text")
					.attr("x", 2)
					.attr("y", 18 + i * 15)
					.attr("fill", "#9a8c98")
					.attr("font-size", 12)
					.text(tdata[i])
			}
		},
		worddivide(text, height) {
			let temp = text.split(' ')
			let tdata = []
			let tempstring = ""
			for (let i = 0; i < temp.length; i++) {
				let newstring = tempstring + temp[i] + " "
				if (i == temp.length - 1) {
					if (newstring.length < height) {
						tdata.push(newstring)
					} else {
						tdata.push(tempstring)
						tdata.push(temp[i])
					}
				} else {
					if (newstring.length < height) {
						tempstring = newstring
					} else {
						tdata.push(tempstring)
						tempstring = temp[i] + " "
					}
				}
			}
			return tdata
		}
	}
}