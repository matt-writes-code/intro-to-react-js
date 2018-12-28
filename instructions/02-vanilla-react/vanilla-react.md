---
title: Vanilla React
path: '/vanilla-react'
---

# Vanilla React

We will start learning React by using React with vanilla JS - which means we will not include any tooling first, and only code with a simple HTML file and a script tag.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="stylesheet" href="./style.css" />
    <title>React Movie App</title>
  </head>

  <body>
    <div id="root">not rendered</div>
    <script src="https://unpkg.com/react@16.4.1/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16.4.1/umd/react-dom.development.js"></script>
    <script>
      // Your code goes here
    </script>
  </body>
</html>
```

In the `<script>` tag, add the following code

```js
const App = function() {
  return React.createElement(
    'div',
    {},
    React.createElement('h1', {}, 'React Movie App')
  );
};

ReactDOM.render(React.createElement(App), document.getElementById('root'));
```

- We create a component, call it as `App`. React is all about creating component, and a component can be as simple as a function.
- There are two types of component - function component & class component. This is a function component.
- A component must return markup, which is generated by `React.createElement`.
- `React.createElement` is a function that takes three parameters: component type, properties, and children. For HTML element and web component, the component type would be a string.
- `ReactDOM.render` is used to mount our `App` component to the HTML. In this case, a div with id `root`.
- Notice we're using `React.createElement` with `App` as a parameter to `ReactDOM.render`. We need an instance of App to render out. App is a class of components and we need to render one instance of App. That's what `React.createElement` does: it makes an instance of a component.
- A React component is not a markup itself; it is a markup generator.

<hr >

## :pencil: Do It: Type the code

1. Create a file and name it as `index.html`.
1. Add the code above in the file.

<hr >

Modify your code, so that it becomes

```js
const Movie = () =>
  React.createElement('div', {}, [
    React.createElement('h1', {}, 'Aquaman'),
    React.createElement('h2', {}, '2018-12-07')
  ]);

const App = function() {
  return React.createElement('div', {}, [
    React.createElement('h1', {}, 'React Movie App'),
    React.createElement(Movie),
    React.createElement(Movie),
    React.createElement(Movie)
  ]);
};

ReactDOM.render(React.createElement(App), document.getElementById('root'));
```

- to make an element to have multiple children, just pass it an array of elements.
- `Movie` is our second component. I use [arrow function][arrow-function] syntax here, which will have an implicit return if the function body is a single expression
- We can have multiple `Movie` instances by calling `React.createElement` multiple times!
- If you're seeing console warning about keys, ignore it for now.

<hr >

We have multiple movies but it's not very useful component yet, since not all movies has name Aquaman. Let's make Movie component a bit more useful.

```js
const Movie = props =>
  React.createElement('div', {}, [
    React.createElement('h1', {}, props.name),
    React.createElement('h2', {}, props.releaseDate)
  ]);

const App = function() {
  return React.createElement('div', {}, [
    React.createElement('h1', {}, 'React Movie App'),
    React.createElement('h1', {}, 'React Movie App'),
    React.createElement(Movie, {
      name: 'Aquaman',
      releaseDate: '2018-12-07'
    }),
    React.createElement(Movie, {
      name: 'Bumblebee',
      releaseDate: '2018-12-15'
    }),
    React.createElement(Movie, {
      name: 'Fantastic Beasts: The Crimes of Grindelwald',
      releaseDate: '2018-11-14'
    })
  ]);
};

ReactDOM.render(React.createElement(App), document.getElementById('root'));
```

- Now `Movie` is a more flexible component that accepts props from its parent.
- `props` are variables that parent component (`App`) pass to its children (`Movie`).

<hr >

As mentioned before, there are 2 types of component - function component and class component. Let's convert `App` to class component.

```js
class App extends React.Component {
  render() {
    return React.createElement('div', {}, [
      React.createElement('h1', {}, 'React Movie App'),
      React.createElement(Movie, {
        name: 'Aquaman',
        releaseDate: '2018-12-07'
      }),
      React.createElement(Movie, {
        name: 'Bumblebee',
        releaseDate: '2018-12-15'
      }),
      React.createElement(Movie, {
        name: 'Fantastic Beasts: The Crimes of Grindelwald',
        releaseDate: '2018-11-14'
      })
    ]);
  }
}
```

- `App` is functionally same as before. However, a class component unlocks more powers, like having state and defining lifecycle methods, which will be explained later.
- Each class component must have a `render` method, which must return the result of `React.createElement` call.
- For function component, props are available as first parameter of the function. For class component, props are available via `this.props`.
- Both function component and render method of class component must be pure function, i.e.:
  - given the same input, it always return the same output (markup)
  - it does not have any side effect - you should not make ajax call / add event listener here.
- So, when you should make an ajax call in a React app? That will be answered in part 3 of this course. But before that, let's dive into the tooling around React.

<hr >

## :pencil: Do It: Create your Movie Component

1. Add `Movie` component in your code and use it as explained above.
1. Modify your `App` component to a class component
1. (Bonus) Add a new props `genres` in your `Movie` component and render it in a `span` tag.

<hr >

[arrow-function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions