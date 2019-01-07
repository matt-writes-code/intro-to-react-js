---
title: React Testing
path: '/react-testing'
---

# React Testing

Testing used to be something that requires a lot efforts to setup, because there are a few moving parts for you to write tests:

1. test runner (the code that will extract all the test code from your code and run them, generate and display test results)
1. assertion library (the utilities for you to make assertion about your result)
1. mocking and spying (in a real-world application, you would definitely need mocking whenever there are indeterminate functionlities or it's expensive to setup end-to-end application)
1. test coverage reports
1. provide a browser or browser-like environment

However, thanks to [Jest], all of these are included in single library with minimal configuration.

## Setup Jest

To setup Jest for our application:

1. run `npm install -D jest babel-jest babel-core@7.0.0-bridge.0`
1. add a `test` npm script in `package.json`

   ```json
   ...
   "test": "jest"
   ...
   ```

Now you're good to go to write your test and run them.

## Testing Javascript (not React specific)

Let's start with writing test for javascript function.

Once you get an idea of how to test javascript, then we will go through how to test React component.

### Creating utility function to generate className

A common utility that you would need when writing React is to generate className to be attached to DOM element for styling based on props.

The offical packages to do that is a package known as [classnames], however, for the sake of learning let's write it as our own code.

Create a file `lib.js` with the content from [this gist](https://gist.github.com/malcolm-kee/30cd26b80c5f45e443ae44dd5a3b4f01).

- `classNames` is a function that take any number of arguments, and join them together as a string. Only string and number will be included in final results and falsy value will be excluded. String will be flattened
- Example usage:

  ```js
  // simple usage
  classNames('btn', 'btn--default'); // 'btn btn--default'

  // use ternary expression as falsy value will be ignored
  classNames('btn', true && 'btn--default', false && 'btn--raised', null); // 'btn btn--default'

  // you may pass down array if you wish, and it will be flattened
  classNames(['btn', null, 'btn--default']); // 'btn btn--default'
  ```

### Create test for the utility function

Let's write unit test for the utility function.

Create a file `lib.test.js` next to `lib.js`. Write the following test case as per usage above.

```js
import { classNames } from './lib.js';

test('classNames', () => {
  expect(classNames('btn', 'btn--default')).toBe('btn btn--default');
  expect(
    classNames('btn', true && 'btn--default', false && 'btn--raised', null)
  ).toBe('btn btn--default');
  expect(classNames(['btn', null, 'btn--default'])).toBe('btn btn--default');
});
```

Now when you run `npm run test`, you should be able to see the following output:

```bash
 PASS  src/lib.test.js
  √ classNames (5ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.789s, estimated 2s
Ran all test suites.
```

Congratulations! You just written your first test.

- By default, jest will look for any files that is inside folder `__test__` or file name end with `.test.js` or `spec.js`. Therefore by naming the file as `lib.test.js`, the file will be treated as test file that jest need to run. I recommend to place the test file next to the code that it's testing with the naming convention `<code-under-test>.test.js`, so that it's clear on the purpose of the test, and what code has test associated with it.
- When jest run the test file, it will injects few variables globally, e.g. `test` and `expect`.
- `test` is used to wrap your unit test and give it a name. When your test fails, the test name will be displayed in the console.
- `expect` is used to assert the result of your test. Common usages are:

  - `expect(result).toBe(expectedValue)` (use `===` for equality check)
  - `expect(result).toEqual(expectedValue)` (recursively check for equality for objecy)
  - `expect(result).toBeDefined()` (equivalent to `expect(result).not.toBe(undefined)`)

    Read through the [Jest expect docs][jest-expect] to get an idea of the supported assertions.

## Additional Configurations of Jest

Let's explore some common configurations when using Jest.

### Fix ESLint Error

You may realize that ESLint is showing error in your test file that `'test' is not defined` and `'expect' is not defined`. However, to fix that error is just a line of code. Update your `.eslintrc` file `env` properties:

```json
...
"env": {
    "es6": true,
    "browser": true,
    "node": true,
    "jest": true
}
...
```

Now the error should be gone now.

### Watch mode

It's common that you may want to keep Jest in watch mode while writing tests, so any change of the test will trigger a re-run and ensure the test is passed.

To run jest in watch mode:

1. add a new npm script: `"test:watch": "jest --watch"`
1. run `npm run test:watch`
1. explore the watch mode options (`p` to filter filename, `t` to filter test name)

### Code Coverage Reports

You may want to explore how many of your code is covered.

To generate code coverage report:

1. add a new npm script: `"test:coverage": "jest --coverage"`
1. run `npm run test:coverage`
1. explore the `coverage/lcov-report` folder that has been generated. Open the `index.html` file with your browser.

<hr >

## :pencil: Do It: configure Jest and write unit tests

1. install Jest as described and configure your npm scripts.
1. copy the utility code as provided and write the tests to test the function.
1. run `npm run test` and verify that the tests are passed.
1. fix ESLint error as described
1. run test in watch mode as described
1. generate code coverage report as described
1. (optional) write unit tests for the function `joinString`.

<hr >

## Testing React Components

Before we start writing tests for React components, let's take a step back and discuss how we organize a test.

When writing tests for a function, it is mostly about asserting the returns of the function given a specific parameters. The convention is `given X, when Y, then Z`. Given parameters of 'btn' and 'btn--default', when run `classNames`, then it will returns the result of `'btn btn--default'`.

There is no difference when writing tests for React Components. The difference of React components is that the output of the component is not returned to us, but being passed to `ReactDOM` to decide what to append/update in the DOM.

Let's explore how to do that.

### Write React Component test

We will write test for `busy-container.js`. But before that, let's modify `BusyContainer` slightly:

```jsx
import React from 'react';

export const BusyContainer = ({ isLoading, children }) => (
  <div>
    {isLoading && <span data-testid="loading-indicator">loading...</span>}
    {children}
  </div>
);
```

> `data-testid` attribute is a common convention to add "hook" to DOM for automated testing.

Let's create a file `busy-container.test.js` next to `busy-container.js` with the following contents:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BusyContainer } from './busy-container';

describe('BusyContainer', () => {
  it('is defined', () => {
    expect(BusyContainer).toBeDefined();
  });

  it('renders loading indicator when props is loading', () => {
    // Thanks to JSDOM (included part of jest, we have access to browser object like document)
    const div = document.createElement('div');
    document.body.appendChild(div);

    ReactDOM.render(
      <BusyContainer isLoading={true}>
        <div id="children">Hello Test</div>
      </BusyContainer>,
      div
    );

    const loadingIndicator = div.querySelector(
      '[data-testid="loading-indicator"]'
    );

    expect(loadingIndicator).toBeDefined();

    // cleanup after test is done
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('not renders loading indicator when props loading = false', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    ReactDOM.render(
      <BusyContainer isLoading={false}>
        <div id="children">Hello Test</div>
      </BusyContainer>,
      div
    );

    const loadingIndicator = div.querySelector(
      '[data-testid="loading-indicator"]'
    );

    expect(loadingIndicator).toBe(null);

    // cleanup after test is done
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });
});
```

- As Jest will run the test in [jsdom] (a environment to be run in NodeJS that supports many features listed in web standards), so we have access to DOM API like `document.createElement` and `document.body.appendChild`.
- For each test, we need to
  - setup our DOM by creating a div and append to body, then we use `ReactDOM` to render our components
  - use `querySelector` to check the current state of the DOM and assert it.
  - unmount the component with `ReactDOM.unmountComponentAtNode`, then remove the container from the body

As the setup and cleanup are required and similar for all tests, there are a library that already implements them with a bunch of helpers. The library name is [`react-testing-library`][react-testing-library] (surprise, surprise!). Let's install that:

`npm install -D react-testing-library`

Let's change `busy-container.test.js` to the following:

```jsx
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { BusyContainer } from './busy-container';

afterEach(cleanup);

describe('BusyContainer', () => {
  it('is defined', () => {
    expect(BusyContainer).toBeDefined();
  });

  it('renders loading indicator when props is loading', () => {
    const { getByTestId } = render(
      <BusyContainer isLoading={true}>
        <div id="children">Hello Test</div>
      </BusyContainer>
    );

    const loadingIndicator = getByTestId('loading-indicator');

    expect(loadingIndicator).toBeDefined();
  });

  it('not renders loading indicator when props loading = false', () => {
    const { queryByTestId } = render(
      <BusyContainer isLoading={false}>
        <div id="children">Hello Test</div>
      </BusyContainer>
    );

    const loadingIndicator = queryByTestId('loading-indicator');

    expect(loadingIndicator).toBe(null);
  });
});
```

- `cleanup` will perform the cleanup step of unmount component and remove container that we did manually previously.
- `render` will create a container and mount our component in the container, as we did manually previously.
- `render` will also returns a few helpers for us to query the DOM. In our case, we use `getByTestId` and `queryByTestId`, which is `querySelector('[data-testid="${testId}"]')` (the difference between the two is `getByTestId` will throws error if no result returns while `queryByTestId` will not throw error and returns `null`). For a full list of supported queries, refer to the [`react-testing-library` Queries docs][react-testing-library-queries].

<hr >

## :pencil: Do It: write React component test

1. install `react-testing-library` as described.
1. modify `BusyContainer` and write the test for it.
1. ensure all the tests are passed

<hr >

[jest]: https://jestjs.io/en/
[classnames]: https://www.npmjs.com/package/classnames
[jest-expect]: https://jestjs.io/docs/en/expect
[react-testing-library]: https://testing-library.com/react
[jsdom]: https://github.com/jsdom/jsdom
[react-testing-library-queries]: https://testing-library.com/docs/api-queries