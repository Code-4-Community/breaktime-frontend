import CommentModal from './CommentModal';
import { CardState } from './types'

import React, { useState, useEffect } from 'react'
import { Box, Card, CardHeader, CardBody, CardFooter, Button } from '@chakra-ui/react';
import { DEFAULT_COLORS } from 'src/constants';
import ApiClient from 'src/components/Auth/apiClient'
import * as updateSchemas from 'src/schemas/backend/UpdateTimesheet'
import { StatusType, StatusEntryType } from 'src/schemas/StatusSchema';
import { UserTypes } from './types';
import { TimesheetStatus } from 'src/schemas/backend/Timesheet';
import moment from 'moment';

interface submitCardProps{
  timesheetId: number,
  associateId: string,
  userType: UserTypes,
  timesheetStatus: StatusType
}

export default function SubmitCard(props: submitCardProps) {

  const [submitted, setSubmitted] = useState(false);
  const [submitDate, setSubmitDate] = useState(null);
  const [state, setState] = useState(CardState.Unsubmitted);

  let statusEntry: StatusEntryType = undefined;

  useEffect(() => {
    switch(props.userType){
      case UserTypes.Associate:
        statusEntry = props.timesheetStatus.HoursSubmitted
        break;
        
      case UserTypes.Supervisor:
        statusEntry = props.timesheetStatus.HoursReviewed
        break;
        
      case UserTypes.Admin:
        statusEntry = props.timesheetStatus.Finalized
        break;
    }

    const isSubmitted = statusEntry === undefined
    setSubmitted(isSubmitted)
    if (submitted) {
      setSubmitDate(moment.unix(statusEntry.Date))
    }

    if() {

    }
    
    //TODO - API Call to determine if the table has been submitted or not.
    //Will set submitted? here and also submitDate if it was submitted to grab the date     
  }, [])

  const submitAction = () => {
    ApiClient.updateTimesheet(updateSchemas.StatusChangeRequest.parse({
      TimesheetID: props.timesheetId,
      AssociateID: props.associateId}))

     // TODO : setup info to read from current db entry
    setSubmitted(!submitted);
    const currentTime = new Date();
    setSubmitDate(currentTime.toString());
    if (state === CardState.Unsubmitted) {
      setState(CardState.InReviewSupervisor);
    }
    else {
      setState(CardState.Unsubmitted);
    }
  }

  return (
    <Box className="col-md-2" style={{ display: "flex", justifyContent: 'flex-end' }}>
      <Card
        bg={(state === CardState.AdminFinalized) ? 'success' : ((state === CardState.InReviewAdmin || state === CardState.InReviewSupervisor) ? 'warning' : 'danger')}
        textColor={DEFAULT_COLORS.BREAKTIME_BLUE}
        key="submit_description"
        className="mb-2 text-center">
        <CardBody>
          <Button onClick={submitAction}>{submitted ? "Resubmit" : "Submit!"}</Button>
        </CardBody>
        {submitted && <CardFooter>
          {submitDate}
          {state}
          <CommentModal></CommentModal>

        </CardFooter>}
      </Card>
    </Box >
  );
}