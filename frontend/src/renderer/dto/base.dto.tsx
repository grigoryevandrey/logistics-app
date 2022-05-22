export class HealthResponse {
  public readonly status: 'UP';
}

export class PaginatedBaseResponse {
  public readonly count: number;
  public readonly offset: number;
  public readonly totalRows: number;
}
