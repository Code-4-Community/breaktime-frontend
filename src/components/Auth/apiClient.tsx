import { Auth } from 'aws-amplify';
import axios, { AxiosInstance } from 'axios';
import {TimeSheetSchema} from '../../schemas/TimesheetSchema'
import {UserSchema} from '../../schemas/UserSchema'


const defaultBaseUrl = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:3000';
// Required to use nock with axios (note: do not use nock, just use jest to mock the apiClient)
axios.defaults.adapter = require('axios/lib/adapters/http');



interface ApiClientOptions {
  /**
   * Skips Cognito authentication.
   */
  skipAuth?: boolean;
}
export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = defaultBaseUrl, options: ApiClientOptions = {}) {
    this.axiosInstance = axios.create({
      baseURL,
    });
    if (!options.skipAuth) {
      this.axiosInstance.interceptors.request.use(async (config) => {
        try { 
          const modifiedConfig = config;
          const session = await Auth.currentSession();
          const jwt = session.getAccessToken().getJwtToken();
          if (modifiedConfig.headers !== undefined) {
            modifiedConfig.headers.Authorization = `Bearer ${jwt}`;
          } 
          return modifiedConfig;
        } catch (error) {
          console.log("Frontend Auth has a problem", error); 
          return config;
        }
      });
    }
  }
  public async signout() {
    try {
      await Auth.signOut(); 
    } catch (error) {
      console.log("Could not sign out: ", error); 
    }
  }

  private async get(path: string, params: any): Promise<unknown> {
    return this.axiosInstance.get(path, params).then((response) => response.data);
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance.post(path, body).then((response) => response.data);
  }

  private async patch(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance.patch(path, body).then((response) => response.data);
  }

  // TODO: setup endpoint for associate/supervisor/admin so it returns a list of timesheets for given uuid
  public async getUserTimesheets(UUID: string): Promise<TimeSheetSchema[]> {
    return this.get('auth/timesheet', {params: {"uuid": UUID}}) as Promise<TimeSheetSchema[]>; 
  }

  public async updateUserTimesheet(updatedEntry): Promise<Boolean> {
    //TODO - Format json? 
    return this.post('/auth/timesheet', {timesheet:updatedEntry}) as Promise<Boolean>; 
  }

  // TODO: setup endpoint for getting user information
  // all roles -> return UserSchema for the current user that is logged in
  public async getUser(): Promise<any> {
    return {  UserID: "77566d69-3b61-452a-afe8-73dcda96f876", 
              FirstName: "john",
              LastName: "doe",
              Type: "Associate",
              Picture: "https://www.google.com/koala.png",
              Company: "Example Company 401" 
          };
  }

  //TODO: hook up to backend, izzys pr has it just not merged yet
  public async getAllUsers(): Promise<any[]> {
    return [{  UserID: "77566d69-3b61-452a-afe8-73dcda96f876", 
              FirstName: "joe",
              LastName: "jane",
              Type: "Associate",
              Picture: "https://www.google.com/panda.png",
              Company: "Example Company 401" 
          },
          {  UserID: "88996d69-3b61-452a-afe8-73dcda96f899", 
          FirstName: "john",
          LastName: "doe",
          Type: "Associate",
          Picture: "https://www.google.com/panda.png",
          Company: "Example Company 402" 
      }];
  }

 
}
 
export default new ApiClient(); 