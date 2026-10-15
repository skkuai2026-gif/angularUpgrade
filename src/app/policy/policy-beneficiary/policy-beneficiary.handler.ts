import { TabItem } from 'src/app/models/common/tab-items';
import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyBeneficiaryHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  responseUpdated: boolean;
  selectedTab: TabItem;
  tabList: TabItem[];
  respPartyRoleList: any;

  constructor(policyService: PolicyService) {
    super(policyService);
    // console.log(this.service.responseIO);
  }
  ngOnInit() {
    // console.log(this.service.responseIO.data.NomineeList);
    this.initNomineeList();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['responseUpdated'] && changes['responseUpdated'].currentValue) {
      if (this.responseUpdated) {
        this.initNomineeList();
      }
    }
  }

  initNomineeList() {
    if (this.service.responseIO.data.NomineeList == null || this.service.responseIO.data.NomineeList.length == 0) {
      this.addNominee();
    } else {
      this.initTabList();
    }
  }

  initTabList() {
    this.getTabList();
    this.selectedTab = this.tabList[0];
    this.tabList[0].isSelected = true;
    this.setNomineePartyDetail();
  }
  private setNomineePartyDetail() {
    let respData: any;
    this.service.getPartyRoleList('NOMINEE', null).subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        this.respPartyRoleList = respData.data.values;
        if (
          this.service.responseIO.data.NomineeList[this.selectedTab.index] != undefined &&
          this.service.responseIO.data.NomineeList[this.selectedTab.index].partySameAsCd === 'SUPPLEMENTARY' &&
          this.service.settingService.getApplicationMode() !== 'offline'
        )
          $('#NomineeList_' + this.selectedTab.index + '_suppPartyGuid').focus();
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  public onAddNominee(event) {
    //alert("add supplementary");
    this.addNominee();
  }
  deleteNomineeConfirmed(tabItem) {
    tabItem.visible = false;
    if (tabItem.id == 'appointee') {
      this.service.setDeleted(this.service.responseIO.data.Appointee);
    } else {
      this.service.setDeleted(this.service.responseIO.data.NomineeList[tabItem.index]);
    }
  }
  public onDeleteNominee(tabItem) {
    //alert("delete supplementary " +index );
    this.confirm(this.service.getMultilingualMessage('deleteConfirmation', [tabItem.text]), () => {
      tabItem.visible = false;
      if (tabItem.id == 'appointee') {
        this.service.setDeleted(this.service.responseIO.data.Appointee);
      } else {
        this.service.setDeleted(this.service.responseIO.data.NomineeList[tabItem.index]);
      }
    });
  }
  public addNominee() {
    this.service.addNominee().subscribe(
      (body) => {
        let response: any;
        response = JSON.parse(JSON.stringify(body));
        // response.data.Nominee['deleteCheck'] = true;
        let newNomineeList = [];
        Array.prototype.push.apply(newNomineeList, this.service?.responseIO?.data?.NomineeList);
        newNomineeList.push(response.data.Nominee);
        //need to change the entire array instance in order to reflect in the dom
        this.service.responseIO.data.NomineeList = [];
        this.service.responseIO.data.NomineeList = newNomineeList;
        this.service.refreshMetaData(response);
        this.getTabList();
        this.tabList[this.tabList.length - 1].isSelected = true;
        this.selectedTab = this.tabList[this.tabList.length - 1];
        this.setNomineePartyDetail();
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  protected getTabList(): TabItem[] {
    this.tabList = [];
    let nomineeIndex = 0;
    this.service.responseIO.data.NomineeList.forEach((nomineeList) => {
      let tab = new TabItem();
      tab.id = 'nominee_' + nomineeIndex;
      tab.text = 'Beneficiary ' + (nomineeIndex + 1);
      tab.index = nomineeIndex;
      this.tabList[nomineeIndex] = tab;
      if (nomineeList.status == 'D' || nomineeList.removed == 'YES') tab.visible = false;
      nomineeIndex++;
    });
    if (this.service.responseIO.data.Appointee != null && this.service.responseIO.data.Appointee != undefined) {
      let tab = new TabItem();
      tab.id = 'appointee';
      tab.text = 'Appointee';
      tab.index = nomineeIndex;
      this.tabList[nomineeIndex] = tab;
      if (
        this.service.responseIO.data.Appointee.status == 'D' ||
        this.service.responseIO.data.Appointee.removed == 'YES'
      )
        tab.visible = false;
      nomineeIndex++;
    }

    return this.tabList;
  }
  setTab(tab: TabItem) {
    this.selectedTab = tab;
    if (tab != undefined) this.setNomineePartyDetail();
  }

  checkTab() {
    if (this.tabList && this.tabList.length != this.service.responseIO.data.NomineeList.length) {
      this.tabList = [];
      this.tabList = this.getTabList();
      this.selectedTab = this.tabList[0];
      return true;
    }
  }

  // protected partySameAsCd_focus(item: FieldItem) {
  // let appPartyRoles: any[] = [];
  // item.options.forEach((option) => {
  //   if (this.respPartyRoleList[option.cd] != undefined) appPartyRoles.push(option);
  // });
  // item.options = appPartyRoles;
  // console.log(appPartyRoles);
  // }

  protected partySameAsCd_change(item: FieldItem) {
    if (this.service.settingService.getApplicationMode() === 'offline') return;
    $('#NomineeList_' + this.selectedTab.index + '_suppPartyGuid').focus();
  }

  protected suppPartyGuid_focus(item: FieldItem) {
    let partySameAsCd = item.model.partySameAsCd;
    let partyGuidList = this.respPartyRoleList[partySameAsCd];
    let partyGuidOptions = [];
    partyGuidList.forEach((partyGuid) => {
      let opt = { cd: partyGuid.guid, desc: partyGuid.name };
      partyGuidOptions.push(opt);
    });
    item.options = partyGuidOptions;
    setTimeout(() => {
      if (item.options.length == 1) {
        item.model.suppPartyGuid = item.options[0].cd;
        $('#NomineeList_' + this.selectedTab.index + '_suppPartyGuid').val(item.model.suppPartyGuid);
      }
    }, 10);
  }
}
