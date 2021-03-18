/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: The main function with 
 *  inizialization of values and the game loopC *************************************************/
'use strict';

function main() {
    //Initialize
    let input = Input();
    let keyInput = input.Keyboard();

    let menuHandlers = MenuHandlers();
    menuHandlers.InitMenuHandlers();
    keyInput.RegisterCommand(['Escape'], menuHandlers.MenuEsc);

    let terrain = Terrain();
    terrain.GenerateLine(terrain.Level.EASY);

    let graphics = Graphics();
    let terrainRenderer = graphics.TerrainRenderer({
        terrain : terrain,
    });
    graphics.InitRenderer({
        background : 'images/background.png',
        platform : 'images/platform.png',
        terrain : 'images/terrain.png',
    });



    let highscores = [];

    let prevTime = performance.now();
    requestAnimationFrame(gameLoop);

    //The Main Game Loop
    function gameLoop(timestamp) {
        let elapsedTime = timestamp - prevTime;
        prevTime = timestamp;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    };
    
    function update(elapsedTime) {
    };
    
    function render() {
        graphics.Clear();
        graphics.RenderBackground();
        terrainRenderer.Render();
    };
    
    function processInput(elapsedTime) {
        keyInput.Update(elapsedTime);
    }
};

