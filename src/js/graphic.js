/* global d3 */
import * as flubber from 'flubber';
import tracker from './utils/tracker';

let jordanData = [];
let jordanDetails = [];
let currentShoe = 0;
const dataSrc = ['assets/data/jordans.json', 'assets/data/jordanDetails.csv']

const fillMatches = {
	null: '#000000',
	st0: 'url(#whiteGradient)',
	st1: '#D81F28',
	st2: '#58595B',
	st3: '#414042',
	st4: '#BCBEC0',
	st5: '#E31E26',
	st6: '#282829',
	st7: '#939598',
	st8: '#D1D3D4',
	st9: '#B42C30',
	st10: '#F3B81E',
	st11: '#C7E9F1',
	st12: '#FFFFFF',
	st13: '#F26C4B',
	st14: '#EF412C',
	st15: 'url(#j30_x5F_6_2_)',
	st16: 'url(#j30_x5F_4_2_)',
	st17: 'url(#j30_x5F_3_1_)',
	st18: 'url(#j31_x5F_3_1_)'
}

function resize() {}

function pathsToJSON() {
	const output = [];
	d3.selectAll('.jordan svg > g').each(function() {
		output.push(getPaths(this));
	});

	window.output = JSON.stringify(output);
}

function getPaths(g) {
	const $g = d3.select(g);
	const shoeID = $g.at('id')

	const output = [];
	$g.selectAll('path')
		// d = path, i = index, n = node
		.each((d, i, n) => {
			const $path = d3.select(n[i]);
			// get the svg path coordinates
			const coordinates = $path.at('d');
			// assigns class to color
			const color = $path.at('class');
			// add the svg path coordinates to the output array
			output.push({ coordinates, color, shoeID });
		});
	return output;
}

function flubberAnimateAll({ prev, next }, i) {

	let j1 = jordanData[prev]
		.map(d => d.coordinates)
		.reverse()
	let j2 = jordanData[next].map(d => d.coordinates)
		.reverse()
	let j2colors = jordanData[next].map(d => d.color)
		.reverse()
	//console.log({ j1, j2 });
	let interpolator = null;
	if (j1.length === j2.length) {
		interpolator = flubber.interpolateAll(j1, j2, {
			match: true,
			single: false
		});
	} else if (j1.length < j2.length) {
		let lastShape = j1.length - 1
		let lastShapeCoords = j1[lastShape]
		interpolator = flubber.separate(lastShapeCoords, j2, { single: false });
	} else {
		let lastShape = j2.length - 1
		let lastShapeCoords = j2[lastShape]
		interpolator = flubber.combine(j1, lastShapeCoords, { single: false });
	}
	const combinedShoes = j2colors.map((color, i) => ({color, interpolatorFunc: interpolator[i]}))

	d3.select('#jordan1')
		.selectAll('path')
		.data(combinedShoes)
		.transition()
		.duration(1000)
		.style('fill', d => fillMatches[d.color])
		.attrTween('d', d => d.interpolatorFunc);

	currentShoe = next
	hideImage(prev)
	revealImage(next)
	updateText(next);
}

function loadData() {
	return new Promise((resolve, reject) => {
		d3.loadData(...dataSrc, (err, response) => {
			if (err) reject('error loading data');
			else resolve(response);
		});
	});
}

function removePaths() {
	// Remove all the paths except the first
	d3.selectAll("g")
	  .filter(function(d, i) { return i; })
	  .remove();
}

function revealImage(next) {
	let currentImg = `#j${next+1}-image`
	d3.selectAll(currentImg)
		.transition()
		.duration(1500)
		.delay(1000)
		.style('opacity', '1')
}

function hideImage(prev) {
	let currentImg = `#j${prev+1}-image`
	d3.selectAll(currentImg)
		.transition()
		.duration(0)
		.style('opacity', '0')
}

function updateText(next) {
	const jordanNum = `jordan${next}`
	const singleShoe = jordanDetails.filter(function(d) { return d.shoeID == jordanNum})
	const dateUpdate = d3.selectAll('.date')
	const priceUpdate = d3.selectAll('.price')
	const designerUpdate = d3.selectAll('.designer')
	const nameUpdate = d3.selectAll('.jordanName')
	const infoUpdate = d3.selectAll('.infoName')
}

function advanceShoe() {
	setTimeout(() => {
		flubberAnimateAll({ prev: currentShoe, next: currentShoe + 1 });
	}, 5000)
}

function init() {
	//pathsToJSON();
	removePaths();
	loadData()
		.then(data => {
			jordanData = data[0]
			jordanDetails = data[1]
			// render graphic stuff now
			flubberAnimateAll({ prev: currentShoe, next: currentShoe + 1 });
			advanceShoe();
		})
		.catch(console.log);
}

export default { init, resize };
