export const stripe = {
  charges: {
    create: jest.fn().mockImplementation((params) => {
      console.log(params);
      return Promise.resolve();
    }),
  },
};
