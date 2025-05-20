// Typewriter Effect
const words = ["Precision trades.", "Calm mindset.", "Phantom domination."];
let i = 0;
let timer;

function typingEffect() {
  let word = words[i].split("");
  let loopTyping = function () {
    if (word.length > 0) {
      document.getElementById("typewriter").innerHTML += word.shift();
    } else {
      deletingEffect();
      return false;
    }
    timer = setTimeout(loopTyping, 100);
  };
  loopTyping();
}

function deletingEffect() {
  let word = words[i].split("");
  let loopDeleting = function () {
    if (word.length > 0) {
      word.pop();
      document.getElementById("typewriter").innerHTML = word.join("");
    } else {
      i = (i + 1) % words.length;
      typingEffect();
      return false;
    }
    timer = setTimeout(loopDeleting, 50);
  };
  setTimeout(loopDeleting, 1000);
}

typingEffect();