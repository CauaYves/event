import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import bookingRepository from '@/repositories/booking-repository';
import { noVacancyError } from '@/errors/no-vacancy-error';

async function checkIntegrityAndlistRooms(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw noVacancyError();
  }
}

async function getRooms(userId: number) {
  const booking = await bookingRepository.findReserveByUserId(userId);

  if (!booking) throw notFoundError();
  return {
    id: booking.id,
    Room: booking.Room,
  };
}

async function makeReseve(userId: number, roomId: number) {
  await checkIntegrityAndlistRooms(userId);
  const booking = await bookingRepository.create(userId, roomId);
  return booking;
}

async function changeRoom(/*userId: number, bookingId: number, roomId: number*/) {
  return 1;
}

const bookingService = {
  getRooms,
  makeReseve,
  changeRoom,
};

export default bookingService;
