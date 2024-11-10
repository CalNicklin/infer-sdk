// src/error.ts
var InferError = class extends Error {
  code;
  status;
  constructor({ code, message, status }) {
    super(message);
    this.name = "InferError";
    this.code = code;
    this.status = status;
  }
};
var UnauthorizedError = class extends InferError {
  constructor() {
    super({
      code: "unauthorized",
      message: "Invalid API key",
      status: 401
    });
  }
};
var RateLimitError = class extends InferError {
  constructor() {
    super({
      code: "rate_limited",
      message: "Rate limit exceeded",
      status: 429
    });
  }
};

// src/infer.ts
var Infer = class {
  apiKey;
  baseUrl;
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? "https://api.infer.ai";
  }
  async handleResponse(response) {
    if (response.ok) {
      return await response.json();
    }
    if (response.status === 401) {
      throw new UnauthorizedError();
    }
    if (response.status === 429) {
      throw new RateLimitError();
    }
    const error = await response.json().catch(() => ({
      message: "Unknown error occurred"
    }));
    throw new InferError({
      code: "server_error",
      message: error.message,
      status: response.status
    });
  }
  get zeroShot() {
    return {
      classify: async (text, labels, options = {}) => {
        const response = await fetch(`${this.baseUrl}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            inputs: text,
            parameters: {
              candidate_labels: labels.join(", "),
              ...options
            }
          })
        });
        return this.handleResponse(response);
      }
    };
  }
};
var infer_default = Infer;

// src/index.ts
var src_default = infer_default;
export {
  InferError,
  RateLimitError,
  UnauthorizedError,
  src_default as default
};
