import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BusinessCommonService } from 'src/app/business-common/service/business-common.service';
import { SearchResult } from 'src/app/models/common/search-result';
import { SearchResultField } from 'src/app/models/common/search-result-field';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { OfflineService } from 'src/app/offline/offline.service';
import { QuotationService } from 'src/app/quotation/services/quotation.service';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'sym-agent-notification-search',
  templateUrl: './agent-notification-search.component.html',
  styleUrls: ['./agent-notification-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AgentNotificationSearchComponent extends BaseSearchComponent<BaseService> implements OnInit {
  isAdvanceSearchDisplayed: boolean;
  isAdvanceSearchRequired: boolean;
  public searchList: SearchResult;
  isAdvanceSearchVisibile: boolean;
  showSearchComponent = true;
  searchName = 'PushNotification2';
  dtTrigger: Subject<any> = new Subject<any>();
  @Output() searchFieldCreated = new EventEmitter<SearchResultField>();
  @Input() firstName: any;
  @Input() lastName: any;
  @Input() searchResultColumnDisplayList: string[];
  @Input() searchText: string;
  dtElement: DataTableDirective;
  public submitField: any;
  constructor(
    baseService: BaseService,
    public settingService: SettingService,
    public businessCommonService: BusinessCommonService,
    public headerService: HeaderService,
    public router: Router
  ) {
    super(baseService, router, headerService);
  }
  ngOnInit() {}

  /**
   * @ignore
   * this refresh the searchResponse displaye in UI
   */
  private refreshSearchList(searchList: any) {
    let list = JSON.parse(JSON.stringify(searchList));
    this.service.searchResponseIO = new SearchResponseIO();
    this.service.searchResponseIO = list;
    this.setSearchList();
    this.rerender_datatable();

    console.log('Get search list successful.');
  }
  rerender_datatable() {
    // setTimeout(() => {
    if (this.dtElement != undefined && this.dtElement.dtInstance != undefined)
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    // }, 15);
  }
  onRefreshClick() {
    this.showSearchComponent = false;
    this.searchName = '';
    setTimeout(() => {
      this.showSearchComponent = true;
      this.searchName = 'PushNotification2';
    }, 0);

    if (this.settingService.getApplicationMode() === 'online') {
      this.service.getSearchList('PushNotification2', true).subscribe(
        (searchList) => {
          console.log('line no 87');
          setTimeout(() => {
            this.refreshSearchList(searchList);
          }, 5);
        },
        (error) => {
          console.log('Get search list failed.');
          console.log('Error:', error);
        }
      );
    } else {
      if (this.settingService.getApplicationMode() === 'offline') {
        let respData;
        this.service.getSearchListRereshOffline().subscribe((searchListOffline) => {
          respData = JSON.parse(JSON.stringify(searchListOffline));
          if (respData.success == true) {
            this.service.getSearchList('searchListOffline', true).subscribe(
              (searchList) => {
                setTimeout(() => {
                  this.refreshSearchList(searchList);
                }, 5);
              },
              (error) => {
                console.log('Get search list failed.');
                console.log('Error:', error);
              }
            );
          }
        });
      }
    }
  }
  public setSearchList() {
    this.searchList = new SearchResult();
    this.searchList.fields = [];
    if (this.service.searchResponseIO.data == undefined) return;
    Object.keys(this.service.searchResponseIO.data.searchResultInfo).forEach((property) => {
      let field = new SearchResultField();
      field.guid = parseInt(property);
      field.isRecordId = this.service.searchResponseIO.data.searchResultInfo[field.guid].isRecordId;
      field.link = this.service.searchResponseIO.data.searchResultInfo[field.guid].link;
      field.name = this.service.searchResponseIO.data.searchResultInfo[field.guid].header;
      field.position = this.service.searchResponseIO.data.searchResultInfo[field.guid].position;
      field.submitId = this.service.searchResponseIO.data.searchResultInfo[field.guid].submitId;
      field.INPUTTYPECD = this.service.searchResponseIO.data.searchResultInfo[field.guid].INPUTTYPECD;
      field.LOOKUPCD = this.service.searchResponseIO.data.searchResultInfo[field.guid].LOOKUPCD;
      field.WIDTH = this.service.searchResponseIO.data.searchResultInfo[field.guid].WIDTH;
      field.metadata = this.service.searchResponseIO.data.searchResultInfo[field.guid].metadata;
      field.linkViewTypeCd = this.service.searchResponseIO.data.searchResultInfo[field.guid].linkViewTypeCd;
      field.LABELKEY = this.service.searchResponseIO.data.searchResultInfo[field.guid].LABELKEY;
      field.colName = this.service.searchResponseIO.data.searchResultInfo[field.guid].colName;

      let code: string = field.metadata;
      if (code != undefined) {
        field.attributeCd =
          code != undefined || code != '' ? 'search_' + code.substring(code.indexOf('.') + 1, code.length) : '';
      }
      // field.VISIBILITY = this.searchResponseIO.data.searchResultInfo[
      //     field.guid
      // ].VISIBILITY;
      if (field.INPUTTYPECD == 'FCOMBO' || field.INPUTTYPECD == 'LOOKUPTEXT' || field.INPUTTYPECD == 'COMBO') {
        let options = [];
        this.service.searchResponseIO.lookups[field.LOOKUPCD].filter((option) => {
          options.push({
            value: option.cd,
            label: option.desc,
          });
        });
        field.foptions = [];
        field.foptions = options;
      }
      if (field.foptions && field.foptions != undefined && field.foptions != null) {
        field.foptions.filter((option) => {
          if (option.value == this.service.searchResponseIO.data.searchCriteriaData[field.metadata]) {
            field.fValue = option;
            this.service.searchResponseIO.data.searchCriteriaData[field.metadata] = option.value;
          }
        });
      }
      this.searchFieldCreated.emit(field);
      this.searchList.fields.push(field);
    });

    this.searchList.fields.filter((field) => {
      if (field.name == null) {
        field.isVisible = false;
      } else {
        if (this.service.searchResponseIO.data.searchResultInfo[field.guid].VISIBILITY != 'NO') {
          field.isVisible = true;
        } else {
          field.isVisible = false;
        }
      }
      if (this.searchResultColumnDisplayList != undefined && this.searchResultColumnDisplayList.length > 0) {
        field.isVisible = false;
      }
      if (field.submitId != undefined && field.submitId != null) {
        this.searchList.fields.filter((title) => {
          if (field.submitId == title.guid) {
            field.link = title.link;
            field.submit = title;
            this.submitField = field;
          }
        });
      }
    });

    if (this.searchResultColumnDisplayList != undefined && this.searchResultColumnDisplayList.length > 0) {
      for (let i = 0; i < this.searchResultColumnDisplayList.length; i++) {
        let index = this.searchList.fields.findIndex(
          (item) => item.metadata === this.searchResultColumnDisplayList[i]
        );
        this.searchList.fields[index].isVisible =
          this.service.searchResponseIO.data.searchResultInfo[this.searchList.fields[index].guid].VISIBILITY !=
            'NO' && this.searchList.fields[index].name !== null
            ? true
            : false;
      }
    }
    this.searchList.fields.sort((a, b) => a.position - b.position);
    this.searchList.values = [];
    this.searchList.values = this.service.searchResponseIO.data.searchResultData;
    this.service.searchResponseIO.searchResult = this.searchList;
    this.service.searchResponseIO.moreOptionList = this.moreOptionList;

    for (let i = 0; i < this.service.searchResponseIO.data.searchCriteriaInfo.length; i++) {
      this.service.searchResponseIO.data.searchCriteriaInfo[i].forEach((criteriaInfoColList) => {
        if (
          criteriaInfoColList.INPUTTYPECD == 'FCOMBO' ||
          criteriaInfoColList.INPUTTYPECD == 'LOOKUPTEXT' ||
          criteriaInfoColList.INPUTTYPECD == 'COMBO'
        ) {
          let options = [];
          this.service.searchResponseIO.lookups[criteriaInfoColList.LOOKUPCD].filter((option) => {
            options.push({
              value: option.cd,
              label: option.desc,
            });
            if (
              this.service.searchResponseIO.data.searchCriteriaData[criteriaInfoColList.metadata] == null &&
              option?.isDef == '1'
            )
              this.service.searchResponseIO.data.searchCriteriaData[criteriaInfoColList.metadata] = option.cd;
          });
          criteriaInfoColList.foptions = [];
          criteriaInfoColList.foptions = options;
        }
      });
      // this.setClass(this.service.searchResponseIO.data.searchCriteriaInfo[i]);
    }
    // console.log(JSON.stringify(this.searchList.values));
    // let columnDef = [];
    // this.searchList.fields.filter((col) => {
    //   console.log(col);
    // });
    // //  this.dtOptions.columnDefs
    setTimeout(() => {
      this.dtTrigger.next();

      // setScrollAndScreenHeight();
      setTimeout(() => {
        // if (!this.isSelectionRequired || this.isSelectionRequired == undefined) {
        // this.service.loadScroll();
        // this.service.setDefaultFocus();
        $(".dataTables_filter input[type='search']").prop('disabled', true);
        if (this.searchList?.values?.length > 0) {
          $(".dataTables_filter input[type='search']").prop('disabled', false);
          $(".dataTables_filter input[type='search']").focus();
        }

        //  }
      }, 5);

      // this.displaySelectOption = false;
    }, 15);
  }
}
