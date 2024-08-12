const fs = require("fs");
const http = require("http");
const EventEmitter = require("events");
const encrypt = require("./encrypt");
const emitter = new EventEmitter();

// ------------Built-in Events---------------------

// System event
// Watch for changes in the 'example.txt' file
// fs.watch("example.txt", (eventType, filename) => {
//   if (filename) {
//     console.log(`${filename} file Changed: ${eventType}`);
//   }
// });

// Network event
// Create an HTTP server
// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("Hello World!");
// });

// Listen for the 'request' event
// server.on("request", (req, res) => {
//   console.log(`Received request for ${req.url}`);
// });

// Start the server
// server.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });

// Timer and Interval events
// Set a timeout event to trigger after 2 seconds
// setTimeout(() => {
//   console.log("Timeout event triggered after 2 seconds");
// }, 2000);

// Set an interval event to trigger every second
// setInterval(() => {
//   console.log("Interval event triggered every 1 second");
// }, 1000);

// ------------Application-Specific (custom) Events---------------------

// Listen for the 'userLoggedIn' event
// emitter.on("userLoggedIn", (user) => {
//   console.log(`User logged in: ${user.name}`);
// });

// Emit the 'userLoggedIn' event
// emitter.emit("userLoggedIn", { name: "Tom" });

// Real-life example

// Listen for 'formSubmitted' event
emitter.on("encryptString", async (data) => {
  const value = await encrypt.encryptString(data);
  console.log(value);
});

emitter.on("compareString", async (data) => {
  const { originalString, hash } = data;
  const value = await encrypt.compareString(originalString, hash);
  console.log(value);
});

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/encrypt") {
    let body = "";
    req.on("data", (chunk) => {
      body = chunk.toString();
    });
    req.on("end", () => {
      const stringToEncrypt = JSON.parse(body);
      emitter.emit("encryptString", stringToEncrypt);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "success" }));
    });
  } else if (req.method === "POST" && req.url === "/compare") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      emitter.emit("compareString", data);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "success" }));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

//---------Custom modules--------------------
const a = 10;
const b = 5;

// console.log(`Adding ${a} + ${b} = ${math.add(a, b)}`);
// console.log(`Subtracting ${a} - ${b} = ${math.subtract(a, b)}`);
// console.log(`Multiplying ${a} * ${b} = ${math.multiply(a, b)}`);
// console.log(`Dividing ${a} / ${b} = ${math.divide(a, b)}`);
