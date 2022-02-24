# Virgo
Virgo is a JavaScript library built to help developing modern web applications faster and easier.

## Getting Started

First, you need to include the bundled CSS file inside `<head>` tag:
```html
<link rel="stylesheet" href="https://unpkg.com/@bahtera/virgo/dist/virgo.bundle.min.css">
```
Then, include the bundled JS file just before the closing of `</body>` tag:
```html
<script src="https://unpkg.com/@bahtera/virgo/dist/virgo.bundle.min.js"></script>
```
Virgo is ready to launch.

## Usage

Using Virgo is easy. If you know HTML, then you know Virgo. It leverages your knowledge about Web and its technology and doesn't try to force you to learn new concepts.

For example, to create a datepicker input inside a form with default configuration, you can do it with basic and valid HTML:

```html
<form>
	<input type="datepicker" name="birthdate" data-label="Your Birthdate">
</form>
```

That script will transform standard HTML date input and provide datepicker component that works accross the browsers. `data-label` attribute is optional, but it will give you a label above the input box –automagically.

For more interesting things about what you can do with Virgo, visit the documentation site on https://virgo.netlify.app/.

## Working with Frameworks

We are going to implement integrations with Angular, ReactJS, VueJS, and Svelte in near future. So, stay tuned!

## License

Virgo is licensed under **MIT License**, which means it is available for:
- Commercial Use
- Re-Distribution
- Modification
- Private Use

without any charge. But we encourage you to contribute in development, or support us financially if this library is helpful. Spreading good words on Virgo inside your communities is also appreciated.
