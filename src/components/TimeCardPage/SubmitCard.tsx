import { CardState } from "./types";
import React, { useState, useEffect, useContext } from "react";
import { Box, Card, CardBody, CardFooter, Button } from "@chakra-ui/react";
import { DEFAULT_COLORS } from "src/constants";
import ApiClient from "src/components/Auth/apiClient";
import * as updateSchemas from "src/schemas/backend/UpdateTimesheet";
import { StatusType, StatusEntryType } from "src/schemas/StatusSchema";
import { UserTypes } from "./types";
import moment from "moment";
import { useToast } from "@chakra-ui/react";
import { UserContext } from "./UserContext";
import { UserSchema } from "src/schemas/UserSchema";
import { getCurrentUser } from "../Auth/UserUtils";
import { TimesheetStatus } from "src/schemas/TimesheetSchema";

interface submitCardProps {
  timesheetId: number;
  associateId: string;
  timesheetStatus: StatusType;
  refreshTimesheetCallback: Function;
}

export default function SubmitCard(props: submitCardProps) {
  const currUser = useContext(UserContext);

  const toast = useToast();

  /** Whether or not the logged-in user has submitted this timesheet yet.*/
  const [submitted, setSubmitted] = useState(false);

  /** The date and time (as a moment) that the logged-in user submitted/reviewed/finalized this timesheet.*/
  const [submitDate, setSubmitDate] = useState(null);
  /**
   *   The card state which corresponds to the latest status update from the timesheet. Corresponds to card color.
   *   Note that this is *not* dependent on the logged in user. I.e. if the latest status update was that
   *   the supervisor had submitted their timesheet review, the card state would be CardState.InReviewAdmin for
   *   any associate, supervisor, or admin that was viewing the timesheet.
   */
  const [state, setState] = useState(CardState.Unsubmitted);
  // TODO: Add information about who submitted when as state variables? i.e. included the authorIds somewhere

  // Run whenever there's an update to the current logged in user (i.e. re-render the correct submission status for the user type)
  useEffect(() => {
    if (currUser === undefined) {
      return;
    }

    console.log("submit card user", currUser);
    console.log(props.timesheetStatus);

    let statusEntry: StatusEntryType = undefined;

    // Determine the appropriate status entry to match up with the logged in user's role
    switch (currUser.Type) {
      case UserTypes.Associate:
        statusEntry = props.timesheetStatus.HoursSubmitted;
        break;

      case UserTypes.Supervisor:
        statusEntry = props.timesheetStatus.HoursReviewed;
        break;

      case UserTypes.Admin:
        statusEntry = props.timesheetStatus.Finalized;
        break;
    }

    const isSubmitted = statusEntry !== undefined;
    setSubmitted(isSubmitted);

    // Set the submitted date to when
    if (isSubmitted && statusEntry.Date !== undefined) {
      setSubmitDate(moment.unix(statusEntry.Date));
    }

    // Determine the latest status update to set the card state
    if (props.timesheetStatus.Finalized !== undefined) {
      setState(CardState.AdminFinalized);
    } else if (props.timesheetStatus.HoursReviewed !== undefined) {
      setState(CardState.InReviewAdmin);
    } else if (props.timesheetStatus.HoursSubmitted !== undefined) {
      setState(CardState.InReviewSupervisor);
    } else {
      setState(CardState.Unsubmitted);
    }
  }, [currUser, props.timesheetStatus]);

  const submitAction = async () => {
    console.log("Current user id:", currUser.UserID);

    let statusSubmissionType: string;

    // Determine the appropriate status entry to match up with the logged in user's role
    switch (currUser.Type) {
      case UserTypes.Associate:
        statusSubmissionType = TimesheetStatus.HOURS_SUBMITTED;
        break;

      case UserTypes.Supervisor:
        statusSubmissionType = TimesheetStatus.HOURS_REVIEWED;
        break;

      case UserTypes.Admin:
        statusSubmissionType = TimesheetStatus.HOURS_SUBMITTED;
        break;
    }

    // Update the current timesheet to be submitted by the logged-in user.
    // The type of status can be determined on the backend by the user type
    try {
      const response = await ApiClient.updateTimesheet(
        updateSchemas.TimesheetUpdateRequest.parse({
          TimesheetID: props.timesheetId,
          Operation: updateSchemas.TimesheetOperations.STATUS_CHANGE,
          Payload: updateSchemas.StatusChangeRequest.parse({
            TimesheetId: props.timesheetId,
            AssociateId: props.associateId,
            authorId: currUser.UserID, // TODO: Implement authorId functionality instead of dummy data
            statusType: statusSubmissionType,
            dateSubmitted: moment().unix(),
          }),
        })
      );

      // TODO: Confirm successful 2xx code responSse from API
      props.refreshTimesheetCallback();

      toast({
        title: "Successful submission!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Uh oh, something went wrong...",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  };

  return (
    <Box
      className="col-md-2"
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      <Card
        bg={
          state === CardState.AdminFinalized
            ? "success"
            : state === CardState.InReviewAdmin ||
              state === CardState.InReviewSupervisor
            ? "warning"
            : "danger"
        }
        textColor={DEFAULT_COLORS.BREAKTIME_BLUE}
        key="submit_description"
        className="mb-2 text-center"
      >
        <CardBody>
          <Button onClick={submitAction}>
            {submitted ? "Resubmit" : "Submit!"}
          </Button>
        </CardBody>
        {submitted && (
          <CardFooter>
            {/* TODO: The AuthorIDs below should all be replaced with calls to the API and then have a User profile card there instead (or at least the name, rather than ID lol) */}

            <div>
              {props.timesheetStatus.HoursSubmitted &&
              props.timesheetStatus.HoursSubmitted.Date ? (
                <p>
                  Associate: {props.timesheetStatus.HoursSubmitted.AuthorID},{" "}
                  <br />
                  Submitted on:{" "}
                  {customDateFormat(props.timesheetStatus.HoursSubmitted.Date)}
                </p>
              ) : (
                <p>Associate: Unsubmitted</p>
              )}

              {props.timesheetStatus.HoursReviewed &&
              props.timesheetStatus.HoursReviewed.Date ? (
                <p>
                  Supervsior: {props.timesheetStatus.HoursReviewed.AuthorID},{" "}
                  <br />
                  Submitted on:{" "}
                  {customDateFormat(props.timesheetStatus.HoursReviewed.Date)}
                </p>
              ) : (
                <p>Supervisor: Unsubmitted</p>
              )}

              {props.timesheetStatus.Finalized &&
              props.timesheetStatus.Finalized.Date ? (
                <p>
                  Admin: {props.timesheetStatus.Finalized.AuthorID}, <br />
                  Submitted on:{" "}
                  {customDateFormat(props.timesheetStatus.Finalized.Date)}
                </p>
              ) : (
                <p>Admin: Unsubmitted</p>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </Box>
  );
}

function customDateFormat(date) {
  const dateX = new Date(date * 1000);
  return dateX.toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}
