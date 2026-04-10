let chart = null;

async function fetchChart() {
  const symbol = document.getElementById('ticker').value.trim().toUpperCase();
  const errorEl = document.getElementById('error');
  errorEl.textContent = '';

  if (!symbol) {
    errorEl.textContent = 'Please enter a ticker symbol.';
    return;
  }

  // FAKE DATA - swap this out when done styling
  const labels = ['Apr 1','Apr 2','Apr 3','Apr 4','Apr 5','Apr 6','Apr 7','Apr 8','Apr 9','Apr 10'];
  const prices = [190.50, 192.30, 191.00, 194.75, 196.20, 193.40, 195.80, 197.10, 196.50, 198.75];

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