export const stripe = {
  charges: {
    create: jest.fn().mockImplementation(async (params) => {
      return "Ok";
    }),
  },
};
