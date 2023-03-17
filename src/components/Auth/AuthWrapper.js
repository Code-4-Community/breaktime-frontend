import { Authenticator} from '@aws-amplify/ui-react';



export default function AuthedApp(props) {
    return (
        <Authenticator hideSignUp={true}>
            {props.page} 
        </Authenticator>
    )
}