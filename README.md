# ShortcodeJS

A tiny library allowing to compose website components being used repeatedly by wrapping them in the callbacks that produce respective HTML markup.

## Using the library

First of all, you need to include _ShortcodeJS_ library. When you're done with the former, new shortcodes are meant to be registered with
the `Shortcode.register()` method. Finally, sources can be parsed by the `Shortcode.parse()` method.

There are two kinds of shortcode:
* _empty shortcode_ being standalone shortcode with no content surrounded, e.g. `[shortcode/]`
* _content shortcode_ being shortcode that surrounds a content, e.g. `[shortcode]Content.[/shortcode]`

In addition, both can have attributes assigned, e.g. `[shortcode attr="val"/]`.

### Methods overview

**`Shortcode.register(name, cb)`**

Registers new shortcode.  
Returns: `undefined`.  
Parameters:
* `name` - a `string` that represents the name of the shortcode
* `cb` - a callback `function` that returns HTML markup, having taken up to 2 parameters:
	* `attr` - an `object` containing attributes assigned to a shortcode
	* `content` - a `string` representing the content of a shortcode

**`Shortcode.parse(source)`**

Parses a source turning registered shortcodes into respecitve HTML markup.  
Returns: `string` being HTML markup.  
Parameters:
* `source` - a `string` that holds the content to be parsed

### Complete example

```html
<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8" />
	<title>ShortcodeJS</title>
</head>

<body>
	<p id="content">
		This paragraph is meant to show you how you can use [b]ShortcodeJS[/b] library.
	</p>

	<script src="shortcode.js"></script>
	<script>
		Shortcode.register('b', function (attr, content) {
			return `<b>${content}</b>`;
		});

		var content = document.getElementById('content');
		content.innerHTML = Shortcode.parse(content.innerHTML);
	</script>
</body>

</html>
```

Note that the name of a shortcode is passed as first argument of the `Shortcode.register()` method, then this name is used within
a content that will be processed.

## Composing a component

### Empty shortcode

Simplest component only consists of name.  
Neither component's attributes nor its content is involved, therefore no parameters are used with the callback composing HTML markup.

```javascript
Shortcode.register('separator', function () {
    return '<hr />';
});

/*
    given input:
    [separator/]

    expected output:
    <hr />
*/
```

### Empty shortcode with attributes

Right beside the name, a shortcode can have attributes assigned.  
It can be done the same way as if it were regular HTML element.

```javascript
Shortcode.register('separator', function (attr) {
    return `<hr style="width: ${attr.width}" />`;
});

/*
    given input:
    [separator width="50%"/]

    expected output:
    <hr style="width: 50%" />
*/
```

### Content shortcode

As well, the shortcodes are able to hold content, including another nested shortcodes.  
Though the example below does not use attributes, passing `attr` parameter is essential as it precedes the `content` parameter that we make use of.

```javascript
Shortcode.register('frame', function (attr, content) {
    return `<div style="border: solid 1px #333">${content}</div>`;
});

/*
    given input:
    [frame]This content is important.[/frame]

    expected output:
    <div style="border: solid 1px #333">This content is important.</div>
*/
```

### Content shortcode with attributes

Content shortcodes are any less different when it comes to assigning attributes.

```javascript
Shortcode.register('cite', function (attr, content) {
    return `@${attr.user}: ${content}`;
});

/*
    given input:
    [cite user="damianc"]I hope you will make good use of it.[/cite]

    expected output:
    @damianc: I hope you will make good use of it.
*/
```

## Default attribute values

It may happen that your shortcode is to take a multiple of attributes of which not all are required.
In the case, default values should be guaranted to be delivered.

>  
> **Note that attribute names must not contain uppercase characters as they will not be preserved.**  <br/><br/>
> Even if you use a shortcode like `[frame borderColor="red"]`, the `attr` object is to contain `bordercolor` property rather than `borderColor`.  <br/><br/>
> Still, you could use dash-case name, e.g. `[frame border-color="red"]`, in which case the respective property name remains the same, i.e. `border-color` (keep in mind that such a name is required to be surrounded with quotes when accessed).
>  

```javascript
Shortcode.register('frame', function (attr, content) {
    var settings = Object.assign({
        borderwidth: '1px',
        bordercolor: '#333'
    }, attr);
	
    return `<div style="border: solid ${settings.borderwidth} ${settings.bordercolor}">
        ${content}
    </div>`;
});

/*
    given input:
    [frame bordercolor="red"]This message is very important![/frame]

    expected output:
    <div style="border: solid 1px red">This message is very important!</div>
*/
```


## Running out of browser

ShortcodeJS is supposed to run in browser environment that delivers the `window.document` object.
For environments like Node.js, function returning ShortcodeJS API is provided - this function takes appropriate `document` object that can be derived from an external library like [jsdom](https://github.com/jsdom/jsdom).

```javascript
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('<!DOCTYPE html></html>');
    const { document } = dom.window;
    const Shortcode = require('../shortcode')(document);

    // ...
```
