// chatBot.js

function appendMessage(text, sender) {
  const container = document.getElementById("chatMessages");
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function getBotAnswerByKeywords(text) {
  const normalized = text.toLowerCase();
  let best = { score: 0, priority: -1, answer: null };

  for (const item of knowledgeBase) {
    let score = 0;
    for (const k of item.keywords) {
      if (normalized.includes(k.toLowerCase())) {
        score++;
      }
    }
    if (score > 0 && (score > best.score || (score === best.score && item.priority > best.priority))) {
      best = { score, priority: item.priority, answer: item.answer };
    }
  }

  return best.answer || defaultAnswer;
}

function handleUserInput() {
  const input = document.getElementById("userInput");
  const btn = document.getElementById("sendBtn");
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  input.value = "";
  btn.disabled = true;

  setTimeout(() => {
    const answer = getBotAnswerByKeywords(text);
    appendMessage(answer, "bot");
    btn.disabled = false;
    input.focus();
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const btn = document.getElementById("sendBtn");

  btn.addEventListener("click", handleUserInput);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserInput();
    }
  });

  appendMessage("Здравствуйте! Я помогу с вопросами по покупке квартиры. Спросите про ипотеку, бюджет, район, дом, квартиру или документы.", "bot");
});
