/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AuthUserInfo {
  username?: string | null;
  isAdmin?: boolean;
  canPublish?: boolean;
}

export interface CheckWinnerResponseDto {
  isWinner?: boolean;
  /** @format double */
  prizeAmount?: number;
}

export interface CreateBoardDto {
  /** @format uuid */
  playerId?: string;
  /** @format uuid */
  gameId?: string;
  numbers?: number[] | null;
}

export interface CreateGameDto {
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string | null;
  winningSequence?: number[] | null;
}

export interface CreatePlayerDto {
  name?: string | null;
  /** @format double */
  balance?: number;
  isActive?: boolean;
  userId?: string | null;
}

export interface CreateTransactionDto {
  /** @format uuid */
  playerId?: string;
  /** @format double */
  amount?: number;
  mobilePayTransactionId?: string | null;
}

export interface GetBoardDto {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  playerId?: string;
  /** @format uuid */
  gameId?: string;
  numbers?: number[] | null;
}

export interface GetGameDto {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string | null;
  winningSequence?: number[] | null;
}

export interface GetPlayerDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
  /** @format double */
  balance?: number;
  isActive?: boolean;
  userId?: string | null;
}

export interface GetTransactionDto {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  playerId?: string;
  /** @format double */
  amount?: number;
  mobilePayTransactionId?: string | null;
}

export interface GetWinnerDto {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  gameId?: string;
  /** @format uuid */
  playerId?: string;
  /** @format double */
  prizeAmount?: number;
  playerName?: string | null;
  /** @format date-time */
  gameStartDate?: string;
}

export interface LoginRequest {
  email?: string | null;
  password?: string | null;
}

export interface LoginResponse {
  jwt?: string | null;
}

export interface RegisterRequest {
  email?: string | null;
  password?: string | null;
  name?: string | null;
}

export interface RegisterResponse {
  email?: string | null;
  name?: string | null;
}

export interface UpdateBoardDto {
  numbers?: number[] | null;
}

export interface UpdateGameDto {
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string | null;
  winningSequence?: number[] | null;
}

export interface UpdatePlayerDto {
  name?: string | null;
  /** @format double */
  balance?: number;
  isActive?: boolean;
}

export interface UpdateTransactionDto {
  /** @format double */
  amount?: number;
  mobilePayTransactionId?: string | null;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:5000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthLoginCreate
     * @request POST:/api/auth/login
     * @secure
     */
    authLoginCreate: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<LoginResponse, any>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthRegisterCreate
     * @request POST:/api/auth/register
     * @secure
     */
    authRegisterCreate: (data: RegisterRequest, params: RequestParams = {}) =>
      this.request<RegisterResponse, any>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthLogoutCreate
     * @request POST:/api/auth/logout
     * @secure
     */
    authLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthUserinfoList
     * @request GET:/api/auth/userinfo
     * @secure
     */
    authUserinfoList: (params: RequestParams = {}) =>
      this.request<AuthUserInfo, any>({
        path: `/api/auth/userinfo`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthConfirmList
     * @request GET:/api/auth/confirm
     * @secure
     */
    authConfirmList: (
      query?: {
        token?: string;
        email?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/auth/confirm`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardCreate
     * @request POST:/api/Board
     * @secure
     */
    boardCreate: (data: CreateBoardDto, params: RequestParams = {}) =>
      this.request<GetBoardDto, any>({
        path: `/api/Board`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardList
     * @request GET:/api/Board
     * @secure
     */
    boardList: (
      query?: {
        /**
         * @format int32
         * @default 10
         */
        limit?: number;
        /**
         * @format int32
         * @default 0
         */
        startAt?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetBoardDto[], any>({
        path: `/api/Board`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardUpdate
     * @request PUT:/api/Board/{id}
     * @secure
     */
    boardUpdate: (id: string, data: UpdateBoardDto, params: RequestParams = {}) =>
      this.request<GetBoardDto, any>({
        path: `/api/Board/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardDetail
     * @request GET:/api/Board/{id}
     * @secure
     */
    boardDetail: (id: string, params: RequestParams = {}) =>
      this.request<GetBoardDto, any>({
        path: `/api/Board/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardDelete
     * @request DELETE:/api/Board/{id}
     * @secure
     */
    boardDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Board/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameCreate
     * @request POST:/api/Game
     * @secure
     */
    gameCreate: (data: CreateGameDto, params: RequestParams = {}) =>
      this.request<GetGameDto, any>({
        path: `/api/Game`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameList
     * @request GET:/api/Game
     * @secure
     */
    gameList: (
      query?: {
        /**
         * @format int32
         * @default 10
         */
        limit?: number;
        /**
         * @format int32
         * @default 0
         */
        startAt?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetGameDto[], any>({
        path: `/api/Game`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameUpdate
     * @request PUT:/api/Game/{id}
     * @secure
     */
    gameUpdate: (id: string, data: UpdateGameDto, params: RequestParams = {}) =>
      this.request<GetGameDto, any>({
        path: `/api/Game/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameDetail
     * @request GET:/api/Game/{id}
     * @secure
     */
    gameDetail: (id: string, params: RequestParams = {}) =>
      this.request<GetGameDto, any>({
        path: `/api/Game/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameDelete
     * @request DELETE:/api/Game/{id}
     * @secure
     */
    gameDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Game/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameCheckWinnerCreate
     * @request POST:/api/Game/{gameId}/check-winner
     * @secure
     */
    gameCheckWinnerCreate: (gameId: string, data: string, params: RequestParams = {}) =>
      this.request<CheckWinnerResponseDto, any>({
        path: `/api/Game/${gameId}/check-winner`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Player
     * @name PlayerCreate
     * @request POST:/api/Player
     * @secure
     */
    playerCreate: (data: CreatePlayerDto, params: RequestParams = {}) =>
      this.request<GetPlayerDto, any>({
        path: `/api/Player`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Player
     * @name PlayerList
     * @request GET:/api/Player
     * @secure
     */
    playerList: (
      query?: {
        /**
         * @format int32
         * @default 10
         */
        limit?: number;
        /**
         * @format int32
         * @default 0
         */
        startAt?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetPlayerDto[], any>({
        path: `/api/Player`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Player
     * @name PlayerUpdate
     * @request PUT:/api/Player/{id}
     * @secure
     */
    playerUpdate: (id: string, data: UpdatePlayerDto, params: RequestParams = {}) =>
      this.request<GetPlayerDto, any>({
        path: `/api/Player/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Player
     * @name PlayerDetail
     * @request GET:/api/Player/{id}
     * @secure
     */
    playerDetail: (id: string, params: RequestParams = {}) =>
      this.request<GetPlayerDto, any>({
        path: `/api/Player/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Player
     * @name PlayerDelete
     * @request DELETE:/api/Player/{id}
     * @secure
     */
    playerDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Player/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionCreate
     * @request POST:/api/Transaction
     * @secure
     */
    transactionCreate: (data: CreateTransactionDto, params: RequestParams = {}) =>
      this.request<GetTransactionDto, any>({
        path: `/api/Transaction`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionList
     * @request GET:/api/Transaction
     * @secure
     */
    transactionList: (
      query?: {
        /**
         * @format int32
         * @default 10
         */
        limit?: number;
        /**
         * @format int32
         * @default 0
         */
        startAt?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetTransactionDto[], any>({
        path: `/api/Transaction`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionUpdate
     * @request PUT:/api/Transaction/{id}
     * @secure
     */
    transactionUpdate: (id: string, data: UpdateTransactionDto, params: RequestParams = {}) =>
      this.request<GetTransactionDto, any>({
        path: `/api/Transaction/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionDetail
     * @request GET:/api/Transaction/{id}
     * @secure
     */
    transactionDetail: (id: string, params: RequestParams = {}) =>
      this.request<GetTransactionDto, any>({
        path: `/api/Transaction/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionDelete
     * @request DELETE:/api/Transaction/{id}
     * @secure
     */
    transactionDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Transaction/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Winner
     * @name WinnerGameDetail
     * @request GET:/api/Winner/game/{gameId}
     * @secure
     */
    winnerGameDetail: (gameId: string, params: RequestParams = {}) =>
      this.request<GetWinnerDto[], any>({
        path: `/api/Winner/game/${gameId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Winner
     * @name WinnerGameCheckCreate
     * @request POST:/api/Winner/game/{gameId}/check
     * @secure
     */
    winnerGameCheckCreate: (gameId: string, params: RequestParams = {}) =>
      this.request<GetWinnerDto, any>({
        path: `/api/Winner/game/${gameId}/check`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Winner
     * @name WinnerGameCheckDetail
     * @request GET:/api/Winner/game/{gameId}/check
     * @secure
     */
    winnerGameCheckDetail: (gameId: string, params: RequestParams = {}) =>
      this.request<GetWinnerDto, any>({
        path: `/api/Winner/game/${gameId}/check`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Winner
     * @name WinnerCreate
     * @request POST:/api/Winner/{winnerId}
     * @secure
     */
    winnerCreate: (winnerId: string, params: RequestParams = {}) =>
      this.request<GetWinnerDto, any>({
        path: `/api/Winner/${winnerId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Winner
     * @name WinnerDetail
     * @request GET:/api/Winner/{winnerId}
     * @secure
     */
    winnerDetail: (winnerId: string, params: RequestParams = {}) =>
      this.request<GetWinnerDto, any>({
        path: `/api/Winner/${winnerId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
