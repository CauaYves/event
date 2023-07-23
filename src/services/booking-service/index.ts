import enrollmentRepository from '@/repositories/enrollment-repository';
import { internalServerError, notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import bookingRepository from '@/repositories/booking-repository';
import { noVacancyError } from '@/errors/no-vacancy-error';
import roomRepository from '@/repositories/room-repository';

async function getRooms(userId: number) {
  const booking = await bookingRepository.findReserveByUserId(userId);

  if (!booking) throw notFoundError();
  return {
    id: booking.id,
    Room: booking.Room,
  };
}

async function makeReseve(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw noVacancyError();
  }

  const room = await roomRepository.findRoomById(roomId);
  const reservesFromRoom = await bookingRepository.getBookingByRoomId(roomId);
  // verificar se o quarto nao existe 404
  if (!room) {
    throw notFoundError();
  }
  // verificar se o quarto possui vagas 403
  if (room.capacity === reservesFromRoom) {
    throw noVacancyError();
  }

  const booking = await bookingRepository.create(userId, roomId);
  return booking.id;
}

async function changeRoom(userId: number, bookingId: number, roomId: number) {
  const oldReserve = await getRooms(userId);
  if (!oldReserve) {
    console.log('o usuario nao fez reserva antes');
    throw notFoundError();
  }

  const room = await roomRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.capacity < 1) {
    console.log('sala sem vagas');
    throw noVacancyError();
  }
  const existingBooking = await bookingRepository.findUnique(bookingId);
  if (!existingBooking) {
    throw notFoundError();
  }
  const deletedOldReserve = await bookingRepository.editBooking(oldReserve.id, room.id);
  console.log(deletedOldReserve);
  if (oldReserve.id !== deletedOldReserve.id || !deletedOldReserve) throw internalServerError();

  return { roomId: deletedOldReserve.id };
}

const bookingService = {
  getRooms,
  makeReseve,
  changeRoom,
};

export default bookingService;
