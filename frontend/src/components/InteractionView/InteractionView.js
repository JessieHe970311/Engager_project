import dataService from '../../service/dataService.js'
import pipeService from '../../service/pipeService.js';
import * as d3 from 'd3'
import $ from 'jquery'

export default {
	name: 'InteractionView',
	components: {},
	props: {},
	computed: {},
	data() {
		return {
			label_color: "#9a8c98"
		}
	},
	watch: {

	},
	mounted: function () {
		const _this = this
		const interaction_data = require('../../assets/mainview_data.json')
		const engagement_data = require('../../assets/userpanel_data.json')
		console.log('Test_InteractionView_interaction_data', interaction_data)
		console.log('Test_InteractionView_engagement_data', engagement_data)
		pipeService.onInteraction(function (msg) {
			_this.drawEachSession(msg[0], msg[1], msg[2], msg[3])
		})
	},
	methods: {
		drawEachSession(data, data3, j, person_select) {
			const _this = this
			const distance = 7
			const interaction_distance = 110
			const interaction_distance1 = 80
			const interaction_distance2 = 30
			const angle_d = 0.1
			const firstperson_y = 50
			const x_p = 10
			const x_d2 = 7
			const y_d2 = 10

			const lenscale = d3.scaleLinear()
				.domain([0, 2])
				.range([0, 2])
			const original_data = require('../../assets/userpanel_data.json')

			d3.select("#peopleinteractionview").selectAll('*').remove()

			const svg = d3.select("#peopleinteractionview")
				.append("svg")
				.attr("width", 400)
				.attr("height", 300)
				.append("g")

			let glyphg2 = svg.append('g')
				.attr("width", 400)
				.attr("height", 300)
				.attr("transform", "translate(150, 50)")

			glyphg2.append("rect")
				.attr("x", 10)
				.attr("y", 10)
				.attr("width", 100)
				.attr("height", 100)
				.attr("fill", "white")
				.attr("id", "interaction" + j)

			// draw circle (radius: engagement score, opacity: interaction) 
			let engagement_dict = {}
			for (let i = 0; i < original_data.length; i++) {
				if (parseInt(original_data[i].clip) == j) {
					console.log(original_data[i].id, original_data[i].score)
					engagement_dict[original_data[i].id] = original_data[i].score
				}
			}
			console.log("Test-engagement_dict", engagement_dict)
			console.log("Test-data3", data3)
			var countt = 1
			for (let t = 1; t < 10; t++) {
				if (t == person_select) {
					// draw circle
					glyphg2.append("circle")
						.attr("cx", function () {
							if (data3[j].clip < 18) {
								return (x_p - 2 * distance + 80) / 2 + x_d2
							} else {
								return (x_p - 2 * distance - 70) / 2 + x_d2
							}
						})
						.attr("cy", (2 * firstperson_y + 150) / 2 - y_d2)
						.attr("r", function () {
							if (t == 1) {
								return 0
							} else {
								return engagement_dict[t.toString()] * 20
							}
						})
						.attr("fill", _this.label_color)

					glyphg2.append("text")
						.attr("x", function () {
							if (data3[j].clip < 18) {
								return (x_p - 2 * distance + 80) / 2
							} else {
								return (x_p - 2 * distance - 70) / 2
							}
						})
						.attr("y", (2 * firstperson_y + 150) / 2 - 3)
						.attr("fill", "black")
						.attr("id", "interaction_center" + t + j)
						.text(function () {
							if (person_select == 1) {
								return 'T'
							} else {
								return String.fromCharCode(63 + person_select)
							}
						})
						.attr("font-size", 20)
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

					// draw circle
					glyphg2.append("circle")
						.attr("cx", function () {
							if (data3[j].clip < 18) {
								return x_d + x_d2 + (x_p - 2 * distance + 80) / 2
							} else {
								return x_d + x_d2 + (x_p - 2 * distance - 70) / 2
							}
						})
						.attr("cy", (2 * firstperson_y + 150) / 2 + y_d - 5)
						.attr("r", function () {
							if (t == 1) {
								return 0
							} else {
								return engagement_dict[t.toString()] * 20
							}
						})
						.attr("opacity", function(){
							let temp_length = data[data3[j].clip][t][person_select].nod.length +
								data[data3[j].clip][t][person_select].smile.length + data[data3[j]
									.clip][t][person_select].speak.length
							return lenscale(temp_length) * 0.5 + 0.2
						})
						.attr("fill", _this.label_color)

					glyphg2.append("text")
						.attr("x", function () {
							if (data3[j].clip < 18) {
								return x_d + (x_p - 2 * distance + 80) / 2 - 1
							} else {
								return x_d + (x_p - 2 * distance - 70) / 2 - 2
							}
						})
						.attr("y", (2 * firstperson_y + 150) / 2 + y_d + 1)
						.attr("font-size", 20)
						.attr("fill", "black")
						.attr("id", "interaction_center" + t + j)
						.text(function () {
							if (t == 1) {
								return 'T'
							} else {
								return String.fromCharCode(63 + t)
							}
						})
						.attr("opacity", 0.8)
						
					// draw interaction line in
					glyphg2.append("line")
						.attr("x1", function () {
							if (data3[j].clip < 18) {
								return x1_d + (x_p - 2 * distance + 90) / 2
							} else {
								return x1_d + (x_p - 2 * distance - 60) / 2
							}
						})
						.attr("y1", (2 * firstperson_y + 140) / 2 + y1_d)
						.attr("x2", function () {
							if (data3[j].clip < 18) {
								return xc1_d + (x_p - 2 * distance + 90) / 2
							} else {
								return xc1_d + (x_p - 2 * distance - 60) / 2
							}
						})
						.attr("y2", (2 * firstperson_y + 140) / 2 + yc1_d)
						.attr('stroke-width', function () {
							let temp_length = data[data3[j].clip][t][person_select].nod.length +
								data[data3[j].clip][t][person_select].smile.length + data[data3[j]
									.clip][t][person_select].speak.length
							return lenscale(temp_length)
						})
						.attr('stroke', _this.label_color)
						.attr("marker-end", "url(#arrow)")
						.attr("id", "interaction_in" + t + j)

					// draw interaction line out
					glyphg2.append("line")
						.attr("x1", function () {
							if (data3[j].clip < 18) {
								return xc2_d + (x_p - 2 * distance + 90) / 2
							} else {
								return xc2_d + (x_p - 2 * distance - 60) / 2
							}
						})
						.attr("y1", (2 * firstperson_y + 140) / 2 + yc2_d)
						.attr("x2", function () {
							if (data3[j].clip < 18) {
								return x2_d + (x_p - 2 * distance + 90) / 2
							} else {
								return x2_d + (x_p - 2 * distance - 60) / 2
							}
						})
						.attr("y2", (2 * firstperson_y + 140) / 2 + y2_d)
						.attr('stroke-width', function () {
							let temp_length = data[data3[j].clip][person_select][t].nod.length +
								data[data3[j].clip][person_select][t].smile.length + data[data3[j]
									.clip][person_select][t].speak.length
							return lenscale(temp_length)
						})
						.attr('stroke', _this.label_color)
						.attr("marker-end", "url(#arrow)")
						.attr("id", "interaction_out" + t + j)
				}
			}

		}
	}
}
