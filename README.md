# node-avro: Avro serialization format support for Node.js

This project aims to create a library for reading and writing
[Avro](http://avro.apache.org/)-serialized data in
[Node.js](http://nodejs.org/) applications.

It is currently basically functional, but not battle-tested in
production yet.

# Install & Use

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

Then you can `require` it from JS:

```
var avro = require("avro");
var schema = avro.prepareSchema("string");
var buffer = schema.encode("foo");
var value = schema.decode(buffer);
```

## Licensing

node-avro is licensed under the MIT license.

## Contact

Node-avro is created by Manuel Simoni
([msimoni@gmail.com](mailto:msimoni@gmail.com)) for [Collective Media,
Inc](http://www.collective.com/).
