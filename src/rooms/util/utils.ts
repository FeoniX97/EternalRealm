import { ServerError } from "@colyseus/core";

export function authenticateRoom(auth: any, token: string) {
  if (auth.token === token) {
    return auth;
  } else {
    throw new ServerError(400, "Token不匹配, 认证失败！");
  }
}
