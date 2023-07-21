import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function listRoomsReserves(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const bookingAndRoomData = await bookingService.getRooms(userId);
    res.send(bookingAndRoomData);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function reserveRoom(req: AuthenticatedRequest, res: Response) {
  try {
    const { roomId } = req.body;
    const { userId } = req;
    const booking = await bookingService.makeReseve(userId, Number(roomId));
    return res.send(booking.id).status(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NoVacancyError') return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'CannotListHotelsError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
  }
}

export async function changeReserve(req: AuthenticatedRequest, res: Response) {
  try {
    const { roomId } = req.body;
    const { bookingId } = req.params;
    const { userId } = req;
    // userId, Number(bookingId), Number(roomId);
    const room = await bookingService.changeRoom();
    res.send(room);
  } catch (error) {
    if (error.name === 'NoVacancyError') return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'CannotListHotelsError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
  }
}
