import { ResponseIO } from './../../models/responseIO';
import { BasePlanHandlerComponent } from './../../quotation/base-plan/base-plan.handler';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { QuotationService } from 'src/app/quotation/services/quotation.service';

@Component({
  selector: 'sym-quotation-base-plan-selection',
  templateUrl: './quotation-base-plan-selection.component.html',
  styleUrls: ['./quotation-base-plan-selection.component.scss'],
  providers: [QuotationService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationBasePlanSelectionComponent extends BasePlanHandlerComponent implements OnInit {
  @Input() planOptionCd: String;
  @Input() responseIO: ResponseIO;
  @Input() quotationIndex: number;
  @Input() respApplicableProduct;
  @Output() notifyBasePlanSelection = new EventEmitter<ResponseIO>();
  protected isPlanSelected: boolean = false;
  public planOption: any = [];
  constructor(service: QuotationService) {
    super(service);
  }

  ngOnInit() {
    let currResponseIO: ResponseIO = new ResponseIO();
    let tempIO = JSON.parse(JSON.stringify(this.responseIO));
    currResponseIO = currResponseIO.copyFrom(tempIO);
    this.service.responseIO = currResponseIO;
    this.service.id = currResponseIO.data.Entity.id;
    //if base plan is already selected then not to override value from validate quotation
    if (this.service.responseIO.data.BasePlan.productPlanOptionCd != this.planOptionCd) {
      this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'baseSumAssured', 0);
      this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'paymentTypeCd', null);
      this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'paymentFrequencyCd', null);
    }
    this.service.setModelFieldValue(
      this.service.responseIO.data.BasePlan,
      'productPlanOptionCd',
      this.planOptionCd
    );
    this.isPlanSelected = false;
    this.setDefaultFundList();
    this.validateQuotation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['respApplicableProduct'] && changes['respApplicableProduct'].currentValue) {
      this.loadPlanOptionDetails();
    }
  }

  onSelectedBasePlan() {
    this.isPlanSelected = true;
    this.validateQuotation(true);
  }

  protected postValidateQuotation() {
    super.postValidateQuotation();
    if (this.isPlanSelected) {
      if (this.service.getErrorCount(this.service.responseIO.data.BasePlan) > 0) {
        //in order to display the errors we need to set this tab as the visited tab.
        this.setVisitedTabs();
        this.error(this.service.getMultilingualLabel('ERR_CONTINUE'), undefined, true);
      } else {
        this.notifyBasePlanSelection.emit(this.service.responseIO);
      }
      this.isPlanSelected = false;
    }
  }

  private setDefaultFundList() {
    let fundValueExist: boolean;
    if (
      this.service.responseIO.data.BasePlan != undefined &&
      this.service.responseIO.data.BasePlan.FundList != undefined &&
      this.service.responseIO.data.BasePlan.FundList.length > 0
    ) {
      for (let index = 0; index < this.service.responseIO.data.BasePlan.FundList.length; index++) {
        if (
          this.service.responseIO.data.BasePlan.FundList[index].allocationPerc != undefined &&
          this.service.responseIO.data.BasePlan.FundList[index].allocationPerc != null
        ) {
          fundValueExist = true;
          break;
        }
      }

      if (!fundValueExist) {
        this.service.responseIO.data.BasePlan.FundList[0]['allocationPerc'] = 100;
        this.service.setUpdated(this.service.responseIO.data.BasePlan.FundList[0]);
      }
    }
  }

  public loadPlanOptionDetails() {
    if (
      this.respApplicableProduct != undefined &&
      this.respApplicableProduct.planOptionList != undefined &&
      this.respApplicableProduct.planOptionList[this.service.responseIO.data.BasePlan.productSeq] != undefined
    ) {
      this.respApplicableProduct.planOptionList[this.service.responseIO.data.BasePlan.productSeq].filter(
        (option) => {
          if (option.cd == this.planOptionCd && option != undefined) {
            this.planOption = option;
          }
        }
      );
    }
  }
}
