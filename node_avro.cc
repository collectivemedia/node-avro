#include <avro/Compiler.hh>
#include <avro/Decoder.hh>
#include <avro/Encoder.hh>
#include <avro/Generic.hh>
#include <avro/Specific.hh>
#include <avro/ValidSchema.hh>
#include <avro/buffer/Buffer.hh>
#include <avro/buffer/BufferStream.hh>
#include <node.h>
#include <node_buffer.h>
#include <v8.h>

using namespace std;
using namespace v8;

/*
  Takes two arguments, an Avro schema as a JSON string, and an Avro
  value as a JSON string, and returns a buffer containing the encoded
  data.
*/
static Handle<Value> JsonStringToAvroBuffer(const Arguments& args) {
  HandleScope scope;

  // Check arguments

  if (args.Length() != 2) {
    ThrowException(Exception::TypeError(String::New("Wrong number of arguments")));
    return scope.Close(Undefined());
  }

  Handle<Value> schemaString = args[0];
  Handle<Value> jsonString = args[1];

  if (!schemaString->IsString()) {
    ThrowException(Exception::TypeError(String::New("Schema must be a string")));
    return scope.Close(Undefined());
  }

  if (!jsonString->IsString()) {
    ThrowException(Exception::TypeError(String::New("JSON must be a string")));
    return scope.Close(Undefined());
  }

  // Compile schema

  String::Utf8Value schemaUtf8Value(schemaString);
  uint8_t *schemaBytes = (uint8_t *) *schemaUtf8Value;
  avro::ValidSchema schema = avro::compileJsonSchemaFromMemory(schemaBytes, schemaUtf8Value.length());

  // Decode JSON from string

  String::Utf8Value jsonUtf8Value(jsonString);
  uint8_t *jsonBytes = (uint8_t *) *jsonUtf8Value;
  auto_ptr<avro::InputStream> in = avro::memoryInputStream(jsonBytes, jsonUtf8Value.length());
  avro::DecoderPtr decoder = avro::jsonDecoder(schema);
  decoder->init(*in);
  avro::GenericDatum datum(schema);
  avro::decode(*decoder, datum);

  // Encode datum to output stream backed by stringstream

  stringstream ss(stringstream::out);
  auto_ptr<avro::OutputStream> out = avro::ostreamOutputStream(ss);
  avro::EncoderPtr encoder = avro::binaryEncoder();
  encoder->init(*out);
  avro::encode(*encoder, datum);
  out->flush();
  string s = ss.str();

  // Copy data to buffer and return it

  Handle<Value> buffer = node::Buffer::New((char *) s.data(), s.size())->handle_;
  return scope.Close(buffer);
}

/*
  Takes two arguments, an Avro schema as a JSON string, and a buffer
  containing encoded data, and returns a JSON string containing the
  decoded Avro value.
*/
static Handle<Value> AvroBufferToJsonString(const Arguments& args) {
  HandleScope scope;

  // Check arguments

  if (args.Length() != 2) {
    ThrowException(Exception::TypeError(String::New("Wrong number of arguments")));
    return scope.Close(Undefined());
  }

  Handle<Value> schemaString = args[0];
  Handle<Value> avroBuffer = args[1];

  if (!schemaString->IsString()) {
    ThrowException(Exception::TypeError(String::New("Schema must be a string")));
    return scope.Close(Undefined());
  }

  if (!node::Buffer::HasInstance(avroBuffer)) {
    ThrowException(Exception::TypeError(String::New("Not a buffer")));
    return scope.Close(Undefined());
  }

  // Compile schema

  String::Utf8Value schemaUtf8Value(schemaString);
  uint8_t *schemaBytes = (uint8_t *) *schemaUtf8Value;
  avro::ValidSchema schema = avro::compileJsonSchemaFromMemory(schemaBytes, schemaUtf8Value.length());

  // Decode data from buffer

  auto_ptr<avro::InputStream> in =
    avro::memoryInputStream((uint8_t *) node::Buffer::Data(avroBuffer->ToObject()),
                            node::Buffer::Length(avroBuffer->ToObject()));
  avro::DecoderPtr decoder = avro::binaryDecoder();
  decoder->init(*in);
  avro::GenericDatum datum(schema);
  avro::decode(*decoder, datum);
  
  // Encode data to JSON

  stringstream ss(stringstream::out);
  auto_ptr<avro::OutputStream> out = avro::ostreamOutputStream(ss);
  avro::EncoderPtr encoder = avro::jsonEncoder(schema);
  encoder->init(*out);
  avro::encode(*encoder, datum);
  out->flush();
  string s = ss.str();

  return scope.Close(String::New((char *) s.data(), s.size()));
}

void init(Handle<Object> target) {
  target->Set(String::NewSymbol("jsonStringToAvroBuffer"),
              FunctionTemplate::New(JsonStringToAvroBuffer)->GetFunction());
  target->Set(String::NewSymbol("avroBufferToJsonString"),
              FunctionTemplate::New(AvroBufferToJsonString)->GetFunction());
}

NODE_MODULE(avro, init)
