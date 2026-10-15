import { FieldItem } from 'src/app/models/common/field-item';
import { Component, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from '../../system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
import { ResponseIO } from 'src/app/models/responseIO';
import { QuotationService } from '../../quotation/services/quotation.service';

@Component({
  selector: 'sym-policy-uw-loading',
  templateUrl: './policy-uw-loading.component.html',
  styleUrls: ['./policy-uw-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyUwLoadingComponent extends BaseComponent<PolicyService> implements OnChanges {
  totalExtraPremium: number = 0.0;
  isShowBreakup: boolean = false;
  productList: any[] = [];
  selectedIndex;
  currExtraList: any[] = [];
  isShowEappPDF: boolean = false;
  isShowSIPDF: boolean = false;
  eappBlockCollapse: boolean = true;
  siBlockCollapse: boolean = true;
  okAcceptConfirmation: boolean = false;
  isProceedToPayClick: boolean = false;
  isMultiLifeApplicable: boolean = false;

  constructor(policyService: PolicyService, public quotationService: QuotationService) {
    super(policyService);
    this.quotationService = quotationService;
  }

  ngOnInit() {
    if (this.service.responseIO != undefined) {
      if (this.service.responseIO.data.Entity.counterOfferDecisionCd == 'ACCEPT') this.okAcceptConfirmation = true;
      if (this.service.responseIO.data.BasePlan != undefined) {
        this.totalExtraPremium = this.service.responseIO.data.BasePlan.extraPremium;
        this.productList.push(this.service.responseIO.data.BasePlan);

        let multiLifeList = this.service.responseIO.data.MultiLifeList;
        if (
          this.service.productFacets &&
          this.service.productFacets.data &&
          this.service.productFacets.data['MULTILIFEAPPLICABLE'] &&
          this.service.productFacets.data['MULTILIFEAPPLICABLE'].length > 0 &&
          this.service.productFacets.data['MULTILIFEAPPLICABLE'] == 'YES' &&
          multiLifeList != undefined &&
          multiLifeList.length > 0
        ) {
          this.isMultiLifeApplicable = true;

          multiLifeList.forEach((multiLife) => {
            this.productList.push(multiLife);
            this.totalExtraPremium = this.totalExtraPremium + multiLife.extraPremium;
          });
        }

        let riderList = this.service.responseIO.data.RiderList;
        if (riderList != undefined && riderList.length > 0) {
          riderList.forEach((rider) => {
            this.productList.push(rider);
            this.totalExtraPremium = this.totalExtraPremium + rider.extraPremium;
          });
        }
      }
      this.setQuotationData();
      this.updatePolicySignatureData();
    }
  }

  showBreakup() {
    this.isShowBreakup = !this.isShowBreakup;
  }

  public setSelectedIndexOfProduct(index: number) {
    this.selectedIndex = index;
    this.currExtraList = [];
    this.currExtraList = this.getProductExtraList(this.selectedIndex);
    setTimeout(() => {
      this.openModal('productExtraDetails');
    }, 10);
  }

  getProductExtraList(index: number): any[] {
    if (this.productList[index].productTypeCd == 'PLAN') return this.productList[index].PlanExtraList;
    else if (this.productList[index].productTypeCd == 'RIDER') return this.productList[index].RiderExtraList;
  }

  protected counterOfferDecisionCd_change(item: FieldItem) {
    //on select of revised counter offer,need to create revised quotation record
    if (item.model.counterOfferDecisionCd == 'ACCEPT') {
      this.confirm(
        this.service.getMultilingualLabel('counterAcceptanceConfirmation'),
        () => {
          this.okAcceptConfirmation = true;
          this.service.createRevisedQuotation().subscribe(
            (responseIO) => {
              // alert( responseIO[ 'message' ] );
              this.service.responseIO = new ResponseIO();
              this.service.responseIO = JSON.parse(JSON.stringify(responseIO));
              this.service.setFieldReadOnly(this.service.responseIO.data.Entity, 'counterOfferDecisionCd', 'NO');
              this.updatePolicySignatureData();
            },
            (error) => {
              console.log('Create Revised Quotation failed.');
              console.log('Error:', error);
            }
          );
        },
        () => {
          this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'counterOfferDecisionCd', null);
        }
      );
    } else {
      this.okAcceptConfirmation = false;
    }
  }

  panelClick(panelType: string) {
    //on revised si or eapp panel click,show corresponding si or eapp pdf data
    if (panelType == 'SI') {
      this.siBlockCollapse = !this.siBlockCollapse;
      if (!this.siBlockCollapse) {
        this.isShowSIPDF = true;
        this.okAcceptConfirmation = true;
        this.setQuotationData();
      }
    } else if (panelType == 'EAPP') {
      this.eappBlockCollapse = !this.eappBlockCollapse;
      if (!this.eappBlockCollapse) {
        this.isShowEappPDF = true;
      }
    } else if (panelType == 'PAY') {
      this.isProceedToPayClick = !this.isProceedToPayClick;
    }
  }

  checkSISignCompleted() {
    //to check whether revised si signature done or not..from that need to set status on ui
    const classes = ['uwdecisionMesg', 'pendingSign'];
    if (
      this.quotationService.responseIO != undefined &&
      this.quotationService.responseIO.data.ServiceSignatureList != undefined
    ) {
      let siSignatureListSize: number = 0;
      this.quotationService.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
        if (serviceSignature.signature != undefined) siSignatureListSize++;
      });
      if (
        this.quotationService.responseIO.data.ServiceSignatureList.length > 0 &&
        siSignatureListSize == this.quotationService.responseIO.data.ServiceSignatureList.length
      ) {
        classes.pop();
        classes.push('completedSign');
      }
    }
    return classes.join(' ');
  }

  checkEappSignCompleted() {
    //to check whether revised policy signature done or not..from that need to set status on ui
    const classes = ['uwdecisionMesg', 'pendingSign'];
    if (this.service.responseIO != undefined && this.service.responseIO.data.ServiceSignatureList != undefined) {
      let eappSignatureListSize: number = 0;
      let actualEappSignObjListSize: number = 0;
      this.service.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
        if (serviceSignature != undefined && serviceSignature.constructor === [].constructor) {
          if (serviceSignature.length > 0) {
            serviceSignature.forEach((serSignature) => {
              if (serSignature != undefined) {
                actualEappSignObjListSize++;
                if (serSignature.signature != undefined) eappSignatureListSize++;
              }
            });
          }
        } else {
          if (serviceSignature != undefined) {
            actualEappSignObjListSize++;
            if (serviceSignature.signature != undefined) eappSignatureListSize++;
          }
        }
      });
      if (eappSignatureListSize == actualEappSignObjListSize) {
        classes.pop();
        classes.push('completedSign');
      }
    }
    return classes.join(' ');
  }

  checkPaymentCompleted() {
    //to check whether revised policy signature done or not..from that need to set status on ui
    const classes = ['uwdecisionMesg', 'pendingSign'];
    if (this.isProceedToPayClick) {
      classes.pop();
      classes.push('completedSign');
    }
    return classes.join(' ');
  }

  setQuotationData() {
    //on accept counter offer,then load quotation data to view si html and signature also this quotation service set in current policy service.
    if (
      this.service.responseIO.data.Entity.counterOfferDecisionCd == 'ACCEPT' &&
      this.okAcceptConfirmation &&
      this.quotationService.responseIO == undefined &&
      this.service.responseIO.data.Entity.quotationSeq != undefined
    ) {
      this.quotationService.id = this.service.responseIO.data.Entity.quotationSeq;
      let modelNameBodyList = this.service.getModelNameBodyList(['OutputPreferences', 'ServiceSignatureList']);
      this.quotationService.load(this.quotationService.id, modelNameBodyList).subscribe(
        (responseIO) => {
          this.quotationService.responseIO = new ResponseIO();
          this.quotationService.responseIO = JSON.parse(JSON.stringify(responseIO));
          this.service.setQuotationService(this.quotationService);
          this.service.setFieldReadOnly(this.service.responseIO.data.Entity, 'counterOfferDecisionCd', 'NO');
          //add policy product facet into quotation ...so that html display
          this.quotationService.productFacets = this.service.productFacets;
        },
        (error) => {
          console.log('load Quotation failed, Error:', error);
        }
      );
    }
  }

  updatePolicySignatureData() {
    //need to do signature again on accepted counter offer decision..so remove existing signature data
    this.service.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
      if (
        serviceSignature != undefined &&
        serviceSignature.signature != undefined &&
        this.service.responseIO.data.Entity.counterOfferDecisionCd == 'ACCEPT' &&
        this.okAcceptConfirmation &&
        serviceSignature.signatureDt != this.service.responseIO.data.Entity.counterOfferAcceptDt
      ) {
        this.service.setModelFieldValue(serviceSignature, 'signature', undefined);
        this.service.setModelFieldValue(serviceSignature, 'signatureDt', undefined);
      }
    });
  }
}
