<template>
	<div id="app" style="width: 1400px">
		<el-header id="systemHeader">Engagement Analysis System</el-header>
		<el-container>
			<el-main id="systemMain">
				<el-row>
					<el-col :span="3">
					<el-select v-model="value" placeholder="select a video" size="mini">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					</el-col>
				</el-row>
				<el-col>
					<el-col :span="5" style="padding:2px;">
						<ControlPanel />
					</el-col>
					<el-col :span="19" style="padding:2px;">
						<el-row :span="12" style="padding:2px;">
							<MainView />
						</el-row>
						<el-row :span="12" style="padding:2px;">
							<DetailView />
						</el-row>
					</el-col>
				</el-col>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	/* global d3 $ _ */
	import ControlPanel from "./components/ControlPanel/ControlPanel.vue"
	import MainView from "./components/MainView/MainView.vue"
	import InteractionView from "./components/InteractionView/InteractionView.vue"
	import DetailView from "./components/DetailView/DetailView.vue"
	import pipeService from './service/pipeService.js'
	export default {
		name: "app",
		components: {
			ControlPanel,
			MainView,
			DetailView
		},
		data() {
			return {
				options: [{
					value: '1',
					label: 'video1'
				}, {
					value: '2',
					label: 'video2'
				}, {
					value: '3',
					label: 'video3'
				}, {
					value: '4',
					label: 'video4'
				}, {
					value: '5',
					label: 'video5'
				}],
				value: ''
			};
		},
		watch: {
			value: function() {
				pipeService.emitStart(this.value)
				console.log(this.value)
			}
		},
		mounted: function() {
			console.log("d3: ", d3); /* eslint-disable-line */
			console.log("$: ", $); /* eslint-disable-line */
			console.log("this: ", this, this.components);
			console.log(
				"_",
				_.partition([1, 2, 3, 4], (n) => n % 2)
			); /* eslint-disable-line */
		},
		methods: {

		}
	};
</script>

<style>
	#app {
		font-family: "Helvetica", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #5c646d;
		width: 1400px;
		height: 780px;
		margin: 0 auto;
	}

	#systemHeader {
		background-color: #92a2b3;
		color: white;
		text-align: start;
		font-weight: bold;
		font-size: 25px;
		line-height: 40px;
		height: 40px !important;
		width: 1400px;
		vertical-align: middle !important;

	}

	#systemMain {
		padding: 5px;
		/* background-color: #E9EEF3; */
		color: rgb(157, 152, 152);
		text-align: center;
		height: 780px;
	}

	.viewheader {
		font-weight: bold;
		text-align: start;
		padding: 5px;
		background: #f8f8fa;
		height: 30px;
	}

	.viewbody {
		height: 330px;
	}
</style>
