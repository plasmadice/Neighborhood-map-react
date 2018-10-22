# Udacity Neighborhood Map Project Overview
This is the final project for the Udacity Grow With Google scholarship course. It demonstrates quite a few things. Most notably accessibility, usability, and responsiveness. The app works on all modern devices and can be navigated with a screen reader. I decided to try `window.innerWidth` instead of media queries for responsiveness.

## How it Works // Getting Started
To start: Clone this repository and `cd` into the root folder.
##### -For a development build
Run `npm install` to get the required dependencies followed by `npm start`.
##### -For a production build
`npm install -g serve` to get a static server.
Run `npm build` to get a production build followed by `serve -s build`

## Credit
APIs used: [Google Maps](https://cloud.google.com/maps-platform/) && [Foursquare](https://foursquare.com)
[Burger Menu](https://negomi.github.io/react-burger-menu/)
[Tutorial Source](https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/): Ended up not using this, but was still very informative nonetheless
Filter button styles from [BestCSSButtonGenerator](https://www.bestcssbuttongenerator.com/)