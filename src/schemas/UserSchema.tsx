import { USER_ROLES } from "src/components/TimeCardPage/types";
import { z } from "zod";

export const UserSchema = z.object({
  UserID: z.string(),
  FirstName: z.string(),
  LastName: z.string(),
  Type: z.nativeEnum(USER_ROLES),
  Picture: z.string().optional(),
});

export type UserSchema = z.infer<typeof UserSchema>;
