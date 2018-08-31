/* global d3 */
// import gsap from 'gsap';
import * as flubber from 'flubber';
import tracker from './utils/tracker';
// import morphSVG from './MorphSVGPlugin';

function resize() {}

function gsapAnimation() {
	const tl = new TimelineMax({ paused: false });

	tl.to(
		'#j1_x5F_tongueRed',
		1,
		{
			morphSVG: { shape: '#j2_x5F_tongueBlack' },
			fill: '#000'
		},
		0
	)
		.to(
			'#j1_x5F_topBlack',
			1,
			{
				morphSVG: { shape: '#j2_x5F_topBlack' }
			},
			0
		)
		.to(
			'#j1_x5F_ankleRed',
			1,
			{
				morphSVG: { shape: '#j2_x5F_ankleWhite' },
				fill: '#ffffff'
			},
			0
		)
		.to(
			'#j1_x5F_midWhite',
			1,
			{
				morphSVG: { shape: '#j2_x5F_midWhite' }
			},
			0
		)
		.to(
			'#j1_x5F_lacesWhite',
			1,
			{
				morphSVG: { shape: '#j2_x5F_tongueWhite' }
			},
			0
		)
		.to(
			'#j1_x5F_toeWhite',
			1,
			{
				morphSVG: { shape: '#j2_x5F_bodyWhite' }
			},
			0
		)
		.to(
			'#j1_x5F_toeRed',
			1,
			{
				morphSVG: { shape: '#j2_x5F_frontToeWhite' },
				fill: '#ffffff'
			},
			0
		)
		.to(
			'#j1_x5F_lacesRed',
			1,
			{
				morphSVG: { shape: '#j2_x5F_redOutline' },
				fill: '#b42c30'
			},
			0
		)
		.to(
			'#j1_x5F_ankleBlack',
			1,
			{
				morphSVG: { shape: '#j2_x5F_blackOutline' }
			},
			0
		)
		.to(
			'#j1_x5F_nikeBlack',
			1,
			{
				morphSVG: { shape: '#j2_x5F_waveRed' },
				fill: '#b42c30'
			},
			0
		)
		.to(
			'#j1_x5F_backRed',
			1,
			{
				morphSVG: { shape: '#j2_x5F_midRed' }
			},
			0
		)
		.to(
			'#j1_x5F_baseWhite',
			1,
			{
				morphSVG: { shape: '#j2_x5F_backWhite' }
			},
			0
		)
		.to(
			'#j1_x5F_supportRed',
			1,
			{
				morphSVG: { shape: '#j2_x5F_soleBlack' },
				fill: '#000'
			},
			0
		)
		.to(
			'#j1_x5F_baseRed',
			1,
			{
				morphSVG: { shape: '#j2_x5F_soleRed' }
			},
			0
		);
	tl.to('#jordan2', 0.25, {
		visibility: 'visible'
	});
}

function flubberSingle() {
	const test1 = d3.select('#j1_x5F_1').attr('d');
	const test2 = d3.select('#j2_x5F_1').attr('d');
	console.log({ test1 });

	const interpolator = flubber.interpolate(test1, test2);

	d3.select('#j1_x5F_1')
		.transition()
		.duration(1000)
		.attrTween('d', () => interpolator);
}

function flubberArray() {
	const test1 = d3.select('#j1_x5F_1').attr('d');
	const test2 = d3.select('#j2_x5F_1').attr('d');
	const test3 = d3.select('#j3_x5F_1').attr('d');
	const test4 = d3.select('#j4_x5F_1').attr('d');

	// Remove all the paths except the first
	d3.selectAll('#jordan2').remove();
	d3.selectAll('#jordan3').remove();
	d3.selectAll('#jordan4').remove();

	const shapeArray = [];
	shapeArray.push(test1, test2, test2, test4);

	console.log(shapeArray);

	// const interpolator = flubber.interpolate(test1, test2);

	d3.select('#j1_x5F_1')
		.style('display', 'block')
		.call(animate);

	function animate(sel) {
		const start = shapeArray.shift();

		const end = shapeArray[0];

		shapeArray.push(start);

		sel
			.datum({ start, end })
			.transition()
			.duration(1500)
			.attrTween('d', d =>
				flubber.interpolate(d.start, d.end, { maxSegmentLength: 0.1 })
			)
			.on('end', () => {
				sel.call(animate);
			});
	}
}

function pathsToJSON(index) {
	const output = [];
	// selects specific jordan
	d3.select(`#jordan${index + 1}`)
		.selectAll('path')
		.each((d, i, n) => {
			const $path = d3.select(n[i]);
			const pathCoordinates = $path.at('d');
			output.push(pathCoordinates);
		});
	//turns the output paths into a JSON string
	let stringOutput = JSON.stringify(output);
	return stringOutput;
}

function getPaths(index) {
	const output = [];
	//selects each jordan version (i.e. jordan1)
	d3.select(`#jordan${index}`)
		.selectAll('path')
		//d = path, i = index, n = node
		.each((d, i, n) => {
			const $path = d3.select(n[i]);
			//get the svg path coordinates
			const pathCoordinates = $path.at('d');
			//attempts to assign class to color
			const pathClass = $path.at('class');
			$path.classed(`j${index}-${pathClass}`, true)
			//add the svg path coordinates to the output array
			output.push(pathCoordinates);
		});
	return output;
}

function flubberAnimateAll() {
	const j1 = getPaths(1)
		.reverse()
		.slice(0, 13);
	const j2 = getPaths(2)
		.reverse()
		.slice(0, 13);
	// console.log({ j1, j2 });
	let interpolator = null;
	if (j1.length === j2.length) {
		interpolator = flubber.interpolateAll(j1, j2, {
			match: true,
			single: false
		});
	} else if (j1.length < j2.length) {
		interpolator = flubber.separate(j1, j2, { single: false });
	} else {
		interpolator = flubber.combine(j1, j2, { single: false });
	}
	// console.log({ interpolator });
	d3.select('#jordan1')
		.selectAll('path')
		.data(interpolator)
		.transition()
		.duration(1500)
		.attrTween('d', d => d);
	// .on('end', () => {
	// 	sel.call(animate);
	// });
}

function init() {
	flubberAnimateAll();
	//pathsToJSON(1);
	// flubberArray()
	// flubberSingle();
	// window.output = JSON.stringify(d3.range(4).map(test));
}

export default { init, resize };
