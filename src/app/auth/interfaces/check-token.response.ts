import { Usuario } from "./login-response.interface";


export interface CheckTokenResponse {
  user:  Usuario;
  token: string;
}
