#ifndef CountingBinaryEncoder_hh__
#define CountingBinaryEncoder_hh__

#include <avro/Encoder.hh>
#include <avro/Exception.hh>
#include <avro/Stream.hh>
#include <avro/Zigzag.hh>
#include <boost/array.hpp>
#include <boost/make_shared.hpp>

using boost::make_shared;
using boost::shared_ptr;

/*
  This is essentially a copy of Avro's BinaryEncoder extended to count
  the number of bytes written.

  Copying BinaryEncoder's code is a sub-optimal solution, but the only
  one that doesn't require modifying the Avro library's code - which I
  want to avoid at the moment.
*/

class CountingBinaryEncoder : public avro::Encoder {
    avro::StreamWriter out_;
    uint8_t *next_;
    uint8_t *end_;
    size_t bytesWritten_;

public:
    size_t getBytesWritten();
  
    void init(avro::OutputStream& os);
    void flush();
    void encodeNull();
    void encodeBool(bool b);
    void encodeInt(int32_t i);
    void encodeLong(int64_t l);
    void encodeFloat(float f);
    void encodeDouble(double d);
    void encodeString(const std::string& s);
    void encodeBytes(const uint8_t *bytes, size_t len);
    void encodeFixed(const uint8_t *bytes, size_t len);
    void encodeEnum(size_t e);
    void arrayStart();
    void arrayEnd();
    void mapStart();
    void mapEnd();
    void setItemCount(size_t count);
    void startItem();
    void encodeUnionIndex(size_t e);

    void doEncodeLong(int64_t l);
};

boost::shared_ptr<CountingBinaryEncoder> countingBinaryEncoder();

#endif
