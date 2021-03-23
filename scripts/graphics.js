/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: This contains the Graphics function
 *   needed to render any objects on the screen.
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
            screenText("rgba(252, 57, 3,1)", 
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

    return {
        Clear : Clear,
        InitRenderer : InitRenderer,
        RenderBackground : RenderBackground,
        TerrainRenderer : TerrainRenderer,
        ShipRenderer : ShipRenderer,
    }; 
};
