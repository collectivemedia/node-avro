var avro = require("../build/Release/avro");
var should = require("should");

var visitorSchema =
  {
    "type" : "record",
    "name" : "Visitor",
    "fields" : [
      {
        "name" : "cookie_id",
        "type" : "string" 
      },
      {
        "name" : "segments",
        "type" : {
          "type" : "map",
          "values" : "long" 
        },
        "default" : { }
      }
    ]
  };

var schemaObj = avro.parseSchema(JSON.stringify(visitorSchema));
var record = { "cookie_id": "1881c3fc349466de14f165e8604307e7",
               "segments": { "a": 122, "b": 244, "c": 366 } };

describe("Avro performance test", function() {

    it("test how many record it can encode per second", function() {
        for (var i = 0; i < 10000; i++) {
            var buf = avro.jsonStringToAvroBuffer(schemaObj, JSON.stringify(record));
        }
    });

    it("test how many record it can decode per second", function() {
        var buf = avro.jsonStringToAvroBuffer(schemaObj, JSON.stringify(record));
        for (var i = 0; i < 10000; i++) {
            var decodedRecord = JSON.parse(avro.avroBufferToJsonString(schemaObj, buf));
        }
    });

});

