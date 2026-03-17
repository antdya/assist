// chatBot.js для assist.html

function appendMessage(text, sender, isHtml = false) {
  // контейнер сообщений в assist.html
  const container = document.getElementById("messages");
  if (!container) return;

  const msg = document.createElement("div");
  msg.classList.add("msg");
  msg.classList.add(sender === "user" ? "user" : "ai");

  const avatar = document.createElement("div");
  avatar.classList.add("msg-avatar");
  avatar.classList.add(sender === "user" ? "user-av" : "ai");
  avatar.textContent = sender === "user" ? "Вы" : "AI";

  const content = document.createElement("div");
  content.classList.add("msg-content");

  const bubble = document.createElement("div");
  bubble.classList.add("msg-bubble");
  if (isHtml) {
    bubble.innerHTML = text;
  } else {
    bubble.textContent = text;
  }

  content.appendChild(bubble);
  msg.appendChild(avatar);
  msg.appendChild(content);
  container.appendChild(msg);

  container.scrollTop = container.scrollHeight;
}

// поиск ответа по ключевым словам (как было)
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
    if (
      score > 0 &&
      (score > best.score ||
        (score === best.score && item.priority > best.priority))
    ) {
      best = { score, priority: item.priority, item };
    }
  }
  return best.item || null;
}

// основной хендлер ввода
function handleUserInput() {
  const input = document.getElementById("user-input");
  const btn = document.getElementById("send-btn");
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user", false);
  input.value = "";
  if (typeof autoResize === "function") {
    autoResize(input);
  }

  if (btn) btn.disabled = true;

  // скрываем welcome-экран при первом сообщении
  const welcome = document.getElementById("welcome-screen");
  if (welcome && !welcome.dataset.hidden) {
    welcome.style.display = "none";
    welcome.dataset.hidden = "1";
  }

  setTimeout(() => {
    const item = getBotAnswerByKeywords(text);
    if (item) {
      appendMessage(item.answer, "bot", true);
    } else {
      appendMessage(defaultAnswer, "bot", false);
    }
    if (btn) btn.disabled = false;
    input.focus();
  }, 300);
}

// инициализация на DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("user-input");
  const btn = document.getElementById("send-btn");

  if (!input || !btn) return;

  btn.addEventListener("click", handleUserInput);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserInput();
    }
  });

  // приветственное сообщение
  appendMessage(
    "Здравствуйте! Кратко опишите вашу ситуацию: например, «покупаю вместо аренды» или «разъезжаюсь с родителями».",
    "bot",
    false
  );
});

// вспомогательные функции для assist.html
window.sendChipMessage = function (text) {
  const input = document.getElementById("user-input");
  input.value = text;
  handleUserInput();
};

window.startScenario = function (code) {
  const map = {
    first: "Покупаю квартиру первый раз — с чего начать?",
    mortgage: "Хочу купить квартиру в ипотеку",
    invest: "Хочу купить квартиру для инвестиций или сдачи",
    secondary: "Что лучше: новостройка или вторичка?"
  };
  const text = map[code] || "Хочу подобрать квартиру";
  const input = document.getElementById("user-input");
  input.value = text;
  handleUserInput();
};
