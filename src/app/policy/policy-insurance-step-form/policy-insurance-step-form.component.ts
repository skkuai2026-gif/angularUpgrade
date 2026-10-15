import { Component, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Location } from '@angular/common';
import { PolicyStepFormComponent } from '../policy-step-form/policy-step-form.component';
import { StepItem } from 'src/app/models/common/step-item';
import { CSAService } from 'src/app/csa/service/csa-service.service';
import { QuotationService } from 'src/app/quotation/services/quotation.service';

@Component({
  selector: 'sym-policy-insurance-step-form',
  templateUrl: './policy-insurance-step-form.component.html',
  styleUrls: ['./policy-insurance-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyInsuranceStepFormComponent extends PolicyStepFormComponent implements OnInit {
  public companyname;
  public company;
  constructor(
    service: PolicyService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    public csaService: CSAService,
    public quotationService: QuotationService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.companyname = this.service.companyFacets.data.COMPANYNAME;
    this.company = SettingService.getApplicationPropertiesValue('COMPANYCOLOUR');
  }

  protected getStepList(): StepItem[] {
    let stepList: StepItem[];
    // let facetId = 'POLICYUIFORMAT_' + 'LIFE';
    let facetId = 'POLICYUIFORMAT_' + this.getInsuranceType();
    stepList = this.service.getStepList(this.service.companyFacets.data[facetId]);
    return stepList;
  }
  ngOnDestroy(): void {
    console.log('policycsa destroy method call..');
    if (this.csaService != undefined) this.csaService.responseIO = undefined;
    if (this.quotationService != undefined) this.quotationService.responseIO = undefined;
    super.ngOnDestroy();
  }
  public but_ok_click() {
    if (
      this.service.responseIO?.data?.Entity?.statusCd === 'ACCEPTED' &&
      this.hasNoValidationErrors() &&
      !this.service.responseIO?.data?.Entity?.applicationRefNum &&
      this.service.isPolicySubmitSuccess === false &&
      this.service.isPolicySubmitSuccess != undefined
    ) {
      this.service.isPolicySubmitSuccess = undefined;
      console.log('61 ok_click  ' + this.service.isPolicySubmitSuccess);
      let prevStepObj = this.stepList[this.selectedStep.index - 1];
      this.onStepChanged(prevStepObj);
    } else {
      let prevStepObj = this.stepList[this.selectedStep.index - 4];
      this.onStepChanged(prevStepObj);
    }
    $('#btn_ok').hide();
  }
  editQuotation_click() {
    this.openPopup('editQuotationPopUp');
  }
  closeeditModal() {
    this.closeModal('editQuotationPopUp');
  }
  protected editQuotationclick(buttonClicked: { id: string; link: string }) {
    this.service.editQuotation().subscribe(
      (successResponse) => {
        this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
        this.router.navigate(['quotation/' + this.service.responseIO.data.Entity.quotationSeq]);
        console.log('Edit Quotation successful.');
      },
      (error) => {
        console.log('Edit Quotation failed.');
        console.log('Error:', error);
      }
    );
  }
  hasNoValidationErrors(): boolean {
    const errors = this.service.responseIO?.validationerrors;
    return !errors || Object.keys(errors).length === 0;
  }
}
