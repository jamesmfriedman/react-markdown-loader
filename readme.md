React Markdown
==================

Webpack loader that parses markdown files and converts them to a React Stateless Component.
This has been forked from [javiercf/react-markdown-loader](javiercf/react-markdown-loader) and retains all of the original functionality, but adds a few needed features.

We developed this loader to make the process of creating styleguides for
React components easier.

## Usage

````markdown
# Write your markdown like you normally would

You can render code in a few ways

This will render code using PrismJS and also include a live JSX example above the code.
This most closely reflects the original libraries pattern.
Any import statement will be hoisted to the scope of the document.

```jsx render
import { Button } from 'rmwc/Button';

<Button>Hello World</Button>
```
````

````markdown
This will just render a code block using Prism
```jsx
import { Button } from 'rmwc/Button';

<Button>Hello World</Button>
```
````

````markdown
This will only render the example, without the associated code block
```jsx renderOnly
import { Button } from 'rmwc/Button';

<Button>Hello World</Button>
```
````

*webpack.config.js*
```js
module: {
  loaders: [
    {
      test: /\.md$/,
      loader: 'babel!react-markdown'
    }
  ]
}
```

*hello-world.js*
```js
import React, { PropTypes } from 'react';
import MyMarkdownFile from './path/to/markdown';

/**
 * HelloWorld
 * @param {Object} props React props
 * @returns {JSX} template
 */
export default function HelloWorld(props) {
  return <MyMarkdownFile />
}
```
