var avroInternal = require("../build/Release/avro");

module.exports.prepareSchema = function(schemaObject) {
    return new AvroSchema(schemaObject);
};

function AvroSchema(schemaObject) {
    this.internalSchema = avroInternal.parseSchema(JSON.stringify(schemaObject));
}

AvroSchema.prototype.encode = function(value) {
    return avroInternal.jsonStringToAvroBuffer(this.internalSchema, JSON.stringify(value));
};

AvroSchema.prototype.decode = function(buffer) {
    return JSON.parse(avroInternal.avroBufferToJsonString(this.internalSchema, buffer));
};
