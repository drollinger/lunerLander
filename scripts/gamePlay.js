/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let GamePlay = function(s, t, m) {
    //remember that these need to not be so hard coded
    let Info = {
        level: terrain.level.EASY,
        score: 0,
        onTransition: false,
        shipOnPad: false,
        countDown: 5000,
    };
    let ship = s;
    let terrain = t;
    let menu = m;
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
                for (let p of pads) {
                    if (ship.Info.center.x - off >= p.start.x && 
                        ship.Info.center.x - off <= p.end.x &&
                        ship.Info.center.x + off >= p.start.x && 
                        ship.Info.center.x + off <= p.end.x
                    ) onPad = true;
                };
                Info.shipOnPad = hasCond && onPad;
                Info.onTransition = true;
                Info.countDown = 5000;
            };
            if (Info.onTransition) {
                Info.countDown -= elapsedTime;
                if (Info.countDown <= 0) {
                    Info.shipOnPad = false;
                    Info.onTransition = false;
                    if (Info.shipOnPad) {
                        if (Info.level == terrain.Level.EASY) {
                            //TODO Fix scoring need to move up before transition
                            Info.score = 1000;
                            terrain.GenerateLine(terrain.Level.HARD);
                            pads = terrain.GetPads();
                            ship.ResetShip();
                        }
                        else {
                            Info.score += 2000;
                            //Save score in highscores
                            menu.GoToMainMenu();
                        }
                    }
                    else menu.GoToMainMenu();
                };
            };
        };
    };

    let RestartGameHandler = function() {
        Info.level = 1;
        terrain.GenerateLine(terrain.Level.EASY);
        score: 0;
        ship.ResetShip();
    };

    return {
        Info : Info,
        Update : Update,
        RestartGameHandler : RestartGameHandler,
    };
}
