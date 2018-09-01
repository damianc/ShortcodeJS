var Shortcode = function (document) {
	var shortcodes = {};
	var settings = {
		attributeNameToCamelCase: true
	};

	var InternalAPI = {
		parseSynthElementAttrs: function (attrsString) {
			var synthDiv = document.createElement('div');
			synthDiv.innerHTML = '<span ' + attrsString + '></span>';

			var synthElement = synthDiv.firstChild;
			var synthElementAttrs = synthElement.getAttributeNames();
			var attrs = {};

			synthElementAttrs.forEach(function (attrName) {
				var finalAttrName = attrName;

				if (settings.attributeNameToCamelCase === true) {
					finalAttrName = attrName.replace(/\-(\w)/g, (char) => char[1].toUpperCase());
				}

				attrs[finalAttrName] = synthElement.getAttribute(attrName);
			});

			return attrs;
		},

		parseEmptyShortcodes: function (source) {
			var reEmptyShortcode = /\[\s*(\w+)([^\/\[]*)?\/\s*\]/g;
			var parsedSource = source.replace(reEmptyShortcode, function (input, name, attrsString) {
				if (shortcodes[name]) {
					let attrs = InternalAPI.parseSynthElementAttrs(attrsString);
					return shortcodes[name](attrs);
				} else {
					return input;
				}
			});
			return parsedSource;
		},

		parseContentShortcodes: function (source) {
			var reContentShortcode = /\[\s*(\S+)([^\]]*)?\]([\s\S]+?)\[\s*\/\s*\1\s*\]/g;
			var parsedSource = source.replace(reContentShortcode, function (input, name, attrsString, content) {
				if (shortcodes[name]) {
					let attrs = InternalAPI.parseSynthElementAttrs(attrsString);
					return shortcodes[name](attrs, content);
				} else {
					return input;
				}
			});
			return parsedSource;
		},

		remainShortcodes: function (source) {
			var shortcodeNames = Object.keys(shortcodes).join('|');
			var reShortcodeNames = new RegExp('\\[\\s*(' + shortcodeNames + ')');
			return reShortcodeNames.test(source);
		},

		/* In the case some unpredicted source causes infinity loop. */
		safeIterationNumber: function (source) {
			var openingBrackets = source.match(/\[(?!\/)/g) || [];
			return openingBrackets.length;
		}
	};

	var PublicAPI = {
		register: function (name, cb) {
			shortcodes[name] = cb;
		},

		parse: function (source) {
			var emptyShortcodesPhase = InternalAPI.parseEmptyShortcodes(source);
			var contentShortcodesPhase = InternalAPI.parseContentShortcodes(emptyShortcodesPhase);

			var safeIterationNumber = InternalAPI.safeIterationNumber(source);
			var runIterationNumber = 1;

			while (InternalAPI.remainShortcodes(contentShortcodesPhase)) {
				contentShortcodesPhase = InternalAPI.parseContentShortcodes(contentShortcodesPhase);
				if (++runIterationNumber > safeIterationNumber) break;
			}

			return contentShortcodesPhase;
		},

		setting: function (option, value) {
			settings[option] = value;
		}
	};

	return PublicAPI;
};

if (typeof window != 'undefined' && typeof window.document != 'undefined') {
	Shortcode = Shortcode(window.document);
} else if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
	module.exports = Shortcode;
}
