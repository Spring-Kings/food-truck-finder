import Router from "next/router";

export const DEFAULT_OK_RESP = (_data: any) => {};
export const DEFAULT_ERR_RESP = (err: any) => console.log(err);
export const DEFAULT_ERR_KICK = (err: any) => {
  // Temporary measure: kick back to home
  console.log(err);
  Router.replace("/");
};
