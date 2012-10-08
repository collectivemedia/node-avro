var avro = require("./build/Release/avro");

/*
  Tests for examples from specification
*/

function assertMatchesHex(schema, value, hex) {
    var buf = avro.jsonStringToAvroBuffer(JSON.stringify(schema), JSON.stringify(value));
    var bufHex = buf.toString("hex");
    if (hex !== bufHex) {
        throw "Value " + JSON.stringify(value) + " doesn't match specified hex '" + hex +
              "', has '" + bufHex + "' instead.";
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

/*
  Test zigzag encoding from specification
*/

var zigzagSchema = "int";

assertMatchesHex(zigzagSchema, 0, "00");
assertMatchesHex(zigzagSchema, -1, "01");
assertMatchesHex(zigzagSchema, 1, "02");
assertMatchesHex(zigzagSchema, -2, "03");
assertMatchesHex(zigzagSchema, 2, "04");
assertMatchesHex(zigzagSchema, -64, "7f");
assertMatchesHex(zigzagSchema, 64, "8001");

/*
  Test roundtripping from JS to Avro and back to JS
*/

function assertRoundtrip(schema, value) {
    var schemaJson = JSON.stringify(schema);
    var valueJson = JSON.stringify(value);
    var buf = avro.jsonStringToAvroBuffer(schemaJson, valueJson);
    var json = avro.avroBufferToJsonString(schemaJson, buf);
    if (json !== valueJson) {
        throw "Value " + valueJson + " doesn't match " + json + ".";
    }
}

assertRoundtrip("string", "foo");
assertRoundtrip("int", 12);
assertRoundtrip("long", 12);

