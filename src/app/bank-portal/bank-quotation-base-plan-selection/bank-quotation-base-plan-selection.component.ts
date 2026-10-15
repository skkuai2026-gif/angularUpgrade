import { FieldItem } from 'src/app/models/common/field-item';
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
  selector: 'sym-bank-quotation-base-plan-selection',
  templateUrl: './bank-quotation-base-plan-selection.component.html',
  styleUrls: ['./bank-quotation-base-plan-selection.component.scss'],
  providers: [QuotationService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BankQuotationBasePlanSelectionComponent extends BasePlanHandlerComponent implements OnInit {
  @Input() product: any;
  @Input() responseIO: ResponseIO;
  @Input() quotationIndex: number;
  @Input() respApplicableProducts: any;
  existingRiderList = [];

  @Output() notifyBasePlanSelection = new EventEmitter<{ responseIO: ResponseIO; isPlanSelected: boolean }>();
  currEvent: any;
  constructor(service: QuotationService) {
    super(service);
  }

  ngOnInit() {
    if (this.product != undefined) {
      let currResponseIO: ResponseIO = new ResponseIO();
      let tempIO = JSON.parse(JSON.stringify(this.responseIO));
      currResponseIO = currResponseIO.copyFrom(tempIO);
      this.service.responseIO = currResponseIO;
      this.service.id = currResponseIO.data.Entity.id;
      this.existingRiderList = [];
      //if base plan is already selected then not to override value from validate quotation
      if (
        this.service.responseIO.data.BasePlan.productSeq != undefined &&
        this.service.responseIO.data.BasePlan.productSeq != this.product['id']
      ) {
        this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'unselectedRiders', null);
        this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'productSeq', null);
        this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'productId', null);
        this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'productPlanOptionCd', null);
        //this.service.responseIO.data.RiderList = [];
        //delete riders from existing rider list by setting selected flag as NO.

        this.existingRiderList = this.service.responseIO.data.RiderList;
        if (
          this.service.responseIO.data.RiderList != undefined &&
          this.service.responseIO.data.RiderList.length > 0
        ) {
          this.service.responseIO.data.RiderList.filter((rider) => {
            rider.selected = 'NO';
          });
        }
      }

      this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'productSeq', this.product['id']);
      this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'productId', this.product['cd']);
      this.setDefaultFundList();
      this.validateQuotation();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['respApplicableProducts'] && changes['respApplicableProducts'].currentValue) {
    }
  }

  onSelectedBasePlan(event, productSeq) {
    this.currEvent = event;
    if (this.existingRiderList != undefined && this.existingRiderList.length > 0) {
      //this.service.responseIO.data.RiderList = [];
      //delete riders from existing rider list by setting selected flag as NO.
      this.existingRiderList.filter((rider) => {
        rider.selected = 'NO';
        this.service.responseIO.data['RiderList'].push(rider);
      });
      this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'unselectedRiders', null);
    }
    if (event.target.checked) {
      this.setDefaultFundList();
      this.validateQuotation(true);
    } else {
      this.notifyBasePlanSelection.emit({ responseIO: this.service.responseIO, isPlanSelected: false });
    }
  }

  protected postValidateQuotation() {
    if (this.currEvent != undefined && this.currEvent.target.checked) {
      super.postValidateQuotation();
      if (this.service.getErrorCount(this.service.responseIO.data.BasePlan) > 0) {
        //in order to display the errors we need to set this tab as the visited tab.
        this.currEvent.target.checked = false;
        this.setVisitedTabs();
        let visitedTabs = this.service.responseIO.data.Entity.visitedTabs;
        visitedTabs = visitedTabs + ',' + 'tab_selProduct';
        this.service.responseIO.data.Entity.visitedTabs = visitedTabs;
        this.error(this.service.getMultilingualLabel('ERR_CONTINUE'), undefined, true);
      } else {
        this.notifyBasePlanSelection.emit({ responseIO: this.service.responseIO, isPlanSelected: true });
      }
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

  protected productPlanOptionCd_focus(item: FieldItem) {
    if (this.respApplicableProducts.productList != undefined) {
      this.respApplicableProducts.productList[item.model.productFamilyCd].filter((product) => {
        if (
          this.respApplicableProducts.planOptionList[product.id] != undefined &&
          product.id == this.product['id']
        )
          this.service.setItemOptions(item, this.respApplicableProducts.planOptionList[product.id]);
      });
    }
  }

  public onRiderEdit_click() {
    this.openPopup('riderDetail_' + this.product['id']);
  }

  public closePop() {
    this.closePopup('riderDetail_' + this.product['id']);
  }
}
