import { Property } from "./Property";

export interface PaginationResult {
  total: number; // Total number of items
  page: number; // Current page number
  page_size: number; // Number of items per page
  properties: Property[]; // Array of items for the current page
}