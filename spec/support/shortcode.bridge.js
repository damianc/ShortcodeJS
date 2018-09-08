const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html></html>');
const { document } = dom.window;
const Shortcode = require('../../src/shortcode')(document);

/*
	empty shortcode without attributes
*/

Shortcode.register('separator', function () {
	return '<hr />';
});

/*
	empty shortcode with attributes
*/

Shortcode.register('link', function (attr) {
	var settings = Object.assign({
		to: '#',
		text: 'here'
	}, attr);

	return `<a href="${settings.to}">${settings.text}</a>`;
});

Shortcode.register('justAttrs', function (attr) {
	return Object.keys(attr).join(',');
});

/*
	content shortcode without attributes
*/

Shortcode.register('b', function (attr, content) {
	return `<b>${content}</b>`;
});

Shortcode.register('u', function (attr, content) {
	return `<u>${content}</u>`;
});

/*
	content shortcode with attributes
*/

Shortcode.register('mark', function (attr, content) {
	var settings = Object.assign({
		color: 'white'
	}, attr);

	return `<span style="background: ${settings.color}">${content}</span>`;
});

module.exports = Shortcode;
