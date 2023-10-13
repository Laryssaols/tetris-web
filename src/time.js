
let startTime = 0; // Variável para armazenar o tempo de início da partida
let timerInterval; // Intervalo para atualizar o tempo

//função de inicializar
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000); // Atualize a cada segundo
}

//função para atualizar tempo de partida 
function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

//func para quando reiniciar a partida 
Game.start = function () {
  Game.state = "running";
  startTimer(); // Inicie o temporizador
  Game.state = 'running';

  Game.generateRandomPiece()

  return Game.animationId = requestAnimationFrame(Game.loop)
};

