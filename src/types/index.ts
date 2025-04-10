export interface UrlResult {
  url: string;
  selected: boolean;
}

export interface ProcessedResult {
  url: string;
  status: number;
  data: any;
  html?: string | undefined;
}
