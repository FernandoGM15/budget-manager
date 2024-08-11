import type { FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";
import type {
  ApiPagination,
  ApiResponse,
  QueryParams,
} from "../interfaces/api.interfaces";

interface PaginationProps<T extends ObjectLiteral, RequestQuery> {
  repository: Repository<T>;
  path: string;
  query: RequestQuery;
}

type QueryWithoutPagination = FindOptionsWhere<
  Omit<Partial<QueryParams>, "limit" | "offset">
>;

export default class Pagination<
  T extends ObjectLiteral,
  Q extends QueryParams,
> {
  private limit = 20;
  private offset = 0;
  private repository: Repository<T>;
  private path: string;
  private query: QueryWithoutPagination;

  constructor({ repository, path, query }: PaginationProps<T, Partial<Q>>) {
    const { limit = 20, offset = 0, ...rest } = query || {};
    console.log(rest);

    this.limit = limit;
    this.offset = offset;
    this.repository = repository;
    this.path = path;
    this.query = <QueryWithoutPagination>rest;
  }

  private createLinks = (total: number): ApiPagination => {
    const API_URL = process.env.API_URL || "http://localhost:3000";
    const nextOffset =
      +this.offset + +this.limit < total
        ? `${API_URL}/${this.path}?limit=${this.limit}&offset=${+this.offset + +this.limit}`
        : null;
    const prevOffset =
      this.offset - this.limit >= 0
        ? `${API_URL}/${this.path}?limit=${this.limit}&offset=${this.offset - this.limit}`
        : null;
    const lastOffset = total - 1 - ((total - 1) % this.limit);
    return {
      _next: nextOffset,
      _prev: prevOffset,
      _first: `${API_URL}/${this.path}?limit=${this.limit}&offset=0`,
      _last: `${API_URL}/${this.path}?limit=${this.limit}&offset=${lastOffset}`,
    };
  };

  public getPaginated = async (): Promise<ApiResponse<T>> => {
    try {
      const queryParams = this.query;
      console.log(queryParams);

      const [data, total] = await this.repository.findAndCount({
        skip: this.offset,
        take: this.limit,
        where: queryParams,
      });

      return {
        data: data,
        _links: this.createLinks(total),
        total,
      };
    } catch (error) {
      throw new Error(<string>error);
    }
  };
}
