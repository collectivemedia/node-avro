#include "CountingBinaryEncoder.hh"

size_t CountingBinaryEncoder::getBytesWritten()
{
    return bytesWritten_; 
}

boost::shared_ptr<CountingBinaryEncoder> countingBinaryEncoder()
{
    return make_shared<CountingBinaryEncoder>();
}

void CountingBinaryEncoder::init(avro::OutputStream& os)
{
    out_.reset(os);
    bytesWritten_ = 0;
}

void CountingBinaryEncoder::flush()
{
    out_.flush();
}

void CountingBinaryEncoder::encodeNull()
{
}

void CountingBinaryEncoder::encodeBool(bool b)
{
    out_.write(b ? 1 : 0);
    bytesWritten_ += 1;
}

void CountingBinaryEncoder::encodeInt(int32_t i)
{
    doEncodeLong(i);
}

void CountingBinaryEncoder::encodeLong(int64_t l)
{
    doEncodeLong(l);
}

void CountingBinaryEncoder::encodeFloat(float f)
{
    const uint8_t* p = reinterpret_cast<const uint8_t*>(&f);
    out_.writeBytes(p, sizeof(float));
    bytesWritten_ += sizeof(float);
}

void CountingBinaryEncoder::encodeDouble(double d)
{
    const uint8_t* p = reinterpret_cast<const uint8_t*>(&d);
    out_.writeBytes(p, sizeof(double));
    bytesWritten_ += sizeof(double);
}

void CountingBinaryEncoder::encodeString(const std::string& s)
{
    doEncodeLong(s.size());
    out_.writeBytes(reinterpret_cast<const uint8_t*>(s.c_str()), s.size());
    bytesWritten_ += s.size();
}

void CountingBinaryEncoder::encodeBytes(const uint8_t *bytes, size_t len)
{
    doEncodeLong(len);
    out_.writeBytes(bytes, len);
    bytesWritten_ += len;
}

void CountingBinaryEncoder::encodeFixed(const uint8_t *bytes, size_t len)
{
    out_.writeBytes(bytes, len);
    bytesWritten_ += len;
}

void CountingBinaryEncoder::encodeEnum(size_t e)
{
    doEncodeLong(e);
}

void CountingBinaryEncoder::arrayStart()
{
}

void CountingBinaryEncoder::arrayEnd()
{
    doEncodeLong(0);
}

void CountingBinaryEncoder::mapStart()
{
}

void CountingBinaryEncoder::mapEnd()
{
    doEncodeLong(0);
}

void CountingBinaryEncoder::setItemCount(size_t count)
{
    if (count == 0) {
        throw avro::Exception("Count cannot be zero");
    }
    doEncodeLong(count);
}

void CountingBinaryEncoder::startItem()
{
}

void CountingBinaryEncoder::encodeUnionIndex(size_t e)
{
    doEncodeLong(e);
}

void CountingBinaryEncoder::doEncodeLong(int64_t l)
{
    boost::array<uint8_t, 10> bytes;
    size_t size = avro::encodeInt64(l, bytes);
    out_.writeBytes(bytes.data(), size);
    bytesWritten_ += size;
}
