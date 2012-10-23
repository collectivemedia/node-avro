# node-avro: Avro serialization format support for Node.js

This project aims to create a library for reading and writing
[Avro](http://avro.apache.org/)-serialized data in
[Node.js](http://nodejs.org/) applications.

It is currently basically functional, but not battle-tested in
production yet.

## Install

Currently the best way to use it from your project:

```
apt-get install cmake libboost-dev libboost-filesystem-dev libboost-system-dev libboost-program-options-dev
git clone git://github.com/collectivemedia/node-avro.git
cd node-avro
./bin/install-and-run-tests
cd ..
npm install
```

(We're working on making this smoother.)

## API

### Example

```
var avro = require("avro");
var schema = avro.prepareSchema("string");
var buffer = schema.encode("foo");
var value = schema.decode(buffer);
```

### `avro.prepareSchema(<object>) -> <schema>`

Creates a prepared schema object from a JS schema object, as defined
in the [Avro spec](http://avro.apache.org/docs/current/spec.html).

### `<schema>.encode(<value>) -> <buffer>`

The `encode` method of a schema object takes a JS value and returns a
binary buffer containing the Avro-encoded representation of the value.

### `<schema>.decode(<buffer>) -> <value>`

The `decode` method of a schema object takes a binary buffer
containing an Avro-encoded value and returns the decoded JS value.

## Licensing

node-avro is licensed under the MIT license.

## Contact

Node-avro is created by Manuel Simoni
([msimoni@gmail.com](mailto:msimoni@gmail.com)) for [Collective Media,
Inc](http://www.collective.com/).
