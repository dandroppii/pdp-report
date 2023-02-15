import { ENDPOINT } from 'constance/endpoint';
import { Client } from 'libs/apis';
import fetcher from 'libs/fetcher';
import qs from 'query-string';
import {
  BaseResponse,
  LoginResponseData,
  UserResponseData,

} from 'types/common';

class IdentityService extends Client {
  public login(params: { UserName: string; Password: string }) {
    return fetcher<BaseResponse<LoginResponseData>>(
      `${this.baseUrl}${ENDPOINT.LOGIN}`,
      {
        headers: this.headers,
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
  }

  public getCurrentUser() {
    return fetcher<BaseResponse<UserResponseData>>(
      `${this.baseUrl}${ENDPOINT.GET_PROFILE}`,
      {
        headers: this.privateHeaders,
      }
    );
  }
}

const identityService = new IdentityService();

export { identityService };
