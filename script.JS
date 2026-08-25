// --- FOYDALANUVCHI ID TIZIMI (Faylning eng boshiga yoziladi) ---
let userId = localStorage.getItem('gameDropUserId');
if (!userId) {
  userId = 'GD-' + Math.floor(1000 + Math.random() * 9000);
  localStorage.setItem('gameDropUserId', userId);
}

window.addEventListener('DOMContentLoaded', () => {
  const idSpan = document.getElementById('userIdDisplay');
  if (idSpan) idSpan.innerText = userId;
});
let userBalance = 0;
let inventory = [];
let selectedCase = null;

const casesData = [
  { id: 1, title: "PUBG Bronze", price: 79, img: "pubg-bronze.jpg", items: ["10 UC", "30 UC", "60 UC", "15 UC", "5 UC", "25 UC"] },
  { id: 2, title: "PUBG Silver", price: 149, img: "pubg-silver.jpg", items: ["60 UC", "120 UC", "180 UC", "15 UC"] },
  { id: 3, title: "PUBG Gold", price: 649, img: "pubg-gold.jpg", items: ["325 UC", "660 UC", "1800 UC", "12 oy prime plus"] },
  { id: 4, title: "Free Fire Mini", price: 79, img: "ff-mini.jpg", items: ["20 Diamond", "50 Diamond", "100 Diamond"] },
  { id: 5, title: "Free Fire Max", price: 499, img: "ff-max.jpg", items: ["100 Diamond", "310 Diamond", "520 Diamond", "Booyah Pass"] }
];

const grid = document.getElementById('casesGrid');
const track = document.getElementById('track');

casesData.forEach(c => {
  const card = document.createElement('div');
  card.className = 'case-card';
  card.onclick = () => openRouletteModal(c);
  card.innerHTML = `
    <div class="case-img-box">
      <img src="${c.img}" alt="${c.title}" class="case-img">
    </div>
    <div class="case-title">${c.title}</div>
    <div class="case-price">${c.price} G</div>
  `;
  grid.appendChild(card);
});

function openRouletteModal(c) {
  selectedCase = c;
  document.getElementById('modalTitle').innerText = `${c.title} (${c.price} G)`;
  document.getElementById('win-message').innerText = '';
  document.getElementById('spinBtn').disabled = false;
  document.getElementById('rouletteModal').style.display = 'flex';
  initTrack();
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  if(id === 'rouletteModal') {
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
  }
}

function initTrack() {
  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  track.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const item = selectedCase.items[Math.floor(Math.random() * selectedCase.items.length)];
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerText = item;
    track.appendChild(div);
  }
}

function spin() {
  if (userBalance < selectedCase.price) {
    alert("Mablağ yetarli emas! Balansni to'ldiring.");
    return;
  }

  userBalance -= selectedCase.price;
  document.getElementById('userBalance').innerText = userBalance;

  const spinBtn = document.getElementById('spinBtn');
  spinBtn.disabled = true;
  document.getElementById('win-message').innerText = "Aylanmoqda...";

  const wonItem = selectedCase.items[Math.floor(Math.random() * selectedCase.items.length)];
  const targetIndex = 40;

  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  track.innerHTML = '';

  for (let i = 0; i < 60; i++) {
    const div = document.createElement('div');
    div.className = 'item-card';
    if (i === targetIndex) {
      div.innerText = wonItem;
    } else {
      div.innerText = selectedCase.items[Math.floor(Math.random() * selectedCase.items.length)];
    }
    track.appendChild(div);
  }

  const wrapperWidth = document.querySelector('.roulette-wrapper').clientWidth;
  const itemFullWidth = 110; 
  const targetCenter = (targetIndex * itemFullWidth) + (itemFullWidth / 2);
  const targetPosition = (wrapperWidth / 2) - targetCenter;

  setTimeout(() => {
    track.style.transition = 'transform 5s cubic-bezier(0.1, 1, 0.1, 1)';
    track.style.transform = `translateX(${targetPosition}px)`;

    setTimeout(() => {
      document.getElementById('win-message').innerText = `Siz yutdingiz: ${wonItem}! 🎉`;
      inventory.push(wonItem);
      document.getElementById('invCount').innerText = inventory.length;
      spinBtn.disabled = false;
    }, 5000);
  }, 100);
}

function openInventory() {
  const list = document.getElementById('inventoryList');
  if (inventory.length === 0) {
    list.innerHTML = `<p style="color: #94a3b8; width: 100%;">Inventaringiz bo'sh.</p>`;
  } else {
    list.innerHTML = inventory.map(item => `<div class="inv-item">${item}</div>`).join('');
  }
  document.getElementById('inventoryModal').style.display = 'flex';
}

function addCoins() {
  document.getElementById('topupModal').style.display = 'flex';
}

function buyPkg(coins, price) {
  userBalance += coins;
  document.getElementById('userBalance').innerText = userBalance;
  alert(`${price.toLocaleString()} so'mga ${coins} G xarid qilindi!`);
  closeModal('topupModal');
}function openInventory() {
  const list = document.getElementById('inventoryList');
  if (inventory.length === 0) {
    list.innerHTML = `<p style="color: #94a3b8; width: 100%;">Inventaringiz bo'sh.</p>`;
  } else {
    // Har bir yutuq uchun alohida quti va Telegramga yuborish tugmasini qo'shamiz
    // 'YOUR_TELEGRAM_USERNAME' yozilgan joyga o'zingizning Telegram username'ingizni yozing (masalan: @username)
    list.innerHTML = inventory.map((item, index) => `
      <div class="inv-item" style="display: flex; justify-content: space-between; align-items: center; width: 100%; background: #1e293b; padding: 10px 15px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #334155;">
        <span style="color: #fff; font-weight: 600;">${item}</span>
        <button onclick="sendToTelegram('${item}')" style="background: #229ed9; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">Telegramga yuborish</button>
      </div>
    `).join('');
  }
  document.getElementById('inventoryModal').style.display = 'flex';
}

// Telegramga yo'naltiruvchi funksiya
function sendToTelegram(item) {
  const myTelegramUsername = "@Hack_Games_0712"; // <-- Shu yerga o'z Telegram username'ingizni yozing (masalan: johndoe)
  const message = encodeURIComponent(`Salom! Men GameDrop o'yinidan "${item}" yutib oldim va buni yechib/olib bermoqchiman.`);
  const telegramUrl = `https://t.me/${myTelegramUsername}?text=${message}`;
  
  window.open(telegramUrl, '_blank');
}// Eski buyPkg funksiyasining o'rniga buni yozamiz:
function buyPkg(coins, price) {
  closeModal('topupModal');
  
  // O'zingizning karta raqamingizni yoki Paynet raqamingizni shu yerga yozing:
  const cardNumber = "7777 0145 6112 5276"; 
  const cardHolder = "Owner";
  const myTelegramUsername = "@Hack_Games_0712"; // <-- Telegram username'ingiz
  
  // Tasdiqlash oynasini chiqaramiz yoki alert orqali ma'lumot beramiz
  const message = `Siz ${coins} G ( ${price.toLocaleString()} so'm) xarid qilmoqchisiz.\n\n` +
    `1. Pulni quyidagi kartaga o'tkazing:\nKarta: ${cardNumber}\nEgasi: ${cardHolder}\n\n` +
    `2. To'lov qilinganidan so'ng, chek rasmini Telegram orqali quyidagi manzilga yuboring:\n@${myTelegramUsername}\n\n` +
    `Chek yuborilgandan so'ng balansingizga tangalar qo'shib beriladi!`;

  // Telegramga to'g'ridan-to'g'ri o'tish uchun havola tayyorlaymiz
  const tgUrl = `https://t.me/${myTelegramUsername}?text=${encodeURIComponent(`Salom! Men ${price.toLocaleString()} so'm to'ladim va ${coins} G sotib olmoqchiman. Mana chek:`)}`;

  if (confirm(message + "\n\n[OK] tugmasini bossangiz, Telegram ochiladi va chekni yuborishingiz mumkin!")) {
    window.open(tgUrl, '_blank');
  }
}
// Admin panelni ochish (Parol bilan himoyalash ham mumkin)
function openAdminPanel() {
  const password = prompt("Admin parolini kiriting:");
  // O'zingizga yoqqan parolni shu yerga yozing (masalan: "1234")
  if (password === "Admin0712") { 
    document.getElementById('adminModal').style.display = 'flex';
  } else if (password !== null) {
    alert("Parol noto'g'ri!");
  }
}

// Admin orqali balansga tanga qo'shish
function adminAddCoins() {
  const inputVal = document.getElementById('adminCoinsInput').value;
  const coinsToAdd = parseInt(inputVal);

  if (isNaN(coinsToAdd) || coinsToAdd <= 0) {
    alert("Iltimos, to'g'ri miqdor kiriting!");
    return;
  }

  // Balansga qo'shamiz
  userBalance += coinsToAdd;
  document.getElementById('userBalance').innerText = userBalance;
  
  alert(`Muvaffaqiyatli! Foydalanuvchi balansiga ${coinsToAdd} G qo'shildi.`);
  document.getElementById('adminCoinsInput').value = '';
  closeModal('adminModal');
}
