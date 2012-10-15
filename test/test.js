var avro = require("../build/Release/avro");
var should = require("should");

/*
  Tests for examples from specification
*/

function assertMatchesHex(schema, value, hex) {

    // Check that encoded value matches hex from spec
    var encBuf = avro.jsonStringToAvroBuffer(JSON.stringify(schema), JSON.stringify(value));
    var encBufHex = encBuf.toString("hex");
    if (hex !== encBufHex) {
        throw "Value " + JSON.stringify(value) + " doesn't match specified hex '" + hex +
              "', has '" + encBufHex + "' instead.";
    }

    // Check that decoding hex from spec matches value
    var decBuf = new Buffer(hex, "hex");
    var decValue = JSON.parse(avro.avroBufferToJsonString(JSON.stringify(schema), decBuf));
    if (value === null) {
        if (decValue !== null) {
            throw "Decoded value should be null, but is " + JSON.stringify(decValue);
        }
    } else {
        value.should.eql(decValue);
    }

}

describe("Avro specification tests", function() {

    it("should serialize Avro values to the hex sequences given in the specification", function() {

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
    
    });
       
});
    
/*
  Test zigzag encoding from specification
*/

describe("Zigzag encoding tests", function() {

    it("should encode integers to the zigzag sample values from the specification", function() {

        var zigzagSchema = "int";
        
        assertMatchesHex(zigzagSchema, 0, "00");
        assertMatchesHex(zigzagSchema, -1, "01");
        assertMatchesHex(zigzagSchema, 1, "02");
        assertMatchesHex(zigzagSchema, -2, "03");
        assertMatchesHex(zigzagSchema, 2, "04");
        assertMatchesHex(zigzagSchema, -64, "7f");
        assertMatchesHex(zigzagSchema, 64, "8001");

    });

});

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

describe("Avro roundtrip tests", function() {

    it("should be able to roundtrip arbitrary values between JS and Avro", function() {

        assertRoundtrip("string", "foo");
        assertRoundtrip("int", 12);
        assertRoundtrip("long", 12);
        assertRoundtrip({ "type": "array", "items": "string" },
                        [ "a", "b", "c" ]);
        assertRoundtrip({ "type": "record", "name": "test", "fields" : [ {"name": "a", "type": "long"} ] },
                        { "a": 12 });

    });

});
