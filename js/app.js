const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

const TILES = [
  'red', 'blue', 'green', 'cyan', 'magenta', 'yellow', 'white', 'black'
];

class App {
  constructor() {
    this.frame = 0;
    this.active = false;
    this.animationFrameId = null;
    
    this.time = {};    
    this.time.start = performance.now();
    this.time.actual = performance.now();
    this.time.lastActual = this.time.actual;
    this.time.game = 0;
    
    this.gridsize = 64;
    this.mapwidth = 8;
    this.mapheight = 8;
    this.map = new Array(this.mapwidth * this.mapheight);

    this.generateMap();

    this.initialised = true;
    
    this.initElements();

    this.play();
  }
  
  generateMap() {
    for (var i = 0; i < this.mapwidth * this.mapheight; i++) {
      this.map[i] = (Math.random() * TILES.length) >> 0;
    }
  }
  
  initElements() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 768;
    this.canvas.height = 512;
    document.body.appendChild(this.canvas);

    window.addEventListener('blur', this);
    window.addEventListener('focus', this);
  }
  
  pause() {
    if (this.active) {
      this.active = false;
      cancelAnimationFrame(this.animationFrameId);
      this.render();
    }
  }

  play() {
    if (!this.active) {
      this.time.lastActual = this.time.actual = performance.now();
      this.active = true;
      this.step();
    }
  }

  update() {
  }

  render() {
    let width = this.canvas.width;
    let height = this.canvas.height;
    
    let ctx = this.canvas.getContext('2d');
    
    ctx.fillStyle = this.active ? 'black' : 'gray';    
    ctx.fillRect(0, 0, width, height);
    
    for (var j = 0; j < this.mapheight; j++) {
      for (var i = 0; i < this.mapwidth; i++) {
        let c = TILES[this.map[j * this.mapwidth + i]];
        ctx.fillStyle = c;
        ctx.fillRect(i * this.gridsize, j * this.gridsize, this.gridsize, this.gridsize);        
      }
    }
  }

  step() {
    if (this.active) {
      this.animationFrameId = requestAnimationFrame(this.step.bind(this));
      this.frame++;

      this.time.actual = performance.now();
      this.time.delta = this.time.actual - this.time.lastActual;
      this.time.step = this.time.delta / 1000;

      this.update();
      this.render();

      this.time.lastActual = this.time.actual;
      this.time.game += this.time.step;
    }
  }

  onBlur() {
    this.pause();
  }

  onFocus() {
    this.play();
  }
  
  handleEvent(event) {
    if (event.type == 'focus') {
      this.onFocus();
    }
    else if (event.type == 'blur') {
      this.onBlur();
    }
    
  }

}
