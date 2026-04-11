export async function onRequest(context) {
  const symbol = new URL(context.request.url).searchParams.get('symbol');
  const apiKey = context.env.ALPHAVANTAGE_API_KEY;

  if (!symbol) {
    return new Response(JSON.stringify({ error: 'No symbol provided' }), { status: 400 });
  }

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}