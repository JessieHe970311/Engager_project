import dataService from '../../service/dataService.js'
import pipeService from '../../service/pipeService.js'
import * as d3 from 'd3'
import $ from 'jquery'

export default {
	name: 'ControlPanel',
	components: {},
	props: {},
	computed: {},
	data() {
		return {
			condition: 0,
			id_select: -1,
			highlight_color: "#b5838d",
			label_color: "#9a8c98",
			element_color: "#eacdc2",
			//"#eacdc2",
			element2_color: "#eacdc2",
			//"#e9edc9",
			element3_color: "#eacdc2",
			//"#bbd0ff",
			select_color: '#bcb8b1',
		}
	},
	watch: {
		condition: function () {
			const _this = this
			// change legend
			for (let i = -1; i < 2; i++) {
				if (_this.condition == i) {
					$(".order" + i).css("fill", _this.label_color)
				} else {
					$(".order" + i).css("fill", "white")
				}
			}
			d3.select("#detail").selectAll("*").remove()
			_this.drawEngagementScoreAndType1(_this.condition)
			if (_this.id_select == 1) {
				$(".name.coach").attr("fill", _this.highlight_color)
				$(".circle.coach").css("stroke", _this.highlight_color)
			} else {
				for (let t = 2; t < 10; t++) {
					if (t == _this.id_select) {
						$(".name.letter." + t).attr("fill", _this.highlight_color)
						$(".name.circle." + t).css("stroke", _this.highlight_color)
						$(".name.average_score." + t).css("fill", _this.highlight_color)
						$(".engagement_score." + t).css("fill", _this.highlight_color)
					} else {
						$(".name.letter." + t).attr("fill", _this.label_color)
						$(".name.circle." + t).css("stroke", _this.label_color)
						if (t == 2 || t == 3 || t == 4 || t == 7 || t == 9) {
							$(".name.average_score." + t).css("fill", _this.element_color)
							$(".engagement_score." + t).css("fill", _this.element_color)
						} else if (t == 5 || t == 6) {
							$(".name.average_score." + t).css("fill", _this.element2_color)
							$(".engagement_score." + t).css("fill", _this.element2_color)
						} else {
							$(".name.average_score." + t).css("fill", _this.element3_color)
							$(".engagement_score." + t).css("fill", _this.element3_color)
						}
					}
				}
			}
		}
	},
	mounted: function () {
		const _this = this
		pipeService.onStart(function (msg) {
			if (msg == "1") {
				_this.drawEngagementScoreAndType1(_this.condition)
				_this.drawLegend()
			}
		})
	},
	methods: {
		drawLegend() {
			const _this = this
			const svg = d3.select(".legendCanvas3")
				.append("svg")
				.attr("width", 500)
				.attr("height", 30)
				.append("g")

			svg.append("rect")
				.attr("x", 10)
				.attr("y", 3)
				.attr("width", 10)
				.attr("height", 10)
				.style("stroke", _this.select_color)
				.style("fill", _this.select_color)
				.attr("class", "order0")
				.on("click", function () {
					_this.condition = 0
				})

			svg.append("text")
				.attr("x", 22)
				.attr("y", 12)
				.attr("fill", _this.select_color)
				.attr("font-size", 12)
				.text("Default")

			svg.append("rect")
				.attr("x", 65)
				.attr("y", 3)
				.attr("width", 10)
				.attr("height", 10)
				.style("stroke", _this.select_color)
				.style("fill", "white")
				.attr("class", "order1")
				.on("click", function () {
					_this.condition = 1
				})

			svg.append("text")
				.attr("x", 77)
				.attr("y", 12)
				.attr("fill", _this.select_color)
				.attr("font-size", 12)
				.text("Descending")

			svg.append("rect")
				.attr("x", 148)
				.attr("y", 3)
				.attr("width", 10)
				.attr("height", 10)
				.style("stroke", _this.select_color)
				.style("fill", "white")
				.attr("class", "order-1")
				.on("click", function () {
					_this.condition = -1
				})

			svg.append("text")
				.attr("x", 160)
				.attr("y", 12)
				.attr("fill", _this.select_color)
				.attr("font-size", 12)
				.text("Ascending")

		},
		drawEngagementScoreAndType1(condition) {
			const _this = this
			d3.select("#panel").selectAll("*").remove()
			var data = require('../../assets/userpanel_data.json')
			//console.log(data)
			var eventtype = require('../../assets/video3_event-updated.json')
			var element = []
			var clip = [] // how many clips and the corresponding num
			var id = [] // how many people and the corresponding num
			var type = [] // how many event types and the corresponding name
			var relation_clip_type = []
			// construct glyph data set 'element': []
			for (let i = 0; i < data.length; i++) {
				if (parseInt(data[i].id) != 1) {
					element.push({
						X: parseInt(data[i].clip),
						Y: parseInt(data[i].id),
						score: parseFloat(data[i].score),
						clip: parseInt(data[i].clip)
					})
					if (!clip.includes(parseInt(data[i].clip))) {
						clip.push(parseInt(data[i].clip))
					}
					if (!id.includes(parseInt(data[i].id))) {
						id.push(parseInt(data[i].id))
					}
				}
			}
			const asc = (a, b) => a - b; //ascend
			const des = (a, b) => b - a; //descend

			var engagement_sum = [0, 0, 0, 0, 0, 0, 0, 0]
			var engagement_num = [0, 0, 0, 0, 0, 0, 0, 0]
			for (let i = 2; i < 10; i++) {
				for (let j = 0; j < element.length; j++) {
					if (element[j].score != 0) {
						engagement_sum[element[j].Y - 2] += element[j].score
						engagement_num[element[j].Y - 2] += 1
					}
				}
			}
			const engagement_data = []
			for (let i = 0; i < engagement_sum.length; i++) {
				engagement_sum[i] /= engagement_num[i]
				engagement_data.push({
					'id': i + 2,
					'score': engagement_sum[i]
				})
			}

			if (condition == 1) {
				engagement_data.sort(function (a, b) {
					return (b.score - a.score)
				})
			} else {
				engagement_data.sort(function (a, b) {
					return (a.score - b.score)
				})
			}

			//console.log('userpanel-engagement_data', engagement_data)


			clip.sort(asc)
			// map clip->x
			const xscale = d3.scaleBand()
				.range([50, 280])
				.domain(clip)

			// map id->y
			if (condition == 0) {
				id = [4, 7, 2, 3, 9, 5, 6, 8]
			} else {
				for (let i = 0; i < engagement_data.length; i++) {
					id[i] = engagement_data[i].id
				}
			}
			//console.log("user-panel", id)

			const yscale = d3.scaleBand()
				.range([115, 525])
				.domain(id)

			for (let i = 0; i < clip.length; i++) {
				let event_temp = eventtype[clip[i]].event_type
				if (!type.includes(event_temp)) {
					type.push(event_temp)
				}
			}

			// map event_type -> color
			const cscale = d3.scaleOrdinal()
				.range(["red", "blue", "green"])
				.domain(type)

			// draw glyph
			const svg = d3.select("#panel")
				.append("svg")
				.attr("width", 500)
				.attr("height", 800)
				.append("g")

			const average = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length
			var average_engagement = []
			for (let i = 1; i < 9; i++) {
				let avg_score = []
				for (let j = 0; j < data.length; j++) {
					if (parseInt(data[j].id) == i + 1 && data[j].score != '' && data[j].score != '0') {
						avg_score.push(parseFloat(data[j].score))
					}
				}
				average_engagement.push(average(avg_score))
			}
			var average_score = []
			for (let i = 0; i < 21; i++) {
				let avg_score = []
				for (let j = 0; j < data.length; j++) {
					if (parseInt(data[j].clip) == i && data[j].score != '') {
						avg_score.push(parseFloat(data[j].score))
					}
				}
				average_score.push({
					'clip': i,
					'score': average(avg_score)
				})
			}

			//name & average_score
			let glyphg = svg.append('g')
				.attr("width", 500)
				.attr("height", 400)
			for (let i = 1; i < 9; i++) {
				glyphg.append("text")
					.attr("x", 32)
					.attr("y", yscale(i + 1) + 5)
					.attr("fill", _this.label_color)
					.attr("font-size", 12)
					.attr("class", "name letter " + (i + 1))
					.text(function () {
						return String.fromCharCode(64 + i)
					})
					.on("click", function () {
						pipeService.emitPersonid(i + 1)
						_this.id_select = i + 1
						$(".name.coach").attr("fill", _this.label_color)
						$(".circle.coach").css("stroke", _this.label_color)
						for (let t = 2; t < 10; t++) {
							if (t == i + 1) {
								$(".name.letter." + t).attr("fill", _this.highlight_color)
								$(".name.circle." + t).css("stroke", _this.highlight_color)
								$(".name.average_score." + t).css("fill", _this.highlight_color)
								$(".engagement_score." + t).css("fill", _this.highlight_color)
							} else {
								if (t == 2 || t == 3 || t == 4 || t == 7 || t == 9) {
									$(".name.average_score." + t).css("fill", _this.element_color)
									$(".engagement_score." + t).css("fill", _this.element_color)
								} else if (t == 5 || t == 6) {
									$(".name.average_score." + t).css("fill", _this.element2_color)
									$(".engagement_score." + t).css("fill", _this.element2_color)
								} else {
									$(".name.average_score." + t).css("fill", _this.element3_color)
									$(".engagement_score." + t).css("fill", _this.element3_color)
								}
								$(".name.letter." + t).attr("fill", _this.label_color)
								$(".name.circle." + t).css("stroke", _this.label_color)
							}
						}
					})

				/*				glyphg.append('circle')
									.attr('r', 6)
									.attr("cx", 54)
									.attr("cy", yscale(i + 1) + 1)
									.attr("class", "name circle " + (i + 1))
									//.style("fill", cscale(eventtype[e.clip].event_type))
									.style("fill", "none")
									.style("stroke", _this.label_color)
				*/					//.style("stroke-width", 1)

				glyphg.append("rect")
					.attr("x", 20 - average_engagement[i - 1] * 20)
					.attr("y", yscale(i + 1) - 3)
					.attr("width", average_engagement[i - 1] * 20)
					.attr("height", 8)
					.attr("class", "name average_score " + (i + 1))
					.style("fill", _this.element_color)
					.style("stroke", _this.element_color)
					.style("opacity", 0.8)
			}
			// add coach
			let glyphg_coach = svg.append('g')
				.attr("width", 100)
				.attr("height", 100)

			glyphg_coach.append("text")
				.attr("x", 8)
				.attr("y", 65)
				.attr("fill", _this.label_color)
				.attr("font-size", 12)
				.attr("class", "name coach")
				.text("Overall")
				.on("click", function () {
					pipeService.emitPersonid(1)
					$(this).attr("fill", _this.highlight_color)
					$(".circle.coach").css("stroke", _this.highlight_color)
					_this.id_select = 1
					for (let t = 2; t < 10; t++) {
						$(".name.letter." + t).attr("fill", _this.label_color)
						$(".name.circle." + t).css("stroke", _this.label_color)
						$(".name.average_score." + t).css("fill", _this.element_color)
						$(".engagement_score." + t).css("fill", _this.element_color)
					}
				})

			// glyphg_coach.append('circle')
			// 	.attr('r', 6)
			// 	.attr("cx", 36)
			// 	.attr("cy", 75)
			// 	.attr("class", "circle coach")
			// 	.style("fill", "none")
			// 	.style("stroke", _this.label_color)
			// 	.style("stroke-width", 1)

			// clip & average_score
			for (let i = 0; i < 21; i++) {
				glyphg.append("text")
					.attr("x", xscale(i) - 3)
					.attr("y", 75)
					.attr("fill", _this.label_color)
					.attr("font-size", 9)
					.text(function () {
						return (i + 1)
					})
			}

			//********************************area diagram*****************************************
			var areascale = d3.scaleLinear()
				.domain([0, 1])
				.range([10, 30])
			var area_generator = d3.area()
				.x(function (d) {
					return xscale(d.clip)
				})
				.y0(function (d) {
					return 70 - areascale(d.score)
				})
				.y1(function (d) {
					return 60
				})
				.curve(d3.curveMonotoneX)

			glyphg.append("path")
				.attr("d", area_generator(average_score))
				.style("fill", "gray")
				.style("opacity", 0.2)

			for (let i = 0; i < 21; i++) {
				glyphg.append("circle")
					.attr("cx", xscale(average_score[i]['clip']))
					.attr("cy", 60)
					.attr("r", (average_score[i]['score']) * 4)
					.attr("fill", _this.element_color)
			}

			//*************************************************************************************


			for (let i = 0; i < id.length; i++) {
				glyphg.append("line")
					.attr("x1", xscale(clip[0]))
					.attr("y1", yscale(id[i]))
					.attr("x2", xscale(clip[20]))
					.attr("y2", yscale(id[i]))
					.attr('stroke-width', 1)
					.attr('stroke', "#decfdd")
			}

			for (let i = 0; i < element.length; i++) {
				let e = element[i]
				//console.log(e)
				glyphg.append('circle')
					.attr('r', e.score * 4)
					.attr("cx", xscale(e.X))
					.attr("cy", yscale(e.Y))
					.attr("class", "engagement_score " + e.Y)
					//.style("fill", cscale(eventtype[e.clip].event_type))
					.style("fill", function () {
						if (e.Y == 2 || e.Y == 3 || e.Y == 4 || e.Y == 7 || e.Y == 9) {
							return _this.element_color
						} else if (e.Y == 5 || e.Y == 6) {
							return _this.element2_color
						} else {
							return _this.element3_color
						}
					})
					.style("stroke-width", 1)
			}
			for (let p = 2; p < 10; p++) {
				let score = []
				for (let i = 0; i < element.length; i++) {
					if (element[i]['Y'] == p) {
						score.push({
							'clip': element[i]['X'],
							'score': element[i]['score']
						})
					}
				}
				var areascale2 = d3.scaleLinear()
					.domain([0, 1])
					.range([10, 30])
				var area_generator2 = d3.area()
					.x(function (d) {
						return xscale(d.clip)
					})
					.y0(function (d) {
						return 10 - areascale2(d.score) + yscale(p)
					})
					.y1(function (d) {
						return yscale(p)
					})
					.curve(d3.curveMonotoneX)

				glyphg.append("path")
					.attr("d", area_generator2(score))
					.style("fill", "gray")
					.style("opacity", 0.2)

			}
		}
	}
}
