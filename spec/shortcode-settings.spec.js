var Shortcode = require('./support/shortcode.bridge');

describe('attributeNameToCamelCase setting', () => {

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

});
