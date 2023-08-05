import React, { useEffect, useState } from 'react';
import { RowSchema } from '../../../schemas/RowSchema';
import { Box } from '@chakra-ui/react';


interface DurationProps {
  row: RowSchema;
  userType: string; // Associate, Supervisor, or Admin
}

/**
 * Calculation component that shows the length of time for the given start and end times of the shift
 */
export function Duration(props: DurationProps) {
  const row = props.row;
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (row[props.userType] !== undefined && row[props.userType].Start !== undefined && row[props.userType].End !== undefined) {
      setDuration(String(((row[props.userType].End - row[props.userType].Start) / 60).toFixed(2)));
    }
  }, [row[props.userType]?.Start, row[props.userType]?.End])
  return <Box>{duration}</Box>
}
