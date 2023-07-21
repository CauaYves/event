import httpStatus from 'http-status';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createHotel,
  createRoomWithHotelId,
  createTicket,
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

  it('should respond with status 200 and roomId', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, 'PAID');
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    const body = { roomId: room.id };

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
    expect(response.status).toBe(httpStatus.OK);
  });
});

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should return 404 when user no have reserves', async () => {
    const token = generateValidToken();
    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should return 200 when user as maded reserve', async () => {
    const token = generateValidToken();
    const response = await server.get('/booking').set('Authorizarion', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});
