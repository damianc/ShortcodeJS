var Shortcode = require('./support/shortcode.bridge');

describe('pre-parsing variables', () => {

	it('should keep variable-reference string as is', () => {
		var input = '[@@:textDecoration]a word[/@@:textDecoration]';
		var output = '[@@:textDecoration]a word[/@@:textDecoration]';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('should use such a shortcode whose name is indicated by the variable', () => {
		var input = '[@@:textDecoration]a word[/@@:textDecoration]';
		var output = '<b>a word</b>';

		expect(
			Shortcode.parse(input, {textDecoration: 'bold' ? 'b' : 'u'})
		).toEqual(output);
	});

});

describe('post-parsing variables', () => {

	it('should keep variable-reference string as is', () => {
		var input = 'The word for today: @:word';
		var output = 'The word for today: @:word';

		expect(
			Shortcode.parse(input)
		).toEqual(output);
	});

	it('should put a word indicated by the variable', () => {
		var input = 'The word for today: @:word';
		var output = 'The word for today: JavaScript';

		expect(
			Shortcode.parse(input, {word: 'JavaScript'})
		).toEqual(output);
	});

});

describe('mixed variables', () => {

	function inlineString(str) {
		return str.replace(/[\n\r\t]+/g, '');
	}

	it('should use such shortcodes whose names are indicated by the pre-parsing variables', () => {
		var input = `[@@:primaryTextDecoration]
			[@@:secondaryTextDecoration]a word[/@@:secondaryTextDecoration]
		[/@@:primaryTextDecoration]`;
		var output = '<b><u>a word</u></b>';

		expect(
			Shortcode.parse(inlineString(input), {primaryTextDecoration: 'b', secondaryTextDecoration: 'u'})
		).toEqual(output);
	});

	it('should use such shortcodes whose names are indicated by the post-parsing variables', () => {
		var input = 'That\'s @:libraryName being tested in @:testingFramework';
		var output = 'That\'s ShortcodeJS being tested in Jasmine';

		expect(
			Shortcode.parse(input, {libraryName: 'ShortcodeJS', testingFramework: 'Jasmine'})
		).toEqual(output);
	});

	it('should use such shortcodes whose names are indicated by the both pre-parsing and post-parsing variables', () => {
		var input = `[@@:primaryTextDecoration]
			[@@:secondaryTextDecoration]
				That's @:libraryName being tested in @:testingFramework
			[/@@:secondaryTextDecoration]
		[/@@:primaryTextDecoration]`;
		var output = '<b><u>That\'s ShortcodeJS being tested in Jasmine</u></b>';

		expect(
			Shortcode.parse(inlineString(input), {
				primaryTextDecoration: 'b', secondaryTextDecoration: 'u',
				libraryName: 'ShortcodeJS', testingFramework: 'Jasmine'
			})
		).toEqual(output);
	});

});
