import React, { useState, useEffect, useContext } from "react";
import { Stack } from "@chakra-ui/react";

import { UserContext } from "../UserContext";
import { CommentSchema } from "../../../schemas/RowSchema";
import { CommentType } from "../types";
import { getAllActiveCommentsOfType } from "../utils";

import ShowCommentModal from "./CommentModals/ShowCommentModal";
import ShowReportModal from "./CommentModals/ShowReportModal";

interface CommentProps {
  comments: CommentSchema[] | undefined;
  date: number;
  timesheetID: number;
}

export function CommentCell({
  comments,
  date,
  timesheetID
}: CommentProps) {
  const [currentComments, setCurrentComments] = useState(
    getAllActiveCommentsOfType(CommentType.Comment, comments)
  );
  const [reports, setReports] = useState(
    getAllActiveCommentsOfType(CommentType.Report, comments)
  );
  const [isEditable, setisEditable] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    //Supervisor/Admins have the right to edit comments/reports
    if (user?.Type === "Supervisor" || user?.Type === "Admin") {
      setisEditable(true);
    }
  }, [user?.Type]);

  return (
    <Stack direction='row'>
      <ShowCommentModal
        setComments={setCurrentComments}
        comments={currentComments}
        isEditable={isEditable}
        timesheetID={timesheetID}
      />
      <ShowReportModal
        date={date}
        setReports={setReports}
        reports={reports}
        isEditable={isEditable}
        timesheetID={timesheetID}
      />
    </Stack>
  );
}
