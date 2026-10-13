const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?"
};

const HISTORY_KEY = "password-generator-history";
const THEME_KEY = "password-generator-theme";
const MAX_HISTORY = 5;

const passwordEl = document.getElementById("password");
const copyBtn = document.getElementById("copy-btn");
const generateBtn = document.getElementById("generate-btn");
const lengthEl = document.getElementById("length");
const lengthValue = document.getElementById("length-value");
const messageEl = document.getElementById("message");
const strengthFill = document.getElementById("strength-fill");
const strengthText = document.getElementById("strength-text");
const historyEl = document.getElementById("history");
const historyEmpty = document.getElementById("history-empty");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");
const checkboxes = {
  uppercase: document.getElementById("uppercase"),
  lowercase: document.getElementById("lowercase"),
  numbers: document.getElementById("numbers"),
  symbols: document.getElementById("symbols")
};

let history = loadHistory();
let messageTimer;

// Random number from the browser's secure generator (better than Math.random)
function secureRandom(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

function generatePassword() {
  const selected = Object.keys(checkboxes).filter(key => checkboxes[key].checked);

  if (selected.length === 0) {
    showMessage("Select at least one character type.");
    return;
  }

  const length = Number(lengthEl.value);
  const pool = selected.map(key => CHARS[key]).join("");

  // Guarantee at least one character from each selected type
  const result = selected.map(key => CHARS[key][secureRandom(CHARS[key].length)]);

  while (result.length < length) {
    result.push(pool[secureRandom(pool.length)]);
  }

  // Shuffle so the guaranteed characters aren't always at the start
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  const password = result.join("").slice(0, length);
  passwordEl.value = password;
  updateStrength(password, selected.length);
  addToHistory(password);
  showMessage("");
}

function updateStrength(password, typeCount) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (typeCount >= 3) score++;
  if (typeCount === 4) score++;

  const levels = [
    { label: "Very weak", color: "#ef4444", width: 20 },
    { label: "Weak", color: "#f97316", width: 40 },
    { label: "Okay", color: "#eab308", width: 60 },
    { label: "Strong", color: "#22c55e", width: 80 },
    { label: "Very strong", color: "#16a34a", width: 100 }
  ];

  const level = levels[Math.min(Math.max(score - 1, 0), 4)];
  strengthFill.style.width = level.width + "%";
  strengthFill.style.background = level.color;
  strengthText.textContent = level.label;
}

async function copyText(text, successMessage) {
  if (!text) {
    showMessage("Generate a password first.");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showMessage(successMessage);
  } catch {
    showMessage("Couldn't copy. Select the text and copy it manually.");
  }
}

function showMessage(text) {
  messageEl.textContent = text;
  clearTimeout(messageTimer);
  if (text) messageTimer = setTimeout(() => (messageEl.textContent = ""), 2500);
}

function loadHistory() {
  try {
    return JSON.parse(sessionStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function addToHistory(password) {
  history.unshift(password);
  history = history.slice(0, MAX_HISTORY);
  // sessionStorage clears when the tab closes, so passwords aren't kept long term
  sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyEl.innerHTML = "";
  history.forEach(pw => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = pw;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "secondary";
    btn.textContent = "Copy";
    btn.addEventListener("click", () => copyText(pw, "Copied!"));
    li.append(span, btn);
    historyEl.appendChild(li);
  });
  historyEmpty.classList.toggle("hidden", history.length > 0);
  clearBtn.classList.toggle("hidden", history.length === 0);
}

function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeToggle.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
}

lengthEl.addEventListener("input", () => {
  lengthValue.textContent = lengthEl.value;
});
generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", () => copyText(passwordEl.value, "Copied!"));
clearBtn.addEventListener("click", () => {
  history = [];
  sessionStorage.removeItem(HISTORY_KEY);
  renderHistory();
});
themeToggle.addEventListener("click", () => applyTheme(!document.body.classList.contains("dark")));

applyTheme(localStorage.getItem(THEME_KEY) === "dark");
renderHistory();
generatePassword();
