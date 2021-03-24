/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let GamePlay = function(s, t, m, ps) {
    //remember that these need to not be so hard coded
    let Info = {
        level: 1,
        score: 0,
        onTransition: false,
        shipOnPad: false,
        countDown: 6000,
        done: false,
    };
    let ship = s;
    let terrain = t;
    let menu = m;
    let particleSystems = ps;
    Info.level = terrain.Level.EASY;
    let pads;

    let Update = function(elapsedTime, gameInPlay) {
        if (gameInPlay) {
            if (ship.Info.crashed && !Info.onTransition) {
                pads = terrain.GetPads();
                let off = ship.Info.width/2;
                let deg = ship.Info.rotation*180/Math.PI;
                let hasCond = (deg <= 5 && deg >= -5);
                hasCond &&= ship.Info.unitSpeed <= 2;
                let onPad = false;
                //Giving 5 pxs of cheat for better user experiance
                for (let p of pads) {
                    if (ship.Info.center.x - off >= p.start.x-5 && 
                        ship.Info.center.x - off <= p.end.x &&
                        ship.Info.center.x + off >= p.start.x && 
                        ship.Info.center.x + off <= p.end.x+5
                    ) onPad = true;
                };
                Info.shipOnPad = hasCond && onPad;
                //TODO Adding in Scoring
    
                if (!Info.shipOnPad) {
                    ShipSounds['audio/sound-1'].play();
                    for (let p of particleSystems) {
                        p.BlowUpShip();
                    }
                }
                else {
                    ShipSounds['audio/sound-2'].play();
                }
                Info.onTransition = true;
                Info.countDown = 6000;
                if (Info.level == terrain.Level.HARD) Info.done = true;
                ship.Info.isBoosting = false;
            };
            if (Info.onTransition) {
                Info.countDown -= elapsedTime;
                if (Info.countDown <= 0) {
                    if (Info.shipOnPad) {
                        if (Info.level == terrain.Level.EASY) {
                            Info.level = terrain.Level.HARD;
                            terrain.GenerateLine(terrain.Level.HARD);
                            pads = terrain.GetPads();
                            ship.ResetShip();
                        }
                        else {
                            menu.GoToMainMenu();
                        }
                    }
                    else menu.GoToMainMenu();
                    Info.shipOnPad = false;
                    Info.onTransition = false;
                    for (let p of particleSystems) {
                        p.Reset();
                    }
                };
            };
        };
    };

    let RestartGameHandler = function() {
        Info.level = 1;
        Info.score = 0;
        Info.done = false;
        terrain.GenerateLine(terrain.Level.EASY);
        ship.ResetShip();
    };

    return {
        Info : Info,
        Update : Update,
        RestartGameHandler : RestartGameHandler,
    };
}
