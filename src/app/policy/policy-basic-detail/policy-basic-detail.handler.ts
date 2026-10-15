import { NavigationLink } from './../../models/common/navigation-link';
import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyBasicDetailHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  navigationLinkList: NavigationLink[];
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnInit(): void {
    this.loadNavigationLinkList();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  protected loadNavigationLinkList() {
    this.navigationLinkList = [];
    let nav = new NavigationLink();
    nav.link = 'basic_Details_Body';
    nav.labelKey = 'basicDetails';
    this.navigationLinkList.push(nav);

    nav = new NavigationLink();
    nav.link = 'communication_Preference_Body';
    nav.labelKey = 'communicationPreference';
    this.navigationLinkList.push(nav);

    nav = new NavigationLink();
    nav.link = 'basic_plan_Body';
    nav.labelKey = 'basePlan';
    this.navigationLinkList.push(nav);

    if (this.service.responseIO.data.RiderList != undefined && this.service.responseIO.data.RiderList.length > 0) {
      nav = new NavigationLink();
      nav.link = 'riderDetails';
      nav.labelKey = 'riderDetails';
      this.navigationLinkList.push(nav);
    }

    if (
      this.service.responseIO.data.BasePlan.FundList != undefined &&
      this.service.responseIO.data.BasePlan.FundList.length > 0
    ) {
      nav = new NavigationLink();
      nav.link = 'fund_list_Body';
      nav.labelKey = 'fundDetails';
      this.navigationLinkList.push(nav);
    }

    nav = new NavigationLink();
    nav.link = 'plan_extra_list_Body';
    nav.labelKey = 'productExtraDetails';
    this.navigationLinkList.push(nav);

    if (
      this.service.productFacets != undefined &&
      this.service.productFacets.data != undefined &&
      this.service.productFacets.data['TOPUPTYPESELECTIONREQUIRED']
    ) {
      nav = new NavigationLink();
      nav.link = 'overallTopup_Body';
      nav.labelKey = 'topupDetails';
      this.navigationLinkList.push(nav);
    }
  }
}
