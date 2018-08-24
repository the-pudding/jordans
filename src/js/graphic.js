/* global d3 */
import gsap from 'gsap';
import morphSVG from './MorphSVGPlugin';

function resize() {}

function init() {
	console.log('Make something awesome!');

	var tl = new TimelineMax({paused:false})

	tl.to("#j1_x5F_tongueRed", 1, {
		morphSVG: {shape:"#j2_x5F_tongueBlack"},
		fill: '#000'
	}, 0)
	.to("#j1_x5F_topBlack", 1, {
		morphSVG: {shape:"#j2_x5F_topBlack"}
	}, 0)
	.to("#j1_x5F_ankleRed", 1, {
		morphSVG: {shape:"#j2_x5F_ankleWhite"},
		fill: '#ffffff'
	}, 0)
	.to("#j1_x5F_midWhite", 1, {
		morphSVG: {shape:"#j2_x5F_midWhite"}
	}, 0)
	.to("#j1_x5F_lacesWhite", 1, {
		morphSVG: {shape:"#j2_x5F_tongueWhite"}
	}, 0)
	.to("#j1_x5F_toeWhite", 1, {
		morphSVG: {shape:"#j2_x5F_bodyWhite"}
	}, 0)
	.to("#j1_x5F_toeRed", 1, {
		morphSVG: {shape:"#j2_x5F_frontToeWhite"},
		fill: '#ffffff'
	}, 0)
	.to("#j1_x5F_lacesRed", 1, {
		morphSVG: {shape:"#j2_x5F_redOutline"},
		fill: '#b42c30'
	}, 0)
	.to("#j1_x5F_ankleBlack", 1, {
		morphSVG: {shape:"#j2_x5F_blackOutline"}
	}, 0)
	.to("#j1_x5F_nikeBlack", 1, {
		morphSVG: {shape:"#j2_x5F_waveRed"},
		fill: '#b42c30'
	}, 0)
	.to("#j1_x5F_backRed", 1, {
		morphSVG: {shape:"#j2_x5F_midRed"}
	}, 0)
	.to("#j1_x5F_baseWhite", 1, {
		morphSVG: {shape:"#j2_x5F_backWhite"}
	}, 0)
	.to("#j1_x5F_supportRed", 1, {
		morphSVG: {shape:"#j2_x5F_soleBlack"},
		fill: '#000'
	}, 0)
	.to("#j1_x5F_baseRed", 1, {
		morphSVG: {shape:"#j2_x5F_soleRed"}
	}, 0)
	tl.to("#jordan2", 0.25, {
		visibility: 'visible'
	})
}

export default { init, resize };
