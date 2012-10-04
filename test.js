var avro = require("./build/Release/avro");

/*
  Tests for examples from specification
*/

function assertMatchesHex(schema, value, hex) {
    var buf = avro.jsonStringToAvroBuffer(JSON.stringify(schema), JSON.stringify(value));
    var bufHex = buf.toString("hex");
    if (hex !== bufHex) {
        throw "Value " + JSON.stringify(value) + " doesn't match specified hex " + hex +
              ", has " + bufHex + " instead.";
    }
}

assertMatchesHex("string", "foo", "06666f6f");

var recordSchema =
  {
    "type": "record", 
    "name": "test",
    "fields" : [
      {"name": "a", "type": "long"},
      {"name": "b", "type": "string"}
    ]
  };

var record = { "a": 27, "b": "foo" };

assertMatchesHex(recordSchema, record, "3606666f6f");

var arraySchema = { "type": "array", "items": "long" };

var array = [ 3, 27 ];

assertMatchesHex(arraySchema, array, "04063600");

var unionSchema = ["string", "null"];

assertMatchesHex(unionSchema, null, "02");
assertMatchesHex(unionSchema, "a", "000261");
