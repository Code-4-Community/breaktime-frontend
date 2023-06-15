import { createContext } from 'react';
import { UserSchema } from 'src/schemas/UserSchema';

export const UserContext = createContext<UserSchema>(undefined);