import http from "http";

function createService(port, name, delay, shouldFail = false) {
  http
    .createServer((req, res) => {
      setTimeout(() => {
        if (shouldFail) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: `${name} failed` }));
        } else {
          res.end(JSON.stringify({ service: name, status: "ok" }));
        }
      }, delay);
    })
    .listen(port);
}

createService(3001, "users", 500);
createService(3002, "orders", 800);
createService(3003, "billing", 300, true);
