# node-avro: Avro serialization format support for Node.js

This project aims to create a library for reading and writing
[Avro](http://avro.apache.org/)-serialized data in
[Node.js](http://nodejs.org/) applications.

It is currently basically functional, but not battle-tested in
production yet.

# Synopsis

```
var avro = require("avro");
var schema = avro.prepareSchema("string");
var buffer = schema.encode("foo");
var value = schema.decode(buffer);
```

## Licensing

node-avro is licensed under the MIT license.

## Requirements

```
apt-get install cmake libboost-dev libboost-filesystem-dev libboost-system-dev libboost-program-options-dev
```

## Contact

Node-avro is created by Manuel Simoni
([msimoni@gmail.com](mailto:msimoni@gmail.com)) for [Collective Media,
Inc](http://www.collective.com/).
