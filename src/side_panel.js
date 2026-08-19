// side_panel.js – Leaflet management with persistent storage, step management, UI reuse

// ----- DOM Elements -----
const addBtn = document.getElementById('addLeafletBtn');
const modal = document.getElementById('leafletModal');
const closeModal = document.getElementById('closeModal');
const form = document.getElementById('leafletForm');
const list = document.getElementById('leafletList');

const stepModal = document.getElementById('stepModal');
const closeStepModal = document.getElementById('closeStepModal');
const stepForm = document.getElementById('stepForm');
const stepList = document.getElementById('stepList');
const stepModalTitle = document.getElementById('stepModalTitle');
const stepInput = document.getElementById('stepInput');

// ----- State -----
let leaflets = [];
let currentLeafIdx = null; // index of leaflet whose steps are being edited

// ----- Persistence -----
function loadLeaflets() {
  const stored = localStorage.getItem('leaflets');
  if (stored) {
    try { leaflets = JSON.parse(stored); }
    catch (e) { console.error('Parse error', e); leaflets = []; }
  }
}
function saveLeaflets() { localStorage.setItem('leaflets', JSON.stringify(leaflets)); }

// ----- UI Helpers -----
function createLeafletElement(item, index) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'leaflet-item';

  // Header with title and delete (×) button (same style as modal close)
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.alignItems = 'center';

  const title = document.createElement('h4');
  title.textContent = item.name;
  title.style.cursor = 'pointer';
  title.addEventListener('click', () => openStepModal(index));

  const delBtn = document.createElement('button');
  delBtn.className = 'close-btn'; // reuse modal close style
  delBtn.innerHTML = '&times;';
  delBtn.title = 'Delete this leaflet';
  delBtn.addEventListener('click', () => {
    leaflets.splice(index, 1);
    saveLeaflets();
    renderList();
  });

  header.appendChild(title);
  header.appendChild(delBtn);

  const desc = document.createElement('p');
  desc.textContent = item.description;

  itemDiv.appendChild(header);
  itemDiv.appendChild(desc);
  return itemDiv;
}

function renderList() {
  list.innerHTML = '';
  leaflets.forEach((it, i) => {
    const el = createLeafletElement(it, i);
    list.appendChild(el);
  });
}

// ----- Leaflet Modal -----
addBtn.addEventListener('click', () => modal.style.display = 'flex');
closeModal.addEventListener('click', () => { modal.style.display = 'none'; form.reset(); });
modal.addEventListener('click', e => { if (e.target === modal) { modal.style.display = 'none'; form.reset(); } });

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('leafletName').value.trim();
  const desc = document.getElementById('leafletDesc').value.trim();
  if (!name || !desc) return;
  leaflets.push({ name, description: desc, steps: [] });
  saveLeaflets();
  renderList();
  form.reset();
  modal.style.display = 'none';
});

// ----- Step Modal -----
function openStepModal(leafIdx) {
  currentLeafIdx = leafIdx;
  const leaf = leaflets[leafIdx];
  stepModalTitle.textContent = `Steps of "${leaf.name}"`;
  renderStepList();
  stepModal.style.display = 'flex';
}

closeStepModal.addEventListener('click', () => { stepModal.style.display = 'none'; stepForm.reset(); });
stepModal.addEventListener('click', e => { if (e.target === stepModal) { stepModal.style.display = 'none'; stepForm.reset(); } });

function renderStepList() {
  stepList.innerHTML = '';
  if (currentLeafIdx === null) return;
  const steps = leaflets[currentLeafIdx].steps || [];
  steps.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'step-item';
    const span = document.createElement('span');
    span.textContent = s;
    const del = document.createElement('button');
    del.className = 'close-btn';
    del.innerHTML = '&times;';
    del.title = 'Delete this step';
    del.addEventListener('click', () => {
      leaflets[currentLeafIdx].steps.splice(i, 1);
      saveLeaflets();
      renderStepList();
    });
    div.appendChild(span);
    div.appendChild(del);
    stepList.appendChild(div);
  });
}

stepForm.addEventListener('submit', e => {
  e.preventDefault();
  if (currentLeafIdx === null) return;
  const stepName = stepInput.value.trim();
  if (!stepName) return;
  leaflets[currentLeafIdx].steps.push(stepName);
  saveLeaflets();
  renderStepList();
  stepForm.reset();
});

// ----- Init -----
loadLeaflets();
renderList();
