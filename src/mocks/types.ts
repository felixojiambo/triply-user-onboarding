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
