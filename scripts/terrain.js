/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let Terrain = function() {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let lineList = [];
    let Level = {
        EASY: 1,   
        HARD: 2,   
    };
    let upperLimit = 0.3;
    let lowerLimit = 0.99;
    let pads = [];

    let GenerateLine = function(level) {
        let start = coord(0, getMidY());
        let end = coord(canvas.width, getMidY());
        pads = [];

        switch (level) {
            case Level.EASY:
                pads.push(getPad(canvas.width*0.15, canvas.width/2.1, canvas.width/11));
                pads.push(getPad(canvas.width/1.9, canvas.width*0.85, canvas.width/11));
                lineList = splitUpLine(start, pads[0].start).concat(
                    pads[0].start).concat(
                    splitUpLine(pads[0].end, pads[1].start)).concat(
                    pads[1].start).concat(
                    splitUpLine(pads[1].end, end));
                break;
            case Level.HARD:
                pads.push(getPad(canvas.width*0.15, canvas.width*0.85, canvas.width/14));
                lineList = splitUpLine(start, pads[0].start).concat(
                    pads[0].start).concat(
                    splitUpLine(pads[0].end, end));
                break;
        }
        lineList.push(end);
    };

    let GetLineList = function() {
        return lineList;
    }
    
    let GetPads = function() {
        return pads;
    }

    function getPad(start, end, width) {
        let sx = Math.random()*(end-start-width)+start;
        let ex = sx + width;
        let y = Math.random()*canvas.height*0.2 + 0.75*canvas.height;
        return {
            start: coord(sx, y),
            end: coord(ex, y),
        };
    }

    function splitUpLine(start, end) {
        if (end.x - start.x < 15) return start;
        let rg = normalRandom();
        let s = 1.2;
        let r = s*rg*(end.x - start.x);
        let y = 0.5*(start.y + end.y) + r;
        //Slightly randomize x to avoid uniform lines
        let x = 0.5*(start.x + end.x) + (Math.random()*.5 - .25)*(end.x - start.x);
        //Limit the height while making peaks/valleys smoother
        if (y < canvas.height*upperLimit) 
            y = 0.5*(start.y + end.y) + 20*Math.random();
        if (y > canvas.height*lowerLimit)
            y = 0.5*(start.y + end.y) - 20*Math.random();

        return [].concat(
            splitUpLine(start, coord(x, y))
        ).concat(
            splitUpLine(coord(x, y), end)
        );
    }

    function normalRandom() {
        var val, u, v, s, mul;
        do {
            u = Math.random()*2-1;
            v = Math.random()*2-1;
            s = u*u+v*v;
        } while(s === 0 || s >= 1);
        
        mul = Math.sqrt(-2 * Math.log(s) / s);
        
        val = u * mul;
	    return val;
    }

    function coord(x, y) {
        return {
            x: x,
            y: y,
        };
    }

    function getMidY() {
        return canvas.height/3 + canvas.height/3*Math.random();
    }

    return {
        GenerateLine : GenerateLine,
        GetLineList : GetLineList,
        GetPads : GetPads, 
        Level : Level,
    };
}
