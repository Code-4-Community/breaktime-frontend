![](https://static.wixstatic.com/media/1193ef_371853f9145b445fb883f16ed7741b60~mv2.jpg/v1/crop/x_0,y_2,w_1842,h_332/fill/w_466,h_84,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Breaktime%20Logo%20Comfortaa-2.jpg)

# Breaktime Frontend 

This repo contains the frontend code for Project Breaktime, an application attempting to create a time tracking dashboard. 

## Installation 

To setup this project ensure that you currently have react installed. 

[Install React](https://legacy.reactjs.org/docs/getting-started.html)

Once installed, all that is needed to install all required dependencies is the following line: 
```
npm install
```
You should now be ready to start running things! 

*Note*: If you are missing a file in `src/aws-exports.tsx` reach out to the tech-lead for this file, or copy `aws-exports.js` into this name. 


## Running the Project

To run the frontend several steps are required: 

1. 
    Run the following command: ```npm start``` After this you should see a browser open to `localhost:3000`. 

2.  
    Start the backend - for instructions see [breaktime-backend](https://github.com/Code-4-Community/breaktime-backend) under the c4c repo. Once this is running you should be able to start interacting with the website. 

3. 
    From step 1 you should be greeted with a log-in window asking you to sign in with a user name and password. These can either be provided by asking anyone on the breaktime team, or by navigating to the Cognito pool for breaktime and creating this yourself: *Ask a developer on project breaktime for instructions on this*

Once logged in, you should be ready to go and interact with the website. 


## Code Overview 

The frontend is using a typescript / react and currently utilizes AWS Amplify for handling authentication. 

### Reading Material 

* [Introduction to AWS Amplify](https://docs.amplify.aws/)
* [Introduction to React](https://react.dev/learn)


### Codebase Design

Important directories and files are described below. While not all files are described, these provide a general overview of the structure. 
```

breaktime-frontend/
├─ public/ - Static assets that should exist on the frontend 
├─ src/ - Directory housing almost all code 
│  ├─ components/ - React Component Modules 
│  |  ├─ Auth/ - Authenticated API interface and components 
|  |  |  ├─ apiClient.tsx - The central interface making authenticated calls to the backend. 
│  |  ├─ HomePage/ - Components for the landing & home page 
│  |  ├─ NavBar/ - Components for the navigation bar 
│  |  ├─ SignOut/ - Components for the signout page 
│  |  ├─ TimeCardPage/ - Components for the timesheet page 
|  |  |  ├─ CellTypes/ - Contains all types of cells rendered on the timesheet 
│  ├─ schemas/ - Typescript schemas for complex data types 
│  ├─ aws-exports.js - AWS configuration file for Cognito 
│  ├─ constants.tsx - Frontend global constants file 
│  ├─ index.css - styling for root of the project 
│  ├─ index.tsx - root JS file 
├─ .gitignore - files ignored by git 
├─ package.json - react project configuration files 
├─ README.md
```

