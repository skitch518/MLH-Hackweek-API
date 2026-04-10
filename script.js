let chart = null;

async function fetchChart() {
  const symbol = document.getElementById('ticker').value.trim().toUpperCase();
  const errorEl = document.getElementById('error');
  const loadingEl = document.getElementById('loading');
  errorEl.textContent = '';

  if (!symbol) {
    errorEl.textContent = 'Please enter a ticker symbol.';
    return;
  }

  loadingEl.classList.remove('hidden');

  const response = await fetch(`/.netlify/functions/chart?symbol=${symbol}`);
  const data = await response.json();

  loadingEl.classList.add('hidden');

  if (data['Error Message'] || !data['Time Series (Daily)']) {
    errorEl.textContent = 'Could not find that ticker. Try another.';
    return;
  }

  const timeSeries = data['Time Series (Daily)'];
  const labels = Object.keys(timeSeries).slice(0, 30).reverse();
  const prices = labels.map(date => parseFloat(timeSeries[date]['4. close']));

  if (chart) chart.destroy();

  const ctx = document.getElementById('myChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${symbol} Closing Price`,
        data: prices,
        borderColor: '#333',
        backgroundColor: 'rgba(51,51,51,0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 3,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { ticks: { callback: v => '$' + v.toFixed(2) } } }
    }
  });
}

document.getElementById('ticker').addEventListener('keydown', e => {
  if (e.key === 'Enter') fetchChart();
});