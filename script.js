let chart = null;
let currentDays = 30;
let currentChartType = 'line';
let lastLabels = [];
let lastData = {
  open: [],
  high: [],
  low: [],
  close: [],
};

function setTimeframe(days) {
  currentDays = days;
  document.querySelectorAll('.timeframe-buttons button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderChart();
}

function setChartType(type) {
  currentChartType = type;
  document.querySelectorAll('.chart-toggle button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderChart();
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
  
  lastLabels = labels;
  lastData = {
    open:  [181,183,182,185,187,186,189,191,190,193,195,194,196,198,197,199,198,200,202,201,203,205],
    high:  [184,186,185,188,190,189,192,194,193,196,198,197,199,201,200,202,201,203,205,204,206,208],
    low:   [180,182,181,184,186,185,188,190,189,192,194,193,195,197,196,198,197,199,201,200,202,204],
    close: [182,184,183,186,188,187,190,192,191,194,196,195,197,199,198,200,199,201,203,202,204,206],
  };

  loadingEl.classList.add('hidden');
  renderChart();
}

function renderChart() {
  if (!lastLabels.length) return;
  if (chart) chart.destroy();

  const labels = lastLabels.slice(-currentDays);
  const open   = lastData.open.slice(-currentDays);
  const high   = lastData.high.slice(-currentDays);
  const low    = lastData.low.slice(-currentDays);
  const close  = lastData.close.slice(-currentDays);

  const ctx = document.getElementById('myChart').getContext('2d');

  if (currentChartType === 'candlestick') {
    const candleData = labels.map((label, i) => ({
      x: label,
      o: open[i],
      h: high[i],
      l: low[i],
      c: close[i],
    }));

    chart = new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [{
          label: 'Price',
          data: candleData,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { type: 'category' },
          y: { ticks: { callback: v => '$' + v.toFixed(2) } }
        }
      }
    });

  } else {
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Close Price',
          data: close,
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
}

document.getElementById('ticker').addEventListener('keydown', e => {
  if (e.key === 'Enter') fetchChart();
});