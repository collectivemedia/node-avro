# node-avro: Avro serialization format support for Node.js

This project aims to create a library for reading and writing
[Avro](http://avro.apache.org/)-serialized data in
[Node.js](http://nodejs.org/) applications.

## Licensing

node-avro is licensed under the MIT license.

## Contact

Node-avro is created by Manuel Simoni
([msimoni@gmail.com](mailto:msimoni@gmail.com)) for [Collective Media,
Inc](http://www.collective.com/).

## Install

### Prerequisites

#### Node.js 0.8.8 and npm

#### Modified Avro C++ library 1.7.2

https://github.com/manuel/avro-cpp

NOTE: The Avro header files must be under /usr/local/include/avro or
otherwise the include_dirs directive in the binding.gyp file must be
changed to point to the location.

### Build

```
$ npm install
```

This creates a directory called build/ containing the build outputs,
and node_modules/ containing required modules.  After changing the
binding.gyp file it has been necessary to remove the build/ directory.

### Use

In JavaScript:

```
var avro = require("./build/Release/avro");
```

See test.js for examples.

### Test

```
$ npm test
```
