import { ResponseIO } from './../../models/responseIO';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { QuotationService } from 'src/app/quotation/services/quotation.service';

@Component({
  selector: 'sym-bank-quotation-coverage',
  templateUrl: './bank-quotation-coverage.component.html',
  styleUrls: ['./bank-quotation-coverage.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BankQuotationCoverageComponent extends BaseComponent<QuotationService> implements OnInit, OnChanges {
  @Input() responseIO: ResponseIO;
  @Input() responseUpdated: boolean;
  public isBasePlanSelected: boolean;
  public selectedQuotationCardIndex: number;
  public respApplicableProducts: any;
  @Output() notifyApplicableProducts = new EventEmitter<boolean>();
  productList = [];
  noOfRowCount = [];
  cardsPerRow = 0;

  constructor(service: QuotationService) {
    super(service);
    this.isBasePlanSelected = false;
    this.cardsPerRow = 3;
  }

  ngOnInit() {
    // this.service.loadScroll();
    //this.getApplicableProducts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['responseUpdated'] &&
        changes['responseUpdated'].currentValue &&
        changes['responseUpdated'].currentValue == true) ||
      (changes['responseUpdated'] && changes['responseUpdated'].firstChange == true)
    ) {
      this.getApplicableProducts();
    }
  }

  private getApplicableProducts() {
    this.productList = [];
    this.noOfRowCount = [];
    this.service.getApplicableProducts().subscribe(
      (successResponse) => {
        this.respApplicableProducts = JSON.parse(JSON.stringify(successResponse));
        this.respApplicableProducts = this.respApplicableProducts.data;
        if (this.respApplicableProducts.productList != undefined) {
          this.respApplicableProducts.productList[this.service.responseIO.data.BasePlan.productFamilyCd].filter(
            (product) => {
              this.productList.push(product);
            }
          );
        }
        let rowCount = this.productList.length / this.cardsPerRow;
        if (rowCount % this.cardsPerRow > 0 && rowCount != 1) rowCount = Math.ceil(rowCount);
        //rowCount = rowCount + 0.5;
        for (var i = 0; i < rowCount; i++) {
          var j = i * this.cardsPerRow;
          this.noOfRowCount.push(j);
        }
        this.notifyApplicableProducts.emit(false);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  public onBasePlanSelection(planSelectedResponse) {
    if (planSelectedResponse.isPlanSelected) {
      this.service.compareQuotaionResponseIOMap.set(
        planSelectedResponse.responseIO.data.BasePlan.productSeq,
        planSelectedResponse.responseIO
      );
      this.selectedStep.resetForwardButtons();
    } else {
      this.service.compareQuotaionResponseIOMap.delete(planSelectedResponse.responseIO.data.BasePlan.productSeq);
    }
  }
}
