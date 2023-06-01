import { ENDPOINT } from 'constance/endpoint';
import { Client } from 'libs/apis';
import fetcher from 'libs/fetcher';
import qs from 'query-string';
import {
  BaseResponse,
  ListPdp,
  ListPdpResponse,
  LoginResponseData,
  PdpReport,
  ProductTrafficItemSummary,
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

  public getProductTrafficsSummary(params: {
    fromDate: string;
    toDate: string;
    supplierId?: string;
  }) {
    return fetcher<BaseResponse<ProductTrafficItemSummary[]>>(
      `${process.env.BASE_URL}${ENDPOINT.GET_TRAFFICS_SUMMARY}?${qs.stringify({
        ...params,
        sortField: 'visitTime',
        type: 'PRODUCT',
        size: 999,
      })}`,
      {
        headers: this.privateHeaders,
      }
    );
  }

  public getListPdp() {
    return fetcher<BaseResponse<ListPdpResponse[]>>(
      `${process.env.BASE_URL}${ENDPOINT.GET_LIST_PDP}?size=999`,
      {
        headers: this.privateHeaders,
      }
    );
  }

  public getListPdpNotYetCreateAccount(payload: string[]) {
    return fetcher<BaseResponse<ListPdpResponse[]>>(
      `${process.env.BASE_URL}${ENDPOINT.GET_LIST_PDP_NOT_YET_CREATE_ACCOUNT}`,
      {
        headers: this.privateHeaders,
        method: 'POST',
        body: JSON.stringify({
          notInListIds: payload,
          status: 1,
          PageNumber: 0,
          PageSize: 999,
        }),
      }
    );
  }

  public createAccount(payload: { userName: string; fullName: string; password: string }) {
    return fetcher<BaseResponse<boolean>>(`${process.env.BASE_URL}${ENDPOINT.CREATE_ACCOUNT}`, {
      headers: this.privateHeaders,
      method: 'POST',
      body: JSON.stringify({
        role: 'Supplier',
        fullName: payload.fullName,
        ...payload,
      }),
    });
  }

  public mapAccountWithPdp(payload: { userName: string; supplierId: string }) {
    return fetcher<BaseResponse<boolean>>(
      `${process.env.BASE_URL}${ENDPOINT.MAP_ACCOUNT_WITH_PDP}`,
      {
        headers: this.privateHeaders,
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  public changePdpStatus(payload: { id: string; status: number }) {
    return fetcher<BaseResponse<ListPdpResponse[]>>(
      `${process.env.BASE_URL}${ENDPOINT.CHANGE_PDP_STATUS}`,
      {
        headers: this.privateHeaders,
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
  }

  public changePdpPassword(payload: { id: string; userName: string; password: string }) {
    return fetcher<BaseResponse<any>>(
      `${process.env.BASE_URL}${ENDPOINT.CHANGE_PASSWORD(payload.id)}`,
      {
        headers: this.privateHeaders,
        method: 'PUT',
        body: JSON.stringify({
          userName: payload.userName,
          password: payload.password,
        }),
      }
    );
  }
}

const pdpService = new PdpService();

export { pdpService };
