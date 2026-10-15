import { SearchResultField } from './search-result-field';
export class SearchResult {
  fields: SearchResultField[];
  values: any[];
}

export class SearchResultRow {
  row: any[];
  moreOptionList: any[];
}
