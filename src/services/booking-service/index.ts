async function getRooms(userId: number) {
  return 1;
}

async function makeReseve(userId: number, roomId: number) {
  return 1;
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
