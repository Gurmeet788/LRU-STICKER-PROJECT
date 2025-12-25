const API_BASE = 'http://127.0.0.1:5000'; // Change to your backend URL
let allStickers = [];

// Show status message
function showStatus(message, isError = false) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${isError ? 'error' : 'success'}`;
    status.style.display = 'block';
    setTimeout(() => { status.style.display = 'none'; }, 3000);
}

// Load all available stickers
async function loadAllStickers() {
    try {
        const response = await fetch(`${API_BASE}/all-stickers`);
        allStickers = await response.json();
        displayStickers(allStickers);
    } catch (error) {
        document.getElementById('stickerGrid').innerHTML = 
            '<div class="empty-state">Error loading stickers</div>';
        showStatus('Failed to load stickers', true);
    }
}

// Display stickers in grid
function displayStickers(stickers) {
    const grid = document.getElementById('stickerGrid');
    if (stickers.length === 0) {
        grid.innerHTML = '<div class="empty-state">No stickers found</div>';
        return;
    }

    grid.innerHTML = stickers.map(filename => {
        const key = filename.replace('.png', '');
        return `
            <div class="sticker-item" onclick="addToCache('${key}', '${filename}')">
                <img src="${API_BASE}/get-sticker/${filename}" 
                     alt="${key}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3E?%3C/text%3E%3C/svg%3E'">
                <div class="name">${key}</div>
            </div>
        `;
    }).join('');
}

// Add sticker to cache
async function addToCache(key, value) {
    try {
        const response = await fetch(`${API_BASE}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value })
        });
        const data = await response.json();
        showStatus(`✅ Added "${key}" to cache`);
        loadCache();
    } catch (error) {
        showStatus('Failed to add to cache', true);
    }
}

// Get sticker from cache
async function getFromCache() {
  const rawKey = document.getElementById('searchKey').value.trim();
  if (!rawKey) return showStatus('Please enter a sticker key', true);

  const url = `${API_BASE}/get/${encodeURIComponent(rawKey)}`;
  const res = await fetch(url);
  const data = await res.json();

  if ('Sticker' in data) {
    showStatus(`✅ Found "${data.Sticker}" — moved to top of cache`);
    loadCache();
  } else {
    showStatus("❌ Sticker field not found", true);
  }
}




// Load and display cache
async function loadCache() {
    try {
        const response = await fetch(`${API_BASE}/get_cache`);
        const cache = await response.json();
        displayCache(cache);
    } catch (error) {
        document.getElementById('cacheList').innerHTML = 
            '<li class="empty-state">Error loading cache</li>';
    }
}

// Display cache items
function displayCache(cache) {
    const list = document.getElementById('cacheList');
    if (!cache || cache.length === 0) {
        list.innerHTML = '<li class="empty-state">Cache is empty</li>';
        return;
    }

    list.innerHTML = cache.map((item, index) => {
        const [key, value] = Object.entries(item)[0];
        return `
            <li class="cache-item">
                <span class="position">#${index + 1}</span>
                <div class="info">
                    <img src="${API_BASE}/get-sticker/${value}" 
                         alt="${key}"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Crect fill=%22%23ddd%22 width=%2240%22 height=%2240%22/%3E%3C/svg%3E'">
                    <span><strong>${key}</strong> → ${value}</span>
                </div>
            </li>
        `;
    }).join('');
}

// Setup events on DOM load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('getCacheBtn').addEventListener('click', getFromCache);
    document.getElementById('searchKey').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getFromCache();
    });

    // Initial load
    loadAllStickers();
    loadCache();

    // Auto-refresh cache every 5 seconds
    //setInterval(loadCache, 5000);
});
