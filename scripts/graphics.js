/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: This contains the Graphics function
 *   needed to render any objects on the screen.
 *   Note that the particle renderer is heavily
 *   influenced by code written by Dr. Mathias
 *************************************************/
'use strict';

let Graphics = function() {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let imgBack = new Image();
    imgBack.isReady = false;
    imgBack.onload = function() {
        this.isReady = true;
    };
    let imgScreen = new Image(); imgScreen.isReady = false;
    imgScreen.onload = function() {
        this.isReady = true;
    };
    let imgPlat = new Image();
    imgPlat.isReady = false;
    imgPlat.onload = function() {
        this.isReady = true;
    };
    let imgTer = new Image();
    imgTer.isReady = false;
    imgTer.onload = function() {
        this.isReady = true;
    };
    let imgShip = new Image();
    imgShip.isReady = false;
    imgShip.onload = function() {
        this.isReady = true;
    };
    let imgFire = new Image();
    imgFire.isReady = false;
    imgFire.onload = function() {
        this.isReady = true;
    };
    let imgSmoke = new Image();
    imgSmoke.isReady = false;
    imgSmoke.onload = function() {
        this.isReady = true;
    };

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    let Clear = function() {
        context.clear();
    }

    let InitRenderer = function(spec) {
        imgBack.src = spec.background;
        imgPlat.src = spec.platform;
        imgTer.src = spec.terrain;
        imgShip.src = spec.ship;
        imgScreen.src = spec.screen;
        imgFire.src = spec.fire;
        imgSmoke.src = spec.smoke;
    }
    
    let RenderBackground = function() {
        if (imgBack.isReady) {
            context.drawImage(imgBack, 0, 0,
                canvas.width + 0.5, canvas.height + 0.5
            );
        }
    }

    let TerrainRenderer = function(spec) {
        let terrain = spec.terrain;
        let lineList = terrain.GetLineList();
        let pads = terrain.GetPads();
        let Render = function() {
            lineList = terrain.GetLineList();
            pads = terrain.GetPads();
            if (imgTer.isReady) {
                context.beginPath();
                context.moveTo(0, canvas.height);
                for(const p of lineList) {
                    context.lineTo(p.x, p.y);
                };
                context.lineTo(canvas.width, canvas.height);
                context.closePath();
                context.strokeStyle = 'rgb(27, 35, 27)';
                context.lineWidth = 8;
                context.fillStyle = context.createPattern(imgTer, "repeat");;
                context.stroke();
                context.fill();
            };

            //Highlight pads
            if (imgPlat.isReady) {
                for(const p of pads) {
                    context.drawImage(imgPlat, p.start.x, p.start.y,
                        p.end.x - p.start.x + 0.5, imgPlat.height
                    );
                };
            };
        };

        return {
            Render : Render,
        };
    }

    let ShipRenderer = function(spec) {
        let ship = spec.ship;
        let info = ship.Info;

        let RenderShip = function() {
            if (imgShip.isReady) {
                context.save();

                context.translate(info.center.x, info.center.y);
                context.rotate(info.rotation);
                context.translate(-info.center.x, -info.center.y);

                context.drawImage(imgShip,
                    info.center.x - info.width/2,
                    info.center.y - info.height/2,
                    info.width, info.height
                );

                context.restore();
            };
        };

        let RenderScore = function() {
            //Define left and right screens
            let ls = {x: 10, y: 10, w: 250, h: 105}
            let rs = {x: canvas.width-270, y: 10, w: 250, h: 105}
            let color;
            if (imgScreen.isReady) {
                context.drawImage(imgScreen, ls.x, ls.y, ls.w, ls.h);
                context.drawImage(imgScreen, rs.x, rs.y, rs.w, rs.h);
            }
            context.font = "25px CalculatorRegular";
            context.shadowOffsetX = 0; 
            context.shadowOffsetY = 0;
            context.shadowBlur = 5;

            screenText("rgba(255, 250, 212,1)", 
                "Score:", ls.x+ls.w/10, ls.y+ls.h/2.625, 
                "3301", ls.x+ls.w-ls.w/10, ls.y+ls.h/2.625
            );

            let fuel = Math.round(info.fuel * 10) / 10;
            if (fuel > 0) color = "rgba(107, 194, 107,1)";
            else color = "rgba(255, 250, 212,1)";
            screenText(color, 
                "Fuel:", ls.x+ls.w/10, 35+ls.y+ls.h/2.625, 
                fuel.toFixed(1)+"%",
                ls.x+ls.w-ls.w/10, 35+ls.y+ls.h/2.625
            );

            let speed = Math.round(info.unitSpeed * 10) / 10;
            if (speed > 2) color = "rgba(255, 250, 212,1)";
            else color = "rgba(107, 194, 107,1)";
            screenText(color, 
                "Speed:", rs.x+rs.w/10, rs.y+rs.h/2.625, 
                speed.toFixed(1)+" m/s", 
                rs.x+rs.w-ls.w/10, rs.y+rs.h/2.625
            );
           
            let deg = Math.round(info.rotation*180/Math.PI * 10) / 10;
            if (deg < -5 || deg > 5) color = "rgba(255, 250, 212,1)";
            else color = "rgba(107, 194, 107,1)";
            screenText(color, 
                "Angle:", rs.x+rs.w/10, 35+rs.y+rs.h/2.625, 
                deg.toFixed(1)+" °", rs.x+rs.w-ls.w/10, 35+rs.y+rs.h/2.625
            );
        };


        function screenText(color, lText, lx, ly, rText, rx, ry) {
            context.save();
            context.fillStyle = color;
            context.shadowColor = color;
            context.textAlign = "left";
            context.fillText(lText, lx, ly);
            context.textAlign = "right";
            context.fillText(rText,  rx, ry);
            context.restore();
        };

        return {
            RenderShip : RenderShip,
            RenderScore : RenderScore,
        };
    }

    let GameRenderer = function(spec) {
        let gamePlay = spec.gamePlay;
        let info = gamePlay.Info;

        let RenderTransitions = function(terrain) {
            if (info.onTransition && info.countDown < 5000) {
                context.fillStyle = 'rgba(0,0,0,.3)';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.font = "30px Comic Sans MS";
                if (info.shipOnPad) {
                    if (info.done) {
                        context.fillStyle = "rgba(107, 194, 107,1)";
                        context.textAlign = "center";
                        context.fillText("Congrats on the Landing!!", canvas.width/2, canvas.height/3-50);
                        context.fillStyle = "rgba(252, 257, 252, 1)";
                        context.fillText(`Total Score: ${info.score}`, canvas.width/2, canvas.height/3);
                        context.fillText("Elon Musk is now Flying Back to Earth", canvas.width/2, canvas.height/3+50);
                        context.fillText("Ejection to Menu in: ", canvas.width/2, canvas.height/3+130);
                    }
                    else {
                        context.fillStyle = "rgba(107, 194, 107,1)";
                        context.textAlign = "center";
                        context.fillText("Congrats on the Landing!!", canvas.width/2, canvas.height/3-50);
                        context.fillStyle = "rgba(252, 257, 252, 1)";
                        context.fillText(`Current Score: ${info.score}`, canvas.width/2, canvas.height/3);
                        context.fillText("There is More to Explore", canvas.width/2, canvas.height/3+50);
                        context.fillText("Next Mission in: ", canvas.width/2, canvas.height/3+130);
                    }

                }
                else {
                    context.fillStyle = "rgba(252, 57, 3,1)";
                    context.textAlign = "center";
                    context.fillText("This was NOT a Simulation", canvas.width/2, canvas.height/3-50);
                    context.fillText("Elon Musk is Dead", canvas.width/2, canvas.height/3);
                    context.fillStyle = "rgba(252, 257, 252, 1)";
                    context.fillText(`Total Score: ${info.score}`, canvas.width/2, canvas.height/3+50);
                    context.fillText("Ejecting to Menu in: ", canvas.width/2, canvas.height/3+130);
                }
                if (info.countDown < 3000) {
                    context.fillStyle = `rgba(252, 257, 252,${(info.countDown%1000)/1000})`;
                    context.font = "100px Comic Sans MS";
                    context.fillText(Math.floor(info.countDown/1000)+1, canvas.width/2, canvas.height/3+250);
                }
            }
        };

        let RenderScore = function() {
        };

        return {
            RenderTransitions : RenderTransitions,
            RenderScore : RenderScore,
        };
    }

    let MenuRenderer = function(spec) {
        let menuing = spec.menuing;
        let info = menuing.Info;

        let RenderMenu = function() {
            let msg;
            if (info.gettingNextKey) msg = 'Please Press New Button<br>Or Esc to Exit';
            else msg = '';
            document.getElementById("msgText").innerHTML = msg;
            for (let id of ['boost','rotateLeft','rotateRight']) {
                let key = info.buttons[id];
                if (key === ' ') key = 'Space';
                document.getElementById(id).innerHTML = key;
            }
        };

        return {
            RenderMenu : RenderMenu,
        };
    }

    let ParticlesRenderer = function(spec) {
        let fireParticles = spec.fireParticles;
        let smokeParticles = spec.smokeParticles;

        let Render = function() {
            if (imgFire.isReady) {
                Object.getOwnPropertyNames(fireParticles.Particles).forEach( function(value) {
                    let particle = fireParticles.Particles[value];
                    drawTexture(imgFire, particle.center, particle.rotation, particle.size);
                });
            }
            if (imgSmoke.isReady) {
                Object.getOwnPropertyNames(smokeParticles.Particles).forEach( function(value) {
                    let particle = smokeParticles.Particles[value];
                    drawTexture(imgSmoke, particle.center, particle.rotation, particle.size);
                });
            }
        }

        function drawTexture(image, center, rotation, size) {
            context.save();

            context.translate(center.x, center.y);
            context.rotate(rotation);
            context.translate(-center.x, -center.y);

            context.drawImage(
                image,
                center.x - size.x / 2,
                center.y - size.y / 2,
                size.x, size.y);

            context.restore();
        }

        return {
            Render : Render,
        };
    };

    return {
        Clear : Clear,
        InitRenderer : InitRenderer,
        RenderBackground : RenderBackground,
        TerrainRenderer : TerrainRenderer,
        ShipRenderer : ShipRenderer,
        GameRenderer : GameRenderer,
        MenuRenderer : MenuRenderer,
        ParticlesRenderer : ParticlesRenderer,
    }; 
};
