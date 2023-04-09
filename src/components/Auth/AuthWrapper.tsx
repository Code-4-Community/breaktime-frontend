import { Authenticator} from '@aws-amplify/ui-react';
import React from 'react';
 


export default function AuthedApp(props) {
    return (
        <Authenticator hideSignUp={true}>
            {props.page} 
        </Authenticator> 
    )
}