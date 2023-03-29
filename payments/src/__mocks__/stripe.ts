export const stripe = {
  charges: {
    create: jest.fn().mockImplementation(async (params) => {
      return { id: "ch_3MqPfkG2Yz03o3oL1iFSzvEy" };
    }),
  },
};
