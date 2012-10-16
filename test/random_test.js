var avro = require("../build/Release/avro");
var should = require("should");

/*
  This file contains a long-running test that encodes randomly created
  Avro data in order to provide wide coverage of serialization and
  deserialization, as well as to detect any memory leaks.
*/

/***** Random Schema Generation *****/

/* Number of different types of Avro values. */
var avroSchemaTypesCount = 14;

/*
  Returns a randomly created Avro schema.
*/
function createRandomAvroSchema() {
    var i = randomNumberBetweenZeroAnd(avroSchemaTypesCount);
    switch(i) {
    case 0:
        return "null";
    case 1:
        return "boolean";
    case 2:
        return "int";
    case 3:
        return "long";
    case 4:
        return "float";
    case 5:
        return "double";
    case 6:
        return "bytes";
    case 7:
        return "string";
    case 8:
        return createRandomRecordSchema();
    case 9:
        return createRandomEnumSchema();
    case 10:
        return createRandomArraySchema();
    case 11:
        return createRandomMapSchema();
    case 12:
        return createRandomUnionSchema();
    case 13:
        return createRandomFixedSchema();
    default:
        throw "Schema type out of range: " + i;
    }
}

/*
  Creates a random string for use as schema name.
*/
function createRandomName() {
    var name = "";
    var ct = randomNumberBetweenZeroAnd(50) + 1;
    var firstAscii = 97; // 'a'
    var ctAscii = 26;
    for (var i = 0; i < ct; i++) {
        name += String.fromCharCode(firstAscii + randomNumberBetweenZeroAnd(ctAscii));
    }
    return name;
}

/*
  Creates a random schema for an Avro record.
*/
function createRandomRecordSchema() {
    var fields = [];
    var ct = randomNumberBetweenZeroAnd(10) + 1;
    for (var i = 0; i < ct; i++) {
        fields.push({ "name": createRandomName(), "type": createRandomAvroSchema() });
    }
    return { "type": "record", "fields": fields, "name": createRandomName() };
}

/*
  Creates a random schema for an Avro enumeration.
*/
function createRandomEnumSchema() {
    var symbols = [];
    var ct = randomNumberBetweenZeroAnd(10);
    for (var i = 0; i < ct; i++) {
        symbols.push(createRandomName());
    }
    return { "type": "enum", "symbols": symbols, "name": createRandomName() };
}

/*
  Creates a random schema for an Avro array.
*/
function createRandomArraySchema() {
    return { "type": "array", "items": createRandomAvroSchema() };
}

/*
  Creates a random schema for an Avro map.
*/
function createRandomMapSchema() {
    return { "type": "map", "values": createRandomAvroSchema() };
}

/*
  Creates a random schema for an Avro union.
*/
function createRandomUnionSchema() {
    var union = [];
    var ct = randomNumberBetweenZeroAnd(10);
    for (var i = 0; i < ct; i++) {
        union.push(createRandomAvroSchema());
    }
    return union;
}

/*
  Creates a random schema for an Avro fixed.
*/
function createRandomFixedSchema() {
    return { "type": "fixed",
             "size": randomNumberBetweenZeroAnd(1024 * 10),
             "name": createRandomName() };
}

/*
  Returns a pseudorandom number greater than or equal to 0, and less
  than the number x.
*/
function randomNumberBetweenZeroAnd(x) {
    return Math.floor(Math.random() * x);
}

/***** Random Value Generation from Schema *****/

/*
  Creates a random Avro (JS) value from a schema.
*/
function createRandomValueFromSchema(schema) {
    // typeof should be OK here because we don't create schema strings
    // with `new`.
    if (typeof(schema) === "string") {
        switch(schema) {
        case "null":
            return null;
        case "boolean":
            return randomNumberBetweenZeroAnd(2) === 0 ? false : true;
        case "int":
            // TODO: test negative numbers
            return randomNumberBetweenZeroAnd(Math.pow(2, 31));
        case "long":
            // TODO: test negative numbers
            return randomNumberBetweenZeroAnd(Math.pow(2, 53));
        case "float":
            // fall through
        case "double":
            return Math.random(); // TODO: test larger numbers
        case "bytes":
            // fall through
            // TODO: test more exotic bytes
        case "string":
            return createRandomName(); // TODO: test more exotic strings
        default:
            throw "Unknown primitive schema type: " + schema;
        }
    } else {
        if (schema.length) {
            return createRandomUnion(schema);
        } else {
            switch(schema.type) {
            case "record":
                return createRandomRecord(schema);
            case "enum":
                return createRandomEnum(schema);
            case "array":
                return createRandomArray(schema);
            case "map":
                return createRandomMap(schema);
            case "fixed":
                return createRandomFixed(schema);
            default:
                throw "Unknown complex schema type: " + schema;
            }
        }
    }
}

function createRandomRecord(schema) {
    var record = Object.create(null);
    should.exist(schema.fields);
    for (var name in schema.fields) {
        record[name] = createRandomValueFromSchema(schema.fields[name].type);
    }
    return record;
}

function createRandomEnum(schema) {
    should.exist(schema.symbols);
    return schema.symbols[randomNumberBetweenZeroAnd(schema.symbols.length)];
}

function createRandomArray(schema) {
    var array = [];
    should.exist(schema.items);
    var ct = randomNumberBetweenZeroAnd(1000);
    for (var i = 0; i < ct; i++) {
        array.push(createRandomValueFromSchema(schema.items));
    }
    return array;
}

function createRandomMap(schema) {
    var map = Object.create(null);
    should.exist(schema.values);
    var ct = randomNumberBetweenZeroAnd(1000);
    for (var i = 0; i < ct; i++) {
        map[createRandomName()] = createRandomValueFromSchema(schema.values);
    }
    return map;
}

function createRandomUnion(schema) {
    should.exist(schema.length);
    return createRandomValueFromSchema(schema[randomNumberBetweenZeroAnd(schema.length)]);
}

function createRandomFixed(schema) {
    should.exist(schema.size);
    var data = "";
    for (var i = 0; i < schema.size; i++) {
        data += String.fromCharCode(randomNumberBetweenZeroAnd(255));
    }
    return data;
}

describe("Random Avro Generation", function() {
    it("should be able to roundtrip randomly generated Avro values", function() {
        for (var i = 0; i < 1000; i++) {
            var schema = createRandomAvroSchema();
            var schemaJson = JSON.stringify(schema);
            for (var j = 0; j < 10; j++) {
                var value = createRandomValueFromSchema(schema);
                var json = JSON.stringify(value);
                var buf = avro.jsonStringToAvroBuffer(schemaJson, json);
                var decodedJson = avro.avroBufferToJsonString(schemaJson, buf);
                if (json !== decodedJson) {
                    throw "Value " + json + " of schema " + schemaJson + 
                        " doesn't match " + decodedJson + ".";
                }
            }
        }
    });
});
