const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const admin = require("firebase-admin");
const serviceAccount = require("./private/notification-4e649-firebase-adminsdk-gfgjm-94b06a9b53.json");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hellos" });
});

app.post("/", async (req, res) => {
    const { fcm } = req.body;

    if (!fcm) {
        return res.status(400).json({ error: "FCM token is required" });
    }

    const message = {
        token: fcm,
        data: {
            type: "incoming_call",
            caller: "John Doe",
        },
        android: {
            priority: "high",
            notification: {
                title: "Incoming Call",
                body: "John Doe is calling you",
                sound: "default",
                clickAction: "CALL_ACTIVITY",
            },
        },
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("Successfully sent message:", response);
        return res.json({ message: "Phone call triggered", response });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: "Failed to send notification" });
    }
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
