import { UserSchema } from "./schemas/UserSchema";

export const userHeighted = (user: UserSchema) => { return user?.Type === "Supervisor" || user?.Type === "Admin"; };
