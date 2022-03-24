const mqtt = require("mqtt");
const pidusage = require("pidusage");

const topic = "Topic";
const host = "mqtt://localhost:1883";
const intervalMS = 10000;

const options = {
  clientId: "ClientID",
  username: "ID",
  password: "Password",
};

const client = mqtt.connect(host, options);

client.on("connect", function () {
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log("Connected");

      setInterval(async () => {
        const stats = await pidusage(process.pid);
        const msg = {
          cpu: Math.round(stats.cpu),
          memory: Math.round(stats.memory / 1024 / 1024),
          date: new Date().toISOString(),
        }
        console.log("Publishing message: ", msg);
        client.publish(topic, Buffer.from(JSON.stringify(msg), "utf-8"));
      }, intervalMS);

    } else {
      console.log(err);
    }
  });
});

client.on("message", function (topic, message) {
  // message is Buffer
  console.log(JSON.parse(message.toString()));
});