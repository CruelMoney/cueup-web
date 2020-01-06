# Cueup Web Project


## TOC

-   [Features](#features)
-   [Usage](#usage)
-   [Structure](#structure)


## Features

This project has out-of-the-box support for the following things:

-   General Setup
    -   🔥 Babel 7
    -   📦 Webpack 4
    -   🔥 ESLint 5 (with a set of custom rules which may be mostly identical to AirBnB with some personal flavor added)
    -   🔥 TypeScript (via Babel)
    -   🔥 Prettier
    -   🔥 Jest 24
    -   🐐 React Testing Library
    -   ✅ Server Side Rendering with Express
    -   ✅ Hot Module Reloading (HMR)
    -   ✅ CSS Modules
    -   ✅ PostCSS
    -   ✅ Precommit hooks via lint-staged + Husky
    -   ✅ Optional static deployment without the need for Node.js on the server
    -   📕 Support for [Storybook](https://storybook.js.org/) (>= 5.0.0)
    -   ✅ code splitting via @loadable/component
    -   ✅ caching SSR

*   Libs and Dependencies 
    -   ⚛ React 16.x (latest), with Hooks!
    -   ✅ i18.js
    -   ✅ Apollo
    -   ✅ React Router 5
    -   ✅ React Helmet
    -   ✅ Styled Components 💅
    -   ✅ Redis


## Usage

There are npm scripts for all the relevant things. The server will always be started on port 8500 unless otherwise specified in `process.env.PORT`. You can use a `.env` file to specify env vars. If you want to use them in your client side code, don't forget to add them in [config/env.js](config/env.js#L37).

### Noteworthy scripts:

#### `yarn start:dev`

Starts the app in development mode: creates a new client and server dev build using webpack, starts the Express server build (for both file serving and server side pre-rendering) and keeps webpack open in watchmode. Updates the app (if possible) on change using HMR.

#### `yarn start`

Starts the compiled app in production mode.

#### `yarn build`

Creates a new build, optimized for production. Does **not** start a dev server or anything else.

#### `yarn test`

Run all tests using jest.

#### `yarn test:update`

Update all Jest snapshots (if there are any)

#### `yarn lint:js`

Run ESLint for all JavaScript and TypeScript files

#### `yarn lint:css`

Run Stylelint for all CSS files

#### `yarn lint`

Run lint:js and lint:css in parallel

#### `yarn analyze`

Starts `webpack-bundle-analyzer` to give you the opportunity to analyze your bundle(s)

#### `yarn depgraph`

Creates an image of your dependency graph. Requires [GraphVIZ](https://www.graphviz.org/) to be in your system's `PATH`

#### `yarn plop`

Run plop to create new React components or Redux reducers via CLI

## Environment Variables

There are a few environment variables you can set to adjust the setup to your needs

| Variable         | Default            | Description                                                                                                                                                                                                                                                                                      |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PORT`           | `8500`             | Port number your application will be served on.                                                                                                                                                                                                                                                  |
| `HOST`           | `http://localhost` | Host (including protocol!) your application will be served on. This is usually neglectable as most of the time your application will be served via remote proxy (e.g. Nginx) on localhost. **Note:** this is only for convenience. The server itself will not be bound exclusively to that host. |
| `DEVSERVER_HOST` | `http://localhost` | Optional. Different host for the Webpack Dev Server to be served on.                                                                                                                                                                                                                             |
| `REDIS_URL`      | null | Optional, will connect to default redis url.                                                                                                                                                                                                                            |

## Structure


```
project
│   .env
│   tsconfig.json
│   ...
|
└───public (public files that can be reached on the domain)
└───src
    └───client (code only running in the browser)
    |   │   polyfills.js
    |   └   ...
    |
    └───server (server code, mostly SSR stuff)
    |
    └───shared (main app, most code goes here)
        |   │   App.js (add new routes here)
        |   └   ...
        |
        └───actions (DEPRECATED -old redux actions)
        └───assets (TODO structure)
        └───components (Shared code between views, TODO more structure)
        |   |   Blocks.js (Row, Col, etc. for layout)
        |   |   Text.js  (Title, Header, Body etc.)
        |   |   GracefullImage.js  (Lazy loaded image used most places)
        |   |   ...
        |   |
        |   └───common
        |   └───graphics (illustrations made as .js)
        |   └───higher-order
        |   └───hooks
        |
        └───constants (API keys, domains and project enums)
        |   └───content (translations of content)
        |       |   routes.json (add new routes here)
        |       └   ...
        |
        └───css (DEPRECATED use styled-components and if necessary put include .css asset in component folder)
        └───reducers (DEPCRECATED not using redux anymore)
        └───routes (main content, each route should be lazy loaded)
        └───utils

```