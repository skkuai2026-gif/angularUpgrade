import { SearchResult } from 'src/app/models/common/search-result';
import { MoreOption } from './common/more-option';
export class SearchResponseIO {
  data: {
    searchResultData: any[];
    searchResultInfo: any[];
    searchCriteriaData: any[];
    searchCriteriaInfo: any[];
  };

  lookups: any[];
  searchResult: SearchResult; // Custom created search result.
  moreOptionList: MoreOption[]; // more options for the current search.
}
