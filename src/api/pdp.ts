import { ENDPOINT } from 'constance/endpoint';
import { Client } from 'libs/apis';
import fetcher from 'libs/fetcher';
import qs from 'query-string';
import {
  BaseResponse,
  ListPdp,
  LoginResponseData,
  PdpReport,
  TrafficItem,
  UserResponseData,
} from 'types/common';

class PdpService extends Client {
  public getPdpReport(params: {
    fromDate: string;
    toDate: string;
    type: 'PDP' | 'PRODUCT';
    supplierId?: string;
  }) {
    return fetcher<BaseResponse<PdpReport>>(
      `${process.env.BASE_URL}${ENDPOINT.GET_SUMMARY}?${qs.stringify({
        ...params,
        sortField: 'visitTime',
      })}`,
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
    size?: number;
    supplierId?: string;
  }) {
    return fetcher<BaseResponse<TrafficItem[]>>(
      `${process.env.BASE_URL}${ENDPOINT.GET_TRAFFICS}?${qs.stringify({
        ...params,
        sortField: 'visitTime',
        size: params.size || 20,
      })}`,
      {
        headers: this.privateHeaders,
      }
    );
  }

  public getListPdp() {
    return fetcher<BaseResponse<ListPdp[]>>(
      `${process.env.BASE_URL}${ENDPOINT.GET_LIST_PDP}?size=999`,
      {
        headers: this.privateHeaders,
      }
    );
  }
}

const pdpService = new PdpService();

export { pdpService };
