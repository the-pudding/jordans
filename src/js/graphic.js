/* global d3 */
import * as flubber from 'flubber';
import tracker from './utils/tracker';

let jordanData = [];
let jordanDetails = [];
let currentShoe = 0;
const dataSrc = ['assets/data/jordans.json', 'assets/data/jordanDetails.csv'];

const fallbackColor = '#000';

const fillMatches = {
	st0: '#fff',
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
};

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
	const shoeID = $g.at('id');

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

function flubberAnimateAll({ prev, next }) {
	// 14
	// 15

	// int 1 = 9 x 9 interpolateAll
	// int 2 = 6 x 1 separate

	const j1 = jordanData[prev].map(d => d.coordinates).reverse();
	const j2 = jordanData[next].map(d => d.coordinates).reverse();
	const j2colors = jordanData[next].map(d => d.color).reverse();

	let terpMatch = null;
	const terpLeftover = null;

	// 13
	const smallestLength = Math.min(j1.length, j2.length);
	const j1Match = j1.slice(0, smallestLength);
	const j2Match = j2.slice(0, smallestLength);

	terpMatch = flubber.interpolateAll(j1Match, j2Match, {
		match: true,
		single: false
	});

	// let j2Leftover = [];

	// if (j1.length < j2.length) {
	// 	// separate
	// 	// const lastShape = j1.pop();
	// 	// j2Leftover = j2.slice(smallestLength, j2.length);
	// 	// terpLeftover = flubber.separate(lastShape, j2Leftover, { single: true });
	// } else {
	// 	// combine
	// 	// alert('freak out');
	// 	const lastShape = j2.length - 1;
	// 	const lastShapeCoords = j2[lastShape];
	// 	interpolator = flubber.combine(j1, lastShapeCoords, { single: true });
	// }

	// console.log({ terpMatch, terpLeftover });
	const combinedShoes = j2colors.map((color, i) => ({
		color,
		interpolatorFunc: i < smallestLength ? terpMatch[i] : null,
		coordinates: j2[i]
	}));

	const $path = d3
		.select('#jordan1')
		.selectAll('path')
		.data(combinedShoes);

	$path
		.transition()
		.duration(1000)
		.st('fill', d => fillMatches[d.color] || fallbackColor)
		.attrTween('d', d => d.interpolatorFunc);

	$path
		.enter()
		.append('path')
		.at('d', d => d.coordinates)
		.st('fill', d => fillMatches[d.color] || fallbackColor);

	$path.exit().remove();

	currentShoe = next;
	hideImage(prev);
	revealImage(next);
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
	d3.selectAll('g')
		.filter((d, i) => i)
		.remove();
}

function revealImage(next) {
	const currentImg = `#j${next + 1}-image`;
	d3.selectAll(currentImg)
		.transition()
		.duration(1500)
		.delay(1000)
		.style('opacity', '1');
}

function hideImage(prev) {
	const currentImg = `#j${prev + 1}-image`;
	d3.selectAll(currentImg)
		.transition()
		.duration(0)
		.style('opacity', '0');
}

function updateText(next) {
	const jordanNum = `jordan${next}`;
	const singleShoe = jordanDetails.filter(d => d.shoeID == jordanNum);
	const dateUpdate = d3.selectAll('.date');
	const priceUpdate = d3.selectAll('.price');
	const designerUpdate = d3.selectAll('.designer');
	const nameUpdate = d3.selectAll('.jordanName');
	const infoUpdate = d3.selectAll('.infoName');
}

function advanceShoe() {
	setTimeout(() => {
		flubberAnimateAll({ prev: currentShoe, next: currentShoe + 1 });
		advanceShoe();
	}, 5000);
}

function init() {
	// pathsToJSON();
	removePaths();
	loadData()
		.then(data => {
			jordanData = data[0];
			jordanDetails = data[1];
			// render graphic stuff now
			flubberAnimateAll({ prev: currentShoe, next: currentShoe + 1 });
			advanceShoe();
		})
		.catch(console.log);
}

export default { init, resize };
