/**
 * Represents the model schema of a User
 */
export type UserModel = {
    firstName: string;
    lastName: string;
    userID: string;
    userEmail: string;
    associateCompanyIds?: string[];
    supervisorCompanyIds?: string[];
    userRole: string;
  };