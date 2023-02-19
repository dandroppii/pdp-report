import { ENDPOINT } from 'constance/endpoint';
import { Client } from 'libs/apis';
import fetcher from 'libs/fetcher';
import qs from 'query-string';
import {
  BaseResponse,
  LoginResponseData,
  PdpReport,
  TrafficItem,
  UserResponseData,
} from 'types/common';

class PdpService extends Client {
  public getPdpReport(params: { fromDate: string; toDate: string; type: 'PDP' | 'PRODUCT' }) {
    return fetcher<BaseResponse<PdpReport>>(
      `${this.baseUrl}${ENDPOINT.GET_SUMMARY}?${qs.stringify(params)}`,
      {
        headers: this.privateHeaders,
      }
    );
  }

  public getPdpTraffics(params: {
    fromDate: string;
    toDate: string;
    type: 'PDP' | 'PRODUCT';
    page: number;
  }) {
    return fetcher<BaseResponse<TrafficItem[]>>(
      `${this.baseUrl}${ENDPOINT.GET_TRAFFICS}?${qs.stringify(params)}`,
      {
        headers: this.privateHeaders,
      }
    );
  }
}

const pdpService = new PdpService();

export { pdpService };
