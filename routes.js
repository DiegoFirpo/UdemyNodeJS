const fs = require("fs");

const requestHandler = (request, response) => {
  const url = request.url;
  const method = request.method;

  response.setHeader("Content-Type", "text/html");

  if (url === "/") {
    response.write(
      "<html><head><title>Enter message</title></head><body><form action='./message' method='POST'><input type='text' name='message' /><button type='submit'>Send</button></form></body></html>"
    );

    return response.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];

    request.on("data", chunk => {
      body.push(chunk);
    });

    return request.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];

      console.log("mens");

      fs.writeFile("message.txt", message, err => {
        response.statusCode = 302;
        response.setHeader("Location", "/");
        return response.end();
      });
    });
  }

  response.write(
    "<html><head><title>My first page</title></head><body><h1>Hello from my Node.js Server!</h1></body></html>"
  );

  response.end();
};

module.exports = requestHandler;
