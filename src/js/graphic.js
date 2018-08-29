/* global d3 */
import gsap from 'gsap';
import morphSVG from './MorphSVGPlugin';
//import interpolate from 'flubber';

function resize() {}

function gsapAnimation() {
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

function flubberSingle() {
	const test1 = d3.select('#j1_x5F_1').attr('d')
	const test2 = d3.select('#j2_x5F_1').attr('d')

	const interpolator = flubber.interpolate(test1, test2);

	d3.select("#j1_x5F_1")
		.transition()
		.duration(1000)
		.attrTween("d", function(){ return interpolator; });
}

function flubberArray() {
	const test1 = d3.select('#j1_x5F_1').attr('d')
	const test2 = d3.select('#j2_x5F_1').attr('d')
	const test3 = d3.select('#j3_x5F_1').attr('d')
	const test4 = d3.select('#j4_x5F_1').attr('d')

	// Remove all the paths except the first
	d3.selectAll("#jordan2").remove();
	d3.selectAll("#jordan3").remove();
	d3.selectAll("#jordan4").remove();

	let shapeArray = []
	shapeArray.push(test1, test2, test2, test4)

	console.log(shapeArray)

	//const interpolator = flubber.interpolate(test1, test2);

	d3.select('#j1_x5F_1')
		.style('display', 'block')
    .call(animate)

	function animate(sel) {
		let start = shapeArray.shift(),
				end = shapeArray[0]

		shapeArray.push(start);

		sel
			.datum({start, end})
			.transition()
			.duration(1500)
	    .attrTween("d", function(d){
				return flubber.interpolate(d.start, d.end, { maxSegmentLength: 0.1})
			})
			.on("end", function() {
      	sel.call(animate);
    	});
	}
}

function init() {
	//flubberArray()
	flubberSingle()
}

export default { init, resize };
