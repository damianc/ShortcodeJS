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

**`Shortcode.parse(source[, variables])`**

Parses a source turning registered shortcodes into respecitve HTML markup.  
Returns: `string` being HTML markup.  
Parameters:
* `source` - a `string` that holds the content to be parsed
* `variables` - a `object` that holds variables that can be interpolated in the content
(consult [Interpolating variables](#interpolating-variables) for details)

**`Shortcode.set(option, value)`**

Sets a particular option using given value.  
Returns: `undefined`.  
Parameters:
* `option` - a `string` representing a name of the option being set
* `value` - a `string` representing a value to set

The table below shows available options to set.

Option | Default value | Description
-------|---------------|------------
`attributeNameToCamelCase` | `true` | Whether to turn dash-case attribute name into camelCase, for example `sc-attr` into `scAttr`.


### Complete example

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>ShortcodeJS</title>
</head>

<body>
    <blockquote id="quotation">
        <p>We don't need another JavaScript framework. We need stuff like the [b]ShortcodeJS[/b] library.</p>
        <cite>~ @:author</cite>
    </blockquote>

    <script src="shortcode.js"></script>
    <script>
        Shortcode.register('b', function (attr, content) {
            return `<b>${content}</b>`;
        });

        var quotation = document.getElementById('quotation');
        quotation.innerHTML = Shortcode.parse(quotation.innerHTML, {author: 'A. Lincoln'});
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

### Interpolating variables

An input string can have assigned variables whose values will be inserted when parsing.
To indicate placeholder for a variable, it's necessary to use `@:name` or `@@:name` syntax.
There are two kinds of such variables:

* _pre-parsing_ - these variables will be interpolated before processing shortcodes (use `@@:name` syntax)
* _post-parsing_ - these variables will be interpolated after processing shortcodes (use `@:name` syntax)

Values of variables are being received from an object passed as a second parameter of the `parse()` method call.
The keys of the object are mapped to variable names used within an input string while while their values correspond to the
values of the object's properties with identical names.

In the code below, following steps are being done:
* `@@:textDecoration` is replaced with `b` string
* the input string with shortcodes embedded is processed
* `@:languageName` is replaced with `JavaScript`, `@:libraryName` is replaced with `ShortcodeJS`

```html
<p id="frame">
    Among @:languageName libraries worth to discover is [@@:textDecoration]@:libraryName[/@@:textDecoration].
</p>
```

```javascript
var frame = document.getElementById('frame');
frame.innerHTML = Shortcode.parse(frame.innerHTML, {
    textDecoration: 'bold' ? 'b' : 'u',
    languageName: 'JavaScript',
    libraryName: 'ShortcodeJS'
});

/*
    expected output:
    Among JavaScript libraries worth to discover is <b>ShortcodeJS</b>.
*/
```

As done in the code above, using pre-parsing variables is recommended mostly for things that can affect process of parsing a shortcode,
i.e., name of a shortcode or values that its attributes have assigned. Other values can be inserted after the shortcode parsing is
perfrormed; this is what post-parsing variables are meant to.

## Default attribute values

It may happen that your shortcode is to take a multiple of attributes of which not all are required.
In the case, default values should be guaranteed to be delivered.

>  
> **Note that attribute names must not contain uppercase characters as they will not be preserved.**  <br/><br/>
> Even if you use a shortcode like `[frame borderColor="red"]`, the `attr` object is to contain `bordercolor` property rather than `borderColor`.  <br/><br/>
> Still, you could use dash-case name, e.g. `[frame border-color="red"]`, in which case the respective property name can remain the same, i.e. `border-color` (keep in mind that such a name is required to be surrounded with quotes when accessed).
See [Combined attribute names](#combined-attribute-names) for details.
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

## Combined attribute names

By default, attribute names consisting of the words separated by dash are turning into the camelCase form to be accessed with the `attr` object in the shortcode callback (e.g. `sc-attr` -> `scAttr`). Why that happens is because the `attributeNameToCamelCase` setting is set to `true` by default. To keep attribute names dash-case set this option to `false` with `Shortcode.set()` method.

```javascript
Shortcode.set('attributeNameToCamelCase', false);
```

## Running out of browser

ShortcodeJS is supposed to run in browser environment that delivers the `window.document` object.
For environments like Node.js (without the `document` object by default), function returning ShortcodeJS API is provided - this function takes appropriate `document` object that can be derived from an external library like [jsdom](https://github.com/jsdom/jsdom).

```javascript
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('<!DOCTYPE html></html>');
    const { document } = dom.window;
    const Shortcode = require('./shortcode')(document);

    // ...
```
