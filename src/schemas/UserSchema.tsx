import { z } from "zod";

export const UserSchema = z.object({
  UserID: z.string(),
  FirstName: z.string(),
  LastName: z.string(),
  Email: z.string().email(),
  Type: z.enum(["Associate", "Supervisor", "Admin"]),
  Picture: z.string().optional(),
});

export type UserSchema = z.infer<typeof UserSchema>;
