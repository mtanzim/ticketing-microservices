import { useState } from "react";
import axios from "axios";

export default function useRequest({ url, method, body }) {
  const [errJSX, setErrJSX] = useState(null);

  const doRequest = async () => {
    try {
      setErrJSX(null);
      const response = await axios?.[method]?.(url, body);
      return response.data;
    } catch (err) {
      const errors = err?.response?.data?.errors;
      setErrJSX(
        <div className="alert alert-danger" role="alert">
          <h2>Oops...</h2>
          <ul>
            {errors?.map((e) => (
              <li>{e?.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errJSX };
}
