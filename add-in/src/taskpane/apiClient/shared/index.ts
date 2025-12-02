export const API_BASE_URL = "http://localhost:8000/api";

export class BaseAPIClient {
  protected url: `${typeof API_BASE_URL}/${string}`;

  constructor(resource: string) {
    this.url = `${API_BASE_URL}/${resource}`;
  }

  protected async fetchAPI<TResponse = unknown>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    options: {
      guard?: (response: unknown) => response is TResponse;
      data?: unknown;
    } = {}
  ): Promise<TResponse> {
    return fetch(this.url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: options.data !== undefined ? JSON.stringify(options.data) : undefined,
    })
      .then((res) => res.json())
      .then((data) => {
        if (options.guard !== undefined) {
          if (options.guard(data)) {
            return data;
          }
          throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
        }
        return data;
      })
      .catch((error) => {
        throw new Error(`API request failed: ${error.message}`);
      });
  }
}
