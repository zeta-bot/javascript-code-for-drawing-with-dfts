let signalX = []; 
let signalY = [];
let fourierY; 
let fourierX;
let time = 0; 
let path = []; 

const TWO_PI = 2 * Math.PI; 
const HALF_PI = Math.PI / 2; 

function setup() {
  createCanvas(3000, 3000);
  const skip = 8;
  for(let i = 0; i < Drawing.length;i+=skip){
    signalX.push(Drawing[i].y);
    signalY.push(Drawing[i].x);
  }
  fourierY = dft(signalY);
  fourierX = dft(signalX);
}

function dft(x) {
  let X = [];
  let N = x.length;
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      let theta = (TWO_PI * k * n) / N;
      re += x[n] * cos(theta);
      im += (-1) * x[n] * sin(theta);
    }
    re = re / N;
    im = im / N;

    let freq = k;
    let amp = sqrt(re * re + im * im);
    let ang = atan2(im, re);
    X[k] = { re, im, freq, amp, ang };
  }
  return X;
}
function epicycles(x,y,rotation,fourier){
    for (let i = 0; i < fourier.length; i++) {
        let prevx = x;
        let prevy = y;
    
        let freq = fourier[i].freq;
        let radius = fourier[i].amp;
        let ang = fourier[i].ang;
        x += radius * cos(freq * time + ang +rotation);
        y += radius * sin(freq * time + ang +rotation);
    
        stroke(255, 100);
        noFill();
        ellipse(prevx, prevy, radius * 2);
        stroke(255);
        line(prevx, prevy, x, y);
      }
  return createVector(x,y);
}
function draw() {
  background(0);
  let vx = epicycles(400,50,0,fourierX);
  let vy = epicycles(50,200,HALF_PI,fourierY);
  let output = createVector((vx.x)/2,(vy.y)/2);
 
  path.unshift(output);
  line(vx.x, vx.y, output.x, output.y);
  line(vy.x, vy.y, output.x, output.y);
  beginShape();
  noFill();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].x, path[i].y);
  }
  endShape();
  const dt = TWO_PI / fourierY.length;
  time += dt;

  //if (wave.length > 250) {
  //  wave.pop();
  //}
}
