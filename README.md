# node-avro: Avro serialization format support for Node.js

This project aims to create a library for reading and writing
[Avro](http://avro.apache.org/)-serialized data in
[Node.js](http://nodejs.org/) applications.

It is currently in an early planning phase.

## Licensing

node-avro is licensed under the MIT license.

## Author

node-avro is created by Manuel Simoni
([msimoni@gmail.com](mailto:msimoni@gmail.com)) for [Collective Media,
Inc](http://www.collective.com/).

# Use Cases

## Sample Schema "person.avsc"

```javascript
{
  "type" : "record",
  "name" : "Person",
  "fields" : [ {
    "name" : "firstName",
    "type" : "string"
  }, {
    "name" : "birthday",
    "type" : "long",
    "doc": "birthday in seconds (silly)"
  } ]
}
```

## Writing Data

```javascript
var personSchema = avro.loadSchema("person.avsc");

var person = { "firstName": "Alice", "birthday": 2388301928301831208 };

var encodedBuffer = avro.jsonToBuffer(personSchema, person);
```

## Reading Data

```javascript
var personSchema = avro.loadSchema("person.avsc");

var encodedBuffer = myReadBufferFromSomewhere();

var person = avro.bufferToJson(personSchema, encodedBuffer);

console.log(person.firstName);
console.log(person.birthday);
```
