# Nostalgic Music Player

This project will allow for users to watch some of their favorite songs come to life! The Nostalgia Media Player was inspired by Windows Media Player's Visualization feature which provided cool animations to sound files. Our project contains 7 popular songs and allows the user to choose from any one of them. Then it visualizes those songs with the help of our Spotify Data dataset. The visualizations include a 3D shape, a wave in the background, and differing colors for these objects and the background. For songs that have higher danceability scores, the object distorts and “bubbles” faster. For more energetic songs, the bubbles grow on the object. For higher valence, the visualization includes brighter and "happier" colors.  For loudness, the wave in the background grows or shrinks in size. For now we utilize an icosahedron as our main object. However, in the future we plan on Spotify compatibility, adding different shapes and allowing for more interactions with the user.


[Online Demo](https://bributler927.github.io/nostalgic_music_player/)

## Installation
To build this project, you will need to use GitHub's NodeJS Package Manager (npm) to manage and install project dependencies. All npm settings, as well as your project dependencies and their versionings, are defined in the file `package.json`. We will unpack this file in the next section.

The NodeJS Package Manager, which is the world's largest software registry and supports over one million open source JavaScript packages and libraries, runs in a NodeJS runtime. The NodeJS runtime is essentially a port of Google Chrome's JavaScript V8 engine that will run directly in your terminal (instead of within a browser).

Before you begin, you will need to install [NodeJS and npm](https://www.npmjs.com/get-npm). Then, open a new terminal instance, set your working directory to the root of the project, and run `npm install`.


## Launching a Local Webserver
Now that your development environment is ready to go, you can spin up a local development webserver using `npm start`. This command will bundle the project code and start a development server at [http://localhost:8080/](http://localhost:8080/). Visit this in your web browser.


## Building the Project for the Web
Once you are happy with your project, try building a production bundle using `npm run build`. This will place an optimized and minified executable version of your project in the `./build/` directory. Test out this production build by setting `./build/` as your working directory and starting out a python server.

Once you have a working production build and are ready for the site to go live, you can deploy your project straight to GitHub Pages via `npm run deploy`. Note that this requires that (1) your project is part of a repository, and (2) you have correctly set up your project's `package.json` file.

## CC Attributes and Credits

This skeleton project was adapted from [edwinwebb's ThreeJS seed project](https://github.com/edwinwebb/three-seed]) by Reilly Bova ’20.

## License
[MIT](./LICENSE)
