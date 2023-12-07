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

    const isSubmitted = statusEntry === undefined;
    setSubmitted(isSubmitted);

    // Set the submitted date to when this
    if (submitted) {
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
  }, [currUser]);

  const submitAction = async () => {
    console.log("Current user id:", currUser.UserID);
    // Update the current timesheet to be submitted by the logged-in user.
    // The type of status can be determined on the backend by the user type
    try {
      const reponse = await ApiClient.updateTimesheet(
        updateSchemas.StatusChangeRequest.parse({
          TimesheetId: props.timesheetId,
          AssociateId: props.associateId,
          authorId: currUser.UserID, // TODO: Implement authorId functionality instead of dummy data
          Status: props.timesheetStatus,
          Date: moment().unix(),
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
            {submitDate}
            {state}
          </CardFooter>
        )}
      </Card>
    </Box>
  );
}
