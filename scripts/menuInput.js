/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let Menuing = function(k, s) {
    let States = {
        GAME: 1,
        PAUSE: 2,
        MAIN: 3,
        SUB: 4,
    };

    let Info = {
        gettingNextKey: false,
        buttons: {},
    }

    let curState;
    let keyboard = k;
    let ship = s;
    let clickAssign = []
    let idToHandler = {
        boost : ship.BoostHandler,
        rotateLeft : ship.RotateLeftHandler,
        rotateRight : ship.RotateRightHandler,
    }
    Info.buttons['boost'] = localStorage.getItem('lunerGame.boost') ?? 'ArrowUp';
    Info.buttons['rotateLeft'] = localStorage.getItem('lunerGame.rotateLeft') ?? 'ArrowLeft';
    Info.buttons['rotateRight'] = localStorage.getItem('lunerGame.rotateRight') ?? 'ArrowRight';

    let InitMenuHandlers = function() {
        document.getElementById('resumeMenu').addEventListener('click', function() {
                toggleMenu('canvasSection');
                curState = States.GAME;
            }
        );
        document.getElementById('exitMenu').addEventListener('click', function() {
                toggleMenu('mainMenuSection');
                curState = States.MAIN;
            }
        );
        document.getElementById('newGameMenu').addEventListener('click',  function() {
                toggleMenu('canvasSection');
                curState = States.GAME;
            }
        );
        document.getElementById('highscoresMenu').addEventListener('click', function() {
                toggleMenu('highscoresSection');
                curState = States.SUB;
            }
        );
        document.getElementById('customizeMenu').addEventListener('click', function() {
                toggleMenu('customizeSection');
                curState = States.SUB;
            }
        );
        document.getElementById('creditsMenu').addEventListener('click', function() {
                toggleMenu('creditsSection');
                curState = States.SUB;
            }
        );
        document.getElementById('boost').addEventListener('click', listenAndGet('boost'))
        document.getElementById('rotateLeft').addEventListener('click', listenAndGet('rotateLeft'));
        document.getElementById('rotateRight').addEventListener('click', listenAndGet('rotateRight'));

        keyboard.RegisterCommand(['Escape'], MenuEsc);
        keyboard.RegisterCommand([Info.buttons['boost']], ship.BoostHandler);
        keyboard.RegisterCommand([Info.buttons['rotateLeft']], ship.RotateLeftHandler);
        keyboard.RegisterCommand([Info.buttons['rotateRight']], ship.RotateRightHandler);

        toggleMenu('mainMenuSection');
        curState = States.MAIN;
    };

    let MenuEsc = onPressOnly(function() {
        switch (curState) {
            case States.SUB:
                toggleMenu('mainMenuSection');
                curState = States.MAIN;
                break;
            case States.GAME:
                toggleMenu('pauseMenuSection');
                curState = States.PAUSE;
                break;
        };
    });

    let GetCurState = function() {
        return curState;
    };

    let GoToMainMenu = function() {
        toggleMenu('mainMenuSection');
        curState = States.MAIN;
    };

    let CreateNewGame = function(gamePlay) {
        document.getElementById('newGameMenu').addEventListener('click', gamePlay.RestartGameHandler);
    };

    let Update = function() {
        if (Info.gettingNextKey) {
            for (let key in keyboard.keys) {
                clickAssign(key);
                break;
            }
        }
    }

    function listenAndGet(id) {
        return (function () {
            Info.gettingNextKey = true;
            clickAssign = function(key) {
                if (key != 'Escape') {
                    keyboard.UnregisterKey(Info.buttons[id]);
                    keyboard.RegisterCommand([key], idToHandler[id]);
                    Info.buttons[id] = key;
                    localStorage[`lunerGame.${id}`] = key;
                };
                Info.gettingNextKey = false;
            };
        });
    };

    function toggleMenu(id) {
        document.querySelectorAll('.row-section').forEach(item => {
            item.style.display='none';
        });
        document.getElementById(id).style.display='initial';
    };

    function onPressOnly(f) {
        return (function(key, elapsedTime) {
            if (!key.heldPress) f();
        });
    };
    
    return {
        InitMenuHandlers : InitMenuHandlers,
        MenuEsc : MenuEsc,
        States : States,
        GetCurState : GetCurState,
        GoToMainMenu : GoToMainMenu,
        CreateNewGame : CreateNewGame,
        Update : Update,
        Info : Info,
    };
};
