// Simple shop data
const PRODUCTS = [
	{ id: 'p1', name: 'Cotton T-Shirt', desc: 'Soft 100% cotton tee', price: 12.99, stock: 120, img: '' },
	{ id: 'p2', name: 'Denim Jeans', desc: 'Durable denim jeans', price: 39.5, stock: 60, img: '' },
	{ id: 'p3', name: 'Linen Shirt', desc: 'Breathable linen shirt', price: 29.0, stock: 80, img: '' },
	{ id: 'p4', name: 'Silk Scarf', desc: 'Elegant silk scarf', price: 19.99, stock: 40, img: '' },
	{ id: 'p5', name: 'Wool Sweater', desc: 'Warm wool sweater', price: 49.99, stock: 30, img: '' }
];

// Keys for localStorage
const LS_ORDERS = 'eg_orders';
const LS_ADMIN = 'eg_admin'; // stores encrypted password hash

// Minimal crypto: use Web Crypto API to derive a key and HMAC a password
async function hashPassword(pw) {
	const enc = new TextEncoder();
	const pwKey = await crypto.subtle.importKey('raw', enc.encode(pw), {name:'PBKDF2'}, false, ['deriveBits']);
	const salt = enc.encode('EliteGarmentsSalt');
	const derived = await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:100000,hash:'SHA-256'}, pwKey, 256);
	const hashArray = Array.from(new Uint8Array(derived));
	return hashArray.map(b=>b.toString(16).padStart(2,'0')).join('');
}

function $(sel){return document.querySelector(sel)}
function $all(sel){return Array.from(document.querySelectorAll(sel))}

// Views (cart and checkout removed; shop is display-only)
const views = {about:$('#about'),shop:$('#shop'),adminLogin:$('#admin-login'),admin:$('#admin')};

function show(view){ Object.values(views).forEach(v=>v.classList.add('hidden')); views[view].classList.remove('hidden'); }

// Products render (display-only)
function renderProducts(){ const container = $('#products'); container.innerHTML=''; PRODUCTS.forEach(p=>{
	const card = document.createElement('div'); card.className='product';
	const img = document.createElement('img'); img.src = p.img || 'https://via.placeholder.com/300x200?text='+encodeURIComponent(p.name);
	card.appendChild(img);
	const h = document.createElement('h4'); h.textContent = p.name; card.appendChild(h);
	const d = document.createElement('p'); d.textContent = p.desc; card.appendChild(d);
	const row = document.createElement('div'); row.className='row';
	const price = document.createElement('div'); price.textContent = '$'+p.price.toFixed(2);
	const stock = document.createElement('div'); stock.style.color = '#4a5568'; stock.textContent = 'Stock: '+p.stock;
	row.appendChild(price); row.appendChild(stock); card.appendChild(row);
	container.appendChild(card);
}); }

// Orders
function loadOrders(){ return JSON.parse(localStorage.getItem(LS_ORDERS) || '[]'); }
function saveOrder(order){ const orders=loadOrders(); orders.push(order); localStorage.setItem(LS_ORDERS, JSON.stringify(orders)); }

// Admin: store hashed password once set, then require it for access
async function adminSetPassword(pw){ const h = await hashPassword(pw); localStorage.setItem(LS_ADMIN, h); }
async function adminCheckPassword(pw){ const h = await hashPassword(pw); return localStorage.getItem(LS_ADMIN) === h; }

// Admin UI
function renderAdmin(){ const orders = loadOrders(); const ordersEl = $('#admin-orders'); ordersEl.innerHTML = '';
	let revenue=0; orders.forEach(o=>{ const el = document.createElement('div'); el.className='panel'; el.innerHTML = `<strong>Order:</strong> ${o.name} - $${o.total.toFixed(2)}<br>${o.items.map(i=>i.name+' x'+i.qty).join(', ')}`; ordersEl.appendChild(el); revenue += o.total; });
	$('#admin-revenue').textContent = '$'+revenue.toFixed(2);
	const inv = $('#admin-inventory'); inv.innerHTML=''; PRODUCTS.forEach(p=>{ const el = document.createElement('div'); el.textContent = `${p.name} — Stock: ${p.stock}`; inv.appendChild(el); });
}

// Event bindings
$('#nav-about').onclick = ()=> show('about');
$('#nav-shop').onclick = ()=> { show('shop'); renderProducts(); }
$('#nav-admin').onclick = ()=> { show('adminLogin'); const has = !!localStorage.getItem(LS_ADMIN); $('#admin-note').textContent = has? 'Enter admin password.' : 'If first time, set a new admin password.'; }

$('#admin-form').onsubmit = async function(e){ e.preventDefault(); const pw = new FormData(this).get('password'); if(!localStorage.getItem(LS_ADMIN)){ await adminSetPassword(pw); alert('Admin password set.'); show('admin'); renderAdmin(); return; } const ok = await adminCheckPassword(pw); if(ok){ show('admin'); renderAdmin(); } else { alert('Wrong password'); } }

$('#admin-logout').onclick = ()=> { show('about'); }

// Init
renderProducts(); show('about');
