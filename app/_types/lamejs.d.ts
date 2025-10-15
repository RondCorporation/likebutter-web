declare module 'lamejs' {
  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, bitRate: number);
    encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array<ArrayBuffer>;
    flush(): Int8Array<ArrayBuffer>;
  }

  export default {
    Mp3Encoder,
  };
}
