import { ENDPOINT } from 'constance/endpoint';
import { Client } from 'libs/apis';
import fetcher from 'libs/fetcher';
import qs from 'query-string';
import { BaseResponse, LoginResponseData, PdpInformations, UserResponseData } from 'types/common';

class IdentityService extends Client {
  public login(params: { UserName: string; Password: string }) {
    return fetcher<BaseResponse<LoginResponseData>>(`${process.env.BASE_URL}${ENDPOINT.LOGIN}`, {
      headers: this.headers,
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public getCurrentUser(id: string) {
    return fetcher<BaseResponse<PdpInformations>>(`${process.env.BASE_URL}${ENDPOINT.GET_PROFILE(id)}`, {
      headers: this.privateHeaders,
    });
  }

  public getCurrentUserId() {
    return fetcher<BaseResponse<string>>(`${process.env.BASE_URL}${ENDPOINT.GET_ID}`, {
      headers: this.privateHeaders,
    });
  }
}

const identityService = new IdentityService();

export { identityService };
