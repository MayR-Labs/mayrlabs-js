export interface ExportInfo {
  name: string;
  type: string;
  file: string;
  line: number;
  filePath: string;
  isUsed: boolean;
  category: "exported";
}

export interface NonExportedInfo {
  name: string;
  type: string;
  file: string;
  line: number;
  filePath: string;
  isUsed: boolean;
  category: "non-exported";
}

export interface ReportData {
  totalExports: number;
  unusedExports: ExportInfo[];
  totalNonExported: number;
  unusedNonExported: NonExportedInfo[];
}
