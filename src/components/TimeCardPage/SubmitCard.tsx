import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, CardFooter, Button } from '@chakra-ui/react';

//https://react-bootstrap.github.io/components/cards/


export default function SubmitCard(props) {

  const [submitted, setSubmitted] = useState(false);
  const [submitDate, setSubmitDate] = useState(null);

  useEffect(() => {
    //TODO - API Call to determine if the table has been submitted or not.
    //Will set submitted? here and also submitDate if it was submitted to grab the date 

  }, [])

  const submitAction = () => {
    setSubmitted(!submitted);
    const currentTime = new Date();
    setSubmitDate(currentTime.toString());
  }

  return (
    <Card
      bg={submitted ? 'success' : 'secondary'}
      key="submit_description"
      className="text-center"

    >
      <CardHeader>{submitted ? "Submitted!" : "Not Submitted"}</CardHeader>
      <CardBody>
        <Button variant={submitted ? 'light' : 'light'} onClick={submitAction}>{submitted ? "Resubmit" : "Submit!"}</Button>
      </CardBody>
      {submitted && <CardFooter>
        {submitDate}

      </CardFooter>}
    </Card>
  )

}
