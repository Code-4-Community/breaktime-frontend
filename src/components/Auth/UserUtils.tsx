import { Auth } from "aws-amplify";
import { UserSchema } from "src/schemas/UserSchema";

// TODO: Below code is primarily pulled from backend files (User.client.ts and user.service.ts). This should be moved to a shared folder
import { z } from "zod";
import { UserTypes } from "../TimeCardPage/types";

/**
 * The client schema of a Cognito attribute.
 * e.g : {Name: 'sub', 'value': 'aeddc72a-fe42b78a8-....'}
 */
export const CognitoAttributes = z.object({
  email: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  sub: z.string(),
});

/**
 * Represents the client schema of a User object returned from Cognito.
 */
export const CognitoUser = z.object({
  attributes: CognitoAttributes, // TODO : should likely expand this out to include all the known attributes we expect from cognito
  username: z.string(),
});

export type CognitoUser = z.infer<typeof CognitoUser>;

const convertCognitoUser = function (user: CognitoUser): UserSchema {
  var sub = user.attributes.sub;
  var firstName = user.attributes.given_name;
  var lastName = user.attributes.family_name;

  // TODO: The type here shouldn't be hard-coded

  return {
    FirstName: firstName,
    LastName: lastName,
    UserID: sub,
    Type: UserTypes.Associate,
  };
};

// TODO: Should this be in a separate file because
export const getCurrentUser = async function (): Promise<UserSchema> {
  const cognitoCurrentUser = await Auth.currentUserInfo();
  console.log(cognitoCurrentUser);
  const currUser = CognitoUser.parse(cognitoCurrentUser);
  //TODO: Also make a call to apiClient.getUser() to get the group for this user
  return convertCognitoUser(currUser);
};
