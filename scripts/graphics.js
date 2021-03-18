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

    return {
        Clear : Clear,
        InitRenderer : InitRenderer,
        RenderBackground : RenderBackground,
        TerrainRenderer : TerrainRenderer,
    }; 
};
