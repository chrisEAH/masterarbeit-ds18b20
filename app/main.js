https://github.com/thisdavej/ds18b20-raspi#readme

var sensor = require('ds18b20-raspi');
var mqtt = require('mqtt');

var config={
    mqttBroker:"mqtt://192.168.178.27",
    mqttTopic:"halle2/porduktionslinie1/temperatur",
    sensor:"Temperatur"
};

if(process.env.mqtt_broker!=undefined){config.mqttBroker=process.env.mqtt_broker;}
if(process.env.sensor!=undefined){config.sensor=process.env.sensor;}
if(process.env.mqtt_topic!=undefined){config.mqttTopic=process.env.mqtt_topic;}

console.log("mqttEndPoint: " + config.mqttBroker);
console.log("mqtt topic: " + config.mqttTopic);
console.log("sensor: " + config.sensor);

var clientMqtt = mqtt.connect(config.mqttBroker);


   
clientMqtt.on('connect', function () {
    {
        console.log("connect to MQTT Endpoint: " + config.mqttBroker);
        setInterval(readTemperature, 5000);
    }
});


function readTemperature()
{
    sensor.readSimpleF((err, temp) => {
        if (err) {
            console.log(err);
        } else {
            console.log(temp);
            let date=new Date();
            var o={"Sensor":config.sensor,
                "Wert":[temp],
                "Einheit":["Fahrenheit"],
                "Zeitstempel":date.getDate()+"."+date.getMonth()+"."+date.getFullYear()+"-"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+","+date.getMilliseconds(),
                "Standort":config.mqttTopic.split("/")};
            clientMqtt.publish(config.mqttTopic,JSON.stringify(o));
        }
    });  
}

    