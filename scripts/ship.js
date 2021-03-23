/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let Ship = function() {
    //remember that these need to not be so hard coded
    let Info = {
        center: coord(500, 50),
        width: 50,
        height: 80,
        //rotation: -1*Math.PI/2,
        rotation: 0,
        speed: coord(0, 0),
        unitSpeed: 0,
        fuel: 100,
        crashed: false,
    };
    let Stats = {

    };
    let gravity = 60;
    let thrust = gravity+30;
    let boost = coord(0, 0);
    let rotateRate = 2;
    let depletionRate = 5;

    //TODO: Colision detection
    let Update = function(elapsedTime, gameInPlay, terrain) {
        if (gameInPlay && !Info.crashed) {
            if (Info.fuel <= 0) boost = coord(0, 0);
            Info.speed.y += (gravity-boost.y)*elapsedTime/1000;
            Info.speed.x += boost.x*elapsedTime/1000;
            Info.unitSpeed = Math.sqrt(Info.speed.x**2 + Info.speed.y**2)/10;
            boost = coord(0, 0);
            Info.center.y += Info.speed.y*elapsedTime/1000;
            Info.center.x += Info.speed.x*elapsedTime/1000;
            if (Info.rotation < -1*Math.PI) Info.rotation += 2*Math.PI;
            if (Info.rotation > Math.PI) Info.rotation -= 2*Math.PI;
            Info.crashed = shipHitLine(terrain.GetLineList());
        };
    };

    let BoostHandler = function(k, elapsedTime) {
        Info.fuel -= depletionRate*elapsedTime/1000;
        if (Info.fuel < 0) Info.fuel = 0;
        boost.x = Math.sin(Info.rotation)*thrust;
        boost.y = Math.cos(Info.rotation)*thrust;
    };

    let RotateRightHandler = function(k, elapsedTime) {
        Info.rotation += rotateRate*elapsedTime/1000;
    };

    let RotateLeftHandler = function(k, elapsedTime) {
        Info.rotation -= rotateRate*elapsedTime/1000;
    };

    function shipHitLine(line) {
        let intersect = false;
        let courners = [];
        let cos = Math.cos(Info.rotation);
        let sin = Math.sin(Info.rotation);
        let x = Info.center.x;
        let w = Info.width/2
        let h = Info.height/2
        let y = Info.center.y;
        //TODO it is not always picking the right one!!!
        let boxMin = coord(x - w*cos - h*sin, y + w*sin - h*cos);
        let boxMax = coord(x + w*cos + h*sin, y - w*sin + h*cos);
        //courners.push(coord(x - w*cos - h*sin, y + w*sin - h*cos)); //lowerLeft
        //courners.push(coord(x - w*cos + h*sin, y + w*sin + h*cos)); //upperLeft
        //courners.push(coord(x + w*cos + h*sin, y - w*sin + h*cos)); //upperRight
        //courners.push(coord(x + w*cos - h*sin, y - w*sin - h*cos)); //lowerRight
        let i = 0;
        while (line[i].x < boxMin.x && i < line.length) i++;
        i--;
        if (i < 0) i = 0;
        for (let j=0; j < courners)
        while (line[i].x < boxMax.x && i+1 < line.length && !intersect) {
            if (doIntersect(line[i].y, line[i+1].y, boxMin.y, boxMax.y)) intersect = true;
            i++;
        }
        return intersect;
    };

    function boxIntersect(courners, line) {
        let intersect = false;
        for (let j=0; j < courners.length; j++) {
            let pt1 = courners[j];
            let pt2 = courners[(j+1)%courners.length];
            let minX = Math.min(pt1.x, pt2.x);
            let maxX = Math.max(pt1.x, pt2.x);
            let i = 0;
            while (line[i].x < minX && i < line.length) i++;
            i--;
            if (i < 0) i = 0;
            while (line[i].x < maxX && i+1 < line.length && !intersect) {
                if (doIntersect(line[i].y, line[i+1].y, boxMin.y, boxMax.y)) intersect = true;
                i++;
            }
        }
        return intersect;
    }

    function doIntersect(lSta, lEnd, bMin, bMax) {
        if (lSta < lEnd) {
            if (lSta > bMax || lEnd < bMin) return false;
        }
        else {
            if (lEnd > bMax || lSta < bMin) return false;
        }
        return true;
    };

    function coord(x, y) {
        return {
            x: x,
            y: y,
        };
    };

    return {
        Info : Info,
        Update : Update,
        BoostHandler : BoostHandler,
        RotateRightHandler : RotateRightHandler,
        RotateLeftHandler : RotateLeftHandler,
    };
}
