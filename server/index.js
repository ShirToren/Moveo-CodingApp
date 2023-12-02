const { WebSocketServer } = require("ws");
const http = require("http");
const uuidv4 = require("uuid").v4;
const url = require("url");
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = 8000;
const MONGODB_URI = `mongodb+srv://2karinaoist:OistrachK@bether.ledfzng.mongodb.net/?retryWrites=true&w=majority`;
const connections = {};
const users = {};
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url);

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with your React app's URL
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  //endpoints
  if (pathname === "/codeblocks") {
    try {
      //   const client = await MongoClient.connect(MONGODB_URI, {
      //     useNewUrlParser: true,
      //     useUnifiedTopology: true,
      //   });
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
      // Access a specific collection
      const db = client.db("BeTher"); // Replace with your database name
      const items = await db.collection("CodeBlocks").find({}).toArray();
      console.log("Documents found:", items);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(items)); // Send code blocks as a JSON response
      //client.close();

      //const collection = db.collection("CodeBlocks"); // Replace with your collection name

      //const collection = client.db.collection("CodeBlocks");

      //   collection.find({}).toArray((error, documents) => {
      //     if (error) {
      //       console.error("Error finding documents:", error);
      //       return;
      //     }
      //     console.log("Documents found:", documents);
      //     res.writeHead(200, { "Content-Type": "application/json" });
      //     res.end(JSON.stringify(documents)); // Send code blocks as a JSON response
      //     //client.close(); // Close the connection when done
      //   });

      // Assuming 'codeblocks' is your collection name
      //   const codeBlocks = await db.collection("CodeBlocks").find({}).toArray();

      //   client.close();

      //   res.writeHead(200, { "Content-Type": "application/json" });
      //   res.end(JSON.stringify(codeBlocks)); // Send code blocks as a JSON response
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const wsServer = new WebSocketServer({ server });

const handleMessage = (bytes, uuid) => {
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];
  user.state = message;
  broadcast();

  console.log(
    `${user.username} updated their updated state: ${JSON.stringify(
      user.state
    )}`
  );
};

const handleClose = (uuid) => {
  console.log(`${users[uuid].username} disconnected`);
  delete connections[uuid];
  delete users[uuid];
  broadcast();
};

const broadcast = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

wsServer.on("connection", (connection, request) => {
  const { username } = url.parse(request.url, true).query;
  console.log(`${username} connected`);
  const uuid = uuidv4();
  connections[uuid] = connection;
  users[uuid] = {
    username,
    state: {},
  };
  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
