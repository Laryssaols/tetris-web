let timerInterval;
    let startTime;
    let isGameRunning = false;

    function startGame() {
      if (!isGameRunning) {
        startTime = Date.now();
        isGameRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
        document.getElementById("endButton").removeAttribute("disabled");
        document.getElementById("startButton").setAttribute("disabled", "true");
      }
    }

    function endGame() {
      if (isGameRunning) {
        clearInterval(timerInterval);
        isGameRunning = false;
        document.getElementById("endButton").setAttribute("disabled", "true");
        document.getElementById("startButton").removeAttribute("disabled");
      }
    }

    function updateTimer() {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = elapsedTime % 60;
      document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    document.getElementById("startButton").addEventListener("click", startGame);
    document.getElementById("endButton").addEventListener("click", endGame);
