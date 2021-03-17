/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: The main function with 
 *  inizialization of values and the game loop
 *************************************************/
'use strict';

function main() {
    //Initialize
    let input = Input();
    let keyInput = input.Keyboard();
    let menuHandlers = MenuHandlers();
    let graphics = Graphics();
    let highscores = [];

    menuHandlers.InitMenuHandlers();
    keyInput.RegisterCommand(['Escape'], menuHandlers.MenuEsc);

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
        graphics.clear();
    };
    
    function processInput(elapsedTime) {
        keyInput.Update(elapsedTime);
    }
};

