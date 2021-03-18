/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let Terrain = function() {
    let lineList = [];
    let level = {
        EASY: 1,   
        HARD: 2,   
    };

    let GenerateLine = function(level) {
        let start = coord(0, 

        switch (level) {
            case level.EASY:
                lineList = splitUpLine(coord(0, ), coord(100, 100));
                break;
            case level.HARD:
                break;
        }
    };

    function splitUpLine(start, end) {
        if (end.x - start.x < 3) return start;
        let rg = normalRandom();
        let s = 1;
        let r = s*rg*(end.x - start.x);
        let y = 0.5*(start.y + end.y) + r;
        let x = 0.5*(start.x + end.x);

        return [].concat(
            splitUpLine(start, coord(x, y))
        ).concat(
            splitUpLine(coord(x, y), end)
        );
    }

    function normalRandom()
    {
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

    return {
        GenerateLine : GenerateLine,
        lineList : lineList,
    };
}
