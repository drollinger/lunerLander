/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: The main function with 
 *  inizialization of values and the game loopC 
 **************************************************/
'use strict';

function main() {
    //Initialize
    let input = Input();
    let keyInput = input.Keyboard();

    let terrain = Terrain();
    terrain.GenerateLine(terrain.Level.EASY);

    let ship = Ship();

    let menuing = Menuing(keyInput, ship);
    menuing.InitMenuHandlers();

    let gamePlay = GamePlay(ship, terrain, menuing);
    menuing.CreateNewGame(gamePlay);

    let fireParticles = Particles({
        size: { mean: 10, stdev: 4 },
        speed: { mean: 50, stdev: 25 },
        lifetime: { mean: 4, stdev: 1 }
    });
    let smokeParticles = Particles({
        size: { mean: 10, stdev: 4 },
        speed: { mean: 50, stdev: 25 },
        lifetime: { mean: 4, stdev: 1 }
    });

    let graphics = Graphics();
    let terrainRenderer = graphics.TerrainRenderer({
        terrain : terrain,
    });
    let shipRenderer = graphics.ShipRenderer({
        ship : ship,
    });
    let gameRenderer = graphics.GameRenderer({
        gamePlay : gamePlay,
    });
    let menuRenderer = graphics.MenuRenderer({
        menuing : menuing,
    });
    let particlesRenderer = graphics.ParticlesRenderer({
        fireParticles : fireParticles,
        smokeParticles : smokeParticles,
    });
    graphics.InitRenderer({
        background : 'images/background.png',
        platform : 'images/platform.png',
        terrain : 'images/terrain.png',
        ship : 'images/ship.png',
        screen : 'images/screen.png',
        fire : 'images/fire.png',
        smoke : 'images/smoke.png',
    });

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
        menuing.Update();
        fireParticles.Update(elapsedTime, ship.Info);
        smokeParticles.Update(elapsedTime, ship.Info);
    };
    
    function render() {
        graphics.Clear();
        graphics.RenderBackground();
        terrainRenderer.Render();
        shipRenderer.RenderShip();
        shipRenderer.RenderScore();
        gameRenderer.RenderTransitions();
        menuRenderer.RenderMenu();
        particlesRenderer.Render();
    };
    
    function processInput(elapsedTime) {
        keyInput.Update(elapsedTime);
    }
};

