//NOTE: This code was written by Dr. Mathias and modified by Dallin Drollinger
'use strict';

let Particles = function(spec) {
    let particleId = 1;
    let Particles = {};

    let Update = function(elapsedTime, shipInfo) {
        let removeMe = [];
        //move to seconds
        elapsedTime = elapsedTime / 1000;
        
        Object.getOwnPropertyNames(Particles).forEach(function(value, index, array) {
            let particle = Particles[value];

            // Update how long it has been alive
            particle.alive += elapsedTime;

            // Update its center
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

            // Rotate proportional to its speed
            particle.rotation += particle.speed / 500;

            // If the lifetime has expired, identify it for removal
            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });

        // Remove all of the expired particles
        for (let particle = 0; particle < removeMe.length; particle++) {
            delete Particles[removeMe[particle]];
        }
        removeMe.length = 0;

        let cos = Math.cos(shipInfo.rotation);
        let sin = Math.sin(shipInfo.rotation);
        let x = shipInfo.center.x;
        let y = shipInfo.center.y;
        let w = shipInfo.width/2
        let h = shipInfo.height/2
        let ll = {x: (x - w*cos - h*sin), y: (y + w*sin - h*cos)}; //lowerLeft
        let lr = {x: (x + w*cos - h*sin), y: (y - w*sin - h*cos)}; //lowerRight
        let shipBase = {x: (ll.x+lr.x)/2, y: (ll.y+lr.y)/2}

        // Generate some new particles
        if (shipInfo.isBoosting) {
            for (let particle = 0; particle < 1; particle++) {
                // Assign a unique name to each particle
                Particles[particleId++] = create(shipBase);
            }
        }
    }

    function create(shipBase) {
        let size = nextGaussian(spec.size.mean, spec.size.stdev);
        let p = {
                center: { x: shipBase.x, y: shipBase.y },
                size: { x: size, y: size},
                direction: nextCircleVector(),
                speed: nextGaussian(spec.speed.mean, spec.speed.stdev),
                rotation: 0,
                lifetime: nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),
                alive: 0
            };

        return p;
    }

    function nextCircleVector() {
        let angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    //Optimize performance
    let usePrevious = false;
    let y2;
    function nextGaussian(mean, stdDev) {
        let x1 = 0;
        let x2 = 0;
        let y1 = 0;
        let z = 0;

        if (usePrevious) {
            usePrevious = false;
            return mean + y2 * stdDev;
        }

        usePrevious = true;

        do {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            z = (x1 * x1) + (x2 * x2);
        } while (z >= 1);
        
        z = Math.sqrt((-2 * Math.log(z)) / z);
        y1 = x1 * z;
        y2 = x2 * z;
        
        return mean + y1 * stdDev;
    }

    return {
        Update : Update,
        Particles : Particles,
    }; 
};
