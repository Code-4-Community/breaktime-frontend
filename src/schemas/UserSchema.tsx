import { z } from "zod";

export const UserSchema = z.object({
  UserID: z.string(), 
  Name: z.string(),
  Type: z.enum(["Employee", "Supervisor", "Admin"]),
  Picture: z.string().optional()
})

export type UserSchema = z.infer<typeof UserSchema>
