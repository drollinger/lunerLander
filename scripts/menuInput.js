/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let Menuing = function() {
    let States = {
        GAME: 1,
        PAUSE: 2,
        MAIN: 3,
        SUB: 4,
    };
    
    let curState;

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
    };
};
