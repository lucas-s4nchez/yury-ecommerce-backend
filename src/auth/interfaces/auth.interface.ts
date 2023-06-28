import { RoleType } from "../../user/types/role.types";

export interface PayloadToken {
  role: RoleType;
  id: string;
}
