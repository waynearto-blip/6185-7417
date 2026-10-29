async function loadItems() {
  const res = await fetch('/api/items');
  const items = await res.json();
  const list = document.getElementById('items-list');
  list.innerHTML = '';

  if (items.length === 0) {
    list.innerHTML = '<li>No items yet.</li>';
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

async function loadBuilds() {
  const res = await fetch('/api/agent/builds');
  const builds = await res.json();
  const list = document.getElementById('builds-list');
  list.innerHTML = '';

  if (builds.length === 0) {
    list.innerHTML = '<li>No builds yet.</li>';
    return;
  }

  builds.forEach(b => {
    const li = document.createElement('li');
    const date = new Date(b.created_at).toLocaleString();
    li.innerHTML = `
      <div class="content">
        <h3>${escapeHtml(b.prompt.slice(0, 80))}${b.prompt.length > 80 ? '...' : ''}</h3>
        <div class="meta">${date} · ${b.status} · ID ${b.id}</div>
      </div>
    `;
    list.appendChild(li);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderPresentation(result) {
  if (!result.presentation || !result.presentation.slides) {
    return '<p>No presentation generated.</p>';
  }
  const slides = result.presentation.slides;
  let html = `<h3>${escapeHtml(result.presentation.title || result.title)}</h3>
    <p><strong>Comprehension summary:</strong> ${escapeHtml(result.comprehension?.summary || 'N/A')}</p>
    <div class="slides">`;
  slides.forEach(slide => {
    html += `
      <div class="slide">
        <h4>Slide ${slide.number}: ${escapeHtml(slide.title)}</h4>
        <ul>${(slide.content || []).map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>
        ${slide.speakerNotes ? `<p class="notes"><em>Notes:</em> ${escapeHtml(slide.speakerNotes)}</p>` : ''}
        ${slide.visuals ? `<p class="visuals"><em>Visuals:</em> ${escapeHtml(slide.visuals)}</p>` : ''}
      </div>`;
  });
  html += '</div>';
  return html;
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

document.getElementById('build-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = document.getElementById('build-prompt').value.trim();
  if (!prompt) return;

  const resultDiv = document.getElementById('build-result');
  resultDiv.innerHTML = '<p>Generating plan...</p>';

  try {
    const res = await fetch('/api/agent/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();

    if (data.error) {
      resultDiv.innerHTML = `<p style="color:red">${escapeHtml(data.error)}</p>`;
      return;
    }

    resultDiv.innerHTML = `
      <h3>Plan (Build #${data.buildId})</h3>
      <pre>${escapeHtml(data.plan.plan || JSON.stringify(data.plan, null, 2))}</pre>
      ${data.plan.files && data.plan.files.length ? `<p>${data.plan.files.length} file(s) suggested</p>` : ''}
      <p>Next: ${(data.plan.nextSteps || []).join(', ')}</p>
    `;

    document.getElementById('build-prompt').value = '';
    loadBuilds();
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red">Error: ${escapeHtml(err.message)}</p>`;
  }
});

document.getElementById('contract-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const contractText = document.getElementById('contract-text').value.trim();
  const title = document.getElementById('pres-title').value.trim() || 'Contract Review Presentation';
  if (contractText.length < 50) {
    alert('Please paste a longer contract or specification.');
    return;
  }

  const resultDiv = document.getElementById('presentation-result');
  resultDiv.innerHTML = '<p>Performing deep comprehension and generating extensive presentation... (this may take 20-40 seconds)</p>';

  try {
    const res = await fetch('/api/agent/contract-to-presentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractText, title })
    });
    const data = await res.json();

    if (data.error) {
      resultDiv.innerHTML = `<p style="color:red">${escapeHtml(data.error)}</p>`;
      return;
    }

    resultDiv.innerHTML = renderPresentation(data);
    loadBuilds();
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red">Error: ${escapeHtml(err.message)}</p>`;
  }
});

loadItems();
loadBuilds();
