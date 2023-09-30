import React, { useState, useEffect } from 'react'
import { WeeklyCommentModal } from './CommentModal';
import { Box, Card, CardHeader, CardBody, CardFooter, Button } from '@chakra-ui/react';
import { CardState } from './types'
import { CommentSchema } from 'src/schemas/RowSchema';

interface SubmitCardProps {
    setWeeklyComments: Function;
    setWeeklyReports: Function;
    weeklyComments: CommentSchema[];
    weeklyReports: CommentSchema[];
}

export default function SubmitCard({
    setWeeklyComments,
    setWeeklyReports,
    weeklyComments,
    weeklyReports
}: SubmitCardProps) {

  const [submitted, setSubmitted] = useState(false);
  const [submitDate, setSubmitDate] = useState(null);
  const [state, setState] = useState(CardState.Unsubmitted);

  useEffect(() => {
    //TODO - API Call to determine if the table has been submitted or not.
    //Will set submitted? here and also submitDate if it was submitted to grab the date     
  }, [])

  const submitAction = () => {
    setSubmitted(!submitted);
    const currentTime = new Date();
    setSubmitDate(currentTime.toString());
    if (state === CardState.Unsubmitted) {
      setState(CardState.InReviewEmployer);
    }
    else {
      setState(CardState.Unsubmitted);
    }
  }

  return (
    <Box className="col-md-2" style={{ display: "flex", justifyContent: 'flex-end' }}>
      <Card
        bg={(state === CardState.Completed) ? 'success' : ((state === CardState.InReviewBreaktime || state === CardState.InReviewEmployer) ? 'warning' : 'danger')}
        textColor="white"
        key="submit_description"
        className="mb-2 text-center">
        <CardBody>
          <Button variant={'light'} onClick={submitAction}>{submitted ? "Resubmit" : "Submit!"}</Button>
        </CardBody>
        {submitted && <CardFooter>
          {submitDate}
          {state}
          <WeeklyCommentModal setWeeklyComments={setWeeklyComments} setWeeklyReports={setWeeklyReports} weeklyComments={weeklyComments} weeklyReports={weeklyReports}/>
        </CardFooter>}
      </Card>
    </Box >
  );

}