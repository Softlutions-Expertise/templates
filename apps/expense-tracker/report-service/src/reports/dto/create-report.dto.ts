export interface CreateReportDto {
  type: string;
  userId: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}
