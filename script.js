async function fetchQuote() {
  const symbol = document.getElementById('ticker').value.trim().toUpperCase();
  const errorEl = document.getElementById('error');
  const loadingEl = document.getElementById('loading');
  errorEl.textContent = '';

  if (!symbol) {
    errorEl.textContent = 'Please enter a ticker symbol.';
    return;
  }

  loadingEl.classList.remove('hidden');

  try {
    const response = await fetch(`https://shrill-thunder-4062.jasonrschriner.workers.dev?symbol=${symbol}`);
    const data = await response.json();

    if (!data.c || data.c === 0) {
      errorEl.textContent = 'Could not find that ticker. Try another.';
      loadingEl.classList.add('hidden');
      return;
    }

    renderQuote(symbol, data);

  } catch(e) {
    errorEl.textContent = 'Something went wrong. Please try again.';
  }

  loadingEl.classList.add('hidden');
}

function renderQuote(symbol, data) {
  const container = document.getElementById('quote');
  if (!container) return;

  const change = (data.c - data.pc).toFixed(2);
  const changePct = (((data.c - data.pc) / data.pc) * 100).toFixed(2);
  const isPositive = change >= 0;

  container.innerHTML = `
    <div class="quote-card">
      <h2>${symbol}</h2>
      <div class="current-price">$${data.c.toFixed(2)}</div>
      <div class="change ${isPositive ? 'positive' : 'negative'}">
        ${isPositive ? '+' : ''}${change} (${isPositive ? '+' : ''}${changePct}%)
      </div>
      <div class="quote-grid">
        <div class="quote-item">
          <span class="label">Open</span>
          <span class="value">$${data.o.toFixed(2)}</span>
        </div>
        <div class="quote-item">
          <span class="label">High</span>
          <span class="value">$${data.h.toFixed(2)}</span>
        </div>
        <div class="quote-item">
          <span class="label">Low</span>
          <span class="value">$${data.l.toFixed(2)}</span>
        </div>
        <div class="quote-item">
          <span class="label">Prev Close</span>
          <span class="value">$${data.pc.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
}

document.getElementById('ticker').addEventListener('keydown', e => {
  if (e.key === 'Enter') fetchQuote();
});