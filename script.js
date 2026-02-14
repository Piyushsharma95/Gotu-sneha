const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const hearts = [];

class Heart {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 15 + 5;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.angle = Math.random() * Math.PI * 2;
        this.wave = Math.random() * 2;
    }
    update() {
        this.y -= this.speed;
        this.x += Math.sin(this.angle) * this.wave;
        this.angle += 0.02;
        if (this.y < -20) this.reset();
    }
    draw() {
        ctx.fillStyle = `rgba(255, 77, 109, ${this.opacity})`;
        ctx.beginPath();
        const x = this.x;
        const y = this.y;
        const s = this.size;
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - s / 2, y - s / 2, x - s, y + s / 3, x, y + s);
        ctx.bezierCurveTo(x + s, y + s / 3, x + s / 2, y - s / 2, x, y);
        ctx.fill();
    }
}

for (let i = 0; i < 50; i++) {
    hearts.push(new Heart());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });
    requestAnimationFrame(animate);
}
animate();

// The rest of the interactive logic
const mainBtn = document.getElementById('mainBtn');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');

mainBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    // Burst effect
    for (let i = 0; i < 30; i++) {
        const h = new Heart();
        h.y = window.innerHeight / 2;
        h.x = window.innerWidth / 2;
        h.speed = Math.random() * 5 + 2;
        h.wave = Math.random() * 10 - 5;
        hearts.push(h);
        setTimeout(() => hearts.shift(), 3000);
    }
});

closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
});

// Cursor trail
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.9) {
        const trail = document.createElement('div');
        trail.innerHTML = '✨';
        trail.style.position = 'fixed';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.pointerEvents = 'none';
        trail.style.fontSize = '12px';
        trail.style.color = '#ffd700';
        trail.style.zIndex = '1000';
        document.body.appendChild(trail);

        trail.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: 'translate(0, 30px) scale(0)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });

        setTimeout(() => trail.remove(), 1000);
    }
});
