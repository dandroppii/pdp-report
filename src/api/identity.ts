import { ENDPOINT } from 'constance/endpoint';
import { Client } from 'libs/apis';
import fetcher from 'libs/fetcher';
import qs from 'query-string';
import { BaseResponse, LoginResponseData, PdpInformations, UserResponseData } from 'types/common';

class IdentityService extends Client {
  public login(params: { UserName: string; Password: string }) {
    return fetcher<BaseResponse<LoginResponseData>>(`${this.baseUrl}${ENDPOINT.LOGIN}`, {
      headers: this.headers,
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public getCurrentUser(id: string) {
    return fetcher<BaseResponse<PdpInformations>>(`${this.baseUrl}${ENDPOINT.GET_PROFILE(id)}`, {
      headers: this.privateHeaders,
    });
  }

  public getCurrentUserId() {
    return fetcher<BaseResponse<string>>(`${this.baseUrl}${ENDPOINT.GET_ID}`, {
      headers: this.privateHeaders,
    });
  }
}

const identityService = new IdentityService();

export { identityService };
