// chatBot.js

function appendMessage(text, sender, isHtml = false) {
  const container = document.getElementById("chatMessages");
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  if (isHtml) {
    msg.innerHTML = text;      // используем HTML‑разметку ответа
  } else {
    msg.textContent = text;    // безопасный текст для пользователя
  }

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function getBotAnswerByKeywords(text) {
  const normalized = text.toLowerCase();
  let best = { score: 0, priority: -1, item: null };

  for (const item of knowledgeBase) {
    let score = 0;
    for (const k of item.keywords) {
      if (normalized.includes(k.toLowerCase())) {
        score++;
      }
    }
    if (score > 0 && (score > best.score || (score === best.score && item.priority > best.priority))) {
      best = { score, priority: item.priority, item };
    }
  }

  return best.item || null;
}

function handleUserInput() {
  const input = document.getElementById("userInput");
  const btn = document.getElementById("sendBtn");
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user", false);
  input.value = "";
  btn.disabled = true;

  setTimeout(() => {
    const item = getBotAnswerByKeywords(text);

    if (item) {
      // HTML‑ответ из faqData.js
      appendMessage(item.answer, "bot", true);
    } else {
      // fallback‑текст
      appendMessage(defaultAnswer, "bot", false);
    }

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

  appendMessage(
    "Здравствуйте! Кратко опишите вашу ситуацию: например, «покупаю вместо аренды» или «разъезжаюсь с родителями».",
    "bot",
    false
  );
});
