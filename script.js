// Foydalanuvchi ID sini yaratish yoki yuklab olish
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = Math.floor(100000 + Math.random() * 900000); // 6 xonali noyob ID
  localStorage.setItem('userId', userId);
}

let userBalance = parseInt(localStorage.getItem('userBalance')) || 0;
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let selectedCase = null;

// Keyslar ro'yxati (rasm yo'llari to'g'irlandi va siz bergan narxlar qo'yildi)
const casesData = [
  { id: 1, title: "PUBG Bronze", price: 99, img: "pubg-bronze.jpg", items: ["10 UC", "30 UC", "60 UC", "15 UC", "5 UC", "25 UC"] },
  { id: 2, title: "PUBG Silver", price: 149, img: "pubg-silver.jpg", items: ["60 UC", "120 UC", "180 UC", "15 UC"] },
  { id: 3, title: "PUBG Gold", price: 699, img: "pubg-gold.jpg", items: ["325 UC", "660 UC", "1800 UC", "12 oy prime plus"] },
  { id: 4, title: "Free Fire Mini", price: 99, img: "ff-mini.jpg", items: ["20 Diamond", "50 Diamond", "100 Diamond"] },
  { id: 5, title: "Free Fire Max", price: 399, img: "ff-max.jpg", items: ["100 Diamond", "310 Diamond", "520 Diamond", "Booyah Pass"] }
];

// Ma'lumotlarni saqlash va ekranni yangilash
function saveData() {
  localStorage.setItem('userBalance', userBalance);
  localStorage.setItem('inventory', JSON.stringify(inventory));
  
  const balanceEl = document.getElementById('userBalance');
  const userIdEl = document.getElementById('displayUserId');
  const invCountEl = document.getElementById('invCount');

  if (balanceEl) balanceEl.innerText = userBalance;
  if (userIdEl) userIdEl.innerText = userId;
  if (invCountEl) invCountEl.innerText = inventory.length;
}

const grid = document.getElementById('casesGrid');
const track = document.getElementById('track');

// Sahifa ochilganda
window.onload = () => {
  saveData();
  renderCases();
};

function renderCases() {
  if (!grid) return;
  grid.innerHTML = '';
  casesData.forEach(c => {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.onclick = () => openRouletteModal(c);
    card.innerHTML = `
      <div class="case-img-box">
        <img src="${c.img}" alt="${c.title}" class="case-img" onerror="this.src='https://via.placeholder.com/150'">
      </div>
      <div class="case-title">${c.title}</div>
      <div class="case-price">${c.price} G</div>
    `;
    grid.appendChild(card);
  });
}

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

// Rulotka elementlarini chiroyli qilib chiqarish
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
  saveData();

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
      div.style.borderColor = '#fbbf24'; // Yutuq turgan joyni ajratib ko'rsatish
      div.style.background = '#334155';
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
      inventory.push({ name: wonItem, status: "Kutilmoqda" });
      saveData();
      spinBtn.disabled = false;
    }, 5000);
  }, 100);
}

// INVENTARNI OCHISH
function openInventory() {
  const list = document.getElementById('inventoryList');
  if (inventory.length === 0) {
    list.innerHTML = `<p style="color: #94a3b8; width: 100%;">Inventaringiz bo'sh.</p>`;
  } else {
    list.innerHTML = inventory.map((itemObj, index) => `
      <div class="inv-item-card ${itemObj.status === 'Olingan' ? 'status-olingan' : ''}">
        <div>
          <b>${itemObj.name}</b><br>
          <small style="color: #94a3b8;">Holati: ${itemObj.status}</small>
        </div>
        ${itemObj.status === 'Kutilmoqda' 
          ? `<button onclick="claimItem(${index})" style="background: #38bdf8; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;">Olish</button>` 
          : `<span style="color: #34d399; font-weight: 600;">Olingan ✓</span>`
        }
      </div>
    `).join('');
  }
  document.getElementById('inventoryModal').style.display = 'flex';
}

function claimItem(index) {
  const item = inventory[index];
  const text = encodeURIComponent(`Salom! Men GameDrop saytidan "${item.name}" yutug'imni olishni xohlayman.\nMening ID: ${userId}`);
  window.open(`https://t.me/Hack_Games_0712?text=${text}`, '_blank');
  
  inventory[index].status = "Olingan";
  saveData();
  openInventory();
}

function addCoins() {
  document.getElementById('topupModal').style.display = 'flex';
}

function buyPkg(coins, price) {
  const text = encodeURIComponent(`Salom! Men ${coins} G tanga (${price.toLocaleString()} so'm) sotib olmoqchiman.\nMening ID: ${userId}`);
  window.open(`https://t.me/Hack_Games_0712?text=${text}`, '_blank');
  closeModal('topupModal');
}

// ADMIN PANEL
function openAdminLogin() {
  document.getElementById('adminLoginForm').style.display = 'block';
  document.getElementById('adminDashboard').style.display = 'none';
  document.getElementById('adminPasswordInput').value = '';
  document.getElementById('adminModal').style.display = 'flex';
}

function checkAdminPassword() {
  const pass = document.getElementById('adminPasswordInput').value;
  if (pass === 'admin0712') {
    document.getElementById('adminLoginForm').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    document.getElementById('adminStatId').innerText = userId;
    document.getElementById('adminStatBalance').innerText = userBalance;
  } else {
    alert("Parol noto'g'ri!");
  }
}

function adminAddCoins() {
  const tId = document.getElementById('targetUserId').value.trim();
  const amount = parseInt(document.getElementById('addCoinAmount').value);

  if (tId === userId.toString()) {
    if (!isNaN(amount) && amount > 0) {
      userBalance += amount;
      saveData();
      document.getElementById('adminStatBalance').innerText = userBalance;
      alert(`Muvaffaqiyatli ${amount} G qo'shildi!`);
    } else {
      alert("Miqdorni to'g'ri kiriting!");
    }
  } else {
    alert("Bunday ID topilmadi yoki xato kiritildi!");
  }
}
