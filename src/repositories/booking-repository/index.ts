import { prisma } from '@/config';

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
  create,
};

export default bookingRepository;
