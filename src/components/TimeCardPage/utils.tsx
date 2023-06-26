import { CellStatus, CommentType } from "./types";
import { CommentSchema } from "src/schemas/RowSchema";
import { UserSchema } from "src/schemas/UserSchema";
import moment from "moment";

export const getAllActiveCommentsOfType = (type: CommentType, commentArray: CommentSchema[]) => {
    if (commentArray === undefined) {
      return [];
    } else {
      return commentArray.filter((comment) => comment.Type === type && comment.State === CellStatus.Active);
    }
  };

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