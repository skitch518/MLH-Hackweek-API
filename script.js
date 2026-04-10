let chart = null;
let lastLabels = [];
let lastPrices = [];
let currentDays = 30;

function setTimeframe(days) {
  currentDays = days;
  document.querySelectorAll('.timeframe-buttons button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderChart(lastLabels.slice(-days), lastPrices.slice(-days));
}

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

  // FAKE DATA - swap out when done styling
  const labels = ['Mar 12','Mar 13','Mar 14','Mar 17','Mar 18','Mar 19','Mar 20','Mar 21','Mar 24','Mar 25','Mar 26','Mar 27','Mar 28','Mar 31','Apr 1','Apr 2','Apr 3','Apr 4','Apr 7','Apr 8','Apr 9','Apr 10'];
  const prices = [182,184,183,186,188,187,190,192,191,194,196,195,197,199,198,200,199,201,203,202,204,206];

  lastLabels = labels;
  lastPrices = prices;

  loadingEl.classList.add('hidden');
  renderChart(lastLabels.slice(-currentDays), lastPrices.slice(-currentDays));
}

function renderChart(labels, prices) {
  if (!labels.length) return;
  if (chart) chart.destroy();

  const ctx = document.getElementById('myChart').getContext('2d');

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Close Price',
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