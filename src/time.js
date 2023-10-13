// Função para inicializar o temporizador
function startTimer() {
  let startTime = Date.now();
  startTime = Date.now() - pausedTime;
  timerInterval = setInterval(() => updateTimer(startTime), 1000); // Atualiza a cada segundo
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

//pausar tempo

function pauseTimer(){
  clearInterval(timerInterval);
  pausedTime = Date.now() - startTime;
}

function resumeTimer(){
  startTime = Date.now()-pausedTime;
  startTimer();
}


