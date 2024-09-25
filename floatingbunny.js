// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
class Bunny {
    max_speed = 60;
    random_velocity = () => {
        return [(Math.random()*2 - 1) * this.max_speed, (Math.random()*2 - 1) * this.max_speed];
    }
    random_directed_velocity = (x, y) => {
        const speed = Math.random() * this.max_speed;
        const normed = Math.sqrt(x * x + y * y);
        return [x / normed * speed, y / normed * speed];
    }
    constructor(texture) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = Math.random() * app.renderer.width;
        this.sprite.y = Math.random() * app.renderer.height;
        this.velocity = [this.max_speed, 0];
        this.sprite.anchor.set(0.5, 0.5);
        const _bunny = this;
        app.stage.addChild(this.sprite);
        this.sprite.on("pointerenter", (eve) => {_bunny.ontouch(eve);});
        this.sprite.eventMode = 'static';
        app.ticker.add((t) => {_bunny.move(t);});
    }
    ontouch = function(event) {
        this.velocity = this.random_directed_velocity(this.sprite.x - event.client.x, this.sprite.y - event.client.y);
    };
    move = function(ticker) {
        const delta_t = ticker.deltaMS / 1e3;

        this.sprite.x += this.velocity[0]*delta_t;
        this.sprite.y += this.velocity[1]*delta_t;

        if (this.sprite.x >= app.renderer.width) {
            this.sprite.x -= app.renderer.width;
        } else if (this.sprite.x <= 0) {
            this.sprite.x += app.renderer.width;
        }

        if (this.sprite.y <= 0) {
            this.sprite.y += app.renderer.height;
        } else if (this.sprite.y >= app.renderer.height) {
            this.sprite.y -= app.renderer.height;
        }

        this.sprite.rotation += 1*delta_t;
    };
};
let new_bunny;
let app;
const canvas = document.getElementById('full-screen');
onload = async function() {
    app = new PIXI.Application();

    // Wait for the Renderer to be available
    await app.init({ background: '#1099bb', resizeTo: window});
    app.canvas.style.display = 'block';
    
    // The application will create a canvas element for you that you
    // can then insert into the DOM
    document.body.appendChild(app.canvas);
    // load the texture we need
    const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');
    
    // This creates a texture from a 'bunny.png' image
    new_bunny = new Bunny(texture);
    // Listen for frame updates
}

