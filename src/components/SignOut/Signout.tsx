
import React from 'react';
import ApiClient from '../Auth/apiClient';
import { Heading } from '@chakra-ui/react';

export default function HomePage() {
  ApiClient.signout()
  return (
    <Heading>
      Logged out
    </Heading>
  );
}
