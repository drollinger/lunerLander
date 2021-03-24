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
        rotation: -1*Math.PI/2,
        speed: coord(0, 0),
        unitSpeed: 0,
        fuel: 100,
        crashed: false,
        isBoosting: false,
    };
    let Stats = {

    };
    let gravity = 40;
    let thrust = gravity+30;
    let boost = coord(0, 0);
    let rotateRate = 2;
    let depletionRate = 5;

    let Update = function(elapsedTime, gameInPlay, terrain) {
        if (gameInPlay && !Info.crashed) {
            if (Info.fuel <= 0) boost = coord(0, 0);
            if (boost.x == 0 && boost.y == 0) Info.isBoosting = false;
            else Info.isBoosting = true;
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

    let ResetShip = function() {
        Info.center = coord(500, 50);
        Info.width = 50;
        Info.height = 80;
        Info.rotation = -1*Math.PI/2;
        Info.speed = coord(0, 0);
        Info.unitSpeed = 0;
        Info.fuel = 100;
        Info.crashed = false;
    }

    let BoostHandler = function(k, elapsedTime) {
        if (!Info.crashed) {
            Info.fuel -= depletionRate*elapsedTime/1000;
            if (Info.fuel < 0) Info.fuel = 0;
            boost.x = Math.sin(Info.rotation)*thrust;
            boost.y = Math.cos(Info.rotation)*thrust;
        };
    };

    let RotateRightHandler = function(k, elapsedTime) {
        if (!Info.crashed) {
            Info.rotation += rotateRate*elapsedTime/1000;
        };
    };

    let RotateLeftHandler = function(k, elapsedTime) {
        if (!Info.crashed) {
            Info.rotation -= rotateRate*elapsedTime/1000;
        };
    };

    function shipHitLine(line) {
        let courners = [];
        let cos = Math.cos(Info.rotation);
        let sin = Math.sin(Info.rotation);
        let x = Info.center.x;
        let w = Info.width/2
        let h = Info.height/2
        let y = Info.center.y;
        let intersect = false;
        intersect = boxIntersect([
            coord(x - w*cos - h*sin, y + w*sin - h*cos), //lowerLeft
            coord(x - w*cos + h*sin, y + w*sin + h*cos), //upperLeft
            coord(x + w*cos + h*sin, y - w*sin + h*cos), //upperRight
            coord(x + w*cos - h*sin, y - w*sin - h*cos), //lowerRight
        ], line);
        return intersect;
    };

    function boxIntersect(courners, line) {
        let intersect = false;
        for (let j=0; j < courners.length; j++) {
            let pt1 = courners[j];
            let pt2 = courners[(j+1)%courners.length];
            let left, right;
            if (pt1.x < pt2.x) {
                left = pt1;
                right = pt2;
            }
            else {
                left = pt2;
                right = pt1;
            }
            let slope = (left.y-right.y)/(left.x-right.x);
            let i = 0;
            while (line[i].x < left.x && i < line.length) i++;
            i--;
            if (i < 0) i = 0;
            while (line[i].x < right.x && i+1 < line.length && !intersect) {
                if (doIntersect(line[i], line[i+1], left, right, slope)) intersect = true;
                i++;
            }
        }
        return intersect;
    }

    function doIntersect(l1, l2, b1, b2, bSlope) {
        if (!isFinite(bSlope)) {
            if (l1.x <= b1.x && l2.x >= b2.x && 
                (l1.y <= Math.max(b1.y, b2.y) || l2.y <= Math.max(b1.y, b2.y))
            ) return true;
            else return false;
        }
        //Will never be Infinity due to terrain generation style
        let lSlope = (l1.y-l2.y)/(l1.x-l2.x);
        let bc = b1.y - bSlope*b1.x;
        let lc = l1.y - lSlope*l1.x;
        let intersectX = (lc - bc)/(bSlope - lSlope);
        if (intersectX < Math.max(b1.x, l1.x) || intersectX > Math.min(b2.x, l2.x)) return false;
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
        ResetShip : ResetShip,
        BoostHandler : BoostHandler,
        RotateRightHandler : RotateRightHandler,
        RotateLeftHandler : RotateLeftHandler,
    };
}
