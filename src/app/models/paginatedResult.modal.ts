export interface PaginatedResult<T> {
    data: T[];
    totalRecords: number;
    limit: number;
    startingRow: number;
}