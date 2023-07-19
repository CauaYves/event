import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function listRoomsReserves(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const room = await bookingService.getRooms(userId);
    res.send(room);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function reserveRoom(req: AuthenticatedRequest, res: Response) {
  try {
    const { roomId } = req.body;
    const { userId } = req;
    const room = await bookingService.makeReseve(userId, Number(roomId));
    res.send(room);
  } catch (error) {
    if (error.name === 'NoVacancyError') return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
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
  }
}
