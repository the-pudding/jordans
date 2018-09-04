/* global d3 */
import * as flubber from 'flubber';
import tracker from './utils/tracker';

let jordanData = [];
let flatData = [];
let nestedData = []

function resize() {}

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

function pathsToJSON() {
	const output = [];
	d3.selectAll('.jordan svg > g').each(function() {
		output.push(getPaths(this));
	});

	window.output = JSON.stringify(output);
}

function unNestData() {
	jordanData.forEach(function(shoes, i) {
		const jNumber = i + 1
		shoes.forEach(function(shoe) {
			flatData.push({
				shoeNumber: 'jordan' + jNumber,
				coordinates: shoe.coordinates,
				color: shoe.color
			})
		})
	});
	console.log(flatData);
}

function nestData() {
	nestedData = d3.nest()
		.key(d => d.shoeNumber)
		.entries(flatData)

	console.log(nestedData)
}

function getPaths(g) {
	const $g = d3.select(g);

	const output = [];
	$g.selectAll('path')
		// d = path, i = index, n = node
		.each((d, i, n) => {
			const $path = d3.select(n[i]);
			// get the svg path coordinates
			const coordinates = $path.at('d');
			// attempts to assign class to color
			const color = $path.at('class');
			// add the svg path coordinates to the output array
			output.push({ coordinates, color });
		});
	return output;
}

function flubberAnimateAll({ prev, next }, i) {
	const j1 = jordanData[prev]
		.map(d => d.coordinates)
		.reverse()
		.slice(0, 13);
	const j2 = jordanData[next].map(d => d.coordinates)
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
		//.style('fill', 'red')
		.attrTween('d', d => d);
}

function loadData() {
	return new Promise((resolve, reject) => {
		d3.loadData('assets/data/jordans.json', (err, response) => {
			if (err) reject('error loading data');
			else resolve(response[0]);
		});
	});
}

function init() {
	// pathsToJSON();
	loadData()
		.then(data => {
			jordanData = data;
			// render graphic stuff now
			//unNestData();
			//nestData();
			flubberAnimateAll({ prev: 0, next: 1 });
		})
		.catch(console.log);

	// flubberArray()
	// flubberSingle();
	// window.output = JSON.stringify(d3.range(4).map(test));
}

export default { init, resize };
