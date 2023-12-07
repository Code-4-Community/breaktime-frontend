import { z } from "zod";
import { UserTypes } from "src/components/TimeCardPage/types";

export const UserSchema = z.object({
  UserID: z.string(),
  FirstName: z.string(),
  LastName: z.string(),
  Type: z.enum([UserTypes.Associate, UserTypes.Supervisor, UserTypes.Admin]),
  Picture: z.string().optional(),
});

export type UserSchema = z.infer<typeof UserSchema>;
