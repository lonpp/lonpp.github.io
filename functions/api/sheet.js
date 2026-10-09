// functions/api/sheet.js
export async function onRequest(context) {
  // 你的 Google 試算表公開 CSV 網址
  const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDYEUjBDASJpi7A3o0vWfWd0oQVl-_2p4UvnnOiUpYjdNjqe1z7QCqCTUas9Jb9h8HUq0neCkObBu-/pub?gid=0&single=true&output=csv";

  try {
    // 透過 Cloudflare 節點向 Google 請求資料，並於節點快取 300 秒（5 分鐘）
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      cf: {
        cacheTtl: 300,
        cacheEverything: true
      }
    });

    if (!response.ok) {
      return new Response("Failed to fetch sheet from Google", { status: 502 });
    }

    const csvData = await response.text();

    // 回傳純文字 CSV，並允許跨域存取與瀏覽器快取
    return new Response(csvData, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (err) {
    return new Response(`Proxy Error: ${err.message}`, { status: 500 });
  }
}