import CommentModal from "./CommentModal";
import { CardState } from "./types";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@chakra-ui/react";
import { DEFAULT_COLORS } from "src/constants";
import ApiClient from "src/components/Auth/apiClient";
import * as updateSchemas from "src/schemas/backend/UpdateTimesheet";
import { StatusType, StatusEntryType } from "src/schemas/StatusSchema";
import { UserTypes } from "./types";
import { TimesheetStatusSchema } from "src/schemas/backend/Timesheet";
import moment from "moment";
import { useToast } from "@chakra-ui/react";

interface submitCardProps {
  timesheetId: number;
  associateId: string;
  userType: UserTypes; // TODO : This should really be in global context for react
  timesheetStatus: StatusType;
  refreshTimesheetCallback: Function;
}



export default function SubmitCard(props: submitCardProps) {

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

  useEffect(() => {
    let statusEntry: StatusEntryType = undefined;

    // Determine the appropriate status entry to match up with the logged in user's role
    switch (props.userType) {
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
  }, []);

  const submitAction = () => {
    // Update the current timesheet to be submitted by the logged-in user.
    // The type of status can be determined on the backend by the user type
    try {
      // TODO comment this out if not testing end-to-end functionality
      ApiClient.updateTimesheet(
        // TODO: This needs to get updated; match up status change request schema with backend)
        updateSchemas.StatusChangeRequest.parse({
          TimesheetId: props.timesheetId,
          AssociateId: props.associateId,
        })
      );

      // TODO: Confirm successful 2xx code response from API
      props.refreshTimesheetCallback();

      toast({
        title: "Successful submission!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      // TODO: Send toast error message
      // toast.error('Uh oh - something went wrong with submitting...')
      toast({
        title: "Uh oh, something went wrong...",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // setSubmitted(submitted);
    // const currentTime = new Date();
    // setSubmitDate(currentTime.toString());
    // if (state === CardState.Unsubmitted) {
    //   setState(CardState.InReviewSupervisor);
    // } else {
    //   setState(CardState.Unsubmitted);
    // }
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
            {/*{state}*/}
            {/* TODO: this should come from each StatusEntry in the props.timesheetStatus object */}
            {/*Associate: abcb34993-1289378457-abdbd, 10-12-2023*/}
            {/*Supervisor: some-toher-id, 10-14-2023*/}
            {/*Admin: not submitted*/}

            <div>
            {props.timesheetStatus.HoursSubmitted && props.timesheetStatus.HoursSubmitted.Date ? (
                <p>
                  Associate: {props.timesheetStatus.HoursSubmitted.AuthorID}, {customDateFormat(props.timesheetStatus.HoursSubmitted.Date)}
                </p>
            ) : (<p>Associate: Unsubmitted</p>)}

            {props.timesheetStatus.HoursReviewed && props.timesheetStatus.HoursReviewed.Date ? (
                <p>
                  Supervsior: {props.timesheetStatus.HoursReviewed.AuthorID}, {customDateFormat(props.timesheetStatus.HoursReviewed.Date)}
                </p>
            ) : (<p>Supervsior:Unsubmitted</p>)}

            {props.timesheetStatus.Finalized && props.timesheetStatus.Finalized.Date ? (
                <p>
                  Admin: {props.timesheetStatus.Finalized.AuthorID}, {customDateFormat(props.timesheetStatus.Finalized.Date)}
                </p>
            ) :( <p>Admin: Unsubmitted</p>)}


              <CommentModal></CommentModal>
            </div>








          </CardFooter>
        )}
      </Card>
    </Box>
  );
}

// function customDateFormat(date) {
//   const dateX = new Date(date * 1000);
//   const year = dateX.getFullYear(); // Get the full year (e.g., 2023)
//   const month = (dateX.getMonth() + 1).toString().padStart(2, '0'); // Get the month (1-12) and pad with leading zero if needed
//   const day = dateX.getDate().toString().padStart(2, '0'); // Get the day of the month (1-31) and pad with leading zero if needed
//
//   return `${month}/${day}/${year.toString().slice(-2)}`;
// }
function customDateFormat(date) {
  const dateX = new Date(date * 1000);
  return dateX.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
}