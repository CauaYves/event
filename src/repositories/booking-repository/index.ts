import { prisma } from '@/config';

async function findReserveByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: { Room: true },
  });
}

async function create(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
      updatedAt: new Date(),
    },
  });
}

const bookingRepository = {
  findReserveByUserId,
  create,
};

export default bookingRepository;
