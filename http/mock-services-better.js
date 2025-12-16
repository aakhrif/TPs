import http from "http";

function createService(port, name, delay, shouldFail = false) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      setTimeout(() => {
        if (shouldFail) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: `${name} failed` }));
        } else {
          res.statusCode = 200;
          res.end(JSON.stringify({ service: name, status: "ok" }));
        }
      }, delay);
    });

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
      resolve(server);
    });
  });
}

const startAll = async () => {
  await Promise.all([
    createService(3001, "users", 500),
    createService(3002, "orders", 800),
    createService(3003, "billing", 300, true),
  ]);
  console.log("All services started");
};

startAll();
