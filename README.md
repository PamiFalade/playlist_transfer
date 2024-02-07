##Things I've Learned
* Different types of loops have different levels of performance
** forEach loops are 6 times slower than do-while loops, and 4 times slower than for loops and while loops
* Working with API's, asynchronous functions
** I often ran into the error of data that was being returned from a function being "undefined", so it would break the code. 
*** I often solved this by making the functions async methods, but this can sometimes be solved by just making the function a callback function. (https://blog.learnhub.africa/2023/07/24/what-is-asynchronous-javascript/) 
*** It is probably better to use a callback function instead of async functions for simple asynchronous tasks/events, where there's no chance of failure and error messages in the way that API's can return. E.g., use a callback for the extractSongInfo() methods, instead of making them async functions.
*** Callback functions are also suitable for dealing with legacy code or specific Node.js APIs that require callbacks.
*** Promises are definitely better for managing multiple asynchronous operations thanks to their chainable syntax; this helps us avoid "callback hell" (this refers to how error handling in callbacks can be complex, which leads to nested callbacks).
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
* Data attributes
** (https://www.youtube.com/watch?v=Xk12JtYG8rw&ab_channel=EnvatoTuts%2B, ~17:15)
* useState, useEffect, useRef
** I use useState a lot in this project to keep track of data that needs to be displayed and is prone to change, so it will need to be updated in the DOM. Examples: the playlist information, the account information, the cue for showing the loading symbol. 
** I use useEffect a few times to run a function as a side effect to a value changing. For example, the side effect of the source platform or the submitted playlist ID being changed, which happens once you submit the link to the playlist in the Landing page and navigate to the PlaylistConfirm page, is that the loadPlaylist() method is run immediately. It's also used to trigger a side effect once you navigate back to the DestinationSelect page after granting the web app permission. The side effect of having the access token in the URL is that the user's account information is retrieved.
** I use useRef to regulate how many characters the displayed name of the song and artists can be in the TracklistDisplay. This hook allows me to make a reference to the appropriate DOM element, so that I can access its width property through the Javascript code. This is a value that would not cause a re-render, hence it is best handled with a useRef hook.
* CSS Best Practice: Make elements' styling depend on the parents
** This makes it easier to reuse components in different settings
* Media queries
** Media queries are used to check certain attributes, such as the size of the viewport, orientation of the viewport (portrait or landscape), resolution, and more.
** Media queries can help you design the website so that it is responsive to such things.
** I used media queries to check if system's color theme. It defaults the color theme of the web app based on the user's device setting.
** Media queries are originally a CSS feature, but can be used in JavaScript using the window.matchMedia() method.
