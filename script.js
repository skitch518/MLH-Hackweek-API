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

function setTimeframe(days, btn) {
  currentDays = days;
  document.querySelectorAll('.timeframe-buttons button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderChart();
}

function setChartType(type, btn) {
  currentChartType = type;
  document.querySelectorAll('.chart-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
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

  try {
    const response = await fetch(`/functions/chart?symbol=${symbol}`);
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    
    const text = await response.text();
    console.log('Raw response:', text);
    
    const data = JSON.parse(text);

    if (data['Error Message'] || !data['Time Series (Daily)']) {
      errorEl.textContent = 'Could not find that ticker. Try another.';
      loadingEl.classList.add('hidden');
      return;
    }

    const timeSeries = data['Time Series (Daily)'];
    const allLabels = Object.keys(timeSeries).reverse();

    lastLabels = allLabels;
    lastData = {
      open:  allLabels.map(d => parseFloat(timeSeries[d]['1. open'])),
      high:  allLabels.map(d => parseFloat(timeSeries[d]['2. high'])),
      low:   allLabels.map(d => parseFloat(timeSeries[d]['3. low'])),
      close: allLabels.map(d => parseFloat(timeSeries[d]['4. close'])),
    };

  } catch(e) {
    errorEl.textContent = 'Something went wrong. Please try again.';
    loadingEl.classList.add('hidden');
    return;
  }

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
          x: {
            type: 'time',
            time: { unit: 'day' },
          },
          y: {
            min: Math.min(...low) - 5,
            max: Math.max(...high) + 5,
            ticks: { callback: v => '$' + v.toFixed(2) }
          }
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