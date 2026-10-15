import { DatePipe } from '@angular/common';
import { BaseService } from 'src/app/system-common/services/base.service';
import {
  Component,
  OnInit,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SearchResult, SearchResultRow } from 'src/app/models/common/search-result';
import { SearchResultField } from 'src/app/models/common/search-result-field';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { SettingService } from '../services/setting.service';
import { Subject } from 'rxjs';

import 'datatables.net';
import { DataTableDirective } from 'angular-datatables';
import { MoreOption } from 'src/app/models/common/more-option';

import * as _moment from 'moment';
import { LeadService } from 'src/app/lead/services/lead.service';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

declare const setScrollAndScreenHeight: any;
// declare const setDefaultFocus: any;
declare const scrollToTop: any;
declare const searchScrollToTop: any;
declare const removeTooltip: any;
@Component({
  selector: 'sym-sunph-search',
  templateUrl: './sunph-search.component.html',
  styleUrls: ['./sunph-search.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SunphSearchComponent implements OnInit {
  /**
   * It is a required input. It contains search response which is to be displayed on the screen.
   * @SearchResponseIO is JSON Object containing { data: { searchResultData ; searchResultInfo ;
   * searchCriteriaData ; };  lookups ; }
   * */
  @Input() searchResponseIO: SearchResponseIO;

  /**
   * It contains JSON Object list of more option to be displayed in the search-list that is displayed.
   * Which is displayed along with individual item of the search-list.
   * e.g: 'Edit' ,'Delete', 'Copy'
   */
  @Input() moreOptionList: any[];

  /**
   * if add option is to be displayed and which module has invoked the component is mentioned here
   *
   * e.g: '/quotation'
   */
  @Input() addRouterLink: any;

  /**
   * It is used to display tooltip text on hover of the add button.
   * e.g: 'addLead'. If no data is passed it will display  'Add'
   */
  @Input() addTooltip: string;

  /**
   * This is used if delete option is applicable on search-list provided.
   * Default value is false.
   */
  @Input() isDeleteRequired: boolean;

  /**
   * This is used if advanced option is applicable to the search-list provided.
   * Default is false.
   */
  @Input() isAdvanceSearchDisplayed: boolean;

  /**
   * This is provided so that the current service is accesible to the component to reload or re-fresh the
   * search-list if list is updated.
   * e.g : QuotationService
   */
  @Input() service: BaseService;

  /**
   * if the calling component is landing page component then this option is to be enabled.
   *
   * This option helps in re-freshing the landing page search-list.
   * e.g: home
   */
  @Input() isLandingPage: boolean;

  /**
   * This option is mentioned if the search list is needs a select option
   *  e.g: IndustryOccupation Search list needs a select option which will return a selected JSON Object.
   */
  @Input() isSelectionRequired: boolean;

  /**
   * If there are any additional Options which needs to be displayed along with
   * delete / Add it needs to be added here.
   * It expects @MoreOption Json object
   * e.g: 'Compare'
   */
  @Input() additionalOptionList: MoreOption[];

  /**
   * This button is displayed if there is any option to be displayed at the search-level header.
   * If there is any additional or delete option to be displayed with respect to search-list
   * then this option value needs to be passed.
   *
   * e.g: 'selectQtn'
   */
  @Input() selectButtonText: string;

  /**
   * If the find() needs the search name to be included then this variable needs a value.
   * eg: 'SearchLifeIllustration' for loading life-illustration search list
   * @deprecated use searchName instead
   */
  @Input() searchText: string;

  /**
   * If the find() needs the search name to be included then this variable needs a value.
   * eg: 'SearchLifeIllustration' for loading life-illustration search list
   */
  @Input() searchName: string;

  /**
   * This is used to hide advanced search option.
   * Default is true.
   */
  @Input() isAdvanceSearchRequired: boolean;
  /**
   * This is used to export the search list in pdf, csv, and excel.
   * here fileName expects string value and format expects array containing pdf | csv | excel.
   */
  @Input() exportDetails: {
    fileName: string;
    format: string[];
  };

  /**
   * This is used to set the executeSearch when the searchText property is used.
   * by default its false.
   *  @deprecated use ExecuteSearchName instead
   */
  @Input() searchTextExecuteSearch: boolean;

  /**
   * This is used to set the executeSearch when the searchName property is used.
   * by default its false.
   */
  @Input() ExecuteSearchName: boolean;

  /**
   * If and any criteria is needed to load the search list.
   * default is empty | undefined;
   *
   */
  @Input() searchCriteriaData: any;

  /**
   * This help to load specified length of data in
   * search table for e.g: 5
   * Default is length is 10.
   */
  @Input() initialResultCount: number;

  /**
   * To hide the search text box and showing entries on the
   *  top of the  data table
   * Default is false
   */
  @Input() displayResultTableOnly: boolean;

  /**
   * This could be used when we want to display certain columns only
   * Expects a list of string to display the column.
   *  e.g: ['SearchProspectDO.quotationRefNum', 'SearchProspectDO.fullName']
   *
   */
  @Input() searchResultColumnDisplayList: string[];

  /**
   * This is an optional parameter to rewrite the key for
   * 'select' shown in the datatable column.
   * ex: 'selectCd'
   */
  @Input() selectLabelKey: string;

  /**
   * This is an optional parameter to add placeholder for
   * 'search' shown in the search box.
   * ex: 'Enter Quotation No.'
   */
  @Input() searchPlaceholder: string;

  /**
   * This is used to close the modal (popup) on click of Select button (When selectButtonText attribute is used)
   * Default value is true.
   */
  @Input() closeOnSelection: boolean;

  /**
   * This is used to show/hide the fields in the search criteria fields above the search table
   * Default value is true.
   */
  @Input() showCriteriaInfoFields: boolean;
  /**
   * This is triggered when any of the moreOption is clicked.
   * e.g: 'copy' option is selected it will emit
   * { button_id: any;
   * link: any;
   * ref_id: any;
   * refNum: string;
   * }
   */

  @Output()
  moreOptionClick = new EventEmitter<{
    button_id: any;
    link: any;
    ref_id: any;
    refNum?: string;
  }>();

  /**
   * This is emitted when an item is selected from the search-list.
   * e.g: when industry-occupation single item is selected.
   */
  @Output() selectedOptionClick = new EventEmitter<any>();

  /**
   * This is emitted when additional option item is selected.
   * e.g: when compare is selected along with selected search-list item.
   */
  @Output() additionalOptionClick = new EventEmitter<MoreOption>();

  /**
   * This is emitted when more option icon is clicked.
   */
  @Output() moreButtonClicked = new EventEmitter<SearchResultRow>();

  @Output() searchFieldCreated = new EventEmitter<SearchResultField>();

  @Output() cancelOptionClick = new EventEmitter<any>();

  /**
   * @ignore
   */
  public searchList: SearchResult;
  /**
   * @ignore
   */
  @ViewChild(DataTableDirective, { static: false })

  /**
   * @ignore
   */
  dtElement: DataTableDirective;

  /**
   * @ignore
   */
  dtOptions: any = {};

  /**
   * @ignore
   */
  dtTrigger: Subject<any> = new Subject<any>();

  /**
   * @ignore
   */
  isDtInitialized: boolean = false;

  /**
   * @ignore
   */
  displaySelectOption: boolean;

  /**
   * @ignore
   */
  selectIDsList: any[];

  /**
   * @ignore
   */
  isAdvanceSearchVisibile: boolean;

  /**
   * @ignore
   */
  selectedOption: any[];

  /**
   * @ignore
   */
  isSelectEmitted: boolean;

  /**
   * @ignore
   */
  isAdvanceSearchDialogVisible: boolean;

  /**
   * @ignore
   */
  isSearchDisabled: boolean;

  /**
   * @ignore
   */
  @Input() showAdvanceFilters: boolean;
  /**
   * @ignore
   */
  currentSelectedResultRow: SearchResultRow;
  isAdvancedSearchOption: boolean = true;
  public submitField: any;
  public info: any;
  donwloadLink: String = 'download-client';
  downloadIDsList: any = [];
  @Output() onDownloadButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() downloadIdList: EventEmitter<any> = new EventEmitter<any>();
  showDownloadButton: boolean = false;
  maxClientImportFormat: any;
  maxClientImportOnline: any;
  maxClientImportOffline: any;
  mode: any;
  isLimitReached = false;
  selectedIndexes: number[] = [];
  today: Date = new Date();

  constructor(
    public route: ActivatedRoute,
    public settingService: SettingService,
    public router: Router,
    public datepipe: DatePipe,
    protected baseService: BaseService,
    protected leadService: LeadService
  ) {
    this.isAdvanceSearchDialogVisible = false;
    this.isAdvanceSearchVisibile = false;
    this.isSelectEmitted = false;
    this.displaySelectOption = false;
    this.isSearchDisabled = true;
    this.isAdvanceSearchRequired = true;
    this.closeOnSelection = true;
    this.showCriteriaInfoFields = true;
    this.showAdvanceFilters = true;
  }

  ngOnInit(): void {
    this.maxClientImportOnline = SettingService.getApplicationPropertiesValue('MAXC360CLIENTIMPORT');
    this.maxClientImportOffline = SettingService.getApplicationPropertiesValue('MAXC360CLIENTIMPORTOFFLINE');
    this.mode = this.settingService.getApplicationMode();
    if (
      (this.isAdvanceSearchDisplayed == undefined || !this.isAdvanceSearchDisplayed) &&
      this.service != undefined &&
      this.service.searchResponseIO == undefined &&
      this.searchResponseIO == undefined &&
      this.searchText == undefined &&
      this.ExecuteSearchName == undefined &&
      this.searchName == undefined &&
      this.searchCriteriaData == undefined
    )
      // console.log(this.service.getUserLoginData())
      this.find();
    this.selectIDsList = [];
    let total = '' + '_TOTAL_';
    let footerEntries =
      this.settingService.getLabelValue('footerEntries') != 'footerEntries'
        ? this.service.getMultilingualMessage('footerntries', [total])
        : this.settingService.getLabelValue('entries');
    if (this.settingService.getLanguageSelected() == 'EN') {
      this.info =
        this.settingService.getLabelValue('Showing') +
        ' _START_ ' +
        this.settingService.getLabelValue('to') +
        ' _END_ ' +
        this.settingService.getLabelValue('of') +
        ' _TOTAL_ ' +
        footerEntries;
    } else if (this.settingService.getLanguageSelected() == 'CH') {
      this.info =
        this.settingService.getLabelValue('Showing') +
        ' _TOTAL_ ' +
        this.settingService.getLabelValue('to') +
        ' _START_ ' +
        this.settingService.getLabelValue('of') +
        ' _END_ ' +
        footerEntries;
    }
    let pageLength = this.initialResultCount != undefined ? this.initialResultCount : 10;
    let lengthMenu =
      this.initialResultCount != undefined
        ? [
            [this.initialResultCount, 10, 25, 50, -1],
            [this.initialResultCount, 10, 25, 50, 'All'],
          ]
        : [
            [5, 10],
            [5, 10],
          ];
    let hideSearchTextBox = this.displayResultTableOnly != undefined && this.displayResultTableOnly ? false : true;
    // let hideBInfo = this.hidePageLengthOption != undefined ? this.hidePageLengthOption : true;
    let infoFiltered =
      this.settingService.getLabelValue('filteredEntries', true) != undefined
        ? '(' + this.service.getMultilingualMessage('filteredEntries', ['_MAX_']) + ')'
        : '';
    this.dtOptions = {
      destroy: true,
      retrieve: true,
      deferRender: true,
      pagingType: 'simple_numbers',
      pageLength: pageLength,
      lengthMenu: lengthMenu,
      bFilter: hideSearchTextBox,
      paging: true,
      ordering: true,
      info: true,
      language: {
        search: '', //this.settingService.getLabelValue('search'),
        searchPlaceholder:
          this.searchPlaceholder != undefined ? this.settingService.getLabelValue(this.searchPlaceholder) : '',
        lengthMenu:
          this.settingService.getLabelValue('Showing') +
          ' ' +
          this.settingService.getLabelValue('entries') +
          ' ' +
          ' _MENU_  ',
        info: this.info,
        infoEmpty: this.info.replace('_START_', '0'),
        zeroRecords: this.settingService.getLabelValue('zeroRecords'),
        emptyTable: this.settingService.getLabelValue('ERR_SEARCHNODATAFOUND'),
        paginate: {
          first: '',
          last: '',
          next: this.settingService.getLabelValue('NEXT'),
          previous: this.settingService.getLabelValue('PREVIOUS'),
        },

        infoFiltered: infoFiltered,
      },
      drawCallback: (settings) => {
        setScrollAndScreenHeight();
        searchScrollToTop();
        // this.clearSelection(); // now 'this' = Angular component
      },

      // dom: 'flirtp',

      scrollX: true,
      // columnDefs: [{ type: 'num', targets: 1 }],
    };
    if (this.displayResultTableOnly != undefined && this.displayResultTableOnly) {
      this.dtOptions['dom'] = 'rtip';
    }
    if (this.exportDetails != undefined && !this.settingService.isMobileViewRendered()) {
      this.dtOptions['dom'] = 'lBftip';
      this.dtOptions['buttons'] = [
        {
          extend: 'collection',
          text: this.settingService.getLabelValue('export_as'),
          className: 'btn  btn_ExportAs',
          autoClose: true,
          buttons: this.getExportButtons(),
        },
      ];
    }
    if (this.moreOptionList && this.moreOptionList.length > 0) {
      this.dtOptions['columnDefs'] = [
        {
          targets: 0, // Target the first column (index 0)
          searchable: false, // Disable search for this column
        },
      ];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchResponseIO'] && changes['searchResponseIO'].currentValue) {
      this.service.searchResponseIO = this.searchResponseIO;
      this.setSearchList();
    }
    if (changes['addRouterLink'] && changes['addRouterLink'].currentValue) {
    }
    if (changes['moreOptionList'] && changes['moreOptionList'].currentValue) {
    }
    if (changes['isDeleteRequired'] && changes['isDeleteRequired'].currentValue) {
    }
    if (changes['executeSearch'] && changes['executeSearch'].currentValue) {
    }
    if (changes['service'] && changes['service'].currentValue) {
    }
    if (changes['isAdvanceSearchDisplayed'] && changes['isAdvanceSearchDisplayed'].currentValue) {
      if (
        !this.isAdvanceSearchDisplayed ||
        this.isAdvanceSearchDisplayed == undefined ||
        this.isAdvanceSearchDisplayed == null
      ) {
        this.isAdvanceSearchVisibile = false;
        this.isAdvanceSearchDialogVisible = false;
      } else if (this.isAdvanceSearchDisplayed) {
        this.isAdvanceSearchVisibile = true;
        this.isAdvanceSearchDialogVisible = true;
      }
    }

    if (changes['isSelectionRequired'] && changes['isSelectionRequired'].currentValue) {
      setScrollAndScreenHeight();
    }
    if (changes['searchText'] && changes['searchText'].currentValue) {
      this.find(this.searchTextExecuteSearch);
    }

    if (changes['ExecuteSearchName']) {
      this.searchTextExecuteSearch = this.ExecuteSearchName;
    }
    if (changes['searchName'] && changes['searchName'].currentValue) {
      this.searchText = this.searchName;
      if (
        ![
          'SearchIndustryOccupationCondition1',
          'SearchIndustryOccupationCondition2',
          'SearchIndustryOccupationCondition3',
        ].includes(this.searchName)
      ) {
        this.find(this.searchTextExecuteSearch || this.ExecuteSearchName);
      }
    }
    if (
      changes['searchCriteriaData'] &&
      changes['searchCriteriaData'].currentValue &&
      !changes['searchCriteriaData'].isFirstChange()
    ) {
      this.find(this.searchTextExecuteSearch || this.ExecuteSearchName);
    }
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getExportButtons() {
    let buttons = [];
    let buttonFormats = {};
    for (let format of this.exportDetails.format) {
      let formatAvailable =
        format.toLowerCase() == 'excel'
          ? true
          : format.toLowerCase() == 'csv'
          ? true
          : format.toLowerCase() == 'pdf'
          ? true
          : false;
      if (formatAvailable) {
        buttonFormats = {
          extend:
            format.toLowerCase() == 'excel'
              ? 'excelHtml5'
              : format.toLowerCase() == 'csv'
              ? 'csvHtml5'
              : format.toLowerCase() == 'pdf'
              ? 'pdfHtml5'
              : undefined,
          className: 'btn btn_export',
          text:
            format.toLowerCase() == 'excel'
              ? 'Excel <i class="fa fa-file-excel-o pl-1"> </i>'
              : format.toLowerCase() == 'csv'
              ? 'CSV <i class="fa fa-file-text-o pl-1"> </i>'
              : format.toLowerCase() == 'pdf'
              ? 'PDF <i class="fa fa-file-pdf-o pl-1"></i>'
              : undefined,
          titleAttr: format.toLowerCase() == 'excel' ? 'EXCEL' : format.toLowerCase() == 'csv' ? 'CSV' : 'PDF',
          title: this.exportDetails.fileName,
          filename: this.exportDetails.fileName.replace(/ /g, '_'),
          exportOptions: {
            columns: 'thead th:not(.thAction)',
          },
        };
        buttons.push(buttonFormats);
      }
    }

    return buttons;
  }

  /**
   * @ignore
   * this rerender the datatable with all the options
   */
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

  /**
   * This will load the search-list to display in the search-view
   * @param executeSearch expects a boolean value whether search is required or not, default value is true
   * @param searchCriteriaData  JSON structure of the searchCriteriaData object, if any.
   */
  find(executeSearch?: boolean, searchCriteriaData?: any) {
    if (this.searchCriteriaData != undefined) {
      searchCriteriaData = this.searchCriteriaData;
    }
    if (this.searchText != undefined) {
      this.leadService.searchClient(executeSearch, searchCriteriaData).subscribe(
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
    } else if (this.isLandingPage) {
      this.service.findForLanding(executeSearch, searchCriteriaData).subscribe(
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
    } else {
      this.service.find(executeSearch, searchCriteriaData).subscribe(
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
  }

  /**
   * @ignore
   * @param row expects whic row data is used to get the ID
   * @param index is used get the index from where to extra the data
   * @param link where to redirect
   * called to get a link.
   * @param field is the SearchResultField fetched from DB
   */
  public onLinkClick(row: any[], index: number, link: any, field?: any) {
    let position: number;
    this.searchList.fields.filter((d) => {
      if (d.position == index + 1) {
        position = d.submit.position;
      }
    });
    let url = link + '/' + row[position - 1];
    if (field.linkViewTypeCd && field.linkViewTypeCd == 'POPUP') {
      this.showWindow(url, 100, 300);
    } else {
      this.router.navigate([url]);
    }
  }

  /**
   *  @ignore
   * It set the searchList that is displayed in UI
   */
  private setSearchList() {
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
    console.log('service', this.service.searchResponseIO.data.searchCriteriaInfo);
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
              isDef: option?.isDef,
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
      this.setClass(this.service.searchResponseIO.data.searchCriteriaInfo[i]);
    }
    // console.log(JSON.stringify(this.searchList.values));
    // let columnDef = [];
    // this.searchList.fields.filter((col) => {
    //   console.log(col);
    // });
    // //  this.dtOptions.columnDefs
    setTimeout(() => {
      this.dtTrigger.next();

      setScrollAndScreenHeight();
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

      this.displaySelectOption = false;
    }, 15);
  }

  /**
   * This is triggered when moreoption is clicked
   * @param option option selected by user
   * @param number ids which are selected
   * @returns if confirmation is cancelled then it return to the screen
   */
  onMoreOptionClicked(option: { id: any; link: any }, seqID: any, refNum: string): void {
    let selectedOption = {
      button_id: option.id,
      link: option.link,
      ref_id: seqID,
      refNum: refNum,
    };
    if (option.id == 'Delete') {
      this.settingService.alertService.confirm(this.settingService.getLabelValue('searchDeleteConfirmation'), {
        okCallBack: () => {
          this.moreOptionClick.emit(selectedOption);
        },
        cancelCallBack: () => {
          return;
        },
        isConfirmationAlert: true,
      });
    } else {
      this.moreOptionClick.emit(selectedOption);
    }
  }

  /**
   *  @ignore
   * This will be triggered on delete checked
   * @param id selected id to be deleted
   * @param event event triggerred on click
   */
  onDeleteChecked(id: any, event: any) {
    if (event.target.checked) {
      this.selectIDsList.push(id);
    } else {
      let index = this.selectIDsList.indexOf(id);
      if (index > -1) {
        this.selectIDsList.splice(index, 1);
      }
    }
  }

  /**
   *  @ignore
   * confirms the records to be deleted and emits the emitter with selected option
   */
  deleteSelectedItems(): void {
    if (this.selectIDsList.length > 0) {
      this.settingService.alertService.confirm(
        this.service.getMultilingualMessage('searchRecDeleteConfirmation', [this.selectIDsList.length.toString()]),
        {
          okCallBack: () => {
            let deleteOption = {
              button_id: 'Delete_All',
              link: '',
              ref_id: this.selectIDsList,
            };
            this.moreOptionClick.emit(deleteOption);
          },
          cancelCallBack: () => {
            this.selectIDsList.filter((id) => {
              // $( '#' + id ).prop( 'checked', false );
              $('#' + id).prop('checked', true);
            });
            // this.selectIDsList = [];
          },
          isConfirmationAlert: true,
        }
      );
    } else {
      this.settingService.alertService.warn(this.settingService.getLabelValue('ERR_PLZSELECTRECORDS'));
    }
  }

  /**
   *  @ignore
   * selects/ de-selects all the displayed list
   */
  selectAll(): void {
    let isChecked = $('tbody input[type="checkbox"]');
    if ($('#selectall').prop('checked') == true) {
      for (let i = 0; i < isChecked.length; i++) {
        this.selectIDsList.push(parseInt(isChecked[i].id));
        $('#' + isChecked[i].id).prop('checked', true);
      }
    } else {
      for (let i = 0; i < isChecked.length; i++) {
        $('#' + isChecked[i].id).prop('checked', false);
      }
      this.selectIDsList = [];
    }
  }

  /**
   *  @ignore
   * on Advanced search cancel click
   */
  onAdvanceSearchCancel() {
    if (
      this.service.searchResponseIO.data.searchCriteriaData &&
      this.service.searchResponseIO.data.searchCriteriaData != undefined &&
      this.service.searchResponseIO.data.searchCriteriaData != null
    ) {
      this.searchList.fields.filter((field) => {
        this.service.searchResponseIO.data.searchCriteriaData[field.metadata] = null;
      });

      this.isAdvanceSearchVisibile = false;
      this.updateSearchResponse();
    }
  }

  /**
   * @ignore
   */
  onAdvanceSearchDialogClosed() {
    this.isAdvanceSearchDialogVisible = false;
    this.checkAdvanceSearchCriteriaPresent();
  }

  /**
   * @ignore
   */
  onAdvanceSearchDialogOpened() {
    this.isAdvanceSearchDialogVisible = true;
  }

  /**
   * @ignore
   */
  onAdvanceSearchClicked() {
    this.isAdvanceSearchVisibile = true;
    this.isAdvanceSearchDialogVisible = true;
  }

  /**
   * This is triggered when there is any input change in advanced search
   * @param field The changed value of SearchResultField JSON Object.
   **/
  onInputChange(field: SearchResultField) {
    if (field.INPUTTYPECD == 'FCOMBO' || field.INPUTTYPECD == 'LOOKUPTEXT') {
      this.service.searchResponseIO.data.searchCriteriaData[field.metadata] =
        field.fValue != '' && field.fValue != 'null' && field.fValue != undefined && field.fValue != null
          ? field.fValue.value
          : null;
    } else if (
      field.INPUTTYPECD != undefined &&
      (field.INPUTTYPECD == 'DATE' || field.INPUTTYPECD == 'DATETIME')
    ) {
      this.service.searchResponseIO.data.searchCriteriaData[field.metadata] = this.datepipe.transform(
        this.baseService.getDate(this.service.searchResponseIO.data.searchCriteriaData[field.metadata]),
        field.INPUTTYPECD == 'DATETIME'
          ? SettingService.getSystemDateFormat() + ' ' + SettingService.getSystemTimeFormat()
          : SettingService.getSystemDateFormat()
      );
      // console.log(this.baseService.getDate(this.searchResponseIO.data.searchCriteriaData[field.metadata]));
    } else {
      let changedInput = this.service.searchResponseIO.data.searchCriteriaData[field.metadata];
      this.service.searchResponseIO.data.searchCriteriaData[field.metadata] =
        changedInput != '' && changedInput != 'null' && changedInput != undefined && changedInput != null
          ? this.service.searchResponseIO.data.searchCriteriaData[field.metadata]
          : null;
    }

    this.checkAdvanceSearchCriteriaPresent(true);
  }

  /**
   * @ignore
   */
  updateSearchResponse() {
    // this.checkAdvanceSearchCriteriaPresent();
    this.isAdvanceSearchDialogVisible = false;
    this.showDownloadButton = true;
    let isCriteriaSearchValue = false;
    if (this.searchCriteriaData !== undefined)
      this.searchCriteriaData = this.service.searchResponseIO.data.searchCriteriaData;
    if (this.isLandingPage == undefined || this.isLandingPage == null || !this.isLandingPage) {
      let executeSearch: boolean;
      if (this.isAdvanceSearchDisplayed && !this.isAdvanceSearchVisibile) {
        executeSearch = false;
      } else {
        executeSearch = true;
      }
      let criteria = this.service.searchResponseIO.data.searchCriteriaData;

      const fields = [
        'SearchLeadDO.firstNameLead',
        'SearchLeadDO.middleNameLead',
        'SearchLeadDO.lastNameLead',
        'SearchLeadDO.birthDtLead',
        'SearchLeadDO.policyNumLead',
      ];

      let isCriteriaSearchValue = fields.some((key) => this.isCriteriaSearchEmpty(criteria[key]));

      if (isCriteriaSearchValue && executeSearch) {
        this.find(executeSearch, criteria);
      } else {
        this.error(this.settingService.getLabelValue('ERR_SEARCHEMPTYCRITERIA'));
      }
    } else {
      this.find(true, this.service.searchResponseIO.data.searchCriteriaData);
    }
    this.isAdvancedSearchOption = true;
  }

  isCriteriaSearchEmpty(value: any) {
    if (value === null || value === undefined || value === '') return false;
    return true;
  }

  error(message: string, callbackMethod?, autoClose?: boolean) {
    let options = {
      okCallBack: () => {
        this.baseService.reloadCurrentRoute();
        if (callbackMethod) {
          callbackMethod();
        }
      },
      autoClose: autoClose,
    };
    this.service.settingService.alertService.error(message, options);
  }

  /**
   * @ignore
   * this refresh the searchResponse displaye in UI
   */
  private refreshSearchList(searchList: any) {
    let list = JSON.parse(JSON.stringify(searchList));
    if (list.data.error) {
      this.error(this.settingService.getLabelValue('C360FailNotification'));
    }
    // this.service.searchResponseIO = new SearchResponseIO();
    // this.service.searchResponseIO = list;
    const oldCriteria = this.service.searchResponseIO?.data?.searchCriteriaData;
    this.service.searchResponseIO = new SearchResponseIO();
    this.service.searchResponseIO = list;

    if (oldCriteria) {
      this.service.searchResponseIO.data.searchCriteriaData = {
        ...oldCriteria,
      };
    }
    this.setSearchList();
    this.rerender_datatable();
    if (
      this.service.searchResponseIO != null &&
      this.service.searchResponseIO.data.searchResultData != null &&
      this.service.searchResponseIO.data.searchResultData.length > 0
    ) {
      this.isAdvancedSearchOption = false;
    } else {
      this.isAdvancedSearchOption = true;
    }
    if (
      this.service.getUserLoginData() != undefined &&
      this.service.getUserLoginData()['agentInfo'] != undefined &&
      this.service.getUserLoginData()['agentInfo']['featureList']
    )
      this.downloadReq = this.service.getUserLoginData()['agentInfo']['featureList'].includes('DOWNLOADCLIENT');

    console.log('Get search list successful.');
  }
  downloadReq = false;
  /**
   * @ignore
   */
  onSelectionChange(selectedRow: any) {
    this.selectedOption = [];
    this.isSelectEmitted = false;
    this.searchList.fields.filter((field) => {
      // todo remove isvisible
      // if (!field.isVisible) {
      this.selectedOption[field.metadata.substring(field.metadata.indexOf('.') + 1)] =
        selectedRow[field.position - 1];
      // }
    });
  }

  /**
   * @ignore
   */
  onSelectClick() {
    if (this.selectedOption && this.selectedOption != undefined) {
      this.selectedOptionClick.emit(this.selectedOption);
      this.isSelectEmitted = true;
      this.setTimeoutPromise(() => {
        if (this.closeOnSelection) this.clearSearchData();
      }, 5);
    } else {
      this.settingService.alertService.warn(this.settingService.getLabelValue('selectAtLeast1Option'));
    }
  }

  /**
   * @ignore
   */
  onSelectItemClicked() {
    this.displaySelectOption = true;
  }

  /**
   * @ignore
   */
  onSelectChecked(id: any, event: any) {
    if (event.target.checked) {
      this.selectIDsList.push(id);
    } else {
      let index = this.selectIDsList.indexOf(id);
      if (index > -1) {
        this.selectIDsList.splice(index, 1);
      }
    }
  }

  /**
   * @ignore
   */
  onAdditionalButtonClicked(buttonDetail: MoreOption) {
    if (this.selectIDsList.length > 0) {
      buttonDetail.ref_id = this.selectIDsList;
      this.additionalOptionClick.emit(buttonDetail);
    } else {
      this.settingService.alertService.warn(this.service.getMultilingualMessage('ERR_PLZSELECT', ['record']));
    }
  }

  /**
   * @ignore
   */
  onAdditionalOptionCloseClick() {
    this.displaySelectOption = false;

    this.selectIDsList = [];
  }

  /**
   * @ignore
   */
  private checkAdvanceSearchCriteriaPresent(isSearchDisabled?: boolean) {
    let isSearchValueChanged: boolean = false;
    let critera = [];
    Object.keys(this.service.searchResponseIO.data.searchCriteriaData).forEach((key) => {
      critera.push(key);
    });

    if (this.service.searchResponseIO.data.searchCriteriaInfo != undefined)
      Object.keys(this.service.searchResponseIO.data.searchCriteriaInfo).forEach((key) => {
        critera.push(key);
      });

    for (let i = 0; i < critera.length; i++) {
      const dataValue = this.service.searchResponseIO.data.searchCriteriaData?.[critera[i]];
      const infoValue = this.service.searchResponseIO.data.searchCriteriaInfo?.[critera[i]];

      if (
        (dataValue !== null && dataValue !== undefined && dataValue !== '') ||
        (infoValue !== null && infoValue !== undefined && infoValue !== '')
      ) {
        isSearchValueChanged = true;
        break;
      }
    }
    if (isSearchDisabled) {
      if (!isSearchValueChanged) {
        this.isSearchDisabled = true;
      } else {
        this.isSearchDisabled = false;
      }
    } else {
      if (!isSearchValueChanged) {
        this.isAdvanceSearchVisibile = false;
      }
    }
  }

  getDateFormatted(dateValue: any): string {
    if (dateValue == null) return '';
    let momentDate: Date = null;
    // if (!(typeof dateValue === 'number')) {
    momentDate = this.service.getDate(dateValue);
    if (!(momentDate instanceof Date && isFinite(+momentDate))) {
      return dateValue;
    }
    return this.datepipe.transform(momentDate, 'yyyy/MM/dd');
  }

  /**
   * This is triggered when clicked on more optionlist icon in individual
   * @param row current selected row value.
   */
  onMoreClick(row: any) {
    this.currentSelectedResultRow = new SearchResultRow();
    this.currentSelectedResultRow.row = row;
    this.moreButtonClicked.emit(this.currentSelectedResultRow);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    if (this.service != undefined && this.service.searchResponseIO != undefined)
      this.service.searchResponseIO = undefined;
    removeTooltip();
  }

  /**
   * This function is used to call popup.
   * @param url.
   * @param height specify height of popup.
   * @param width specify width of popup
   */

  protected showWindow(url: any, height: number, width: number) {
    var winHeight = $(window).height() - height;
    var winWidth = $(window).width() - width;
    var windowOptions =
      'toolbar=0,location=0,directories=0,status=1,menubar=0,scrollbars=1,resizable=1,width=' +
      winWidth +
      ',height=' +
      winHeight +
      ',left=100,top=100';
    window.open(url, 'win', windowOptions);
  }

  onAdvanceSearchCriteriaClear() {
    if (this.service.searchResponseIO.data.searchCriteriaInfo != undefined) {
      for (let i = 0; i < this.service.searchResponseIO.data.searchCriteriaInfo.length; i++) {
        for (let j = 0; j < this.service.searchResponseIO.data.searchCriteriaInfo[i].length; j++) {
          this.service.searchResponseIO.data.searchCriteriaData[
            this.service.searchResponseIO.data.searchCriteriaInfo[i][j].metadata
          ] = undefined;
          if (
            this.service.searchResponseIO.data.searchCriteriaInfo[i][j].INPUTTYPECD === 'DATE' ||
            this.service.searchResponseIO.data.searchCriteriaInfo[i][j].INPUTTYPECD === 'DATETIME'
          ) {
            this.service.searchResponseIO.data.searchCriteriaData[
              this.service.searchResponseIO.data.searchCriteriaInfo[i][j].metadata + '_dt'
            ] = undefined;
          }
          if (
            this.service.searchResponseIO.data.searchCriteriaInfo[i][j].INPUTTYPECD === 'COMBO' ||
            this.service.searchResponseIO.data.searchCriteriaInfo[i][j].INPUTTYPECD === 'FCOMBO' ||
            this.service.searchResponseIO.data.searchCriteriaInfo[i][j].INPUTTYPECD === 'NCOMBO' ||
            this.service.searchResponseIO.data.searchCriteriaInfo[i][j].INPUTTYPECD === 'LOOKUPTEXT'
          ) {
            let defaultValue = null;
            this.service.searchResponseIO.data.searchCriteriaInfo[i][j].foptions.filter((option) => {
              if (option && option.isDef && option.isDef === '1') {
                defaultValue = option.value;
                return;
              }
            });
            this.service.searchResponseIO.data.searchCriteriaData[
              this.service.searchResponseIO.data.searchCriteriaInfo[i][j].metadata
            ] = defaultValue;
            this.service.searchResponseIO.data.searchCriteriaData[
              this.service.searchResponseIO.data.searchCriteriaInfo[i][j].metadata + '_fc'
            ] = undefined;
          }
        }
      }
    }
  }

  private setClass(searchCriteriaInfoColList: any) {
    let colSize = Math.floor(12 / searchCriteriaInfoColList.length);
    searchCriteriaInfoColList.forEach((criteriaCol) => {
      criteriaCol['divClass'] = 'col-sm-' + colSize + ' col-md-' + colSize + ' col-xl-' + colSize;
    });
  }
  /**
   *  @ignore
   */
  public onCancelClicked() {
    this.clearSearchData();
    this.cancelOptionClick.emit(true);
  }

  /**
   *  @ignore
   * clears all the result data
   */
  private clearSearchData() {
    if (this.searchList != undefined) this.searchList.values = undefined;
    this.searchList.fields.filter((field) => {
      field.fValue = undefined;
    });
    this.onAdvanceSearchCriteriaClear();
    this.isAdvancedSearchOption = true;
    if (this.isAdvanceSearchDisplayed) {
      this.isAdvanceSearchVisibile = true;
      this.isAdvanceSearchDialogVisible = true;
    }
    this.rerender_datatable();
  }

  /**
   * @ignore
   * This is used instead of settimeout. add await while calling this method
   * @param callback method which needs to be excuted after timeout
   * @param ms time in millisecond
   * @returns promise call. e.g: this.setTimeoutPromise(()=>{console.log('')},5)
   */
  private setTimeoutPromise(callback: () => void, ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms)).then(callback);
  }

  public navigate_downloadClient() {
    this.router.navigate(['/download-client']);
  }
  onDownloadClick() {
    this.downloadIdList.emit([...this.downloadIDsList]); // copy emit
    this.onDownloadButtonClick.emit();

    this.downloadIDsList = [];
    $('tbody tr td input[type="checkbox"]').prop('checked', false);
  }

  downloadList(row: any[], index: number, event: any) {
    const actualValue = row[6];
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (this.mode === 'online') {
        if (this.selectedIndexes.length >= this.maxClientImportOnline) {
          checkbox.checked = false;
          return;
        }
      } else if (this.mode === 'offline') {
        if (this.selectedIndexes.length >= this.maxClientImportOffline) {
          checkbox.checked = false;
          return;
        }
      }

      this.selectedIndexes.push(index);

      this.downloadIDsList.push(actualValue);
      if (this.mode === 'online') {
        if (this.selectedIndexes.length == this.maxClientImportOnline) {
          this.infoMessage(`You have selected the maximum of ${this.maxClientImportOnline} records.`);
        }
      } else if (this.mode === 'offline') {
        if (this.selectedIndexes.length == this.maxClientImportOffline) {
          this.infoMessage(`You have selected the maximum of ${this.maxClientImportOnline} records.`);
        }
      }
    } else {
      const i = this.selectedIndexes.indexOf(index);
      if (i > -1) this.selectedIndexes.splice(i, 1);

      const j = this.downloadIDsList.indexOf(actualValue);
      if (j > -1) this.downloadIDsList.splice(j, 1);
    }
  }
  isChecked(index: number): boolean {
    return this.selectedIndexes.includes(index);
  }

  isCheckboxDisabled(index: number): boolean {
    return this.selectedIndexes.length >= 5 && !this.selectedIndexes.includes(index);
  }
  isImportDisabled(row: any[]): boolean {
    if (this.settingService.getApplicationMode() === 'offline') {
      const importFlag = row?.[5];
      return importFlag === 'YES';
    }
    return false;
  }
  clearSelection() {
    this.downloadIDsList = [];
    this.selectedIndexes = [];
    $('tbody tr td input[type="checkbox"]').prop('checked', false);
  }
  infoMessage(message: string, callbackMethod?, autoClose?: boolean) {
    let options = {
      okCallBack: callbackMethod,
      autoClose: autoClose,
    };
    this.service.settingService.alertService.info(message, options);
  }
}
