import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });

interface Point {
  x: number;
  y: number;
}

interface MoveMessage {
  type: "move";
  x: number;
  y: number;
}

interface StateMessage {
  type: "state";
  x: number;
  y: number;
}

type ClientMessage = MoveMessage;
type ServerMessage = StateMessage;

// Shared world state
let point: Point = { x: 0, y: 0 };

console.log("WebSocket server running on ws://localhost:8080");

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  // Send current state immediately
  const stateMsg: ServerMessage = {
    type: "state",
    x: point.x,
    y: point.y
  };
  ws.send(JSON.stringify(stateMsg));

  ws.on("message", (msg: WebSocket.RawData) => {
    const data = JSON.parse(msg.toString()) as ClientMessage;

    if (data.type === "move") {
      point.x = data.x;
      point.y = data.y;

      // Broadcast to all clients
      const broadcastMsg: ServerMessage = {
        type: "state",
        x: point.x,
        y: point.y
      };

      for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(broadcastMsg));
        }
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
