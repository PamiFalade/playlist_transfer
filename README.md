# Getting Started with Create React App

##Things I've Learned
* Different types of loops have different levels of performance
** forEach loops are 6 times slower than do-while loops, and 4 times slower than for loops and while loops
* Working with API's, asynchronous functions
** Using the await keyword does not work in a forEach loop. It needs to be at the "top level." You can use it in a for loop though.
** If you are getting a value that is returned from an asynchronous function, it will be received as a Promise. To unravel the Promise so you get the actual data you need, you need to put the 'await' keyword before the function call. 
* Arrow functions vs normal functions (https://www.youtube.com/watch?v=5iGGvJn8K1U&ab_channel=WebDevSimplified)
* Hoisting functions (https://stackoverflow.com/questions/33040703/proper-use-of-const-for-defining-functions)
** This is why it may be preferable to use normal functions instead of arrow functions. Arrow functions act like normal variables, so they don't exhibit any hoisting behaviour, so they must be defined before the actual code that uses them.
* let vs. const for member variable declarations
** Using const makes it so that the function does not modify the object 
* Can't use the "continue" to skip iterations in a forEach loop, like you can in a for, while, and do-while loop. Instead, use "return"
* Animating CSS Grid (https://css-tricks.com/animating-css-grid-how-to-examples/)
** Seems to only work for columns, not rows.
** Transitions won't work if you declare the columns using repeat(). Need to manually define each column.  

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
