// Minimal stand-in for the Vercel/Express response object.
export function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(body) {
      res.body = body;
      return res;
    },
    setHeader(name, value) {
      res.headers[name.toLowerCase()] = value;
    },
  };
  return res;
}

export function mockReq(body, method = "POST") {
  return { method, body, headers: { origin: "https://example.test", host: "example.test" } };
}
