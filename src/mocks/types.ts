// src/mocks/types.ts

export interface SendCodeRequestBody {
  simulateError?: boolean;
}

export function isSendCodeRequestBody(body: unknown): body is SendCodeRequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    ('simulateError' in body ? typeof (body as any).simulateError === 'boolean' : true)
  );
}
export interface LogRequestBody {
  error?: unknown;
  info?: unknown;
}

export function isLogRequestBody(body: unknown): body is LogRequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    ('error' in body || 'info' in body)
  );
}
