var audio = new Audio();
audio.loop = true;
audio.autoplay = true;
audio.setAttribute("style","display:none;");
var canvas, ctx, source, context, analyzer, fbc_array, bars, bar_x, bar_width, bar_height, triangles = [], squares = [], circles = [], midSum = 1, lowSum = 1, highSum = 1;
function createShape(x , y, check, shape) {
  var divShape = document.createElement("div");
  var size = 2 + Math.floor(Math.random() * 5);
  var posX = Math.floor(Math.random()*x);
  var posY = Math.floor(Math.random()*y);
  if (check == true) {
    posY = Math.floor(Math.random()*(0.05) * y + y);
  }
   if (shape == "triangle") {
  divShape.setAttribute("style","width: 0; height: 0; border-left: " + 10 * size + "px solid transparent;  border-right: " + 10*size + "px solid transparent; border-bottom:" + size*17 + "px solid #111; position:absolute;")
    divShape.style.opacity = 0.3 + 0.4 * Math.random();
  divShape.className = "triangle";
}
else if (shape == "square") {
  divShape.setAttribute("style","width: " + 5 * size + "; height: " + 5 * size + "; background-color: #111; position:absolute;")
    divShape.style.opacity = 0.4 + 0.6 * Math.random();
  divShape.className = "square";
}
else {
  divShape.setAttribute("style","width: " + 60 * size + "; height: " + 60 * size + "; border-radius:50%; background-color: #111; position:absolute;")
    divShape.style.opacity = 0.1 + 0.2 * Math.random();
  divShape.className = "circle";
}
  divShape.setAttribute("data-speed", 1/(size/7) * 30);
  divShape.setAttribute("data-hex", '#'+(Math.random()*0xFFFFFF<<0).toString(16));
  divShape.style.animationDuration = 5 * 1/(size/7)  + "s";

  divShape.addEventListener("transitionend", function() {
    if (shape == "triangle")
    this.style.borderBottomColor = "#111";
    else {
    this.style.backgroundColor = "#111";
    }
  });
  var shapeParent = document.createElement("div");
  shapeParent.setAttribute("style","position:absolute; top:" + posY + "px; left:" + posX  + "px; animation-name:move;  animation-iteration-count: 1;    animation-timing-function: linear;")
  shapeParent.setAttribute("data-shape", shape);
      // triParent.style.transitionDuration = "5s";
    // triParent.style.transform = "translateY(" + -posY + "px)";
  shapeParent.style.animationDuration=  5 * 1/(size/7) + "s";
  shapeParent.style.width="1px";
  shapeParent.style.height="100%";
  shapeParent.appendChild(divShape);
  shapeParent.addEventListener("animationend", function() {
    this.parentElement.removeChild(this);
    document.getElementById("container").appendChild(createShape(canvas.width, canvas.height, true, this.getAttribute("data-shape")));
  });
  if (shape == "triangle") {
    triangles = document.getElementsByClassName("triangle");
  }
  else if (shape == "square") {
    squares = document.getElementsByClassName("square");
  }
  else {
    circles = document.getElementsByClassName("circle");
  }
    // triangle.style.transform += "translate(0," + -posY + "px)";
  return shapeParent;
}

function end() {
  this.style.borderColor = "red";
}
window.onload = function init() {
  document.getElementById("audio_file").onchange = function() {
    var files = this.files;
    var file = URL.createObjectURL(files[0]);
    audio.src = file;
    audio.play();
  }
  document.getElementById('container').appendChild(audio);
  context = new AudioContext();
  analyzer = context.createAnalyser();
  analyzer.smoothingTimeConstant = 0.8;
  canvas = document.getElementById('analyzer');
  canvas.setAttribute("width", document.body.getBoundingClientRect().width + "px");
  canvas.setAttribute("height", document.body.getBoundingClientRect().height + "px");
  canvas.setAttribute("overflow", "hidden");
  // canvas.setAttribute("style","height:" + document.body.getBoundingClientRect().height + "px; width:" + document.body.getBoundingClientRect().width + "px;");
  ctx = canvas.getContext('2d');
  source = context.createMediaElementSource(audio);
  source.connect(analyzer);
  analyzer.connect(context.destination);
  for (var x = 0; x < 20; x++) {
    document.getElementById("container").appendChild(createShape(canvas.width, canvas.height * 1.12, false, "triangle"));
  }
  for (var x = 0; x < 30; x++) {
    document.getElementById("container").appendChild(createShape(canvas.width, canvas.height * 1.12, false, "square"));
  }
  for (var x = 0; x < 10; x++) {
    document.getElementById("container").appendChild(createShape(canvas.width, canvas.height * 1.12, false, "circle"));
  }
  triangles = document.getElementsByClassName("triangle");
  ctx.translate(canvas.width/2, canvas.height/2);

  frameLooper();
      // ctx.translate(canvas.width/2, canvas.height/2);
}
function frameLooper() {
  window.requestAnimationFrame(frameLooper);
  fbc_array = new Uint8Array(analyzer.frequencyBinCount);
  analyzer.getByteFrequencyData(fbc_array);
  ctx.clearRect(-canvas.width/2,-canvas.height/2,canvas.width, canvas.height);
  bars = 200;

    // triangles[x].setAttribute("rotation", (triangles[x].getAttribute("rotation") + 1) % 360);
  // }
  var newMidSum = 0, newLowSum = 0, newHighSum = 0;
  for (var i = 0; i < bars; i++) {
    bar_width = 4;
    if (i < 67) {
      newLowSum += fbc_array[i];
    }
    else if (i < 134) {
      newMidSum += fbc_array[i];
    }
    else {
      newHighSum += fbc_array[i];
    }
    // bar_width = canvas.width/bars;
    bar_height = -(fbc_array[i])/255 * canvas.height/2 * 0.9;
    var grd = ctx.createLinearGradient(0,0,bar_width, bar_height);
    grd.addColorStop(1, "#4d001f");
    grd.addColorStop(0, "#333");
    ctx.fillStyle = grd;
    ctx.rotate(360/bars*Math.PI/180)
    ctx.fillRect(0, 0, bar_width, bar_height);
  }
//  console.log(newSum/sum)
  if (newMidSum/midSum * 100  > 112 ) {
    for (var x = 0; x < triangles.length; x++) {
          triangles[x].style.borderBottomColor = triangles[x].getAttribute("data-hex");
      }
  }
  if (newHighSum/highSum * 100 > 112) {
    for (var x = 0; x < squares.length; x++) {
        squares[x].style.backgroundColor = squares[x].getAttribute("data-hex");
    }
  }
  if (newLowSum/lowSum * 100 > 112) {
    for (var x = 0; x < circles.length; x++) {
      circles[x].style.backgroundColor = circles[x].getAttribute("data-hex");
    }
  }

  midSum = newMidSum;
  lowSum = newLowSum;
  highSum = newHighSum;
}
