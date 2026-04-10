exports.handler = async function(event) {
  const symbol = event.queryStringParameters.symbol;
  const apiKey = process.env.ALPHA_VANTAGE_KEY;

  if (!symbol) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No symbol provided" })
    };
  }

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(data)
  };
};