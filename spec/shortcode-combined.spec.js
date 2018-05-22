var Shortcode = require('./support/shortcode.bridge');

describe('Adjacent shortcodes', () => {

	it('of different types should pass', () => {
		var input = '[b]bold[/b][mark]note[/mark]';
		var output = '<b>bold</b><span style="background: white">note</span>';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('of the same type should pass', () => {
		var input = '[b]bold[/b][b]any less[/b]';
		var output = '<b>bold</b><b>any less</b>';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

});

describe('Nested shortcodes', () => {

	it('of different types should pass', () => {
		var input = '[b]bold [mark]note[/mark][/b]';
		var output = '<b>bold <span style="background: white">note</span></b>';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('of the same type should pass', () => {
		var input = '[b]bold [b]of bold[/b][/b]';
		var output = '<b>bold <b>of bold</b></b>';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

});

describe('Shortcodes with whitespaces', () => {

	it('with gaps between key characters should pass', () => {
		var input = '[ link text = "this page" / ]';
		var output = '<a href="#">this page</a>';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('multiline ones should pass', () => {
		var input = `[link
			text = "this page"
		/]`;
		var output = '<a href="#">this page</a>';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

});
