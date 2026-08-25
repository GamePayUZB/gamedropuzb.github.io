// Foydalanuvchi ID sini yaratish yoki yuklab olish
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = Math.floor(100000 + Math.random() * 900000); // 6 xonali noyob ID
  localStorage.setItem('userId', userId);
}

let userBalance = parseInt(localStorage.getItem('userBalance')) || 0;
// Inventar obyektdan iborat bo'ladi: { name: "10 UC", status: "Kutilmoqda" yoki "Olingan" }
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let selectedCase = null;
let casesData = [];

// Ma'lumotlarni saqlash va ekranni yangilash
function saveData() {
  localStorage.setItem('userBalance', userBalance);
  localStorage.setItem('inventory', JSON.stringify(inventory));
  
  document.getElementById('userBalance').innerText = userBalance;
  document.getElementById('displayUserId').innerText = userId;
  document.getElementById('invCount').innerText = inventory.length;
}

const grid = document.getElementById('casesGrid');
const track = document.getElementById('track');

// Sahifa ochilganda
window.onload = async () => {
  saveData();
  try {
    const response = await fetch('database.json');
    const data = await response.json();
    casesData = data.cases;
    renderCases();
  } catch (error) {
    console.error("database.json yuklashda xatolik:", error);
    grid.innerHTML = `<p style="color: #ef4444; grid-column: 1/-1; text-align: center;">Keyslarni yuklab bo'lmadi!</p>`;
  }
};

function renderCases() {
  grid.innerHTML = '';
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
      // Inventarga obyekt sifatida qo'shish (status bilan)
      inventory.push({ name: wonItem, status: "Kutilmoqda" });
      saveData();
      spinBtn.disabled = false;
    }, 5000);
  }, 100);
}

// INVENTARNI OCHISH VA TELEGRAMGA ULASH
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
          ? `<button onclick="claimItem(${index})" style="background: #38bdf8; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;">Oshirish / Olish</button>` 
          : `<span style="color: #34d399; font-weight: 600;">Olingan ✓</span>`
        }
      </div>
    `).join('');
  }
  document.getElementById('inventoryModal').style.display = 'flex';
}

// Telegramga yuborish va statusni "Olingan" qilish
function claimItem(index) {
  const item = inventory[index];
  const text = encodeURIComponent(`Salom! Men GameDrop saytidan "${item.name}" yutug'imni olishni xohlayman.\nMening ID: ${userId}`);
  
  // Telegramga yo'naltirish
  window.open(`https://t.me/Hack_Games_0712?text=${text}`, '_blank');
  
  // Statusni olingan qilish
  inventory[index].status = "Olingan";
  saveData();
  openInventory();
}

function addCoins() {
  document.getElementById('topupModal').style.display = 'flex';
}

// XARID QILISH (TEKIN EMAS, TELEGRAMGA O'TADI)
function buyPkg(coins, price) {
  const text = encodeURIComponent(`Salom! Men ${coins} G tanga (${price.toLocaleString()} so'm) sotib olmoqchiman.\nMening ID: ${userId}`);
  window.open(`https://t.me/Hack_Games_0712?text=${text}`, '_blank');
  closeModal('topupModal');
}

// --- ADMIN PANEL FUNKSIYALARI ---
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
