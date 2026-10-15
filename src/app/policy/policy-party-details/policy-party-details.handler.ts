import { NavigationLink } from './../../models/common/navigation-link';
import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyDetailsHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  model: any;
  isNavigationReqd: boolean;

  navigationLinkList: NavigationLink[];

  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
    //console.log(this.service.responseIO);
  }

  ngOnInit() {
    super.ngOnInit();
    this.isNavigationReqd = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (changes['model'] && changes['model'].currentValue) {
      if (this.model != null) {
        this.loadNavigationLinkList();
      }
    }
  }

  protected loadNavigationLinkList() {
    this.navigationLinkList = [];
    let nav = new NavigationLink();
    nav.link = 'basic_Details_Body';
    nav.labelKey = 'PartyDetails';
    this.navigationLinkList.push(nav);
    nav = new NavigationLink();
    nav.link = 'address_Details_Body';
    nav.labelKey = 'ADDRESSINFORMATION';

    this.navigationLinkList.push(nav);
    nav = new NavigationLink();
    nav.link = 'contact_Details_Body';
    nav.labelKey = 'CONTACTDETAILS';

    this.navigationLinkList.push(nav);
    if (this.model.Employment != undefined) {
      nav = new NavigationLink();
      nav.link = 'Employment_Body';
      nav.labelKey = 'employmentHeader';
      this.navigationLinkList.push(nav);
    }
    if (this.model.IdentityList != undefined) {
      nav = new NavigationLink();
      nav.link = 'IdentityList_Body';
      nav.labelKey = 'identityHeader';

      this.navigationLinkList.push(nav);
    }

    if (this.model.OtherIncomeList != undefined) {
      nav = new NavigationLink();
      nav.link = 'OtherIncomeList_Body';
      nav.labelKey = 'otherSourceIncome';
      this.navigationLinkList.push(nav);
    }
    nav = new NavigationLink();
    nav.link = 'nationalityDetails_Body';
    nav.labelKey = 'nationalityDetails';
    this.navigationLinkList.push(nav);
  }

  protected titleCd_change(item: FieldItem) {
    this.service.getGenderForTitle(item.model);
  }

  protected birthDt_change(item: FieldItem) {
    item.model.age = undefined;
    this.service.computeAge(item.model);
  }

  // protected age_change(item: FieldItem) {
  //   item.model.birthDt = undefined;
  //   this.service.computeAge(item.model);
  // }

  protected genderCd_change(item: FieldItem) {
    item.model.relationCd = '';
  }

  protected relationCd_focus(item: FieldItem) {
    this.service.getRelationForGender(item);
  }

  protected industryCd_change(item: FieldItem) {
    item.model.natureOfDuty = '';
  }

  protected natureOfDuty_focus(item: FieldItem) {
    this.service.getNatureOfDuty(item);
  }
  protected natureOfDuty_change(item: FieldItem) {
    item.model.occupationCd = '';
  }
  protected occupationCd_focus(item: FieldItem) {
    this.service.getOccupationCd(item);
  }
  protected coverageCountryCd_change(item: FieldItem) {
    item.model.coverageCityCd = '';
  }
  protected coverageCityCd_focus(item: FieldItem) {
    this.service.getCoverageCityCd(item);
  }
}
