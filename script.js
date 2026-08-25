// --- DATABASE VA LOCALSTORAGE BILAN ISHLASH ---
let userBalance = localStorage.getItem('userBalance') ? parseInt(localStorage.getItem('userBalance')) : 0;
let inventory = localStorage.getItem('inventory') ? JSON.parse(localStorage.getItem('inventory')) : [];

let userId = localStorage.getItem('userId');
if (!userId) {
    userId = "ID-" + Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('userId', userId);
}

const MY_TELEGRAM = "Hack_Games_0712"; 

window.onload = function() {
    const idDisplay = document.getElementById('userIdDisplay');
    if (idDisplay) idDisplay.innerText = userId;
    updateBalanceDisplay();
    updateInventoryDisplay();
    renderCases();
};

let casesData = [
    { id: 1, title: "PUBG Bronze", price: 79, img: "pubg-bronze.jpg", items: ["10 UC", "30 UC", "60 UC", "15 UC", "5 UC", "25 UC"] },
    { id: 2, title: "PUBG Silver", price: 149, img: "pubg-silver.jpg", items: ["60 UC", "120 UC", "180 UC", "15 UC"] },
    { id: 3, title: "PUBG Gold", price: 649, img: "pubg-gold.jpg", items: ["325 UC", "660 UC", "1800 UC", "12 oy prime plus"] },
    { id: 4, title: "Free Fire Mini", price: 79, img: "ff-mini.jpg", items: ["20 Diamond", "50 Diamond", "100 Diamond"] },
    { id: 5, title: "Free Fire Max", price: 499, img: "ff-max.jpg", items: ["100 Diamond", "310 Diamond", "520 Diamond", "Booyah Pass"] }
];

function renderCases() {
    const grid = document.getElementById('casesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    casesData.forEach(c => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.innerHTML = `
            <img src="${c.img}" alt="${c.title}" style="width:100%; border-radius:8px;">
            <h3>${c.title}</h3>
            <p>Narxi: ${c.price} tanga</p>
            <button onclick="openRoulette(${c.id})" style="padding:8px 16px; background:#22c55e; color:white; border:none; border-radius:6px; cursor:pointer;">Ochish</button>
        `;
        grid.appendChild(card);
    });
}

function updateBalanceDisplay() {
    const balanceEl = document.getElementById('balanceDisplay');
    if (balanceEl) balanceEl.innerText = userBalance;
    localStorage.setItem('userBalance', userBalance);
}

function openRoulette(caseId) {
    let selectedCase = casesData.find(c => c.id === caseId);
    if (!selectedCase) return;

    if (userBalance < selectedCase.price) {
        alert("Balansingizda tanga yetarli emas! Tanga sotib olish uchun '+ Tangalar' tugmasini bosing.");
        return;
    }

    userBalance -= selectedCase.price;
    updateBalanceDisplay();

    const modal = document.getElementById('rouletteModal');
    if (modal) modal.style.display = 'flex';

    const track = document.getElementById('track');
    if (track) {
        track.innerHTML = '';
        let itemsList = [];
        for (let i = 0; i < 30; i++) {
            let randomItem = selectedCase.items[Math.floor(Math.random() * selectedCase.items.length)];
            itemsList.push(randomItem);
        }

        itemsList.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'roulette-item';
            itemDiv.innerText = item;
            itemDiv.style.cssText = "min-width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; background: #334155; color: white; font-weight: bold; border-radius: 8px; border: 2px solid #475569;";
            track.appendChild(itemDiv);
        });

        track.style.transition = 'none';
        track.style.transform = 'translateX(0px)';

        setTimeout(() => {
            track.style.transition = 'transform 4s cubic-bezier(0.15, 0.75, 0.25, 1)';
            let randomOffset = Math.floor(Math.random() * 1500) + 1500;
            track.style.transform = `translateX(-${randomOffset}px)`;

            setTimeout(() => {
                let winningIndex = Math.floor((randomOffset + 100) / 120) % itemsList.length;
                let wonItem = itemsList[winningIndex];
                inventory.push({ caseTitle: selectedCase.title, prize: wonItem });
                updateInventoryDisplay();
            }, 4000);
        }, 50);
    }
}

function closeRoulette() {
    const modal = document.getElementById('rouletteModal');
    if (modal) modal.style.display = 'none';
}

// --- TANGA SOTIB OLISH (TELEGRAMGA O'TISH) ---
function buyCoinsTelegram(coins, price) {
    let text = `Salom! Men tanga sotib olmoqchiman.%0A- ID: ${userId}%0A- Miqdor: ${coins} ta tanga%0A- Narxi: ${price} so'm`;
    window.open(`https://t.me/${MY_TELEGRAM}?text=${text}`, '_blank');
}

// --- INVENTAR ---
function updateInventoryDisplay() {
    const invContainer = document.getElementById('inventoryList');
    const invCount = document.getElementById('inventoryCount');
    if (invCount) invCount.innerText = inventory.length;
    localStorage.setItem('inventory', JSON.stringify(inventory));

    if (invContainer) {
        invContainer.innerHTML = '';
        inventory.forEach((inv, index) => {
            const div = document.createElement('div');
            div.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 10px; margin-bottom: 5px; border-radius: 6px; color: white;";
            div.innerHTML = `
                <span>${index + 1}. ${inv.caseTitle} — <b>${inv.prize}</b></span>
                <button onclick="claimPrize(${index})" style="background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Olish (Telegram)</button>
            `;
            invContainer.appendChild(div);
        });
    }
}

function claimPrize(index) {
    let invItem = inventory[index];
    let text = `Assalomu alaykum! Men yutug'imni olmoqchiman:%0A- ID: ${userId}%0A- Keys: ${invItem.caseTitle}%0A- Yutuq: ${invItem.prize}`;
    
    window.open(`https://t.me/${MY_TELEGRAM}?text=${text}`, '_blank');

    inventory.splice(index, 1);
    updateInventoryDisplay();
}

// --- ADMIN PANEL (Parol: admin0712) ---
function openAdminPanel() {
    const password = prompt("Admin parolini kiriting:");
    if (password === "admin0712") {
        let targetId = prompt(`Sizning ID: ${userId}\nCoin qo'shmoqchi bo'lgan ID'ni kiriting:`);
        if (targetId) {
            let addAmount = prompt("Qancha coin qo'shmoqchisiz?");
            if (addAmount && !isNaN(addAmount)) {
                userBalance += Number(addAmount);
                updateBalanceDisplay();
                alert(`Muvaffaqiyatli! Balansga ${addAmount} ta coin qo'shildi.`);
            }
        }
    } else if (password !== null) {
        alert("Parol noto'g'ri!");
    }
}

// Tugmalarni to'g'ri ulash
const addCoinsBtn = document.getElementById('addCoinsBtn');
if (addCoinsBtn) {
    addCoinsBtn.onclick = function() {
        buyCoinsTelegram(100, "10,000");
    };
}

const adminPanelBtn = document.getElementById('adminPanelBtn');
if (adminPanelBtn) {
    adminPanelBtn.onclick = openAdminPanel;
}
