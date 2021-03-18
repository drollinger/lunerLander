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

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };
    function clear() {
        context.clear();
    }

    function InitRenderer(spec) {
    }

    return {
        clear : clear,
        InitRenderer : InitRenderer,
    }; 
};
