interface AckHandlerCallback {
  (err: Error | undefined, guid: string): void;
}
export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (
          subject: string,
          data?: Uint8Array | string | Buffer,
          callback?: AckHandlerCallback
        ): string => {
          console.log({ subject, data });
          callback?.(undefined, "123");
          return "Ok";
        }
      ),
  },
};
