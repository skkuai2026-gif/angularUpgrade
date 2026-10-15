import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationStepFormComponent } from '../quotation-step-form/quotation-step-form.component';
import { QuotationService } from '../services/quotation.service';
import { Location } from '@angular/common';
import { StepItem } from 'src/app/models/common/step-item';

@Component({
  selector: 'sym-quotation-insurance-step-form',
  templateUrl: './quotation-insurance-step-form.component.html',
  styleUrls: ['./quotation-insurance-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationInsuranceStepFormComponent extends QuotationStepFormComponent implements OnInit {
  currentUrl: string;
  insuranceTypeCd: string;
  constructor(
    service: QuotationService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }

  ngOnInit() {
    this.insuranceTypeCd = this.route.snapshot.paramMap.get('insuranceTypeCd');
    super.ngOnInit();
  }
  protected getStepList(): StepItem[] {
    let stepList: StepItem[];
    this.insuranceTypeCd = this.insuranceTypeCd != null ? this.insuranceTypeCd : this.getInsuranceType();
    let facetId = 'QUOTEUIFORMAT_' + this.insuranceTypeCd;
    stepList = this.service.getStepList(this.service.companyFacets.data[facetId]);
    return stepList;
  }

  // Upon clicking 'Save' on the product selection page, the product facet is undefined and the XML contains a product facet within the 'symif' condition. As a result, the merge step list is triggered when the product facets load. To address this, the merge step list was added to the postLoadProductFacets process.

  protected mergeStepList(): void {
    if (
      this.service.productFacets == undefined &&
      this.service.responseIO?.data?.BasePlan?.productSeq != undefined
    ) {
      //This condition occurs when saving from the product selection page after a product has been selected
    } else {
      super.mergeStepList();
    }
  }

  protected postLoadProductFacets() {
    super.mergeStepList();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  public nsap_change() {
    this.service.setModelFieldValue(
      this.service.responseIO.data.Entity,
      'tripTypeCd',
      this.service.responseIO.data.Proposer.nsap
    );
  }
}
