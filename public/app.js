async function loadItems() {
  const res = await fetch('/api/items');
  const items = await res.json();
  const list = document.getElementById('items-list');
  list.innerHTML = '';

  if (items.length === 0) {
    list.innerHTML = '<li>No items yet. Add one above.</li>';
    return;
  }

  items.forEach(item => {
    const li = document.createElement('li');
    const date = new Date(item.created_at).toLocaleString();
    li.innerHTML = `
      <div class="content">
        <h3>${escapeHtml(item.title)}</h3>
        ${item.content ? `<p>${escapeHtml(item.content)}</p>` : ''}
        <div class="meta">${date} · ID ${item.id}</div>
      </div>
      <button class="delete-btn" data-id="${item.id}">Delete</button>
    `;
    list.appendChild(li);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this item?')) return;
      await fetch(`/api/items/${btn.dataset.id}`, { method: 'DELETE' });
      loadItems();
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  if (!title) return;

  await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });

  document.getElementById('title').value = '';
  document.getElementById('content').value = '';
  loadItems();
});

loadItems();
