let startTime = 0; 
let timerInterval;

//função de inicializar
let startTime = 0; // Variável para armazenar o tempo de início da partida
let pausedTime = 0; // Variável para armazenar o tempo de pausa
let timerInterval; // Intervalo para atualizar o tempo

// Função para inicializar o temporizador
function startTimer() {
  startTime = Date.now() - pausedTime;
  timerInterval = setInterval(updateTimer, 1000); // Atualiza a cada segundo
}

// Função para atualizar o tempo de partida
function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Função para pausar o temporizador
function pauseTimer() {
  clearInterval(timerInterval);
  pausedTime = Date.now() - startTime;
}

function resumeTimer() {
  startTime = Date.now() - pausedTime;
  startTimer();
}

// Outras funções e código relacionado ao temporizador
