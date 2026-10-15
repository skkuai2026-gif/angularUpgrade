import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { ResponseIO } from 'src/app/models/responseIO';
import { QuotationService } from 'src/app/quotation/services/quotation.service';
import { PolicyService } from '../services/policy.service';
import { PolicyQuoteIllustrationHandlerComponent } from './policy-quote-illustration.handler';

@Component({
  selector: 'sym-policy-quote-illustration',
  templateUrl: './policy-quote-illustration.component.html',
  styleUrls: ['./policy-quote-illustration.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyQuoteIllustrationComponent extends PolicyQuoteIllustrationHandlerComponent implements OnInit {
  /**
   * Will emit true if the quoteIllustration(Preview) in E-App preview is successfully Loaded.
   */
  @Output() policyQuoteIllustrationLoaded = new EventEmitter<boolean>();
  constructor(policyService: PolicyService, public quotationService: QuotationService) {
    super(policyService, quotationService);
    this.quotationService = quotationService;
  }
  ngOnInit() {
    super.ngOnInit();
    this.setQuotationData();
    $('.scrollDiv, .pgContent').css('overflow-y', 'hidden');
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  ngOnDestroy() {
    // $('.pgContent').css('overflow', 'initial');
    $('.scrollDiv, .pgContent').css('overflow-y', 'auto');
  }
  protected setQuotationData() {
    //on accept counter offer,then load quotation data to view si html and signature also this quotation service set in current policy service.
    if (this.service.responseIO.data.Entity.quotationSeq != undefined) {
      this.quotationService.id = this.service.responseIO.data.Entity.quotationSeq;
      let modelNameBodyList = this.service.getModelNameBodyList([
        'Entity',
        'OutputPreferences',
        'ServiceSignatureList',
      ]);
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
}
