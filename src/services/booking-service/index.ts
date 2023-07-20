import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import bookingRepository from '@/repositories/booking-repository';
import { noVacancyError } from '@/errors/no-vacancy-error';

async function listRooms(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.TicketType.isRemote) throw noVacancyError(); //FORBIDDEN 403
  if (!ticket || ticket.status === 'RESERVED' || !ticket.TicketType.includesHotel) throw cannotListHotelsError(); //PAYMENT_REQUIRED 402
  return;
}

async function getRooms(userId: number) {
  await listRooms(userId);
}

async function makeReseve(userId: number, roomId: number) {
  await listRooms(userId);
  const booking = await bookingRepository.create(userId, roomId);
  return booking;
}

async function changeRoom(userId: number, bookingId: number, roomId: number) {
  return 1;
}

const bookingService = {
  getRooms,
  makeReseve,
  changeRoom,
};

export default bookingService;
