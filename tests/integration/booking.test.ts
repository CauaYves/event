import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { any, number } from 'joi';
import {
  createEnrollmentWithAddress,
  createHotel,
  createRoomWithHotelId,
  createTicket,
  createTicketType,
  createTicketTypeRemote,
  createTicketTypeWithHotel,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 403 if ticket is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeRemote();
    await createTicket(enrollment.id, ticketType.id, 'PAID');
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    const body = { roomId: room.id };

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  // it('should respond with status 200 when token is valid, ticket is PAID, the event is not remote and have hotels available', async () => {
  //   const user = await createUser();
  //   const token = await generateValidToken(user);
  //   const enrollment = await createEnrollmentWithAddress(user);
  //   const ticketType = await createTicketTypeWithHotel();
  //   await createTicket(enrollment.id, ticketType.id, 'PAID');
  //   const hotel = await createHotel();
  //   const room = await createRoomWithHotelId(hotel.id);
  //   const body = { roomId: room.id };

  //   const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
  //   expect(response.status).toBe(httpStatus.OK);
  //   expect(response.body).toEqual({
  //     roomId: expect(number),
  //   });
  // });
});

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});
