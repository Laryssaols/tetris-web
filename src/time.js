<<<<<<< HEAD

let startTime = 0; 
let timerInterval;

//função de inicializar
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000); // Atualiza a cada segundo
=======
// Função para inicializar o temporizador
function startTimer() {
  let startTime = Date.now();
  startTime = Date.now() - pausedTime;
  timerInterval = setInterval(() => updateTimer(startTime), 1000); // Atualiza a cada segundo
>>>>>>> 59d0b8941f849ce41a3eb594d0fdd3b9bf4a4d6f
}

// Função para atualizar o tempo de partida
function updateTimer(startTime) {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

<<<<<<< HEAD
//func para quando reiniciar a partida 
Game.start = function () {
  Game.state = "running";
  startTimer();
  Game.state = 'running';

  Game.generateRandomPiece()

  return Game.animationId = requestAnimationFrame(Game.loop)
};
=======
//pausar tempo

function pauseTimer(){
  clearInterval(timerInterval);
  pausedTime = Date.now() - startTime;
}

function resumeTimer(){
  startTime = Date.now()-pausedTime;
  startTimer();
}

>>>>>>> 59d0b8941f849ce41a3eb594d0fdd3b9bf4a4d6f

