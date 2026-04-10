let chart = null;
let currentMetric = 'close';
let lastLabels = [];
let lastData = {};

function setMetric(metric) {
  currentMetric = metric;
  document.querySelectorAll('.metric-buttons button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderChart(lastLabels, lastData);
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
  const labels = ['Apr 1','Apr 2','Apr 3','Apr 4','Apr 5','Apr 6','Apr 7','Apr 8','Apr 9','Apr 10'];

  lastLabels = labels;
  lastData = {
    open:  [188, 190, 189, 192, 194, 191, 193, 195, 194, 196],
    high:  [191, 193, 192, 195, 197, 194, 196, 198, 197, 199],
    low:   [187, 189, 188, 191, 193, 190, 192, 194, 193, 195],
    close: [190.50, 192.30, 191.00, 194.75, 196.20, 193.40, 195.80, 197.10, 196.50, 198.75],
  };

  loadingEl.classList.add('hidden');
  renderChart(lastLabels, lastData);
}

function renderChart(labels, data) {
  if (!labels.length || !data.close) return;
  if (chart) chart.destroy();

  const ctx = document.getElementById('myChart').getContext('2d');

  const datasets = currentMetric === 'all' ? [
    { label: 'Open',  data: data.open,  borderColor: '#4e79a7', backgroundColor: 'transparent', tension: 0.3, pointRadius: 3 },
    { label: 'High',  data: data.high,  borderColor: '#59a14f', backgroundColor: 'transparent', tension: 0.3, pointRadius: 3 },
    { label: 'Low',   data: data.low,   borderColor: '#e15759', backgroundColor: 'transparent', tension: 0.3, pointRadius: 3 },
    { label: 'Close', data: data.close, borderColor: '#333',    backgroundColor: 'transparent', tension: 0.3, pointRadius: 3 },
  ] : [{
    label: currentMetric.charAt(0).toUpperCase() + currentMetric.slice(1),
    data: data[currentMetric],
    borderColor: '#333',
    backgroundColor: 'rgba(51,51,51,0.1)',
    tension: 0.3,
    fill: true,
    pointRadius: 3,
  }];

  chart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
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