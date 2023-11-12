import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Textarea,
} from '@chakra-ui/react';

function ReportModal() {

  const [reasonForReport, setReasonForReport] = useState('');
  const [notificationToSupervisor, setNotificationToSupervisor] = useState('');
  const [reasonForLateness, setReasonForLateness] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault(); 

    //temporary method of dealing with the data - need to figure out how to send it to the database
    console.log({
      reasonForReport,
      notificationToSupervisor,
      reasonForLateness,
    });
    
    handleCancel();
  };


  const handleCancel = () => {
    setReasonForReport('');
    setNotificationToSupervisor('');
    setReasonForLateness('');
  };

  return (
    <Box p={5} shadow='md' borderWidth='1px' borderRadius='md'>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="reason-for-report">
            <FormLabel>Select reason for report:</FormLabel>
            <Select 
              placeholder="Select reason"
              value={reasonForReport}
              onChange={(e) => setReasonForReport(e.target.value)}
            >
              <option value = "#1"> #1</option>
              <option value = "#2"> #2</option>
              <option value = "#3"> #3</option>
            </Select>
          </FormControl>

          <FormControl id="notification-to-supervisor">
            <FormLabel>Did the associate notify the supervisor reasonably in advance?</FormLabel>
            <Select 
              placeholder="Select reason"
              value={notificationToSupervisor}
              onChange={(e) => setNotificationToSupervisor(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </FormControl>

          <FormControl id="reason-for-lateness">
            <FormLabel>Why did the associate have a late arrival/early departure/no show?</FormLabel>
            <Textarea 
              placeholder="Enter answer"
              value={reasonForLateness}
              onChange={(e) => setReasonForLateness(e.target.value)}
            />
          </FormControl>

          <Box display="flex" justifyContent="space-between" w="full">
            <Button colorScheme="blue" onClick={handleCancel}>Cancel</Button>
            <Button colorScheme="blue" type="submit">Submit</Button>
          </Box>
        </VStack>
      </form>
    </Box>
  );
}

export default ReportModal;
