import { http, HttpResponse, HttpHandler } from 'msw';

import { Event } from '../types';
import { events } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.

export const handlers: HttpHandler[] = [
  http.get('/api/events', () => {
    return HttpResponse.json(events);
  }),

  http.post('/api/events', async ({ request }) => {
    const { event } = (await request.json()) as { event: Event };
    const newEvents = { ...event, id: String(events.length + 1) };
    events.push(newEvents);
    return HttpResponse.json(newEvents, { status: 201 });
  }),

  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Record<string, unknown>;
    const updateEvents = events.map((event) =>
      event.id === id ? { ...event, ...updates } : event
    );
    return HttpResponse.json(updateEvents.find((event) => event.id === id));
  }),

  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;
    events.filter((event) => event.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
