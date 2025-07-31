const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const fs = require("fs");
const path = require("path");

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Hellos" });
});


// requirement has changed , server will now call the user
io.on("connection", (socket) => {
    console.log("A user connected - " + socket.id);

    //  requirement has changed , server will now call the user
    /*
    // read the file
    const filePath = path.join(__dirname, "welcome.mp3");
    // encode it in base64
    const base64Audio = fs.readFileSync(filePath, { encoding: "base64" });
    // step 1 :- send the welcome.mp3 file to the client
    socket.emit("play-audio", {
        data: base64Audio,
        fileName: "welcome.mp3",
        mime: "audio/mpeg",
    });

    */

    socket.on("disconnect", () => {
        console.log("A user disconnected - " + socket.id);
    });

    socket.on("message", (data) => {
        console.log("Message received: ", data);
        io.emit("message", data);
    });

    socket.on("audio-file", (socket, data) => { });
});

server.listen(8080, () => {
    console.log("Server is running on port 8080");
});
