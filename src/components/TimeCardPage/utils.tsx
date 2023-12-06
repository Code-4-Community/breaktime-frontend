import { CellStatus, CommentType } from "./types";
import { CommentSchema } from "src/schemas/RowSchema";
import { UserSchema } from "src/schemas/UserSchema";
import { ReportOptions } from "./types";
import moment from "moment";
import { UseToastOptions, createStandaloneToast } from "@chakra-ui/react";

export const getAllActiveCommentsOfType = (type: CommentType, commentArray: CommentSchema[]) => {
    if (commentArray === undefined) {
      return [];
    } else {
      return commentArray.filter((comment) => comment.Type === type && comment.State === CellStatus.Active);
    }
  };

export const toast = createStandaloneToast();

export const createToast = (props: UseToastOptions) => {
  return {
    position: props.position,
    title: props.title,
    description: props.description,
    status: props.status,
    duration: 9000,
    isClosable: true,
  };
}

export const createNewComment = (
    user: UserSchema,
    type: CommentType,
    content: string
  ) => {
    return {
      AuthorID: user?.UserID, // need to add loading logic so user is defined before anything occurs
      Type: type,
      Timestamp: moment().unix(), // TODO: possibly change it to be more specific formatting
      Content: content,
      State: CellStatus.Active,
    };
  };


// TODO: fix types and add a new type for report but this will do for demo
export const createNewReport = (
  user: UserSchema,
  content: ReportOptions,
  correctTime: number
) => {
  return {
    AuthorID: user?.UserID, // TODO: need to add loading logic so user is defined before anything occurs
    Type: CommentType.Report,
    Timestamp: correctTime, // TODO: possibly change it to be more specific formatting
    Content: content,
    State: CellStatus.Active,
  };
};