var avro = require("./build/Release/avro");

var schema1 = "string";
var value1_1 = "foo";

var buf1_1 = avro.jsonStringToAvroBuffer(JSON.stringify(schema1), JSON.stringify(value1_1));

console.log(buf1_1);

var value1_1_decoded = avro.avroBufferToJsonString(JSON.stringify(schema1), buf1_1);

console.log(value1_1_decoded);
