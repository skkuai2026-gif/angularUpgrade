import { TabItem } from 'src/app/models/common/tab-items';
import { Component, Input, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { DynamicComponentList } from '../services/dynamic-component-list';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SupplementaryHandlerComponent extends BaseComponent<QuotationService> implements OnInit {
  @Input() public defaultReq: boolean;
  constructor(quotationService: QuotationService) {
    super(quotationService);
    this.defaultReq = true;
  }
  selectedTab: TabItem;
  tabList: TabItem[];

  ngOnInit() {
    this.initSupplementary();
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['responseUpdated'] && changes['responseUpdated'].currentValue) {
      if (changes['responseUpdated'].currentValue) {
        this.initSupplementary();
      }
    }
  }

  initSupplementary() {
    if (
      (this.service.responseIO.data.SupplementaryList == null ||
        this.service.responseIO.data.SupplementaryList.length == 0) &&
      this.defaultReq == true
    ) {
      this.addSupplementary();
    } else {
      this.initTabList();
    }
  }

  initTabList() {
    this.tabList = [];
    this.tabList = this.getTabList();
    if (this.tabList[0] != undefined) {
      this.selectedTab = this.tabList[0];
      this.tabList[0].isSelected = true;
    }
  }

  public title_change(item: FieldItem) {
    let gender = this.service.getGenderForTitle(item.model.title);
    item.model.genderCd = gender;
  }

  public dob_change(item: FieldItem) {
    this.service.computeAge(item.model);
  }

  public onAddSupplementary(event) {
    //alert("add supplementary");
    this.addSupplementary();
  }

  public onDeleteSupplementary(tabItem: TabItem) {
    this.confirm(this.service.getMultilingualMessage('deleteConfirmation', [tabItem.text]), () => {
      // this.tabList.splice(tabItem.index, 1);
      tabItem.visible = false;
      this.service.setDeleted(this.service.responseIO.data.SupplementaryList[tabItem.index]);
      this.selectedTab = this.tabList[tabItem.index - 1];
    });
  }

  protected getTabList(): TabItem[] {
    let tabList: TabItem[] = [];
    let suppIndex = 0;
    let tabIndex = 0;
    this.service.responseIO.data.SupplementaryList.forEach((supplementaryParty) => {
      let tab = new TabItem();
      tab.id = 'supplementary_' + suppIndex;
      tab.text = 'Supplementary ' + (suppIndex + 1);
      if (this.service.productFacets != undefined) {
        if (
          this.service.productFacets.data['FAMILYINSUREDDETAILS'] != undefined &&
          this.service.productFacets.data['FAMILYINSUREDDETAILS'] == 'YES'
        )
          tab.text = this.service.getMultilingualLabel('familyFloater') + ' ' + (suppIndex + 1);
        else if (
          this.service.productFacets.data['MULTILIFEAPPLICABLE'] != undefined &&
          this.service.productFacets.data['MULTILIFEAPPLICABLE'] == 'YES'
        )
          tab.text = this.service.getMultilingualLabel('multLives') + ' ' + (suppIndex + 1);
      }
      tabList[tabIndex] = tab;
      tab.index = tabIndex;
      if (supplementaryParty.status == 'D' || supplementaryParty.removed == 'YES') {
        tab.visible = false;
      }
      tabIndex++;

      suppIndex++;
    });
    return tabList;
  }
  setTab(tab: TabItem) {
    this.selectedTab = tab;
  }

  protected addSupplementary() {
    let respData: any;
    this.service.addSupplementary().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        let newSuppList = [];
        Array.prototype.push.apply(newSuppList, this.service?.responseIO?.data?.SupplementaryList);
        newSuppList.push(respData.data.Supplementary);
        //need to change the entire array instance in order to reflect in the dom
        this.service.responseIO.data.SupplementaryList = [];
        this.service.responseIO.data.SupplementaryList = newSuppList;
        this.service.refreshMetaData(respData);
        this.tabList = [];
        this.tabList = this.getTabList();
        this.selectedTab = this.tabList[this.tabList.length - 1];

        this.tabList[this.tabList.length - 1].isSelected = true;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  protected baseSumAssured_change(item: FieldItem) {
    this.validateQuotation(undefined, item);
  }

  protected validateQuotation(isRefreshValidationerrors?: boolean, item?: FieldItem) {
    let modelNameListArray = ['SupplementaryList'];
    let respData: any;
    this.service.validateQuotation(modelNameListArray, 'calculatePremium', true).subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        //this.service.responseIO.data.BasePlan = respData.data.BasePlan;
        this.service.responseIO.data.SupplementaryList = [];
        this.service.responseIO.data.SupplementaryList = respData.data.SupplementaryList;
        if (isRefreshValidationerrors) this.service.responseIO.validationerrors = respData.validationerrors;
        //Object.assign(this.service.responseIO.validationerrors, respData.validationerrors);
        this.service.refreshMetaData(respData);
        this.postValidateQuotation();
        if (item != undefined) this.setFieldFocus(item.model, item.fieldCd);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  protected postValidateQuotation() {}
}
