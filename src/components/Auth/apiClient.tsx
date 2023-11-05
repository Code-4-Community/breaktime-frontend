import { Auth } from "aws-amplify";
import axios, { AxiosInstance } from "axios";
import { TimeSheetSchema } from "../../schemas/TimesheetSchema";
import { UserSchema } from "../../schemas/UserSchema";
import { ReportOptions } from "../TimeCardPage/types";

const defaultBaseUrl =
  process.env.REACT_APP_API_BASE_URL ?? "http://localhost:3000";
// Required to use nock with axios (note: do not use nock, just use jest to mock the apiClient)
axios.defaults.adapter = require("axios/lib/adapters/http");

interface ApiClientOptions {
  /**
   * Skips Cognito authentication.
   */
  skipAuth?: boolean;
}
export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(
    baseURL: string = defaultBaseUrl,
    options: ApiClientOptions = {}
  ) {
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

  private async get(path: string): Promise<unknown> {
    return this.axiosInstance.get(path).then((response) => response.data);
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance
      .post(path, body)
      .then((response) => response.data);
  }

  private async patch(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance
      .patch(path, body)
      .then((response) => response.data);
  }

  public async updateTimesheet(req): Promise<unknown> {
    return this.axiosInstance.post('/auth/timesheet', req)
  }

  // TODO: setup endpoint for associate/supervisor/admin so it returns a list of timesheets for given uuid
  public async getUserTimesheets(UUID: string): Promise<TimeSheetSchema[]> {
    return this.get("auth/timesheet") as Promise<TimeSheetSchema[]>;
  }

  public async updateUserTimesheet(updatedEntry): Promise<Boolean> {
    //TODO - Format json?
    return this.post("/auth/timesheet", {
      timesheet: updatedEntry,
    }) as Promise<Boolean>;
  }

  public async getPasswordTest(): Promise<string> {
    return this.get("/auth/timesheet") as Promise<string>;
  }

  // TODO: setup endpoint for getting user information
  // all roles -> return UserSchema for the current user that is logged in
  public async getUser(): Promise<UserSchema> {
    return {
      UserID: "abc",
      FirstName: "john",
      LastName: "doe",
      Type: "Supervisor",
      Picture: "https://www.google.com/koala.png",
    };
  }

  //TODO: hook up to backend, izzys pr has it just not merged yet
  public async getAllUsers(): Promise<UserSchema[]> {
    return [
      {
        UserID: "bcd",
        FirstName: "joe",
        LastName: "jane",
        Type: "Associate",
        Picture: "https://www.google.com/panda.png",
      },
    ];
  }

  //TODO: hook up to backend
  public async saveComment(comment: string, timesheetID: number): Promise<Boolean> {
    return true;
  }

  //TODO: hook up to backend
  public async saveReport(report: ReportOptions, timesheetID: number): Promise<Boolean> {
    return false;
  }

}
export default new ApiClient();
