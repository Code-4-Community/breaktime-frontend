import { Auth } from 'aws-amplify';
import axios, { AxiosInstance } from 'axios';

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
    console.log("Preparing auth"); 
    if (!options.skipAuth) {
      console.log("Adding interceptors"); 
      this.axiosInstance.interceptors.request.use(async (config) => {
        try {
          const modifiedConfig = config;
          const session = await Auth.currentSession();
          const jwt = session.getAccessToken().getJwtToken();
          console.log(session);
          console.log(jwt); 
          if (modifiedConfig.headers !== undefined) {
            modifiedConfig.headers.Authorization = `Bearer ${jwt}`;
          } 
          return modifiedConfig;
        } catch (error) {
          console.log("Thing broken :("); 
          console.log(error); 
          return config;
        }
      });
    }
  }

  private async get(path: string): Promise<unknown> {
    return this.axiosInstance.get(path).then((response) => response.data);
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance.post(path, body).then((response) => response.data);
  }

  private async patch(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance.patch(path, body).then((response) => response.data);
  }

  public async getPasswordTest(): Promise<string> {
    return this.get('/auth/me') as Promise<string>;
  }
}
 
export default new ApiClient(); 
 