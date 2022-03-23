const mqtt = require("mqtt");
const pidusage = require("pidusage");

const topic = "nodeJsTopic";
const host = "mqtt://localhost";
const intervalMS = 5000; //10000
// const options = {
//   clientId: "Client ID",
//   username: "ID",
//   password: "Password",
// };

const options = {
  clientId: "ClientID",
  username: "ID",
  password: "Password",
};

//const client = mqtt.connect(host, options);
const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", function () {
  console.log("connecting...");
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
  console.log(topic);
  console.log(JSON.parse(message.toString()));
});