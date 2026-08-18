// side_panel.js – handles Add Leaflet modal and list rendering

// Elements
const addBtn = document.getElementById('addLeafletBtn');
const modal = document.getElementById('leafletModal');
const closeModal = document.getElementById('closeModal');
const form = document.getElementById('leafletForm');
const list = document.getElementById('leafletList');

// Open modal
addBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

// Close modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  form.reset();
});

// Close when clicking outside the content
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    form.reset();
  }
});

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('leafletName').value.trim();
  const desc = document.getElementById('leafletDesc').value.trim();
  if (!name || !desc) return; // simple validation

  // Create a new leaflet item
  const item = document.createElement('div');
  item.className = 'leaflet-item';
  const title = document.createElement('h4');
  title.textContent = name;
  const para = document.createElement('p');
  para.textContent = desc;
  item.appendChild(title);
  item.appendChild(para);
  list.appendChild(item);

  // Reset & close modal
  form.reset();
  modal.style.display = 'none';
});
