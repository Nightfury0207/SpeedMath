const startBtn = document.getElementById("start-btn");
const endBtn = document.getElementById("end-btn");
const question = document.getElementById("question");
const controls = document.querySelector(".controls-container");
const result = document.getElementById("result");
const wait = document.getElementById("wait");
const timerval = document.getElementById("timer");
const submitBtn = document.getElementById("submit-btn");
const errorMessage = document.getElementById("error-msg");
let inputValue;
var highscore = 0;
var solution;
var userInput;
var randomOperator;
var scoreval;
var isPaused = false;

function loadHighscore() {
  let scorefromBrowser = localStorage.getItem("highscore");
  if (scorefromBrowser) {
    highscore = scorefromBrowser;
    result.innerHTML = "HighScore: " + highscore;
  }
}
window.addEventListener("load", loadHighscore);

//Random Value Generator
const randomValue = (min, max) => Math.floor(Math.random() * (max - min)) + min;

//Operation Functions
const addOperation = (operand1, operand2) => operand1 + operand2;
const subtractOperation = (operand1, operand2) => operand1 - operand2;
const multiplyOperation = (operand1, operand2) => operand1 * operand2;

let operators = [addOperation, subtractOperation, multiplyOperation];

//setting <funtion.name> property for operation funtions to be used in creating question statement in line 44.
Object.defineProperty(addOperation, "name", { value: "+" });
Object.defineProperty(subtractOperation, "name", { value: "-" });
Object.defineProperty(multiplyOperation, "name", { value: "x" });

//Takes in Operands and Operator to evaluate and return the answer.
function evaluate(operand1, operand2, randomOperator) {
  return randomOperator(operand1, operand2);
}

function questionGenerator() {
  //Chooses 2 Random numbers as Operands to generate a question.
  let [num1, num2] = [randomValue(1, 20), randomValue(1, 20)];

  //Chooses a Mathematical Operation at Random to generate a Question.
  randomOperator = operators[Math.floor(Math.random() * operators.length)];

  if (randomOperator == subtractOperation && num2 > num1) {
    [num1, num2] = [num2, num1];
  }

  //Calculates the correct answer for the question generated.
  solution = evaluate(num1, num2, randomOperator);
  question.innerHTML =
    num1 +
    " " +
    randomOperator.name +
    " " +
    num2 +
    "=" +
    '<input type="number" id="inputValue" placeholder="?">';
  inputValue = document.getElementById("inputValue");
  inputValue.focus();
  inputValue.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
      submitBtn.click();
    }
  });
}

function startTimer(timeLeft) {
  timerval.innerHTML = "Time Left: " + timeLeft;
  let timer = setInterval(() => {
    if (!isPaused) {
      timeLeft = timeLeft - 1;
      if (timeLeft >= 0) timerval.innerHTML = "Time Left: " + timeLeft;
      else {
        clearInterval(timer);
        stopGame();
      }
    }
  }, 1000);
}

function startGame() {
  scoreval = 0;
  questionGenerator();
  startTimer(30);
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hide");
  controls.classList.add("hide");
  startBtn.classList.add("hide");
}

function submit() {
  errorMessage.classList.add("hide");
  userInput = document.getElementById("inputValue").value;
  if (userInput) {
    if (userInput == solution) {
      scoreval = scoreval + 1;
      console.log(scoreval);
      continueGame(
        `Yippie!! <span style="color:#008000;">Correct</span> Answer`
      );
    } else {
      continueGame(`Oops!! <span style="color:#FF0000;">Wrong</span> Answer`);
    }
  } else {
    errorMessage.classList.remove("hide");
    errorMessage.innerHTML = "Input Cannot Be Empty";
  }
}

function continueGame(resultText) {
  isPaused = true;
  result.innerHTML = resultText;
  wait.innerHTML = "Wait for next Question...";
  controls.classList.remove("hide");

  setTimeout(() => {
    questionGenerator();
    isPaused = false;
    errorMessage.innerHTML = "";
    wait.innerHTML = "";
    errorMessage.classList.add("hide");
    controls.classList.add("hide");
  }, 2000);
}

function stopGame() {
  result.innerHTML = "Time Up!!!<br>Your Score: " + scoreval;
  wait.innerHTML = "Last Highscore: " + highscore;
  startBtn.innerText = "Play Again";
  controls.classList.remove("hide");
  startBtn.classList.remove("hide");
  endBtn.classList.remove("hide");
  if (scoreval > highscore) {
    highscore = scoreval;
    localStorage.setItem("highscore", highscore);
    wait.innerText = "CONGRATULATIONS!!! NEW HIGH SCORE SET";
  }
}

startBtn.addEventListener("click", startGame);
//startBtn.addEventListener("click", window.location.reload(););
submitBtn.addEventListener("click", submit);
