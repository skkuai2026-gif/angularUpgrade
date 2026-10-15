import { NavigationLink } from './../../models/common/navigation-link';
import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyPartyDetailsHandlerComponent } from './policy-party-details.handler';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-policy-party-details',
  templateUrl: './policy-party-details.component.html',
  styleUrls: ['./policy-party-details.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyDetailsComponent extends PolicyPartyDetailsHandlerComponent implements OnChanges {
  @Input() model: any;
  @Input() isNavigationReqd: boolean;

  navigationLinkList: NavigationLink[];

  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService, settingService);
    //console.log(this.service.responseIO);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  protected relationCd_focus(item: FieldItem) {
    // this.service.getRelationForGender(item);
  }

  protected relationCd_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PolicyAdditionalFields, 'field11', null);
  }
  protected genderCd_change(item: FieldItem) {
    // item.model.relationCd = '';
  }
  protected titleCd_change(item: FieldItem) {
    // this.service.getGenderForTitle(item.model);
  }
  protected loadNavigationLinkList() {
    this.navigationLinkList = [];
    let nav = new NavigationLink();
    nav.link = 'basic_Details_Body';
    nav.labelKey = 'PartyDetails';
    this.navigationLinkList.push(nav);
    nav = new NavigationLink();
    nav.link = 'contact_Details_Body';
    nav.labelKey = 'CONTACTDETAILS';
    this.navigationLinkList.push(nav);
    nav = new NavigationLink();
    nav.link = 'address_Details_Body';
    nav.labelKey = 'ADDRESSINFORMATION';

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
    // if (this.model.OtherIncomeList != undefined) {
    //   nav = new NavigationLink();
    //   nav.link = 'OtherIncomeList_Body';
    //   nav.labelKey = 'otherSourceIncome';
    //   this.navigationLinkList.push(nav);
    // }
    nav = new NavigationLink();
    nav.link = 'nationalityDetails_Body';
    nav.labelKey = 'nationalityDetails';
    this.navigationLinkList.push(nav);
    nav = new NavigationLink();
    nav.link = 'additionalInstruction_Body';
    nav.labelKey = 'additionalInstructions';
    this.navigationLinkList.push(nav);
  }
}
