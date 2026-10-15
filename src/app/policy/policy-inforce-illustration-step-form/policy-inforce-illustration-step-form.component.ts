import { TabItem } from './../../models/common/tab-items';
import { StepItem } from './../../models/common/step-item';
import { ResponseIO } from './../../models/responseIO';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeader } from 'src/app/models/common/page-header';
import { BaseStepFormComponent } from 'src/app/system-common/base-step-form/base-step-form.component';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { Location } from '@angular/common';
import { QuotationService } from './../../quotation/services/quotation.service';
@Component({
  selector: 'sym-policy-inforce-illustration-step-form',
  templateUrl: './policy-inforce-illustration-step-form.component.html',
  styleUrls: ['./policy-inforce-illustration-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyInforceIllustrationStepFormComponent
  extends BaseStepFormComponent<PolicyService>
  implements OnInit
{
  policyNum: any;
  apiResponseData;
  apiRequestData: { value: any };
  searchOpened: boolean;

  constructor(
    service: PolicyService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
    this.apiResponseData = null;
    this.apiRequestData = { value: null };
    this.searchOpened = false;
  }

  ngOnInit() {
    this.openModal('policyInforceIllustration');
    this.searchOpened = true;
    this.headerService.pageHeader = new PageHeader();
  }
  protected getStepList(): StepItem[] {
    let stepList: StepItem[] = [
      new StepItem(
        0,
        'step_yourPolicyDetails',
        [
          {
            id: 'tab_policy_basic',
            isSelected: true,
            modelList: ['Entity', 'Proposer', 'PrimaryInsured', 'BasePlan', 'RiderList'],
          },
        ],
        ['but_createQuotation ']
      ),
      ,
    ];
    return stepList;
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.additionalInfo = this.service.responseIO.data.Entity.productId;
    header.refNumber = this.service.responseIO.data.Entity.policyNum;
    header.title = 'Inforce Policy ';
    return header;
  }

  onOkButtonClicked() {
    // console.log(this.policyNum);
    if (this.policyNum == undefined || this.policyNum == null || this.policyNum == '') {
      this.error(this.settingService.getLabelValue('plcEnterValue'));
      // setTimeout(() => {
      //   this.openModal('policyInforceIllustration');
      // }, 100);
    } else {
      this.service.findByPolicyNum(this.policyNum).subscribe(
        (body) => {
          this.searchOpened = false;
          // console.log(body);
          this.apiRequestData.value = JSON.stringify(this.service.httpReq, null, '\t');
          this.apiResponseData = JSON.stringify(body, null, '\t');
          this.service.responseIO = new ResponseIO();
          this.service.responseIO = JSON.parse(JSON.stringify(body));
          //console.log('loaded details:' + service.responseIO);
          let currPageHeader = this.getPageHeader();
          if (currPageHeader != undefined) this.headerService.pageHeader = currPageHeader;
          this.stepList = [];
          this.stepList = this.getStepList();
          this.closeModal('policyInforceIllustration');
        },
        (error) => {
          console.log('Data load failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  getRiderTotalPremium() {
    let totalRiderPremium: number;
    totalRiderPremium = 0;
    if (this.service.responseIO.data && this.service.responseIO.data['RiderList']) {
      this.service.responseIO.data['RiderList'].filter((rider) => {
        // console.log(rider);
        if (rider.selected == 'YES') {
          // console.log(rider.modalPremium);
          totalRiderPremium += rider.modalPremium;
        }
      });
    }
    return totalRiderPremium;
  }

  onbut_createQuotationClick() {
    //Since this policy is not exisiting policy.
    this.service.responseIO.data.Entity.id = undefined;
    this.service.responseIO.data.Entity.statusCd = 'INFORCE';
    //change status of fund record as fund record is getting remove while merge.
    if (this.service.responseIO.data.BasePlan.FundList != undefined) {
      this.service.responseIO.data.BasePlan.FundList.filter((fund) => {
        if (fund.id != undefined) {
          fund.status = 'I';
          fund.id = undefined;
        }
      });
    }

    this.service.createQuotation().subscribe(
      (body) => {
        let responseIO = JSON.parse(JSON.stringify(body));
        this.router.navigate(['quotation/' + responseIO.data.Entity.quotationSeq]);
      },
      (error) => {
        console.log('Data load failed.');
        console.log('Error:', error);
      }
    );
  }
  onSearchClick() {
    this.openModal('policyInforceIllustration');
    this.searchOpened = true;
  }

  onRestApiClick() {
    this.openModal('apiRequest');
  }

  onPopupClosed() {
    this.searchOpened = false;
    if (this.service.responseIO == undefined) this.router.navigate(['/inforce-illustration-search']);
  }

  ngOnDestroy(): void {
    this.closeModal('policyInforceIllustration');
  }
}
