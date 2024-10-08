import dataService from '../../service/dataService.js'
import pipeService from '../../service/pipeService.js';
import * as d3 from 'd3'
import $ from 'jquery'

export default {
	name: 'MainView',
	components: {},
	props: {},
	computed: {},
	data() {
		return {
			label_color: "#9a8c98",
			increaseInteraction: "#e63946",
			decreaseInteraction: "#457b9d",
			constantInteraction: "grey",
			smilecolor: "#ff9f1c",
			//"#ff595e",
			//"#ff9f1c",
			nodcolor: "#06d6a0",
			//"#8ac926",
			//"#06d6a0",
			speakcolor: "#cdb4db",
			//"#1982c4",
			//"#cdb4db",
			chatcolor: "#f28482",
			boundarycolor: "#bbbbbb",
			selectcolor: '#bcb8b1',
			otherpeoplecolor: "#eacdc2",
			linecolor: "#bfc0c0",
			highlightcolor: "#fcf300",
			frequencycolor: "#eacdc2",
			frequencycolor2: "#7f4f24",//interaction的颜色
			rect_color: "#f6bd60",
			id_click: [],
			id_pointer: -1
		}
	},
	watch: {
		id_click: function() {
			// draw glyph
			//console.log(this.id_click)
			for (let i = 1; i < 10; i++) {
				if (this.id_click.includes(i)) {
					$(".click.name." + i).css("fill", this.highlightcolor)
					$(".click.circle." + i).css("stroke", this.highlightcolor)
				} else {
					$(".click.name." + i).css("fill", this.label_color)
					$(".click.circle." + i).css("stroke", this.label_color)
				}
			}
			d3.select("#main2").selectAll('*').remove()
			for (let i = 0; i < this.id_click.length; i++) {
				const svg = d3.select("#main2")
					.append("svg")
					.attr("width", 1050)
					.attr("height", 60)
					.append("g")
				this.drawOtherPeople1(this.id_pointer, this.id_click[i], svg)
			}
		}
	},
	mounted: function() {
		let _this = this
		pipeService.onPersonid(function(msg) {
			//console.log('choose the person ID', msg)
			d3.select("#main").selectAll('*').remove()
			d3.select("#main2").selectAll('*').remove()
			_this.id_click = []
			_this.drawPeopleInteraction1(parseInt(msg), 1)
			_this.id_pointer = parseInt(msg)
		})
		_this.drawLegend()
	},
	methods: {
		drawLine(points, svg, color, id) {
			const _this = this
			var line = d3.line()
				.x((d) => d.xpoint)
				.y((d) => d.ypoint)
				.curve(d3.curveMonotoneX)
			points.sort((a, b) => a.xpoint - b.xpoint)
			svg.append("path")
				.attr("d", line(points))
				.attr("fill", "none")
				.attr("stroke", color)
				.attr("stroke-width", 1.5)
				.attr("opacity", 0.3)
				.attr("class", "line " + id)
				.on("mouseover", function(){
					$(this).attr("stroke-width", 4)
					$(this).attr("stroke", _this.rect_color)
					$(".name.rect." + id).attr("stroke-width", 2)
					$(".name.rect." + id).attr("stroke", _this.rect_color)
				})
				.on("mouseout", function(){
					$(this).attr("stroke-width", 1)
					$(this).attr("stroke", _this.label_color)
					$(".name.rect." + id).attr("stroke-width", 1)
					$(".name.rect." + id).attr("stroke", _this.label_color)
				})
		},
		drawLegend() {
			const _this = this
			const svg = d3.select(".legendCanvas")
				.append("svg")
				.attr("width", 400)
				.attr("height", 30)
				.append("g")
			

			svg.append("rect")
				.attr("x", 10)
				.attr("y", 3)
				.attr("width", 10)
				.attr("height", 10)
				.style("stroke", _this.selectcolor)
				.style("fill", "none")

			svg.append("text")
				.attr("x", 22)
				.attr("y", 11)
				.attr("fill", _this.selectcolor)
				.attr("font-size", 11)
				.text("Lectorial (LT)")

			svg.append("rect")
				.attr("x", 96)
				.attr("y", 3)
				.attr("width", 10)
				.attr("height", 10)
				.style("stroke", _this.selectcolor)
				.style("fill", "none")

			svg.append("text")
				.attr("x", 108)
				.attr("y", 11)
				.attr("fill", _this.selectcolor)
				.attr("font-size", 11)
				.text("Question Asking (QA)")

			svg.append("rect")
				.attr("x", 227)
				.attr("y", 3)
				.attr("width", 10)
				.attr("height", 10)
				.style("stroke", _this.selectcolor)
				.style("fill", "none")

			svg.append("text")
				.attr("x", 239)
				.attr("y", 11)
				.attr("fill", _this.selectcolor)
				.attr("font-size", 11)
				.text("Group Discussion (GD)")

			// svg.append("rect")
			// 	.attr("x", 124)
			// 	.attr("y", 5)
			// 	.attr("width", 8)
			// 	.attr("height", 8)
			// 	.style("fill", _this.increaseInteraction)

			// svg.append("text")
			// 	.attr("x", 135)
			// 	.attr("y", 12)
			// 	.attr("fill", _this.label_color)
			// 	.attr("font-size", 10)
			// 	.text("increase")

			// svg.append("rect")
			// 	.attr("x", 180)
			// 	.attr("y", 5)
			// 	.attr("width", 8)
			// 	.attr("height", 8)
			// 	.style("fill", _this.decreaseInteraction)

			// svg.append("text")
			// 	.attr("x", 190)
			// 	.attr("y", 12)
			// 	.attr("fill", _this.label_color)
			// 	.attr("font-size", 10)
			// 	.text("decrease")
		},
		drawOtherPeople1(person_select, another_person, svg) {
			const _this = this
			const data = require('../../assets/mainview_data.json')
			const eventdata = require('../../assets/video3_event-updated.json')
			//console.log(data)
			const clip_num = 21
			const matrix = {
				// smile, nod, speak
				1: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				2: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				3: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				4: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				5: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				6: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				7: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				8: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				9: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				]
			}

			// obtain the type of each session
			var event_type = []
			for (let i = 0; i < 21; i++) {
				event_type.push(eventdata[i].event_type)
			}
			var data2 = []
			var data3 = []
			// data set constructed <x: clip, y: id, value:[smile, nod, speak]> - determing person_select

			// person out
			for (let i = 0; i < 21; i++) { //each clip
				for (let j = 1; j < 10; j++) { // each accepter
					for (let k = 1; k < 10; k++) { // each speaker
						//console.log(i, j, k, data[i][j][k]) 
						matrix[j][k - 1][0] += data[i][j][k].smile.length
						matrix[j][k - 1][1] += data[i][j][k].nod.length
						matrix[j][k - 1][2] += data[i][j][k].speak.length
						if (k == person_select && j ==
							another_person) { // if the speaker is person_select, build the data set
							data2.push({
								'clip': i,
								'id': j,
								'smile': data[i][j][k].smile.length,
								'nod': data[i][j][k].nod.length,
								'speak': data[i][j][k].speak.length
							})
							// judge whether has this clip
							let judge = 0
							let position = 0
							for (let p = 0; p < data3.length; p++) {
								if (data3[p].clip == i) {
									position = p
									judge = 1
									break
								}
							}
							if (judge == 1) {
								//console.log(data[i][j][k].smile.length, data[i][j][k].nod.length, data[i][j][k].speak.length)
								data3[position].smile = data3[position].smile + data[i][j][k].smile.length
								data3[position].nod = data3[position].nod + data[i][j][k].nod.length
								data3[position].speak = data3[position].speak + data[i][j][k].speak.length
							} else {
								data3.push({
									'clip': i,
									'smile': data[i][j][k].smile.length,
									'nod': data[i][j][k].nod.length,
									'speak': data[i][j][k].speak.length
								})
							}
						}
					}
				}
			}

			// person in
			for (let i = 0; i < 21; i++) { //each clip
				for (let j = 1; j < 10; j++) { // each speaker
					for (let k = 1; k < 10; k++) { // each accepter
						//console.log(i, j, k, data[i][k][j]) 
						matrix[k][j - 1][0] += data[i][k][j].smile.length
						matrix[k][j - 1][1] += data[i][k][j].nod.length
						matrix[k][j - 1][2] += data[i][k][j].speak.length
						if (j == person_select && k ==
							another_person) { // if the speaker is person_select, build the data set
							for (let q = 0; q < data2.length; q++) {
								if (data2[q].clip == i && data2[q].id == k) {
									data2[q].smile += data[i][k][j].smile.length
									data2[q].nod += data[i][k][j].nod.length
									data2[q].speak += data[i][k][j].speak.length
									let position = 0
									for (let p = 0; p < data3.length; p++) {
										if (data3[p].clip == i) {
											position = p
											break
										}
									}
									data3[position].smile = data3[position].smile + data[i][j][k].smile.length
									data3[position].nod = data3[position].nod + data[i][j][k].nod.length
									data3[position].speak = data3[position].speak + data[i][j][k].speak.length
								}
							}
						}
					}
				}
			}
			//console.log("interactionview-data2:", data2)
			//console.log("interactionview-subview-data3:", data3)
			//console.log(matrix)
			const xscale = d3.scaleBand()
				.range([30, 1050])
				.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])

			var summary_frequency = []
			for (let i = 1; i < 10; i++) {
				summary_frequency.push({
					'id': i,
					'frequency': matrix[i][person_select - 1][0] + matrix[i][person_select - 1][1] + matrix[i][
						person_select - 1
					][2]
				})
			}
			summary_frequency.sort(function(a, b) {
				return (b.frequency - a.frequency)
			})
			const person_order = []
			for (let i = 0; i < 9; i++) {
				if (summary_frequency[i].id != person_select) {
					person_order.push(summary_frequency[i].id)
				}
			}
			//console.log(person_order)

			const hscale = d3.scaleLinear()
				.range([1, 30])
				.domain([1, 20])
			const times = 3
			const distance = 7
			const firstperson_y = 50
			//console.log(matrix[i])
			const glyphg = svg.append('g')
				.attr("width", 1050)
				.attr("height", 30)

			//draw the line between the bounding box
			const data_line = []
			for (let j = 0; j < data3.length - 1; j++) {
				let frequency_later = data3[j + 1].smile + data3[j + 1].nod + data3[j + 1].speak
				let frequency_now = data3[j].smile + data3[j].nod + data3[j].speak
				let difference = frequency_later - frequency_now
				data_line.push({
					'order': j,
					'difference': difference
				})
			}
			const differencescale = d3.scaleLinear()
				.range([2, 10])
				.domain([0, 20])

			for (let j = 0; j < data_line.length; j++) {
				glyphg.append("line")
					.attr("x1", xscale(j) + 19)
					.attr("y1", 35)
					.attr("x2", xscale(j) + 38)
					.attr("y2", 35)
					.attr('stroke-width', 1)
					.attr('stroke', _this.constantInteraction)
			}
			// write the center name
			glyphg.append("text")
				.attr("x", 3)
				.attr("y", 37)
				.attr("fill", _this.label_color)
				.attr("font-size", 12)
				.text(function() {
					if (another_person == 1) {
						return 'T'
					} else {
						return String.fromCharCode(63 + another_person)
					}
				})

			glyphg.append('circle')
				.attr('r', 6)
				.attr("cx", 7)
				.attr("cy", 33)
				.style("fill", "none")
				.style("stroke", _this.label_color)
				.style("stroke-width", 1)

			//content in the bounding box (smile, nod, speak)
			for (let j = 0; j < data3.length; j++) {
				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) - distance - 5)
					.attr("y", firstperson_y - 35)
					.attr("width", 3 * distance + 10)
					.attr("height", 35)
					.style("fill", "white")
					.style("stroke", _this.boundarycolor)
				//.attr("class", "person_interaction boundingbox " + j)

				// draw the summary of frequency
				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) - distance - 5)
					.attr("y", 15)
					.attr("width", 3 * distance + 10)
					.attr("height", 3)
					.style("fill", "none")
					.style("stroke", _this.boundarycolor)

				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) - distance - 5)
					.attr("y", 15)
					.attr("width", (data3[j].smile + data3[j].nod + data3[j].speak) * 0.8)
					.attr("height", 3)
					.style("fill", _this.frequencycolor)
					.style("stroke", _this.boundarycolor)

				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip))
					.attr("y", function() {
						if (data3[j].smile == 0) {
							return 0
						} else {
							return firstperson_y - hscale(data3[j].smile)
						}
					})
					.attr("width", distance)
					.attr("height", function() {
						if (data3[j].smile == 0) {
							return 0
						} else {
							return hscale(data3[j].smile)
						}
					})
					.style("fill", _this.smilecolor)

				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) - distance)
					.attr("y", function() {
						if (data3[j].nod == 0) {
							return 0
						} else {
							return firstperson_y - hscale(data3[j].nod)
						}
					})
					.attr("width", distance)
					.attr("height", function() {
						if (data3[j].nod == 0) {
							return 0
						} else {
							return hscale(data3[j].nod)
						}
					})
					.style("fill", _this.nodcolor)

				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) + distance)
					.attr("y", function() {
						if (data3[j].speak == 0) {
							return 0
						} else {
							return firstperson_y - hscale(data3[j].speak)
						}
					})
					.attr("width", distance)
					.attr("height", function() {
						if (data3[j].speak == 0) {
							return 0
						} else {
							return hscale(data3[j].speak)
						}
					})
					.style("fill", _this.speakcolor)
			}
		},
		drawPeopleInteraction1(person_select, layout_condition) {
			const _this = this
			const data = require('../../assets/mainview_data.json')
			const eventdata = require('../../assets/video3_event-updated.json')
			//console.log("mainview-data:", data)
			const clip_num = 21
			const matrix = {
				// smile, nod, speak
				1: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				2: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				3: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				4: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				5: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				6: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				7: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				8: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				],
				9: [
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				]
			}

			// obtain the type of each session
			var event_type = []
			for (let i = 0; i < 21; i++) {
				event_type.push(eventdata[i].event_type)
			}
			var data2 = []
			var data3 = []
			// data set constructed <x: clip, y: id, value:[smile, nod, speak]> - determing person_select
			// console.log('*Test: data', data)
			// person out
			for (let i = 0; i < 21; i++) { //each clip
				for (let j = 1; j < 10; j++) { // each accepter
					for (let k = 1; k < 10; k++) { // each speaker
						//console.log(i, j, k, data[i][j][k]) 
						matrix[j][k - 1][0] += data[i][j][k].smile.length
						matrix[j][k - 1][1] += data[i][j][k].nod.length
						matrix[j][k - 1][2] += data[i][j][k].speak.length
						if (k == person_select && j !=
							person_select) { // if the speaker is person_select, build the data set
							data2.push({
								'clip': i,
								'id': j,
								'smile': data[i][j][k].smile.length,
								'nod': data[i][j][k].nod.length,
								'speak': data[i][j][k].speak.length
							})
							// judge whether has this clip
							let judge = 0
							let position = 0
							for (let p = 0; p < data3.length; p++) {
								if (data3[p].clip == i) {
									position = p
									judge = 1
									break
								}
							}
							if (judge == 1) {
								//console.log(data[i][j][k].smile.length, data[i][j][k].nod.length, data[i][j][k].speak.length)
								data3[position].smile = data3[position].smile + data[i][j][k].smile.length
								data3[position].nod = data3[position].nod + data[i][j][k].nod.length
								data3[position].speak = data3[position].speak + data[i][j][k].speak.length
							} else {
								data3.push({
									'clip': i,
									'smile': data[i][j][k].smile.length,
									'nod': data[i][j][k].nod.length,
									'speak': data[i][j][k].speak.length
								})
							}
						}
					}
				}
			}

			// person in
			for (let i = 0; i < 21; i++) { //each clip
				for (let j = 1; j < 10; j++) { // each speaker
					for (let k = 1; k < 10; k++) { // each accepter
						//console.log(i, j, k, data[i][k][j]) 
						matrix[k][j - 1][0] += data[i][k][j].smile.length
						matrix[k][j - 1][1] += data[i][k][j].nod.length
						matrix[k][j - 1][2] += data[i][k][j].speak.length
						if (j == person_select && k !=
							person_select) { // if the speaker is person_select, build the data set
							for (let q = 0; q < data2.length; q++) {
								if (data2[q].clip == i && data2[q].id == k) {
									data2[q].smile += data[i][j][k].smile.length
									data2[q].nod += data[i][j][k].nod.length
									data2[q].speak += data[i][j][k].speak.length
									let position = 0
									for (let p = 0; p < data3.length; p++) {
										if (data3[p].clip == i) {
											position = p
											break
										}
									}
									data3[position].smile = data3[position].smile + data[i][j][k].smile.length
									data3[position].nod = data3[position].nod + data[i][j][k].nod.length
									data3[position].speak = data3[position].speak + data[i][j][k].speak.length
								}
							}
						}
					}
				}
			}
			console.log('* Test - data3', data3)
			//console.log("interactionview-data2:", data2)
			//console.log("interactionview-data3:", data3)
			//console.log(matrix)
			const xscale = d3.scaleBand()
				.range([30, 1050])
				.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])

			var summary_frequency = []
			for (let i = 1; i < 10; i++) {
				summary_frequency.push({
					'id': i,
					'frequency': matrix[i][person_select - 1][0] + matrix[i][person_select - 1][1] + matrix[i][
						person_select - 1
					][2]
				})
			}
			summary_frequency.sort(function(a, b) {
				return (b.frequency - a.frequency)
			})

			const person_order = []
			for (let i = 0; i < 9; i++) {
				if (summary_frequency[i].id != person_select) {
					person_order.push(summary_frequency[i].id)
				}
			}
			//console.log(person_order)
			const yscale = d3.scaleBand()
				.range([50, 350])
				.domain(person_order)

			const hscale = d3.scaleLinear()
				.range([1, 30])
				.domain([1, 20])
			// draw glyph
			const svg = d3.select("#main")
				.append("svg")
				.attr("width", 1050)
				.attr("height", 400)
				.append("g")
			// console.log(frequency_data)
			//********************************area diagram*****************************************
			// const yscale2 = d3.scaleLinear()
			// 	.domain([1, 8])
			// 	.range([20, 0])

			// const area_generator1 = d3.area()
			// 	.x(function(d) {
			// 		return xscale(d.clip)
			// 	})
			// 	.y0(function(d) {
			// 		//console.log(yscale(d.id))
			// 		return yscale(d.id)
			// 	})
			// 	.y1(function(d) {
			// 		return yscale(d.id) + yscale2(d.frequency) - 24
			// 	})
			// 	.curve(d3.curveMonotoneX)

			// //console.log(data2)
			// const flowcolor = ["#e5e5e5", "steelblue"]
			// for (let k = 1; k < 10; k++) {
			// 	if (k == person_select){
			// 		continue
			// 	}
			// 	let k_data = []
			// 	for (let p = 0; p < data2.length; p++) {
			// 		if (data2[p].id == k) {
			// 			k_data.push({
			// 				'clip': data2[p].clip,
			// 				'id': k,
			// 				'frequency': data2[p].smile + data2[p].nod + data2[p].speak
			// 			})
			// 		}
			// 	}
			// 	//console.log(k_data)
			// 	svg.append("path")
			// 		.attr("d", area_generator1(k_data))
			// 		.style("fill", flowcolor[0])
			// }


			// //********************************area diagram*****************************************
			const times = 3
			const distance = 7
			const firstperson_y = 50
			//console.log(matrix[i])
			const glyphg = svg.append('g')
				.attr("width", 1050)
				.attr("height", 350)

			const glyphg2 = svg.append('g')
				.attr("width", 1050)
				.attr("height", 350)

			//draw the line between the bounding box
			const data_line = []
			for (let j = 0; j < data3.length - 1; j++) {
				let frequency_later = data3[j + 1].smile + data3[j + 1].nod + data3[j + 1].speak
				let frequency_now = data3[j].smile + data3[j].nod + data3[j].speak
				let difference = frequency_later - frequency_now
				data_line.push({
					'order': j,
					'difference': difference
				})
			}
			const differencescale = d3.scaleLinear()
				.range([2, 10])
				.domain([0, 20])

			for (let j = 0; j < data_line.length; j++) {
				glyphg.append("line")
					.attr("x1", xscale(j) + 19)
					.attr("y1", 35)
					.attr("x2", xscale(j) + 50)
					.attr("y2", 35)
					// .attr('stroke-width', function() {
					// 	if (data_line[j].difference > 0) {
					// 		return differencescale(data_line[j].difference)
					// 	} else if (data_line[j].difference < 0) {
					// 		return differencescale(-data_line[j].difference)
					// 	} else {
					// 		return 1
					// 	}
					// })
					.attr('stroke-width', 1)
					.attr('stroke', _this.constantInteraction)
					// .attr('stroke', function() {
					// 	if (data_line[j].difference > 0) {
					// 		return _this.increaseInteraction
					// 	} else if (data_line[j].difference < 0) {
					// 		return _this.decreaseInteraction
					// 	} else {
					// 		return _this.constantInteraction
					// 	}
					// })
			}
			var defs = svg.append("defs")

			var arrowMarker = defs.append("marker")
				.attr("id", "arrow")
				.attr("markerUnits", "strokeWidth")
				.attr("markerWidth", "8")
				.attr("markerHeight", "8")
				.attr("viewBox", "0 0 12 12")
				.attr("refX", "13")
				.attr("refY", "6")
				.attr("orient", "auto")

			var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

			arrowMarker.append("path")
				.attr("d", arrow_path)
				.attr("fill", _this.label_color)

			const interaction_distance = 40
			const interaction_distance1 = 33
			const interaction_distance2 = 10
			const lenscale = d3.scaleLinear()
				.range([0, 3])
				.domain([0, 10])
			const angle_d = 0.1

			//content in the bounding box (smile, nod, speak)
			for (let j = 0; j < data3.length; j++) {
				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) - distance - 5)
					.attr("y", firstperson_y - 35)
					.attr("width", 3 * distance + 10)
					.attr("height", 35)
					.style("fill", "white")
					.style("stroke", _this.boundarycolor)
					.attr("class", "person_interaction boundingbox " + j)
					
				// draw the summary of behaviors
				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) - distance - 5)
					.attr("y", firstperson_y)
					.attr("width", function(){
						if ((data3[j].nod + data3[j].smile + data3[j].speak) * 1.5 > 3 * distance + 10) {
							return 3 * distance + 10
						} else {
							return (data3[j].nod + data3[j].smile + data3[j].speak) * 1.5
						}
					})
					.attr("height", 3)
					.style("fill",  _this.frequencycolor2)

				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) - distance - 5)
					.attr("y", firstperson_y)
					.attr("width", 3 * distance + 10)
					.attr("height", 3)
					.style("fill", "none")
					.style("stroke", _this.boundarycolor)
				
				//	console.log(data3[j].nod + data3[j].smile + data3[j].speak)
				// draw the summary of frequency
				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) - distance - 5)
					.attr("y", 15)
					.attr("width", 3 * distance + 10)
					.attr("height", 3)
					.style("fill", "none")
					.style("stroke", _this.boundarycolor)

				const engagement_data = require('../../assets/userpanel_data.json')
				
				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) - distance - 5)
					.attr("y", 15)
					.attr("width", function() {
						console.log(engagement_data)
						if (parseInt(person_select) == 1){
							let average = 0
							for (let q = 0; q < engagement_data.length; q++) {
								if (engagement_data[q].id != parseInt(person_select) && parseInt(engagement_data[q].clip) == parseInt(data3[j].clip)) { 
									if (!Number.isNaN(engagement_data[q].score)) {
										average += parseFloat(engagement_data[q].score)
									}
								}
							}
							return 20 * (average/8)
						} else {
							for (let p = 0; p < engagement_data.length; p++) {
								if (parseInt(engagement_data[p].clip) == parseInt(data3[j].clip) && parseInt(
										engagement_data[p].id) == parseInt(person_select)) {
									return 20 * parseFloat(engagement_data[p].score)
								}
							}
						}
					})
					.attr("height", 3)
					.style("fill", _this.frequencycolor)
					.style("stroke", _this.boundarycolor)

				//.attr("class", "person_interaction boundingbox " + j)

				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip))
					.attr("y", function() {
						if (data3[j].smile == 0) {
							return 0
						} else {
							return firstperson_y - hscale(data3[j].smile)
						}
					})
					.attr("width", distance)
					.attr("height", function() {
						if (data3[j].smile == 0) {
							return 0
						} else {
							return hscale(data3[j].smile)
						}
					})
					.style("fill", _this.smilecolor)
					.attr("class", "person_interaction smile " + j)

				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) - distance)
					.attr("y", function() {
						if (data3[j].nod == 0) {
							return 0
						} else {
							return firstperson_y - hscale(data3[j].nod)
						}
					})
					.attr("width", distance)
					.attr("height", function() {
						if (data3[j].nod == 0) {
							return 0
						} else {
							return hscale(data3[j].nod)
						}
					})
					.style("fill", _this.nodcolor)
					.attr("class", "person_interaction nod " + j)

				glyphg.append("rect")
					.attr("x", xscale(data3[j].clip) + distance)
					.attr("y", function() {
						if (data3[j].speak == 0) {
							return 0
						} else {
							return firstperson_y - hscale(data3[j].speak)
						}
					})
					.attr("width", distance)
					.attr("height", function() {
						if (data3[j].speak == 0) {
							return 0
						} else {
							return hscale(data3[j].speak)
						}
					})
					.style("fill", _this.speakcolor)
					.attr("class", "person_interaction speak " + j)
			}
			//when click the clip
			$(".person_interaction").click(function() {
				let msg = parseInt($(this).attr("class").split(' ')[2])
				pipeService.emitSessionid(msg)
				for (let t = 0; t < 21; t++) {
					if (t == msg) {
						$(".person_interaction.boundingbox." + t).css("stroke", _this.highlightcolor)
						$(".person_interaction.boundingbox." + t).css("stroke-width", 2)
						pipeService.emitInteraction([data, data3, t, _this.id_pointer])
					} else {
						$(".person_interaction.boundingbox." + t).css("stroke", _this.boundarycolor)
						$(".person_interaction.boundingbox." + t).css("stroke-width", 1)
					}

				}

			})

			//draw line of the same person
			const linescale = d3.scaleBand()
				.range([70, 200])
				.domain([0, 1, 2, 3, 4, 5, 6, 7])

			const frequencyscale = d3.scaleLinear()
				.range([180, 80])
				.domain([0, 20])

			var person_in_clip_order = []
			for (let i = 0; i < 21; i++) {

				let order_temp = []
				let k_data = []
				for (let j = 0; j < data2.length; j++) {
					if (parseInt(data2[j].clip) == i) {
						k_data.push({
							'clip': i,
							'id': data2[j].id,
							'frequency': data2[j].smile + data2[j].nod + data2[j].speak
						})
					}
				}
				k_data.sort(function(a, b) {
					return (b.frequency - a.frequency)
				})

				for (let j = 0; j < k_data.length; j++) {
					order_temp.push({
						'id': k_data[j].id,
						'frequency': k_data[j].frequency
					})
				}
				person_in_clip_order.push(order_temp)
			}
			//console.log(person_in_clip_order)
			for (let j = 0; j < 9; j++) {
				if (j == person_select - 1) {
					continue
				}
				let points = []
				for (let i = 0; i < person_in_clip_order.length; i++) {
					//console.log(person_in_clip_order[i])
					for (let k = 0; k < person_in_clip_order[i].length; k++) {
						if (person_in_clip_order[i][k].id == j + 1) {
							points.push({
								'xpoint': xscale(i) + 6,
								'ypoint': 200 - person_in_clip_order[i][k].frequency * 10
							})
							break
						}
					}
				}
				//console.log(points)
				this.drawLine(points, glyphg, _this.linecolor, j + 1)
			}

			//draw other people under each clip
			const opacityscale = d3.scaleLinear()
				.range([0.2, 1])
				.domain([0, 20])

			const circlescale = d3.scaleLinear()
				.range([3, 10])
				.domain([0, 20])
			// write the center name
			glyphg.append("text")
				.attr("x", 3)
				.attr("y", 37)
				.attr("fill", _this.label_color)
				.attr("font-size", 12)
				.text(function() {
					if (person_select == 1) {
						return 'T'
					} else {
						return String.fromCharCode(63 + person_select)
					}
				})
				.on("mouseover", function() {
					glyphg2.append("rect")
						.attr("x", 10)
						.attr("y", firstperson_y + 20)
						.attr("width", 100)
						.attr("height", 100)
						.attr("fill", "white")
						.attr("stroke", _this.label_color)
						.attr("id", "interaction_center")
					var countt = 1
					for (let t = 1; t < 10; t++) {
						if (t == person_select) {
							//console.log("1firstperson:", (2 * firstperson_y + 150) / 2)
							glyphg2.append("text")
								.attr("x", 51)
								.attr("y", (2 * firstperson_y + 150) / 2)
								.attr("fill", _this.label_color)
								.attr("id", "interaction_center" + t)
								.text(function() {
									if (person_select == 1) {
										return 'T'
									} else {
										return String.fromCharCode(63 + person_select)
									}
								})
						} else {
							countt = countt + 1
							let alpha = countt * (Math.PI) / 4
							let alpha1 = countt * (Math.PI) / 4 - angle_d
							let alpha2 = countt * (Math.PI) / 4 + angle_d
							let x_d = Math.sin(alpha) * interaction_distance
							let y_d = Math.cos(alpha) * interaction_distance
							let x1_d = Math.sin(alpha1) * interaction_distance1
							let x2_d = Math.sin(alpha2) * interaction_distance1
							let y1_d = Math.cos(alpha1) * interaction_distance1
							let y2_d = Math.cos(alpha2) * interaction_distance1
							let xc1_d = Math.sin(alpha1) * interaction_distance2
							let xc2_d = Math.sin(alpha2) * interaction_distance2
							let yc1_d = Math.cos(alpha1) * interaction_distance2
							let yc2_d = Math.cos(alpha2) * interaction_distance2
							glyphg2.append("text")
								.attr("x", x_d + 53)
								.attr("y", (2 * firstperson_y + 150) / 2 + y_d)
								.attr("font-size", 12)
								.attr("fill", _this.label_color)
								.attr("id", "interaction_center" + t)
								.text(function() {
									if (t == 1) {
										return 'T'
									} else {
										return String.fromCharCode(63 + t)
									}
								})
							// draw interaction line in
							let len2scale = d3.scaleLinear()
								.range([0, 3])
								.domain([0, 10])

							glyphg2.append("line")
								.attr("x1", x1_d + 56)
								.attr("y1", (2 * firstperson_y + 140) / 2 + y1_d)
								.attr("x2", xc1_d + 56)
								.attr("y2", (2 * firstperson_y + 140) / 2 + yc1_d)
								.attr('stroke-width', function() {
									let temp_length = 0
									for (let p = 0; p < 21; p++) {
										temp_length += data[p][t][person_select].nod.length +
											data[p][t][person_select].smile.length + data[p][t][person_select]
											.speak.length
									}
									if (len2scale(temp_length) > 2) {
										return 2
									} else {
										return len2scale(temp_length)
									}
								})
								.attr('stroke', _this.label_color)
								.attr("marker-end", "url(#arrow)")
								.attr("id", "interaction_in" + t)

							// draw interaction line out
							glyphg2.append("line")
								.attr("x1", xc2_d + 56)
								.attr("y1", (2 * firstperson_y + 140) / 2 + yc2_d)
								.attr("x2", x2_d + 56)
								.attr("y2", (2 * firstperson_y + 140) / 2 + y2_d)
								.attr('stroke-width', function() {
									let temp_length = 0
									for (let p = 0; p < 21; p++) {
										temp_length += data[p][person_select][t].nod.length +
											data[p][person_select][t].smile.length + data[p][person_select][t]
											.speak.length
									}
									if (len2scale(temp_length) > 2) {
										return 2
									} else {
										return len2scale(temp_length)
									}
								})
								.attr('stroke', _this.label_color)
								.attr("marker-end", "url(#arrow)")
								.attr("id", "interaction_out" + t)
						}
					}
				})
				.on("mouseout", function() {
					$("#interaction_center").remove()
					for (let t = 1; t < 10; t++) {
						$("#interaction_center" + t).remove()
						$("#interaction_in" + t).remove()
						$("#interaction_out" + t).remove()
					}
				})

			glyphg.append('circle')
				.attr('r', 6)
				.attr("cx", 7)
				.attr("cy", 33)
				.style("fill", "none")
				.style("stroke", _this.label_color)
				.style("stroke-width", 1)
		
			let k_data = []
			let order_temp = []			
			for (let j = 0; j < data2.length; j++) {
				let judge_t = 0
				let temp_f = data2[j].smile + data2[j].nod + data2[j].speak
				for (let p = 0; p < k_data.length; p++) {
					if (k_data[p].id == data2[j].id) {
						k_data[p].frequency = k_data[p].frequency + temp_f
						judge_t = 1
						break
					}
				}
				if (judge_t != 1) {
					k_data.push({
						'id': data2[j].id,
						'frequency': temp_f
					})
				}
			}

				// for (let j = 0; j < k_data.length; j++) {
				// 	// glyphg.append('circle')
				// 	// 	.attr('r', circlescale(k_data[j].frequency))
				// 	// 	.attr("cx",xscale(i))
				// 	// 	.attr("cy", tempscale(k_data[j].id))
				// 	// 	.style("fill", _this.boundarycolor)
				// 	// 	.style("stroke-width", 1)
				// 	// 	.style("opacity", 0.5)
				// 	if (layout_condition == 1) {
				// 		glyphg2.append('rect')
				// 			.attr("x", xscale(i))
				// 			.attr("y", tempscale(k_data[j].id))
				// 			//.attr("y", frequencyscale(k_data[j].frequency))
				// 			.attr("width", 15)
				// 			.attr("height", 8)
				// 			.attr("class", "interaction_person" + k_data[j].id + i)
				// 			.style("fill", _this.otherpeoplecolor)
				// 			.style("opacity", opacityscale(k_data[j].frequency))
				// 			.style("stroke", _this.boundarycolor)
				// 			.on("mouseover", function() {
				// 				$(".line." + k_data[j].id).attr("stroke-width", 5)
				// 				$(".name_display." + i + k_data[j].id).css("opacity", 1)
				// 			})
				// 			.on("mouseout", function() {
				// 				$(".line." + k_data[j].id).attr("stroke-width", 1)
				// 				$(".name_display." + i + k_data[j].id).css("opacity", 0)
				// 			})

				// 		glyphg2.append('text')
				// 			.attr("x", xscale(i) + 10)
				// 			.attr("y", tempscale(k_data[j].id))
				// 			.attr("fill", _this.label_color)
				// 			.attr("font-size", 9)
				// 			.text(function() {
				// 				if (k_data[j].id == 1) {
				// 					return 'T'
				// 				} else {
				// 					return String.fromCharCode(63 + k_data[j].id)
				// 				}
				// 			})
				// 			.attr("class", "name_display " + i + k_data[j].id)
				// 			.style("opacity", 0)
				// 	} else {
				// 		glyphg2.append('rect')
				// 			.attr("x", xscale(i))
				// 			.attr("y", frequencyscale(k_data[j].frequency))
				// 			.attr("width", 15)
				// 			.attr("height", 8)
				// 			.attr("class", "interaction_person" + k_data[j].id + i)
				// 			.style("fill", _this.otherpeoplecolor)
				// 			.style("stroke", _this.boundarycolor)
				// 			.on("mouseover", function() {
				// 				$(".line." + k_data[j].id).attr("stroke-width", 5)
				// 				$(".name_display." + i + k_data[j].id).css("opacity", 1)
				// 			})
				// 			.on("mouseout", function() {
				// 				$(".line." + k_data[j].id).attr("stroke-width", 1)
				// 				$(".name_display." + i + k_data[j].id).css("opacity", 0)
				// 			})
				// 	}

				// }
			
			k_data.sort(function(a, b) {
				return (b.frequency - a.frequency)
			})
			for (let j = 0; j < k_data.length; j++) {
				order_temp.push(k_data[j].id)
			}
			//console.log(k_data)
			
			// write the name
			let tempscale = d3.scaleBand()
				.range([70, 200])
				.domain(order_temp)
			
			for (let t = 0; t < order_temp.length; t++) {
				glyphg.append("text")
					.attr("x", 10)
					.attr("y", tempscale(order_temp[t]) + 7)
					.attr("fill", _this.label_color)
					.attr("font-size", 12)
					.text(function() {
						if (order_temp[t] == 1) {
							return 'T'
						} else {
							return String.fromCharCode(63 + order_temp[t])
						}
					})
					.attr("class", "click name " + order_temp[t])
				
				glyphg.append("rect")
					.attr("x", 8)
					.attr("y", tempscale(order_temp[t]) - 3)
					.attr("width", 12)
					.attr("height", 12)
					.attr("fill", "white")
					.attr("opacity", 0.3)
					.attr("stroke",  _this.label_color)
					.attr("stroke-width", 1)
					.attr("class", "name rect " +  k_data[t].id)
					.on("mouseover", function(){
						$(this).attr("stroke-width", 2)
						$(".line." + k_data[t].id).attr("stroke-width", 4)
						$(".line." + k_data[t].id).attr("stroke", _this.rect_color)
						$(this).attr("stroke", _this.rect_color)
						if ( k_data[t].id !=  k_data[0].id) {
							$('.name.rect.' + k_data[0].id).attr("stroke-width", 1)
							$('.name.rect.' + k_data[0].id).attr("stroke", _this.label_color)
							$(".line." + k_data[0].id).attr("stroke-width", 1)
							$(".line." + k_data[0].id).attr("stroke", _this.label_color)
						}
					})
					.on("mouseout", function(){
						if ( k_data[t].id !=  k_data[0].id) {
							$(this).attr("stroke-width", 1)
							$(".line." + k_data[t].id).attr("stroke-width", 1)
							$(".line." + k_data[t].id).attr("stroke", _this.label_color)
							$(this).attr("stroke", _this.label_color)
						}
						$('.name.rect.' + k_data[0].id).attr("stroke-width", 2)
						$('.name.rect.' + k_data[0].id).attr("stroke", _this.rect_color)
						$(".line." + k_data[0].id).attr("stroke-width", 4)
						$(".line." + k_data[0].id).attr("stroke", _this.rect_color)
					})
					.on("click", function() {
						if (_this.id_click.includes(order_temp[t])) {
							Array.prototype.indexOf = function(val) {
								for (var i = 0; i < this.length; i++) {
									if (this[i] == val) return i;
								}
								return -1;
							}
							Array.prototype.remove = function(val) {
								var index = this.indexOf(val);
								if (index > -1) {
									this.splice(index, 1);
								}
							}
							_this.id_click.remove(order_temp[t])
							//console.log("_id_click:", _this.id_click)
						} else {
							_this.id_click.push(order_temp[t])
							//console.log("_id_click:", _this.id_click)
						}
					})
			}
			// default highlight
			$('.name.rect.' + k_data[0].id).attr("stroke-width", 2)
			$('.name.rect.' + k_data[0].id).attr("stroke", _this.rect_color)
			$(".line." + k_data[0].id).attr("stroke-width", 4)
			$(".line." + k_data[0].id).attr("stroke", _this.rect_color)
			
			// write the clip number
			for (let i = 0; i < 21; i++) {
				let glyphg_temp = svg.append('g')
					.attr("width", 1050)
					.attr("height", 50)
				glyphg_temp.append("text")
					.attr("x", xscale(i) - 2)
					.attr("y", 10)
					.attr("fill", _this.label_color)
					.attr("font-size", 9)
					.text(function() {
						return 's' + (i + 1)
					})
				
				glyphg_temp.append("text")
					.attr("x", xscale(i) - 4)
					.attr("y", 65)
					.attr("fill", _this.label_color)
					.attr("font-size", 11)
					.text(function() {
						if(event_type[i] == 'question asking'){
							return 'QA'
						} else if (event_type[i] == 'group work') {
							return 'GD'
						} else {
							return 'LT'
						}
					})

				glyphg_temp.append("text")
					.attr("x", xscale(i) - 2)
					.attr("y", 60)
					.attr("fill", _this.label_color)
					.attr("font-size", 10)
					.text(event_type[i])
					.attr("class", "session " + i)
					.style("opacity", 0)

				// add session type

				// if (event_type[i] == "question asking") {
				// 	glyphg_temp.append('rect')
				// 		.attr("x", xscale(i) - 8)
				// 		.attr("y", 13)
				// 		.attr("width", 5)
				// 		.attr("height", 5)
				// 		.style("fill", _this.sessioncolor)

				// } else if (event_type[i] == "lectorial") {
				// 	glyphg_temp.append('circle')
				// 		.attr("cx", xscale(i) - 6)
				// 		.attr("cy", 16)
				// 		.attr("r", 3)
				// 		.style("fill", _this.sessioncolor)
				// } else {
				// 	console.log("wait")
				// }

			}
		}
	}
}
