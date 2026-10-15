import { Component, EventEmitter, Inject, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { MoreOption } from 'src/app/models/common/more-option';
import { PageHeader } from 'src/app/models/common/page-header';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../services/base.service';
import { HeaderService } from '../services/header.service';
import { SettingService } from '../services/setting.service';
import { SearchResultRow } from 'src/app/models/common/search-result';
@Component({
  selector: 'sym-base-step-form',
  template: ` <p>base-step form works!</p> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export abstract class BaseSearchComponent<S extends BaseService> extends BaseComponent<S> implements OnInit {
  public breadCrumbList: BreadCrumb[];
  public moreOptionList: any[];
  public addLink: any;
  public additionalOptionList: MoreOption[];

  /**
   * This is triggered to emit the selected option
   */
  @Output() selectedOptionChanged = new EventEmitter<any>();

  constructor(@Inject('service') public service: S, public router: Router, public headerService?: HeaderService) {
    super(service);
  }
  ngOnInit() {
    this.breadCrumbList = [];
    this.moreOptionList = [];
    this.breadCrumbList = this.getBreadCrumbList();
    this.moreOptionList = this.getMoreOptionList();
    this.additionalOptionList = this.getAdditionalOptionList();
    if (this.headerService != undefined) this.headerService.pageHeader = this.getPageHeader();
  }

  //Adding default empty implementation

  /**
   * This will get option list for search list if any e.g: 'Edit' , 'Delete' etc..
   * @returns JSON Object of optionList for search-view
   */
  protected getMoreOptionList(): any {
    return [];
  }

  /**
   * This will get the bread-crum to be displayed in search-view e.g 'home / Search'
   * @returns JSON Object of BreadCrumb for search-view
   */
  protected getBreadCrumbList(): BreadCrumb[] {
    return [];
  }

  /**
   * This will get the headers if any to be displayed in search-view e.g: title: 'search Quotation'
   * @returns JSON Object of PageHeader for search-view
   */
  protected getPageHeader(): PageHeader {
    return;
  }

  /**
   * This will get additional Option list for search-view e.g: 'Compare'
   * @returns JSON Object of MoreOption for search-view
   */
  protected getAdditionalOptionList(): MoreOption[] {
    return [];
  }

  /**
   * This is invoked when there is optionList emitted from search-component and call its respective method
   * based on button_id from the param.
   * @param buttonClicked is option clicked by the user, which have button id, link, reference id, ref number
   */
  public onMoreOptionClicked(buttonClicked: { button_id: any; link: any; ref_id: any; refNum: string }): void {
    //check if  Edit/Copy/Delete button is clicked accordingly write logic
    this.callCustomOnClick(buttonClicked);
    // console.log(functionName);
  }

  /**
   * his is invoked when there is additionalOptionList emitted from search-component and call its
   * respective method based on button_id from the param.
   * @param buttonClicked is option clicked by the user, which have MoreOption JSON Object.
   */
  public onAdditionalOptionClicked(buttonClicked: MoreOption) {
    //check if  Edit/Copy/Delete button is clicked accordingly write logic
    this.callCustomOnClick(buttonClicked);
    // console.log(functionName);
  }

  private callCustomOnClick(buttonClicked) {
    let functionName: string;
    functionName = buttonClicked.button_id + '_click';
    if (typeof this[functionName] === 'function') {
      eval('this.' + functionName + '(buttonClicked)');
    }
  }

  //add here
  /**
   * This refresh the page with-out reloading the page
   */
  reloadCurrentRoute(): void {
    this.service.reloadCurrentRoute();
  }

  /**
   * This is invoked when there is optionList emitted from search-component and call its respective
   * @param selectedOption expects the JSON Object which is selected in search component
   */
  public onSelectedOptionClick(selectedOption): void {
    this.selectedOptionChanged.emit(selectedOption);
  }

  /**
   *  This returns the metadata value from the given row
   * @param searchRecord contains row value of selected row. e.g: ["HOON00003396", "", "" , ""]
   * @param metadataCd expects a string value of metadata code. e.g: 'SearchProspectDO.quoteStatusLookupCd'
   * @returns the value from row based on the given metadata code e.g: 'ACCEPTED'
   */
  protected getRecordValue(searchRecord: SearchResultRow, metadataCd: string): any {
    let recordValue: any;
    for (let i = 0; i < this.service.searchResponseIO.searchResult.fields.length; i++) {
      if (this.service.searchResponseIO.searchResult.fields[i].metadata == metadataCd) {
        recordValue = this.service.getCodeFromLookupDesc(
          this.service.searchResponseIO.searchResult.fields[i].LOOKUPCD,
          searchRecord.row[this.service.searchResponseIO.searchResult.fields[i].position - 1],
          this.service.searchResponseIO.lookups
        );
        break;
      }
    }
    return recordValue;
  }

  /**
   * This removes the more option object based on id.
   * @param optionIDToDel expects the id of option item to delete. eg: ['Delete', 'Download']
   * @returns new option list without the mentioned ID.
   */
  protected getMoreOptions(optionIDToDel: string[]): MoreOption[] {
    let options = [];
    for (let j = 0; j < this.service.searchResponseIO.moreOptionList.length; j++) {
      options.push(this.service.searchResponseIO.moreOptionList[j]);
    }
    for (let i = 0; i < optionIDToDel.length; i++) {
      options.filter((opt, j) => {
        if (opt['id'] === optionIDToDel[i]) {
          options.splice(j, 1);
        }
      });
    }
    // console.log(options);
    return options;
  }
}
