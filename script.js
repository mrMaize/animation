(() => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const TWO_PI = Math.PI * 2;

    let width, height, mouse, dots;

    const config = {
        dotMinRadius: 6,
        dotMaxRadius: 20,
        massFactor: 0.002,
        defaultColor: `rgba(29, 147, 96, 0.76)`,
        smooth: 0.65,
        sphereRadius: 300,
        mouseDot: 40,
        mouseSize: 50,
    }

    class Dot {
        constructor(radius) {
            this.position = {x: mouse.x, y: mouse.y }
            this.velocity = {x: 0, y: 0 }
            this.radius = radius || random(config.dotMinRadius, config.dotMaxRadius);
            this.mass = this.radius * config.massFactor;
        }

        draw(x, y) {
            this.position.x = x || this.position.x + this.velocity.x;
            this.position.y = y || this.position.y + this.velocity.y;
            createCircle(this.position.x, this.position.y, this.radius, true, this.color, )
            createCircle(this.position.x, this.position.y, this.radius, false, config.defaultColor, )
        }
    }

    function createCircle(x, y, radius, isFilled, color) {
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TWO_PI);
        ctx.closePath();
        isFilled ? ctx.fill() : ctx.stroke();
    }


    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function setMousePosition({layerX, layerY}) {
        [mouse.x, mouse.y] = [layerX, layerY]
    }

    function isDown() {
        mouse.down  = !mouse.down;
    }

    function init() {
        width = canvas.width = innerWidth;
        height = canvas.height = innerHeight;

        mouse = {x: width / 2, y: height / 2, down: false};
        dots = [];

        dots.push(new Dot(config.mouseDot))
    }

    function updateDots() {
        for (let i = 1; i < dots.length; i++) {
            let acc = {x: 0, y: 0};

            for (let j = 0; j < dots.length; j++) {
                if (i === j) continue;

                let [dot_a, dot_b] = [dots[i], dots[j]];
                let delta = {x: dot_b.position.x - dot_a.position.x, y: dot_b.position.y - dot_a.position.y};
                let distance = Math.sqrt(delta.x ** 2 + delta.y ** 2) || 1;

                let force = (distance - config.sphereRadius) / distance * dot_b.mass;

                if (j === 0) {
                    const alpha = config.mouseSize / distance;
                    dot_a.color = `rgba(29, 147, 96, ${alpha})`
                    force = distance < config.mouseSize ? (distance - config.mouseSize) * dot_b.mass : 0;
                }

                acc.x += delta.x * force;
                acc.y += delta.y * force;
            }

            dots[i].velocity.x = dots[i].velocity.x * config.smooth + acc.x * dots[i].mass;
            dots[i].velocity.y = dots[i].velocity.y * config.smooth + acc.y * dots[i].mass;
        }

        dots.map(dot => dot === dots[0] ? dot.draw(mouse.x, mouse.y) : dot.draw())
    }


    function loop() {
        ctx.clearRect(0, 0, width, height);
        if (mouse.down) {
            console.log('mouse down')
            dots.push(new Dot());
        }

        updateDots();

        window.requestAnimationFrame(loop)
    }

    init();
    loop();

    document.addEventListener('mousemove', setMousePosition)
    window.addEventListener('mouseup', isDown)
    window.addEventListener('mousedown', isDown)
})()