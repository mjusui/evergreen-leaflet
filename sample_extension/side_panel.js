// side_panel.js – Add Leaflet modal, list rendering, persistence, delete

// ----- DOM Elements -----
const addBtn = document.getElementById('addLeafletBtn');
const modal = document.getElementById('leafletModal');
const closeModal = document.getElementById('closeModal');
const form = document.getElementById('leafletForm');
const list = document.getElementById('leafletList');

// ----- State -----
let leaflets = [];

// Load persisted leaflets from localStorage
function loadLeaflets() {
  const stored = localStorage.getItem('leaflets');
  if (stored) {
    try {
      leaflets = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse leaflets from localStorage', e);
      leaflets = [];
    }
  }
}

// Persist current leaflets array
function saveLeaflets() {
  localStorage.setItem('leaflets', JSON.stringify(leaflets));
}

// Create a DOM element for a single leaflet item
function createLeafletElement(item, index) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'leaflet-item';
  // Title and description
  const title = document.createElement('h4');
  title.textContent = item.name;
  const para = document.createElement('p');
  para.textContent = item.description;
  // Delete (✕) button
  const delBtn = document.createElement('button');
  delBtn.textContent = '✕';
  delBtn.title = 'Delete this leaflet';
  delBtn.style.marginLeft = '8px';
  delBtn.addEventListener('click', () => {
    // Remove from array and re‑save
    leaflets.splice(index, 1);
    saveLeaflets();
    renderList();
  });
  // Assemble
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.appendChild(title);
  header.appendChild(delBtn);
  itemDiv.appendChild(header);
  itemDiv.appendChild(para);
  return itemDiv;
}

// Render the whole leaflets list
function renderList() {
  // Clear current content
  list.innerHTML = '';
  leaflets.forEach((it, i) => {
    const el = createLeafletElement(it, i);
    list.appendChild(el);
  });
}

// ----- Modal handling -----
addBtn.addEventListener('click', () => modal.style.display = 'flex');
closeModal.addEventListener('click', () => { modal.style.display = 'none'; form.reset(); });
modal.addEventListener('click', e => { if (e.target === modal) { modal.style.display = 'none'; form.reset(); } });

// ----- Form submission -----
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('leafletName').value.trim();
  const desc = document.getElementById('leafletDesc').value.trim();
  if (!name || !desc) return;

  // Add to state & persist
  leaflets.push({ name, description: desc });
  saveLeaflets();
  renderList();

  form.reset();
  modal.style.display = 'none';
});

// ----- Init -----
loadLeaflets();
renderList();
