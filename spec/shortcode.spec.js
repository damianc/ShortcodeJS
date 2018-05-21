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

describe('Shortcode attribute', () => {

	it('should keep dash-case attribute names', () => {
		var input = '[justAttrs attr-a="1st" attr-b="2nd"/]';
		var output = 'attr-a,attr-b';

		// turn dash-case to camelCase translating off
		Shortcode.setting('attributeNameToCamelCase', false);

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('should turn dash-case attribute names into camelCase ones', () => {
		var input = '[justAttrs attr-a="1st" attr-b="2nd"/]';
		var output = 'attrA,attrB';

		// turn dash-case to camelCase translating on
		Shortcode.setting('attributeNameToCamelCase', true);

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

})
