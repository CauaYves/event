import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function listRoomsReserves(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const bookingAndRoomData = await bookingService.getRooms(userId);
    return res.send(bookingAndRoomData);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function reserveRoom(req: AuthenticatedRequest, res: Response) {
  try {
    const { roomId } = req.body;
    const { userId } = req;
    const bookingId = await bookingService.makeReseve(userId, Number(roomId));
    return res.send({ bookingId });
  } catch (error) {
    if (error.name === 'NoVacancyError') return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND); // usar essa função
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function changeReserve(req: AuthenticatedRequest, res: Response) {
  try {
    const { roomId } = req.body;
    const { bookingId } = req.params;
    const { userId } = req;
    const room = await bookingService.changeRoom(userId, Number(bookingId), Number(roomId));
    res.send(room);
  } catch (error) {
    if (error.name === 'NoVacancyError') return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'CannotListHotelsError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED); // usar essa
  }
}
