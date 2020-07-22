# Hunt-The-Wumpus BabylonJS Edition

Hunt-The-Wumpus is a [adventure game invented in 1973](https://en.wikipedia.org/wiki/Hunt_the_Wumpus).   It is used today as a local mentor project in high schools to inspire and showcase what real computer science projects look like to Juniors and Seniors.  By building a game !

The mentor project is sponsored by Microsoft, details [here](http://aka.ms/wumpus/).

This repo is a teaching sample on how to make the game to spec, using Babylon.JS

## Tutorial this project was inspired on

The project is inspired and based from [this blog post tutortial](https://docs.microsoft.com/en-us/archive/blogs/davrous/coding4fun-tutorial-creating-a-3d-webgl-procedural-qrcode-maze-with-babylon-js) from David Rousset.    That step by step tutorial can help people understand some of how this project is built.   How it works, and has a step by step guide on some of the details like cloning, canvas, physics, and camera animations.

I have modified that project from a QR code valentines day maze, into a traditional hunt the wumpus.

I have also updated it from the tutorial to use the latest drops of the Babylon.js 3D game engine from [here](https://github.com/BabylonJS/Babylon.js) and the cannon.js physics engine from [here](https://github.com/schteppe/cannon.js/)

## Getting started

To get started with this project first clone the repo.

### Tools
Then get the following tools:

  - [**Visual Studio Code**](https://code.visualstudio.com/).  This is a great lightweight free code editors. It will do debugging, and GIT source control all built in.
  - [**LiveServer vscode extension**](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).   This is an extension that will fire up a lightweight web server on your local machine in order to run the web app from.
  - [**ChromeDebugger vscode extension**](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome).  This is an extension that will allow you to easily debug all of your code.

### Development workflow
Once you have all of that setup, your workflow is something like this.

  1. Write some code.
  2. Make sure the LiveServer is running your local web server.
  3. Point your browser to http://127.0.0.1:5500/ to run the app
  4. Set breakpoints and run the ChromeDebugger to debug your code.
  5. Rinse and repeat.

### Publishing
This github project is also linked to a Azure static website build process.  It will automatically build and snap to any changes in the master branch.   The web game is automatically published here:

 - https://lively-sea-0f3ffb20f.azurestaticapps.net/

## Game controls

 - At the start of the game you are dropped into a random room.
 - You move around the maze using the up-down-left-right keys.   
 - You can zoom out for a bird-eye-view by tapping the space key.