# Build file for Node-avro.
{
  "targets":
  [
    {
      "target_name": "avro",
      "sources": ["node_avro.cc"],
      'link_settings': {
          'libraries': [
              '/usr/local/lib/libavrocpp.so'
          ]
      }
    }
  ],
  "target_defaults":
  {
    # If this is not set, `Buffer.hh` doesn't find the header `Config.hh`.

    "include_dirs": ["/usr/local/include/avro"],

    # Exceptions and RTTI must be re-enabled because the Avro C++
    # library makes use of them.

    "cflags!": ["-fno-exceptions", "-fno-rtti"],
    "cflags_cc!": ["-fno-exceptions", "-fno-rtti"]
  }
}
