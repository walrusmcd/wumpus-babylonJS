"use strict";

// Size of a cube/block
var BLOCK_SIZE = 8;
var ROOM_WIDTH = 32;
var WALL_WIDTH = 16;
var WALL_HEIGHT = 8;
var MARGIN = 1;

var GROUND_WIDTH = ((Cave.COLS*2)-1) * WALL_WIDTH;  // 11
var GROUND_HEIGHT = ((Cave.ROWS*2)+2) * WALL_WIDTH; // 12

// Are we inside the labyrinth or looking at the QR Code in zoom out?
var birdsEyeView = false;
var freeCamera, canvas, engine, scene;
var camPositionInLabyrinth = null, camRotationInLabyrinth = null;
var ground;
var mainWall, halfWall, doorWall;
var doorWalls = [];
// game text controls
var textCoins, textScore, textRoomNumber, textStatus;

var gameControl;

// coordinate space: 0,0 is in the middle of the entire ground space
function getCenterOfRoom(roomNumber){
    // js is all floats, make sure someone doesn't pass us in a float (round down)
    roomNumber = Math.floor(roomNumber);
    // which column and row are we in?
    var col = Cave.getRoomCol(roomNumber);
    var row = Cave.getRoomRow(roomNumber);
    // these are from birdseye (left + top)
    var groundLeft = GROUND_WIDTH / 2 * -1;
    var groupTop = GROUND_HEIGHT / 2;
    // cheat sheet on how to find the center "X" based on number of wall widths
    // { col, number of widths }
    // { 1, 2   }
    // { 2, 3.5 }
    // { 3, 5   }
    // { 4, 6.5 }
    // { 5, 8   }
    // { 6, 9.5 }
    var xPos = groundLeft + WALL_WIDTH + ((1 + (1.5 * (col-1))) * 15);
    // cheat sheet on how to find the center "Z" based on number of wall widths
    // { row, number of widths }
    // { 1, 2  } 1
    // { 2, 4  } 3
    // { 3, 6  } 5
    // { 4, 8  } 7
    // { 5, 10 } 9
    var zPos = groupTop - 36 - ((row-1) * 26); // WALL_WIDTH
    // odd columns are shifted down a bit
    var oddCol = col % 2;
    if (!oddCol) {
        zPos -= 13;
    }
    // x, y, z
    var position = new BABYLON.Vector3(xPos, 0, zPos);
    return position;
}

function cloneWall(wall, position = null, deltaX = null, deltaZ = null, rotationY = null) {
    var clone = wall.clone();
    clone.position = position.clone();
    clone.position.x += deltaX;
    clone.position.z += deltaZ;
    if (rotationY != null)
        clone.rotation.y = rotationY;
}

// makes 6 walls, used "half walls" if there is a door
function createRoom(roomNumber, doors) {
    // get the center of the room
    var wallPosition = getCenterOfRoom(roomNumber);
    // the "center" of the wall is raised off the floor a bit
    wallPosition.y = WALL_HEIGHT / 2;
    // 0 is the "top" wall
    if (!doors[0]) {
        // clone a wall
        cloneWall(mainWall, wallPosition, 0, 13);
    } else {
        // clone a half wall
        cloneWall(halfWall, wallPosition, -5, 13);
        // clone a door
        doorWalls.push(cloneWall(doorWall, wallPosition, 0, 13));
        // clone another half wall
        cloneWall(halfWall, wallPosition, 5, 13);
    }
    // 1 is the next wall on the right (clockwise)
    if (!doors[1]) {
        // clone a wall, hexagon, each side is 120(d)
        cloneWall(mainWall, wallPosition, 11.25, 6.5, Math.PI / 3);
    } else {
        // clone a half wall
        cloneWall(halfWall, wallPosition, 8.65, 11, Math.PI / 3);
        // clone a door
        doorWalls.push(cloneWall(doorWall, wallPosition, 11.25, 6.5, Math.PI / 3));
        // clone another half wall
        cloneWall(halfWall, wallPosition, 13.85, 2, Math.PI / 3);
    }
    if (!doors[2]) {
        // clone a wall
        cloneWall(mainWall, wallPosition, 11.25, -6.5, Math.PI * 2 / 3);
    }
    if (!doors[3]) {
        // clone a wall
        cloneWall(mainWall, wallPosition, 0, -13);
    } else {
        // clone a half wall
        cloneWall(halfWall, wallPosition, -5, -13);
        // clone a door
        doorWalls.push(cloneWall(doorWall, wallPosition, 0, -13));
        // clone another half wall
        cloneWall(halfWall, wallPosition, 5, -13);
    }
    if (!doors[4]) {
        // clone a wall
        cloneWall(mainWall, wallPosition, -11.25, -6.5, Math.PI / 3);
    }
    if (!doors[5]) {
        // clone a wall
        cloneWall(mainWall, wallPosition, -11.25, 6.5, Math.PI * 2 / 3);
    } else {
        // clone a half wall
        cloneWall(halfWall, wallPosition, -8.65, 11, Math.PI * 2 / 3);
        // clone a door
        doorWalls.push(cloneWall(doorWall, wallPosition, -11.25, 6.5, Math.PI * 2 / 3));
        // clone another half wall
        cloneWall(halfWall, wallPosition, -13.85, 2, Math.PI * 2 / 3);
    }
}

var mainMusic, pitMusic, wumpusMusic;
function playSound() {
    // Load the sound and play it automatically once ready
    mainMusic = new BABYLON.Sound("Music", "/assets/POL-cave-dripping.wav", scene, null, {
        loop: true,
        autoplay: true
    });
}

function createScene() {
    //number of module count or cube in width/height
    //var mCount = 33;
    // It needs a HTML element to work with
    // needed to set the proper size of the playground
    //var mCount = qrcode._oQRCode.moduleCount;
    var mCount = 30;

    scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    //scene.enablePhysics(new BABYLON.Vector3(0, 0, 0));
    //scene.gravity = new BABYLON.Vector3(0, -0.8, 0);
    scene.collisionsEnabled = true;

    freeCamera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 5, 0), scene);
    freeCamera.minZ = 1;
    freeCamera.checkCollisions = true;
    freeCamera.applyGravity = true;
    freeCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    // create the basics of the environment
    scene.createDefaultEnvironment({createSkybox: false, createGround:false});

    // Ground
    var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.emissiveTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_d100.jpg", scene);
    // for more on how UV scaling works , here https://doc.babylonjs.com/how_to/more_materials#tiling
    groundMaterial.emissiveTexture.uScale = mCount;
    groundMaterial.emissiveTexture.vScale = mCount;
    groundMaterial.bumpTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_b010.jpg", scene);
    groundMaterial.bumpTexture.uScale = mCount;
    groundMaterial.bumpTexture.vScale = mCount;
    groundMaterial.specularTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_s100-g100-r100.jpg", scene);
    groundMaterial.specularTexture.uScale = mCount;
    groundMaterial.specularTexture.vScale = mCount;

    ground = BABYLON.Mesh.CreateGround(
        "ground",       // name
        GROUND_WIDTH,   // width
        GROUND_HEIGHT,  // height
        1,              // subdivisions
        scene,          // scene
        false);         // updatable
    ground.material = groundMaterial;
    ground.checkCollisions = true;
    // friction is just friction, restitution is how "bouncy" the collsion is .  1.0 will be very bouncy.
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 });

    //Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    //At Last, add some lights to our scene
    var light0 = new BABYLON.PointLight("pointlight0", new BABYLON.Vector3(28, 78, 385), scene);
    light0.diffuse = new BABYLON.Color3(0.5137254901960784, 0.2117647058823529, 0.0941176470588235);
    light0.intensity = 0.2;

    var light1 = new BABYLON.PointLight("pointlight1", new BABYLON.Vector3(382, 96, 4), scene);
    light1.diffuse = new BABYLON.Color3(1, 0.7333333333333333, 0.3568627450980392);
    light1.intensity = 0.2;

    // create a standard material for the side walls (from 3 textures)
    var cubeWallMaterial = new BABYLON.StandardMaterial("cubeWalls", scene);
    cubeWallMaterial.emissiveTexture = new BABYLON.Texture("textures/masonry-wall-texture.jpg", scene);
    cubeWallMaterial.bumpTexture = new BABYLON.Texture("textures/masonry-wall-bump-map.jpg", scene);
    cubeWallMaterial.specularTexture = new BABYLON.Texture("textures/masonry-wall-normal-map.jpg", scene);

    mainWall  = BABYLON.MeshBuilder.CreateBox("wall", {width:WALL_WIDTH, height:8, depth:2}, scene);
    mainWall.material = cubeWallMaterial;
    mainWall.checkCollisions = true;
    mainWall.setEnabled(false);

    halfWall  = BABYLON.MeshBuilder.CreateBox("halfWall", {width:4, height:8, depth:2}, scene);
    halfWall.material = cubeWallMaterial;
    halfWall.checkCollisions = true;
    halfWall.setEnabled(false);

    doorWall  = BABYLON.MeshBuilder.CreateBox("doorWall", {width:6, height:8, depth:2}, scene);
    doorWall.material = new BABYLON.StandardMaterial("door-material", scene);
    doorWall.material.diffuseColor  = new BABYLON.Color3(0.1, 0.1, 0.1);
    doorWall.material.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    doorWall.checkCollisions = false;
    doorWall.setEnabled(false);

    var caveDoors = gameControl.gameLocations.cave.caveDoors;
    // validate the cave
    if (Cave.validateCave(caveDoors) == false)
        window.alert("the cave failed validation!");
    // build out all the rooms in the cave
    for (var roomNum = 1; roomNum <= Cave.NUMBER_OF_ROOMS; roomNum++) {
        createRoom(roomNum, caveDoors[roomNum-1]);
    }

    return scene;
};

function addInputListeners() {

    window.addEventListener("keydown", function (event) {
        // ascii 32 is the 'space' char
        if (event.keyCode === 32) {
            if (!birdsEyeView) {
                birdsEyeView = true;
                // do we aleady have a saved position?
                if (camPositionInLabyrinth == null) {
                    // Saving current position & rotation in the labyrinth
                    camPositionInLabyrinth = freeCamera.position;
                    camRotationInLabyrinth = freeCamera.rotation;
                }
                // animate up in space
                animateCameraPositionAndRotation(freeCamera, freeCamera.position,
                    new BABYLON.Vector3(0, 250, 0),
                    freeCamera.rotation,
                    //new BABYLON.Vector3(1.4912565104551518, -1.5709696842019767, freeCamera.rotation.z));
                    new BABYLON.Vector3(Math.PI / 2, 0, 0),
                    null);
            }
            else {
                birdsEyeView = false;
                // animate back down
                animateCameraPositionAndRotation(freeCamera, freeCamera.position,
                    camPositionInLabyrinth, freeCamera.rotation, camRotationInLabyrinth, animateCameraPositionAndRotationEnd);
                
            }
            freeCamera.applyGravity = !birdsEyeView;
        }
    }, false);

    canvas.addEventListener("mousedown", function (evt) {
        var pickResult = scene.pick(evt.clientX, evt.clientY);

        if (pickResult.hit) {
            var dir = pickResult.pickedPoint.subtract(scene.activeCamera.position);
            dir.normalize();
            pickResult.pickedMesh.applyImpulse(dir.scale(50), pickResult.pickedPoint);
        }
    });
}

function createGameControls() {

    var controlsTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    // make a stack panel for the center buttons
    // make a grid for the center buttons
    var grid = new BABYLON.GUI.Grid();
    grid.addColumnDefinition(100, true);
    grid.addColumnDefinition(100, true);
    grid.addColumnDefinition(100, true);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.5);
    grid.width = "300px";
    grid.height = "80px";
    grid.background = "grey";
    grid.color = "white";
    grid.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    grid.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    controlsTexture.addControl(grid);

    var button = BABYLON.GUI.Button.CreateSimpleButton("exit", "exit");
    button.onPointerClickObservable.add(function () {
        location.reload();
    });
    grid.addControl(button, 1, 0);

    button = BABYLON.GUI.Button.CreateSimpleButton("goto", "goto room");
    button.onPointerClickObservable.add(function () {
        gotoRoom();
    });
    grid.addControl(button, 1, 1);

    button = BABYLON.GUI.Button.CreateSimpleButton("fire", "fire arrow");
    grid.addControl(button, 0, 0);

    button = BABYLON.GUI.Button.CreateSimpleButton("buy-s", "buy a secret");
    grid.addControl(button, 0, 1);

    button = BABYLON.GUI.Button.CreateSimpleButton("buy-a", "buy arrows");
    grid.addControl(button, 0, 2);

    // make a grid for the right hand status panel
    grid = new BABYLON.GUI.Grid();
    grid.addColumnDefinition(100, true);
    grid.addColumnDefinition(100, true);
    grid.addColumnDefinition(100, true);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.5);
    grid.width = "300px";
    grid.height = "80px";
    grid.background = "grey";
    grid.color = "white";
    grid.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    grid.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    controlsTexture.addControl(grid);

    var text = new BABYLON.GUI.TextBlock();
    text.text = "coins"
    grid.addControl(text, 0, 0);  // row, col

    textCoins = new BABYLON.GUI.TextBlock();
    grid.addControl(textCoins, 1, 0);  // row, col

    text = new BABYLON.GUI.TextBlock();
    text.text = "score"
    grid.addControl(text, 0, 1);  // row, col

    textScore = new BABYLON.GUI.TextBlock();
    grid.addControl(textScore, 1, 1);  // row, col

    text = new BABYLON.GUI.TextBlock();
    text.text = "room#"
    grid.addControl(text, 0, 2);  // row, col

    textRoomNumber = new BABYLON.GUI.TextBlock();
    grid.addControl(textRoomNumber, 1, 2);  // row, col

    // and now for the bottom left status panel
    grid = new BABYLON.GUI.Grid();
    grid.addColumnDefinition(300, true);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.5);
    grid.width = "300px";
    grid.height = "80px";
    grid.background = "grey";
    grid.color = "white";
    grid.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    grid.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    controlsTexture.addControl(grid);

    textStatus = new BABYLON.GUI.TextBlock();
    grid.addControl(textStatus, 1, 0);  // row, col
}

function gotoRoom() {
    document.getElementById("dialog-form").className = "onScreen";
    document.getElementById("dialog-form").title = "goto room";
    document.getElementById("form-label").innerText = "room number:";
    document.getElementById("form-value").value = "";

    $("#dialog-form").dialog({
        autoOpen: true,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "go": function () {

                freeCamera.position = getCenterOfRoom($("#form-value").val())
                freeCamera.position.y = 2;
            
                // close the new game dialog
                $(this).dialog("close");                
            }
        }
    });    
}

function getRoomNumber(position) {
    var minD = GROUND_WIDTH+GROUND_HEIGHT, minRoom;
    // find what center we are closest too
    for (var roomNum = 1; roomNum <= Cave.NUMBER_OF_ROOMS; roomNum++) {
        var roomPosition  = getCenterOfRoom(roomNum);
        var d = BABYLON.Vector3.Distance(roomPosition, position);
        if (d < minD) {
            minD = d;
            minRoom = roomNum;
        }
    }
    return minRoom;
}

function gameLoopWorker() {
    // what room is the player in ?
    var roomNum = getRoomNumber(freeCamera.position);

    // did we just change rooms?
    if (gameControl.gameLocations.playerRoomNumber != roomNum) {
        // change rooms !
        gameControl.movePlayerToRoom(roomNum);
    }

    // update the game controls
    textCoins.text = gameControl.player.goldCoins.toString();
    textScore.text = gameControl.player.getCurrentScore().toString();
    textRoomNumber.text = gameControl.gameLocations.playerRoomNumber.toString();
    textStatus.text = gameControl.statusText;
}

var wumpusMeshes;
function createWumpus(roomNumber) {

    BABYLON.SceneLoader.ImportMesh("", "/assets/", "seagulf.glb", scene, function (meshes, particleSystems, skeletons) {
        wumpusMeshes = meshes;
        var position = getCenterOfRoom(roomNumber);
        wumpusMeshes[0].scaling = new BABYLON.Vector3(2, 2, 2);
        wumpusMeshes[0].position = position.clone();
        wumpusMeshes[1].scaling = new BABYLON.Vector3(0.6, 0.6, 0.6);
        wumpusMeshes[1].position = position.clone();
    });
}

var batsMeshes = [];
function createBats(roomNumber) {

    BABYLON.SceneLoader.ImportMesh("", "/assets/", "Channel9.stl", scene, function (meshes, particleSystems, skeletons) {
        batsMeshes.push(meshes[0]);
        meshes[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
        meshes[0].position = getCenterOfRoom(roomNumber);
    });
}

var pitMeshes = [];
function createPits(roomNumber) {
    var pit = BABYLON.MeshBuilder.CreateDisc("pit", {radius: 8}, scene);
    pitMeshes.push(pit);
    var material = new BABYLON.StandardMaterial("pit-material", scene);
    material.diffuseColor  = new BABYLON.Color3(0.1, 0.1, 0.1);
    material.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    pit.material = material;
    pit.position = getCenterOfRoom(roomNumber);
    // it has to be "just" above the ground, or it blends in to the ground.
    pit.position.y = 0.1;
    // rotate the disc so it looks flat on the floor
    pit.rotation.x = Math.PI / 2;
}

// puts the player, wumpus, bats, and pits into rooms
function putThingsInRooms() {
    // put the player in their room
    freeCamera.position = getCenterOfRoom(gameControl.gameLocations.playerRoomNumber)
    freeCamera.position.y = 2;

    // put the wumpus in their room
    createWumpus(gameControl.gameLocations.wumpusRoomNumber);

    // put 2 bats in random rooms
    createBats(gameControl.gameLocations.getBatRoomNumber(0));
    createBats(gameControl.gameLocations.getBatRoomNumber(1));

    // put 2 bottomless pits in random rooms
    createPits(gameControl.gameLocations.getPitRoomNumber(0));
    createPits(gameControl.gameLocations.getPitRoomNumber(1));
}

function newGame() {
    document.getElementById("dialog-form").className = "onScreen";
    document.getElementById("dialog-form").title = "new game";
    document.getElementById("form-label").innerText = "player name:";

    $("#dialog-form").dialog({
        autoOpen: true,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "go": function () {
                // create the wumpus main objects (game control manages them all)
                gameControl = new GameControl($("#form-value").val());

                // create the main maze scene
                createScene();

                // add the input listeners
                addInputListeners();

                // play some fun sounds
                playSound();

                // attach the canvas to the camera
                scene.activeCamera.attachControl(canvas);

                // create the game controls
                createGameControls();

                // setup everything in their rooms
                putThingsInRooms();

                // setup the game loop worker (3 times a second)
                window.setInterval(gameLoopWorker, 300);

                // Once the scene is loaded, just register a render loop to render it
                engine.runRenderLoop(function () {
                    scene.render();
                });

                // now put it all onscreen
                canvas.className = "offScreen onScreen";
                
                // close the new game dialog
                $(this).dialog("close");
                document.getElementById("new-game").blur();
            }
        }
    });
};

window.onload = function () {
    canvas = document.getElementById("canvas");

    document.getElementById("new-game").onclick = newGame;

    // Check support
    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {
        // create the engine, note: the canvas starts hidden (offScreen / scale(0))
        engine = new BABYLON.Engine(canvas, true);

        // add a resize listener
        window.addEventListener("resize", function () {
            engine.resize();
        });
    }
};

// this makes sure that we keep remembering our starting position 
// until we finally animate our way back there
var animateCameraPositionAndRotationEnd = function () {
    // did we make it back ?
    if (freeCamera.position.equals(camPositionInLabyrinth)) {
        // clear this out, we successfullly animated back to our start position.
        camPositionInLabyrinth = null;
    }
};

var animateCameraPositionAndRotation = function (freeCamera, fromPosition, toPosition,
                                                 fromRotation, toRotation, animEnded) {

    var animCamPosition = new BABYLON.Animation("animCam", "position", 30,
                              BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                              BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keysPosition = [];
    keysPosition.push({
        frame: 0,
        value: fromPosition
    });
    keysPosition.push({
        frame: 100,
        value: toPosition
    });
    animCamPosition.setKeys(keysPosition);

    var animCamRotation = new BABYLON.Animation("animCam", "rotation", 30,
                              BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                              BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keysRotation = [];
    keysRotation.push({
        frame: 0,
        value: fromRotation
    });
    keysRotation.push({
        frame: 100,
        value: toRotation
    });
    animCamRotation.setKeys(keysRotation);

    freeCamera.animations.push(animCamPosition);
    freeCamera.animations.push(animCamRotation);

    scene.beginAnimation(
        freeCamera,
        0, 
        100, 
        false, 
        1.0, 
        animEnded);
};