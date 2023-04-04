import { useState } from "react";
import axios from "axios";

export default function useRequest({ url, method, body, onSuccess }) {
  const [errJSX, setErrJSX] = useState(null);

  const doRequest = async (e, bodyOverride = {}) => {
    try {
      setErrJSX(null);
      const mergedBody = {
        ...body,
        ...bodyOverride,
      };
      console.log({ body, mergedBody, bodyOverride });
      const response = await axios?.[method]?.(url, mergedBody);
      return onSuccess(response.data);
    } catch (err) {
      console.log(err);
      const errors = err?.response?.data?.errors;
      setErrJSX(
        <div className="alert alert-danger mt-2 mb-2" role="alert">
          <h2>Oops...</h2>
          <ul>
            {errors?.map((e, idx) => (
              <li key={idx}>{e?.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errJSX };
}
