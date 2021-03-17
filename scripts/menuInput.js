/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let MenuHandlers = function() {
    let states = {
        GAME: 1,
        PAUSE: 2,
        MAIN: 3,
        SUB: 4,
    };
    
    let curState;

    let InitMenuHandlers = function() {
        document.getElementById('resumeMenu').addEventListener('click', function() {
                toggleMenu('canvasSection');
                curState = states.GAME;
            }
        );
        document.getElementById('exitMenu').addEventListener('click', function() {
                toggleMenu('mainMenuSection');
                curState = states.MAIN;
            }
        );
        document.getElementById('newGameMenu').addEventListener('click',  function() {
                toggleMenu('canvasSection');
                curState = states.GAME;
            }
        );
        document.getElementById('highscoresMenu').addEventListener('click', function() {
                toggleMenu('highscoresSection');
                curState = states.SUB;
            }
        );
        document.getElementById('customizeMenu').addEventListener('click', function() {
                toggleMenu('customizeSection');
                curState = states.SUB;
            }
        );
        document.getElementById('creditsMenu').addEventListener('click', function() {
                toggleMenu('creditsSection');
                curState = states.SUB;
            }
        );
        toggleMenu('mainMenuSection');
        curState = states.MAIN;
    };

    function toggleMenu(id) {
        document.querySelectorAll('.row-section').forEach(item => {
            item.style.display='none';
        });
        document.getElementById(id).style.display='initial';
    };

    let MenuEsc = onPressOnly(function() {
        switch (curState) {
            case states.SUB:
                toggleMenu('mainMenuSection');
                curState = states.MAIN;
                break;
            case states.GAME:
                toggleMenu('pauseMenuSection');
                curState = states.PAUSE;
                break;
        };
    });

    function onPressOnly(f) {
        return (function(key, elapsedTime) {
            if (!key.heldPress) f();
        });
    };
    
    return {
        InitMenuHandlers : InitMenuHandlers,
        MenuEsc : MenuEsc,
    };
};
