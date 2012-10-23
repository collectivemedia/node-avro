var avro = require("../lib/index");
var should = require("should");

/*
  Tests for examples from specification
*/

function assertMatchesHex(schema, value, hex) {

    var schemaObj = avro.prepareSchema(schema);

    // Check that encoded value matches hex from spec
    var encBuf = schemaObj.encode(value);
    var encBufHex = encBuf.toString("hex");
    if (hex !== encBufHex) {
        throw "Value " + JSON.stringify(value) + " doesn't match specified hex '" + hex +
              "', has '" + encBufHex + "' instead.";
    }

    // Check that decoding hex from spec matches value
    var decBuf = new Buffer(hex, "hex");
    var decValue = schemaObj.decode(decBuf);
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
    var schemaObj = avro.prepareSchema(schema);
    var buf = schemaObj.encode(value);
    schemaObj.decode(buf).should.eql(value);
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

describe("Error handling tests", function() {

    it("built-in functions should throw an exception if called with the wrong arguments", function() {

        (function() { avro.prepareSchema(); }).should.throwError();
        (function() { avro.prepareSchema(12); }).should.throwError();
        (function() { avro.prepareSchema(true); }).should.throwError();

        var schema = avro.prepareSchema("boolean");
        (function() { schema.encode(); }).should.throwError();
        (function() { schema.encode(12); }).should.throwError();
        (function() { schema.encode("12"); }).should.throwError();

        (function() { schema.decode(); }).should.throwError();
        (function() { schema.decode(12); }).should.throwError();
        (function() { schema.decode("12"); }).should.throwError();

    });

});
