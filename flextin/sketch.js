let video;

let posesCuerpo;

let poses = [];

let boton;

let logo;

let robotito;

let blasco;

let mujer;

let minimo;

let maximo;


function preload() {
  posesCuerpo = ml5.bodyPose("MoveNet", {flipped: false })
  
  logo = loadImage('imagenLogo.png');
  robotito = loadImage('robot.png');
  blasco = loadImage('ies.png');
  mujer = loadImage('mujer.png')
  
}

 function botonPressed() {
  saveCanvas(video, 'elasticidad', 'png');
}

function tenemosPose(resultado) {
  poses = resultado;
}

function setup() { 
  
   createCanvas(1020,800);
  textSize(18)
  

  
  text("Nombre:", 20, 20);
  nombreAlumno = createInput();
  nombreAlumno.position(790, 100);
  
  text("Clase:", 20, 20);
  grupoAlumno = createInput();
  grupoAlumno.position(790, 160);
  

  boton = createButton('Guardar Resultado');
  boton.position(800,525);
  boton.size(180,100);
  boton.style('font-size','24px');
  
  boton.mousePressed(guardarImagen);

 

  video = createCapture(VIDEO, { flipped: false });
  video.size(750, 600);
  video.hide();
  posesCuerpo.detectStart(video, tenemosPose);
  connections = posesCuerpo.getSkeleton();
  
  posesCuerpo.detectStart(video, tenemosPose);
  textSize(30);
}

function draw() {

  rect(50,50,50,50);

   background('grey');  
    image(video, 0, 0);
  image(logo, 712, 530);
    image(video, 0, 0);
  image(robotito,770,325);
    image(video, 0, 0);
  image(blasco, 750,-10);
      image(video, 0, 0);
  image(mujer, -120,17);
  
  
  if (poses.length > 0) {
    
    let pose = poses[0];
    for(let i = 0; i < pose.keypoints.length; i++) {
      let keypoint = pose.keypoints[i];
       noStroke();
       if (keypoint.confidence > 0.1) {
          circle(keypoint.x, keypoint.y, 12);
           fill(0,0,255);
       }
    }  
    for(let i = 0; i < connections.length; i++) {
       let connection = connections [i];
       let a = connection[0];
       let b = connection[1];
       let keyPointA= pose.keypoints[a];
       let keyPointB= pose.keypoints[b];
       stroke(0,255,0);
       strokeWeight(4);
       line(keyPointA.x, keyPointA.y, keyPointB.x, keyPointB.y, );
    }
    
    
    noStroke();
    textSize(18);
    if (alineado(poses[0].left_ankle.x, poses[0].left_ankle.y, poses[0].left_knee.x, poses[0].left_knee.y, poses[0].left_hip.x, poses[0].left_hip.y)) {
      fill("rgba(49,238,31,0.4)")
    } else  {
      fill("rgba(173,57,34,0.4)") 
    }
   rect (780,193,200,130);
   if (alineado(poses[0].left_ankle.x, poses[0].left_ankle.y, poses[0].left_knee.x, poses[0].left_knee.y, poses[0].left_hip.x, poses[0].left_hip.y)) {
     
      fill("rgba(49,238,31,0.4)")
     
     let distancia1 = dist(poses[0].left_hip.x, poses[0].left_hip.y,poses[0].left_ankle.x, poses[0].left_ankle.y);
     let distancia2 = dist(poses[0].left_hip.x, poses[0].left_hip.y, poses[0].left_hip.x, poses[0].left_wrist.y,);
     
         
     if (poses[0].left_hip.y>poses[0].left_wrist.y) {
       distancia3 = " "
     } else {   
       noStroke();
       textSize(70);
       fill('rgb(44,201,31)')
       let distancia3 = (distancia2/distancia1) * 100; 
       distancia3 = distancia3.toFixed(1);
   
       
   text (distancia3 + "%", 520, 75);
     }
     
     
    } else  {
      fill("rgba(173,57,34,0.4)") 
    }
    
   noStroke();
       textSize(16);

    fill("white");
    text("rodilla Y: " + round(poses[0].left_knee.y) ,791,215);
    text("rodilla X: " + round(poses[0].left_knee.x) ,791,235);
    text("tobillo Y: " + round(poses[0].left_ankle.y) ,791,255);
    text("tobillo X: " + round(poses[0].left_ankle.x) ,791,275);
    text("cadera Y: " + round(poses[0].left_hip.y) ,791,295);
    text("cadera X: " + round(poses[0].left_hip.x) ,791,315);
    


  }  

     noStroke();
   textSize(18);
  fill("rgb(255,12,12)");
  text("Alumno/a:" ,840,90);
  
       noStroke();
   textSize(18);
  fill("rgb(255,12,12)");
  text("Grupo:" ,852,150);
  
      noStroke();
  textSize (15);
  fill('rgb(255,255,255)')
  text("1.Poner la cámara de manera que se vea al alumno/a de la cabeza a los pies.",220, 635);
  text("2.Poner donde pone “Alumno/a:” el nombre del alumno y donde pone",220, 655);
  text("“Grupo:” poner el grupo.",220,675);
  text("3.El alumno/a realiza la pose indicada; el sistema mostrará un porcentaje",220, 695);
  text("de corrección y un mensaje de “bien alineado” o “mal alineado” según",220, 715);
  text("la posición de brazos y piernas.",220, 735)
  text("4.Durante la pose, pulsar “Guardar Resultado” para descargar",220, 755);
  text("automáticamente una imagen PNG de la pose con el nombre del alumno/a.", 220, 775);

}

function guardarImagen() {
  let recorte = get(0, 0, 750, 600);
  let nombre = nombreAlumno.value();
  let grupo = grupoAlumno.value();
  
     if (nombre === ''||grupo === '') {
       alert('Tienes que poner nombre y grupo');
    }
    else{
      save(recorte, nombre +'_'+ grupo + '.png');
    }

  
  }


function alineado(tobilloX, tobilloY, rodillaX, rodillaY, caderaX, caderaY) {
  let tolerancia = 10.2;
  let pendiente1 = (caderaY-rodillaY)/(caderaX-rodillaX);
  let pendiente2 = (caderaY-tobilloY)/(caderaX-tobilloX);
  let diferencia = abs(pendiente1-pendiente2);
  
    if (diferencia<tolerancia) {
      return true;
    } 
  else {
      return false;
    }
  
}

