import lamejs from 'lamejs';

export const AUDIO_CONSTRAINTS = {
  // 원본 파일 제한 (변환 전)
  maxOriginalSize: 100 * 1024 * 1024, // 100MB
  // 업로드 파일 제한 (변환 후, MP3 기준)
  maxUploadSize: 30 * 1024 * 1024, // 30MB
  // MP3 변환 설정
  mp3BitRate: 192, // 192kbps
  mp3SampleRate: 44100, // 44.1kHz
  // 허용 형식
  allowedMimeTypes: ['audio/mpeg', 'audio/wav'],
  allowedExtensions: ['.mp3', '.wav'],
} as const;

export interface ConversionProgress {
  stage: 'decoding' | 'encoding' | 'complete';
  progress: number; // 0-100
  estimatedSize?: number;
}

/**
 * Check if file is a WAV file
 */
export function isWavFile(file: File): boolean {
  return (
    file.type === 'audio/wav' ||
    file.type === 'audio/x-wav' ||
    file.name.toLowerCase().endsWith('.wav')
  );
}

/**
 * Check if file is an MP3 file
 */
export function isMp3File(file: File): boolean {
  return (
    file.type === 'audio/mpeg' ||
    file.type === 'audio/mp3' ||
    file.name.toLowerCase().endsWith('.mp3')
  );
}

/**
 * Validate audio file format
 */
export function validateAudioFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file format
  if (!isWavFile(file) && !isMp3File(file)) {
    return {
      valid: false,
      error: 'Only MP3 and WAV files are supported',
    };
  }

  // Check original file size
  if (file.size > AUDIO_CONSTRAINTS.maxOriginalSize) {
    const maxSizeMB = AUDIO_CONSTRAINTS.maxOriginalSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Decode WAV file to PCM data
 */
async function decodeWav(
  arrayBuffer: ArrayBuffer
): Promise<{ channels: number; sampleRate: number; samples: Int16Array[] }> {
  const dataView = new DataView(arrayBuffer);

  // WAV 헤더 파싱
  const channels = dataView.getUint16(22, true);
  const sampleRate = dataView.getUint32(24, true);
  const bitsPerSample = dataView.getUint16(34, true);

  // 데이터 청크 찾기
  let pos = 12;
  while (pos < arrayBuffer.byteLength) {
    const chunkId = String.fromCharCode(
      dataView.getUint8(pos),
      dataView.getUint8(pos + 1),
      dataView.getUint8(pos + 2),
      dataView.getUint8(pos + 3)
    );
    const chunkSize = dataView.getUint32(pos + 4, true);

    if (chunkId === 'data') {
      pos += 8;
      break;
    }
    pos += 8 + chunkSize;
  }

  // PCM 데이터 추출
  const samplesCount = (arrayBuffer.byteLength - pos) / (bitsPerSample / 8);
  const samples: Int16Array[] = [];

  for (let ch = 0; ch < channels; ch++) {
    samples.push(new Int16Array(Math.floor(samplesCount / channels)));
  }

  let sampleIndex = 0;
  while (pos < arrayBuffer.byteLength) {
    for (let ch = 0; ch < channels; ch++) {
      if (bitsPerSample === 16) {
        samples[ch][sampleIndex] = dataView.getInt16(pos, true);
        pos += 2;
      } else if (bitsPerSample === 8) {
        samples[ch][sampleIndex] = (dataView.getUint8(pos) - 128) * 256;
        pos += 1;
      }
    }
    sampleIndex++;
  }

  return { channels, sampleRate, samples };
}

/**
 * Convert WAV file to MP3
 */
export async function convertWavToMp3(
  file: File,
  onProgress?: (progress: ConversionProgress) => void
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      onProgress?.({ stage: 'decoding', progress: 10 });

      // Decode WAV
      const { channels, sampleRate, samples } = await decodeWav(arrayBuffer);

      onProgress?.({ stage: 'decoding', progress: 30 });

      // Initialize MP3 encoder
      const mp3Encoder = new lamejs.Mp3Encoder(
        channels,
        sampleRate,
        AUDIO_CONSTRAINTS.mp3BitRate
      );

      onProgress?.({ stage: 'encoding', progress: 40 });

      const mp3Data: Int8Array<ArrayBuffer>[] = [];
      const sampleBlockSize = 1152;

      // Encode samples in chunks
      for (
        let i = 0;
        i < samples[0].length;
        i += sampleBlockSize
      ) {
        const leftChunk = samples[0].subarray(i, i + sampleBlockSize);
        const rightChunk =
          channels > 1
            ? samples[1].subarray(i, i + sampleBlockSize)
            : leftChunk;

        const mp3buf = mp3Encoder.encodeBuffer(leftChunk, rightChunk);

        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }

        // Update progress
        const progress = 40 + Math.floor((i / samples[0].length) * 50);
        onProgress?.({ stage: 'encoding', progress });
      }

      onProgress?.({ stage: 'encoding', progress: 90 });

      // Flush remaining data
      const mp3buf = mp3Encoder.flush();
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }

      onProgress?.({ stage: 'complete', progress: 100 });

      // Create Blob from MP3 data
      const blob = new Blob(mp3Data, { type: 'audio/mpeg' });

      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Process audio file for upload
 * - Validates file format and size
 * - Converts WAV to MP3 if needed
 * - Returns processed file ready for upload
 */
export async function processAudioFile(
  file: File,
  onProgress?: (progress: ConversionProgress) => void
): Promise<{ file: File; wasConverted: boolean; originalSize: number }> {
  const originalSize = file.size;

  // Validate file
  const validation = validateAudioFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // If it's MP3, check upload size and return as-is
  if (isMp3File(file)) {
    if (file.size > AUDIO_CONSTRAINTS.maxUploadSize) {
      const maxSizeMB = AUDIO_CONSTRAINTS.maxUploadSize / (1024 * 1024);
      throw new Error(
        `MP3 file size exceeds ${maxSizeMB}MB upload limit. Please use a lower bitrate or shorter audio.`
      );
    }
    return { file, wasConverted: false, originalSize };
  }

  // If it's WAV, convert to MP3
  if (isWavFile(file)) {
    onProgress?.({ stage: 'decoding', progress: 0 });

    const mp3Blob = await convertWavToMp3(file, onProgress);

    // Check converted file size
    if (mp3Blob.size > AUDIO_CONSTRAINTS.maxUploadSize) {
      const maxSizeMB = AUDIO_CONSTRAINTS.maxUploadSize / (1024 * 1024);
      throw new Error(
        `Converted MP3 file size (${(mp3Blob.size / (1024 * 1024)).toFixed(1)}MB) exceeds ${maxSizeMB}MB upload limit. Please use a shorter audio file.`
      );
    }

    // Create File from Blob with original name but .mp3 extension
    const mp3File = new File(
      [mp3Blob],
      file.name.replace(/\.[^/.]+$/, '.mp3'),
      { type: 'audio/mpeg' }
    );

    return { file: mp3File, wasConverted: true, originalSize };
  }

  throw new Error('Unsupported file format');
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
