import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { LeadStepFormHandlerComponent } from './lead-step-form.handler';
import { LeadService } from './../services/lead.service';
import { SettingService } from './../../system-common/services/setting.service';
import { HeaderService } from './../../system-common/services/header.service';

@Component({
  selector: 'sym-lead-step-form',
  templateUrl: './lead-step-form.component.html',
  styleUrls: ['./lead-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadStepFormComponent extends LeadStepFormHandlerComponent {
  constructor(
    service: LeadService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }
  protected createFNA() {
    let respData: any;
    this.service.createFNA().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        {
          if (SettingService.getApplicationPropertiesValue('COMPANYCOLOUR') === 'SLGFI') {
            this.router.navigate(['csa-slgfi/' + respData.data.Entity.fnaSeq]);
          } else {
            this.router.navigate(['csa/' + respData.data.Entity.fnaSeq]);
          }
        }

        console.log('createFNA  successful.');
      },
      (error) => {
        console.log('createFNA failed.');
        console.log('Error:', error);
      }
    );
  }
  protected viewCSAList() {
    console.log('in view csa list');
    this.service.viewCSAListDisplayed = true;
    this.service.hideLoader(undefined, undefined);
    this.openModal('viewCSAList');
  }

  protected viewProposalList() {
    console.log('in view proposal list');
    this.service.viewProposalListLeadDisplayed = true;
    this.service.hideLoader(undefined, undefined);
    this.openModal('viewProposalListLead');
  }

  protected viewPolicyList() {
    console.log('in view policy list');
    this.service.viewPolicyListDisplayed = true;
    this.service.hideLoader(undefined, undefined);
    this.openModal('viewPolicyList');
  }

  public viewCSAList_click(buttonClicked: { id: string; link: string }) {
    this.viewCSAList();
  }

  public viewProposalList_click(buttonClicked: { id: string; link: string }) {
    this.viewProposalList();
  }

  public viewPolicyList_click(buttonClicked: { id: string; link: string }) {
    this.viewPolicyList();
  }
  protected getMoreOptionList(): any[] {
    let optionList: any[];
    optionList = [];
    if (this.service.responseIO != undefined && this.service.responseIO.data.LeadParty != undefined) {
      if (this.service.responseIO.data.LeadParty.partyTypeCd === 'INDIVIDUAL') {
        optionList.push({
          id: 'createFNA',
        });
        optionList.push({
          id: 'viewCSAList',
        });
      } else if (this.service.responseIO.data.LeadParty.partyTypeCd === 'ORGANIZATION') {
        optionList.push({
          id: 'createQuotation',
        });
      }
      optionList.push({
        id: 'viewProposalList',
      });
      optionList.push({
        id: 'viewPolicyList',
      });
      optionList.push({
        id: 'close',
      });
    }
    return optionList;
  }
}
