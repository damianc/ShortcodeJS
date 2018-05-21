var Shortcode = require('./support/shortcode.bridge');

describe('Empty shortcode', () => {

	it('should perform no parsing', () => {
		var input = '[x/]';
		var output = '[x/]';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('should perform simple parsing', () => {
		var input = '[separator/]';
		var output = '<hr />';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('should perform parsing with use of passed attributes', () => {
		var input = '[link to="github.com" text="GitHub"/]';
		var output = '<a href="github.com">GitHub</a>';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('should perform parsing with use of one default attribute', () => {
		var input = '[link text="this page"/]';
		var output = '<a href="#">this page</a>';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

});

describe('Content shortcode', () => {
	
	it('should perform no parsing', () => {
		var input = '[x]nothing[/x]';
		var output = '[x]nothing[/x]';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('should perform simple parsing', () => {
		var input = '[b]bold[/b]';
		var output = '<b>bold</b>';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('should perform parsing with use of passed attributes', () => {
		var input = '[mark color="yellow"]important thing[/mark]';
		var output = '<span style="background: yellow">important thing</span>';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('should perform parsing with use of one default attribute', () => {
		var input = '[mark]just thing[/mark]';
		var output = '<span style="background: white">just thing</span>';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

});
