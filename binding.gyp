# Build file for Node-avro.
{
  "targets":
  [
    {
      "target_name": "avro",
      "sources": ["node_avro.cc"],
      'link_settings': {
          'libraries': [
              '-L <(module_root_dir)/avro-cpp -l avrocpp_s'
          ]
      }
    }
  ],
  "target_defaults":
  {
    # If this is not set, `Buffer.hh` doesn't find the header `Config.hh`.

    "include_dirs": ["<(module_root_dir)/avro-cpp/api"],

    # Exceptions and RTTI must be re-enabled because the Avro C++
    # library makes use of them.

    "cflags!": ["-fno-exceptions", "-fno-rtti"],
    "cflags_cc!": ["-fno-exceptions", "-fno-rtti"]
  }
}
