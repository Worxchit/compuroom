const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000';
const ASSETS_URL = `${API_BASE_URL}/api/assets`;

const form = document.getElementById('asset-form');
const idField = document.getElementById('asset-id');
const tbody = document.getElementById('assets-tbody');
const emptyMsg = document.getElementById('empty-msg');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');
const refreshBtn = document.getElementById('refresh-btn');
const healthStatus = document.getElementById('health-status');

function resetForm() {
  form.reset();
  idField.value = '';
  formTitle.textContent = 'เพิ่มครุภัณฑ์ใหม่';
}

async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('unhealthy');
    healthStatus.textContent = 'API เชื่อมต่อสำเร็จ (online)';
  } catch (err) {
    healthStatus.textContent = 'ไม่สามารถเชื่อมต่อ API ได้ (offline)';
  }
}

async function loadAssets() {
  const res = await fetch(ASSETS_URL);
  const assets = await res.json();
  renderAssets(assets);
}

function renderAssets(assets) {
  tbody.innerHTML = '';
  emptyMsg.hidden = assets.length !== 0;

  assets.forEach((asset) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${asset.id}</td>
      <td>${asset.asset_code}</td>
      <td>${asset.brand}</td>
      <td>${asset.model}</td>
      <td>${asset.cpu ?? ''}</td>
      <td>${asset.ram ?? ''}</td>
      <td>${asset.room}</td>
      <td><span class="status-${asset.status}">${asset.status}</span></td>
      <td class="row-actions">
        <button data-action="edit" data-id="${asset.id}">แก้ไข</button>
        <button data-action="delete" data-id="${asset.id}" class="secondary">ลบ</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function editAsset(id) {
  const res = await fetch(`${ASSETS_URL}/${id}`);
  if (!res.ok) return;
  const asset = await res.json();

  idField.value = asset.id;
  document.getElementById('asset_code').value = asset.asset_code;
  document.getElementById('brand').value = asset.brand;
  document.getElementById('model').value = asset.model;
  document.getElementById('cpu').value = asset.cpu ?? '';
  document.getElementById('ram').value = asset.ram ?? '';
  document.getElementById('room').value = asset.room;
  document.getElementById('status').value = asset.status;
  formTitle.textContent = `แก้ไขครุภัณฑ์ #${asset.id}`;
}

async function deleteAsset(id) {
  if (!confirm('ยืนยันการลบครุภัณฑ์นี้?')) return;
  await fetch(`${ASSETS_URL}/${id}`, { method: 'DELETE' });
  await loadAssets();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    asset_code: document.getElementById('asset_code').value,
    brand: document.getElementById('brand').value,
    model: document.getElementById('model').value,
    cpu: document.getElementById('cpu').value,
    ram: document.getElementById('ram').value,
    room: document.getElementById('room').value,
    status: document.getElementById('status').value,
  };

  const id = idField.value;
  const url = id ? `${ASSETS_URL}/${id}` : ASSETS_URL;
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert(err.error || 'เกิดข้อผิดพลาด');
    return;
  }

  resetForm();
  await loadAssets();
});

cancelBtn.addEventListener('click', resetForm);
refreshBtn.addEventListener('click', loadAssets);

tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === 'edit') editAsset(id);
  if (btn.dataset.action === 'delete') deleteAsset(id);
});

checkHealth();
loadAssets();
