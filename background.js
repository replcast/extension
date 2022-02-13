const enabledPages = ["https://repl.it/*", "https://replit.com/*"];
import { io } from "./assets/socketio.min.js";
let castId = null;
let socket = io(
  "https://replcast-server.herokuapp.com/" /*"http://localhost:3000"*/,
  {
    jsonp: false,
    transports: ["websocket"],
    autoConnect: false,
  }
);

const startCast = () => {
  console.log("Starting cast");
  socket.connect();
};

chrome.runtime.onMessage.addListener(function (request) {
  switch (request.type) {
    case "updateCast": {
      socket.emit("updateCast", {
        content: request.content,
        cursorPosition: request.cursorPosition,
        id: castId,
      });
      break;
    }
    case "killCast": {
      console.log("Killing cast", castId);
      socket.emit("killCast", castId);
      socket.disconnect();
      break;
    }
    default: {
      console.log("Unhandled message:", request);
    }
  }
});

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    title: "Cast with ReplCast",
    id: "1",
    documentUrlPatterns: enabledPages,
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if ((info.menuItemId = "1")) {
    startCast();
  }
});

socket.on("connect", () => {
  console.log("Connected to socket");
  socket.emit("serveCast");
});

socket.on("disconnect", () => {
  chrome.storage.local.set({ currentCast: "" });
  console.log("Disconnected from socket");
});

socket.on("castId", (e) => {
  castId = e.id;
  console.log("castId", e.id);
  chrome.storage.local.set({ currentCast: e.id });
  chrome.runtime.sendMessage({
    type: "copyCode",
    id: e.id,
  });
});
