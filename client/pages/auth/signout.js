import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

export default function Signout() {
  const { doRequest, errJSX } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/auth/signin"),
  });
  useEffect(() => {
    doRequest();
  }, []);

  return <p>You are being signed out...</p>;
}
