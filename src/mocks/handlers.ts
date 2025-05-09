import { http, HttpResponse } from 'msw';
import { isSendCodeRequestBody } from './types';

export const handlers = [
  // GET /api/industries → returns list or 500 if ?simulateError=1
  http.get('/api/industries', ({ request }) => {
    const url = new URL(request.url);
    const simulateError = url.searchParams.get('simulateError') === '1';

    if (simulateError) {
      return HttpResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }

    return HttpResponse.json(
      {
        industries: [
          'Technology',
          'Finance',
          'Healthcare',
          'Retail',
          'Education',
        ],
      },
      { status: 200 }
    );
  }),

  // POST /api/send-code → returns code or 400 if { simulateError: true }
  http.post('/api/send-code', async ({ request }) => {
    const body = await request.json();

    if (!isSendCodeRequestBody(body)) {
      return HttpResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (body.simulateError) {
      return HttpResponse.json(
        { message: 'Failed to send code' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      { success: true, code: '123456' },
      { status: 200 }
    );
  }),

  // POST /api/submit → returns success or 400 if { simulateError: true }
  http.post('/api/submit', async ({ request }) => {
    const body = await request.json();

    if (!isSendCodeRequestBody(body)) {
      return HttpResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (body.simulateError) {
      return HttpResponse.json(
        { message: 'Submission failed' },
        { status: 400 }
      );
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
  // POST /api/log → swallow error logs
  http.post('/api/log', async ({ request }) => {
    // Cast the unknown body to our expected shape
    const body = (await request.json()) as { error: string; info: string };
    const { error, info } = body;

    console.debug('[LOG ENDPOINT]', { error, info });
    return HttpResponse.json({}, { status: 200 });
  }),
];
