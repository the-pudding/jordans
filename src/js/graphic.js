/* global d3 */
import * as flubber from 'flubber';
import tracker from './utils/tracker';

const TIMEOUT_DURATION = 5000;

// selections
const $nav = d3.select('nav');
const $navUl = $nav.select('nav ul');
const $navLi = $navUl.selectAll('li');
const $autoplayBtn = $nav.select('.autoplay');
const $svg = d3.select('#shapes');
const $shoeWrapper = d3.select('.shoe-wrapper')
const $jordanBox = d3.select('.jordan');
const $content = d3.select('#content');
const $contentBG = d3.select('.content-bg');
const $texthint = d3.select('.text-hint');
const $navhint = d3.select('.nav-hint');

// for nav
let dragPosX = 0;
const navCount = $navLi.size();
const navSize = $navLi.node().offsetWidth;
const totalW = navCount * navSize;
const dragMax = totalW - navSize;
const dragOffset = 0;

// data
let jordanData = [];

let currentShoe = 0;
let nextShoe = currentShoe + 1;
const dataSrc = ['assets/data/jordans.json'];

// colors
const fallbackColor = '#000000';
const fillMatches = {
	st0: '#E31E26',
	st1: '#E6E7E8',
	st2: '#414042',
	st3: '#58595B',
	st4: '#E6E6E6',
	st5: '#58595B',
	st6: '#333333',
	st7: 'url(#gradientWhite)',
	st8: '#D81F28',
	st9: '#BCBEC0',
	st10: '#282829',
	st11: '#0D0D0D',
	st12: '#B3B3B3',
	st13: '#FFFFFF',
	st14: '#F3B81E',
	st15: '#B42C30',
	st16: '#939598',
	st17: '#D1D3D4',
	st18: '#6D6E71',
	st19: '#1A1A1A',
	st20: '#0368AB',
	st21: '#1C75BC',
	st22: '#C7E9F1',
	st23: '#F26C4B',
	st24: '#EF412C',
	st25: 'url(#gradientCosmos)',
	st26: 'url(#gradientCosmos)',
	st27: 'url(#gradientCosmos)',
	st28: 'url(#gradientRedBlack)',
	st29: 'url(#gradientRedBlack)',
	st30: 'url(#gradientRedBlack)',
	st31: '#21409A',
	st32: '#A7A9AC',
	st33: '#D7DF23',
	st34: 'url(#gradientRedBlue)',
	st35: 'url(#gradientPurple)',
	st36: '#ED907B',
	st37: 'url(#gradientPurple)',
	st38: '#983279',
	st39: '#392f8d',
	st40: '#453D98',
	st60: 'magenta',
	st61: "#F1F2F2"
};

let timer = null;

function resize() {
	let widthSVG = $shoeWrapper.node().offsetWidth;
	let heightSVG = widthSVG/1.4
	$jordanBox.st('height', heightSVG)
}

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
	// update nav
	$navLi.classed('is-active', (d, i) => i === next - 1);

	const j1 = jordanData[prev].map(d => d.coordinates).reverse();
	const j2 = jordanData[next].map(d => d.coordinates).reverse();
	const j2colors = jordanData[next].map(d => d.color).reverse();

	let terpMatch = null;
	const terpLeftover = null;

	const smallestLength = Math.min(j1.length, j2.length);
	const j1Match = j1.slice(0, smallestLength);
	const j2Match = j2.slice(0, smallestLength);

	terpMatch = flubber.interpolateAll(j1Match, j2Match, {
		match: true,
		single: false
	});
	const combinedShoes = j2colors.map((color, i) => ({
		color,
		interpolatorFunc: i < smallestLength ? terpMatch[i] : null,
		coordinates: j2[i]
	}));

	const $path = d3
		.select('#jordan0')
		.selectAll('path')
		.data(combinedShoes);

	$path
		.transition()
		.duration(1000)
		.st('fill', d => fillMatches[d.color] || fallbackColor)
		.st('stroke', d => fillMatches[d.color] || fallbackColor)
		.attrTween('d', d => d.interpolatorFunc);

	$path
		.enter()
		.append('path')
		.at('d', d => d.coordinates)
		.st('fill', d => fillMatches[d.color] || fallbackColor)
		.st('stroke', d => fillMatches[d.color] || fallbackColor);

	$path.exit().remove();

	currentShoe = next;

	// Change this to most recent Jordan shoe to loop
	if (currentShoe == 39) {
		nextShoe = 1
	} else {
		nextShoe = currentShoe + 1;
	}

	hideImage(prev);
	revealImage(next);
	updateText(next - 1);
}

function loadData() {
	return new Promise((resolve, reject) => {
		d3.loadData(...dataSrc, (err, response) => {
			if (err) reject('error loading data');
			else resolve(response);
		});
	});
}

function revealImage(next) {
	const currentImg = `#j${next}-image`;
	d3.selectAll(currentImg)
		.transition()
		.duration(1500)
		.delay(1000)
		.style('opacity', '1');
}

function hideImage(prev) {
	const currentImg = `#j${prev}-image`;
	d3.selectAll(currentImg)
		.transition()
		.duration(0)
		.style('opacity', '0');
}

window.onscroll = function() {
	if ($texthint.classed('is-visible') == true) {
		$texthint.classed('is-visible', false)
	}
}

function updateText(next) {
	if (next == 0) {
		$texthint.classed('is-visible', true)
	}
	d3.selectAll('.intro-text').classed('is-hidden', true)
	d3.selectAll('.loading-text').classed('is-hidden', true)
	d3.selectAll('.details-text').classed('is-visible', (d, i) => i === next);
	d3.selectAll('.big-num').text(() => {
		if ((next+1).toString().length > 1) {
			return next + 1;
		} else {
			return `0${(next + 1).toString()}`;
		}
	});
}

function handleShoeClick() {
	const item = d3.select(this);
	const activeState = item.classed('is-active');

	// d3.selectAll('li:not(.is-active)').classed('not-selected', !notActive);
	// const name = item.at('data-type');
	// const id = item.at('data-id');
	const next = +item.at('data-index') + 1;

	if (timer) {
		timer.stop();
		$autoplayBtn.html('<div class="play-pause"><img class="play-icon" src="assets/images/play.svg"></div>');
		timer = null;
	}
	if (currentShoe !== next) {
		$navLi.classed('is-active', false);
		item.classed('is-active', !activeState);
		flubberAnimateAll({ prev: currentShoe, next });
	}
}

function prefix(prop) {
	return [prop, `webkit-${prop}`, `ms-${prop}`];
}

function handleDrag() {
	$navhint.classed('is-hidden', true)
	const { x } = d3.event;
	const diff = dragPosX - x;
	dragPosX = x;

	const prev = +$navUl.at('data-x');
	const cur = Math.max(0, Math.min(prev + diff, dragMax));

	const index = Math.min(
		Math.max(0, Math.floor((cur / dragMax) * navCount)),
		navCount - 1
	);
	const trans = (cur - dragOffset) * -1;

	$navLi.classed('is-current', (d, i) => i === index);
	$navUl.at('data-x', cur);

	const prefixes = prefix('transform');
	prefixes.forEach(pre => {
		const transform = `translateX(${trans}px)`;
		$navUl.node().style[pre] = transform;
	});
}

function handleDragStart() {
	const { x } = d3.event;
	dragPosX = x;
	$navUl.classed('is-dragend', false);
	$nav.classed('is-drag', true);
}

function handleDragEnd() {
	const cur = +$navUl.at('data-x');
	const index = Math.min(
		Math.max(0, Math.floor((cur / dragMax) * navCount)),
		navCount - 1
	);
	const x = index * navSize;
	const trans = (x - dragOffset) * -1;

	$navUl.at('data-x', x);

	const prefixes = prefix('transform');
	prefixes.forEach(pre => {
		const transform = `translateX(${trans}px)`;
		$navUl.node().style[pre] = transform;
	});

	$navUl.classed('is-dragend', true);
	$nav.classed('is-drag', false);
}

function advanceShoe() {
	flubberAnimateAll({ prev: currentShoe, next: nextShoe });
	timer = d3.timeout(advanceShoe, TIMEOUT_DURATION);
}

function handleAutoplayClick() {
	const shouldPlay = $autoplayBtn.html() === '<div class="play-pause"><img class="play-icon" src="assets/images/play.svg"></div>';
	if (shouldPlay) {
		$autoplayBtn.html('<div class="play-pause"><img src="assets/images/pause.svg"></div>');
		advanceShoe();
	} else if (!shouldPlay && timer) {
		$autoplayBtn.html('<div class="play-pause"><img class="play-icon" src="assets/images/play.svg"></div>');
		timer.stop();
		timer = null;
	}
}

function setUpFirstShoe() {
	revealImage(0)
}

function setupNav() {

	$navUl.call(
		d3
			.drag()
			.on('drag', handleDrag)
			.on('start', handleDragStart)
			.on('end', handleDragEnd)
	);
	$navLi.on('click', handleShoeClick);

	$autoplayBtn.on('click', handleAutoplayClick);
}

function init() {
	pathsToJSON();
	loadData()
		.then(data => {
			jordanData = data[0];
			setupNav();
			setUpFirstShoe();
			timer = d3.timeout(advanceShoe, TIMEOUT_DURATION);
		})
		//.catch(console.log);
	resize();
}

export default { init, resize };
