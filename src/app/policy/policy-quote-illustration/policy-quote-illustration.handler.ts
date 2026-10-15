import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
import { Component, EventEmitter, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from 'src/app/quotation/services/quotation.service';
import { ResponseIO } from 'src/app/models/responseIO';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyQuoteIllustrationHandlerComponent extends BaseComponent<PolicyService> {
  /**
   * Will emit true if the quoteIllustration(Preview) in E-App preview is successfully Loaded.
   */
  @Output() policyQuoteIllustrationLoaded = new EventEmitter<boolean>();
  constructor(policyService: PolicyService, public quotationService: QuotationService) {
    super(policyService);
    this.quotationService = quotationService;
  }
  ngOnInit() {
    super.ngOnInit();
    this.setQuotationData();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  protected setQuotationData() {
    //on accept counter offer,then load quotation data to view si html and signature also this quotation service set in current policy service.
    if (
      this.quotationService.responseIO == undefined &&
      this.service.responseIO.data.Entity.quotationSeq != undefined
    ) {
      this.quotationService.id = this.service.responseIO.data.Entity.quotationSeq;
      let modelNameBodyList = this.service.getModelNameBodyList(['OutputPreferences', 'ServiceSignatureList']);
      this.quotationService.currentActiveTab = 'tab_siIllustration';
      this.quotationService.load(this.quotationService.id, modelNameBodyList).subscribe(
        (responseIO) => {
          this.quotationService.responseIO = new ResponseIO();
          this.quotationService.responseIO = JSON.parse(JSON.stringify(responseIO));
          this.service.setQuotationService(this.quotationService);
          //add policy product facet into quotation ...so that html display
          this.quotationService.productFacets = this.service.productFacets;
        },
        (error) => {
          console.log('load Quotation failed, Error:', error);
        }
      );
    }
  }

  onApplyButtonClick() {
    //this.copyQuotationSignIntoPolicySign();
  }

  protected copyQuotationSignIntoPolicySign() {
    console.log('before quotation service', this.service.quotationService.responseIO);
    console.log('before policy service', this.service.responseIO.data);
    if (
      this.service.quotationService != undefined &&
      this.service.quotationService.responseIO != undefined
      // (this.service.responseIO.data.Entity.counterOfferDecisionCd == 'ACCEPT' ||
      //   this.service.responseIO.data.Entity.counterOfferDecisionCd == undefined)
    ) {
      //Clone the current ServiceSignatureList
      const policySignList = this.service.responseIO.data.ServiceSignatureList;
      const quotationSignList = this.service.quotationService.responseIO.data.ServiceSignatureList;

      const newServiceSignMap = new Map<string, any>();

      //Add all items from the original list into the map (by guid)
      policySignList.forEach((item) => {
        newServiceSignMap.set(item.guid, item);
      });

      //Merge quotation list into the map
      quotationSignList.forEach((quotationSignature: any, i: number) => {
        if (newServiceSignMap.has(quotationSignature.guid)) {
          // If guid exists, update the quotation list with the newer value
          quotationSignList[i] = newServiceSignMap.get(quotationSignature.guid);
        } else {
          // If not, add this item to the new list
          newServiceSignMap.set(quotationSignature.guid, quotationSignature);
        }
      });

      // Replace the list
      this.service.responseIO.data.ServiceSignatureList = [];
      this.service.responseIO.data.ServiceSignatureList = Array.from(newServiceSignMap.values());
      //this.service.responseIO.data.ServiceSignatureList = newServiceSignList;
      console.log('after quotation service', this.service.quotationService.responseIO);
      console.log('after policy service', this.service.responseIO.data);
    }
  }

  quoteIllustrationLoaded(illustrationIsLoaded) {
    this.copyQuotationSignIntoPolicySign();
    this.policyQuoteIllustrationLoaded.emit(illustrationIsLoaded);
  }
}
