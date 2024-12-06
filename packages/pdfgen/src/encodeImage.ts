export interface EncodeOptions {
  string?: boolean;
  local?: boolean;
  headers?: HeadersInit;
}

function toBuffer(arrayBuffer: ArrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

export async function encode(
  url: string,
  opts: EncodeOptions = { string: false }
): Promise<string | Buffer> {
  try {
    if (!url || url === "") {
      return Promise.reject(new Error("URL is a required parameter"));
    }

    const response = await fetch(url, {
      headers: opts.headers,
    });
    const status = response.status;
    const data = await response.arrayBuffer();

    if (data && status >= 200 && status < 302) {
      const buf = toBuffer(data);
      return opts.string ? buf.toString("base64") : buf;
    }

    return Promise.reject(new Error("empty body and/or wrong status code"));
  } catch (err) {
    if (err) {
      return Promise.reject(err);
    }

    return Promise.reject(new Error("unknown error in encode"));
  }
}
