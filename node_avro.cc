#include <avro/Compiler.hh>
#include <avro/Decoder.hh>
#include <avro/Encoder.hh>
#include <avro/Generic.hh>
#include <avro/Specific.hh>
#include <avro/ValidSchema.hh>
#include <avro/buffer/Buffer.hh>
#include <avro/buffer/BufferStream.hh>
#include <cassert>
#include <node.h>
#include <node_buffer.h>
#include <v8.h>

using namespace std;
using namespace v8;

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
  
  // Encode datum to output stream

  auto_ptr<avro::OutputStream> out = avro::memoryOutputStream();
  avro::EncoderPtr encoder = avro::binaryEncoder();
  encoder->init(*out);
  avro::encode(*encoder, datum);

  // Copy encoded data to vector

  size_t len = out->byteCount();
  assert(len > 0);
  vector<uint8_t> v(len);
  avro::StreamReader r;
  r.reset(*avro::memoryInputStream(*out));
  for (size_t i = 0; i < len; i++) {
    try {
      v[i] = r.read();
    } catch(Exception e) {
      break;
    }
  }

  // Copy data to buffer and return it

  Handle<Value> buffer = node::Buffer::New((char *) &v.front(), len)->handle_;
  return scope.Close(buffer);
}

void init(Handle<Object> target) {
  target->Set(String::NewSymbol("jsonStringToAvroBuffer"),
              FunctionTemplate::New(JsonStringToAvroBuffer)->GetFunction());
}

NODE_MODULE(avro, init)
