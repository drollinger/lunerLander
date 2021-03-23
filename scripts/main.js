/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: The main function with 
 *  inizialization of values and the game loopC 
 **************************************************/
'use strict';

function main() {
    //Initialize
    //TODO have the init in the declaration, it will be cleaner
    let input = Input();
    let keyInput = input.Keyboard();

    let menuing = Menuing();
    menuing.InitMenuHandlers();
    keyInput.RegisterCommand(['Escape'], menuing.MenuEsc);

    let terrain = Terrain();
    terrain.GenerateLine(terrain.Level.EASY);

    let ship = Ship();
    keyInput.RegisterCommand(['ArrowUp'], ship.BoostHandler);
    keyInput.RegisterCommand(['ArrowLeft'], ship.RotateLeftHandler);
    keyInput.RegisterCommand(['ArrowRight'], ship.RotateRightHandler);

    let graphics = Graphics();
    let terrainRenderer = graphics.TerrainRenderer({
        terrain : terrain,
    });
    let shipRenderer = graphics.ShipRenderer({
        ship : ship,
    });
    graphics.InitRenderer({
        background : 'images/background.png',
        platform : 'images/platform.png',
        terrain : 'images/terrain.png',
        ship : 'images/ship.png',
        screen : 'images/screen.png',
    });

    let gamePlay = GamePlay(ship, terrain, menuing);
    menuing.CreateNewGame(gamePlay);

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
        let gameInPlay = menuing.GetCurState()==menuing.States.GAME;
        ship.Update(elapsedTime, gameInPlay, terrain);
        gamePlay.Update(elapsedTime, gameInPlay);
    };
    
    function render() {
        graphics.Clear();
        graphics.RenderBackground();
        terrainRenderer.Render();
        shipRenderer.RenderShip();
        shipRenderer.RenderScore();
    };
    
    function processInput(elapsedTime) {
        keyInput.Update(elapsedTime);
    }
};

