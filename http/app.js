// step4.js
async function fetchService(name, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    return { name, status: "ok", data: await res.json() };
  } catch (err) {
    return { name, status: "error", error: err.message };
  }
}

async function fetchSystemReport() {
  const services = [
    ["users", "http://localhost:3001"],
    ["orders", "http://localhost:3002"],
    ["billing", "http://localhost:3003"],
  ];

  const results = await Promise.allSettled(
    services.map(([name, url]) => fetchService(name, url))
  );

  return results.map((r) => r.value);
}

console.log(await fetchSystemReport());
