import { TabItem } from './../../models/common/tab-items';
import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  Input,
  ChangeDetectionStrategy,
  Renderer2,
} from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { WithdrawalHandlerComponent } from './withdrawal.handler';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class WithdrawalComponent extends WithdrawalHandlerComponent implements OnInit {
  riderApplicableFL: any;
  shoewrrorPopup: any;
  constructor(quotationService: QuotationService, private renderer: Renderer2) {
    super(quotationService);
    this.service.responseIO.data.Entity.withdrawalFl = 'YES';
  }
  @Input() selectedTab: TabItem;
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.selectedTab = this.selectedTab;
    this.service.responseIO.data.Entity.withdrawalFl = 'YES';
  }
  ngOnInit(): void {
    super.ngOnInit();

    console.log('setting withdrawalFl YES');

    if (this.service.responseIO?.data?.Entity?.quoteStatusCd === 'ACCEPTED') {
      setTimeout(() => {
        this.disableElement('deleteWithdrawal');
        this.disableElement('generateWithdrawal');
      });
    }
    this.service.responseIO.data.Entity.withdrawalFl = 'YES';
  }
  private disableElement(id: string): void {
    const element = document.getElementById(id);

    if (element) {
      this.renderer.setStyle(element, 'pointer-events', 'none');
      this.renderer.setStyle(element, 'opacity', '0.5');
      this.renderer.setStyle(element, 'cursor', 'not-allowed');
    }
  }

  public generateWithdrawal_click() {
    this.onWithdrawalScheduleButtonClick();
  }
  public deleteWithdrawal_click() {
    this.confirm(this.service.getMultilingualMessage('deleteConfirmation', ['all Withdrawals']), () => {
      this.service.responseIO.data.WithdrawalList.filter((withdraw) => {
        this.service.setDeleted(withdraw);
      });
    });
  }
  onWithdrawalScheduleButtonClick() {
    let currentSolverFacetId = 'WITHDRAWALSOLVERWRAPPERV8';
    // if (this.service.productFacets.data['WITHDRAWALSCHEDULESOLVERVUL'] != undefined)
    //   currentSolverFacetId = 'WITHDRAWALSCHEDULESOLVERVUL';
    this.service.responseIO.data.Entity.currentSolverFacetId = currentSolverFacetId;
    let modelNameListArray = ['WithdrawalList'];
    if (this.service.responseIO.data.WithdrawalList.length != 0) {
      for (let i = 0; i < this.service.responseIO.data.WithdrawalList.length; i++) {
        const policyYearFromStr = this.service.responseIO.data.WithdrawalList[i].policyYearFrom;
        const payingYearsStr = this.service.responseIO.data.Entity.payingYears;
        const policyYearFrom = Number(policyYearFromStr);
        const payingYears = Number(payingYearsStr);
        if (!isNaN(payingYears) && !isNaN(policyYearFrom) && policyYearFrom <= payingYears) {
          this.shoewrrorPopup = false;
          break;
        } else {
          this.shoewrrorPopup = true;
        }
      }
    } else {
      this.shoewrrorPopup = true;
      this.warn(this.service.getMultilingualLabel('ERR_ZEROWITHDRAWAL'));
    }

    if (this.shoewrrorPopup == false) {
      let payingYears = String(this.service.responseIO.data.Entity.payingYears);
      this.warn(this.service.getMultilingualLabel('ERR_CHECKWITHDRAWALPLYSI') + payingYears + '.');
    } else {
      let respData: any;
      this.service.solve(modelNameListArray).subscribe(
        (successResponse) => {
          respData = JSON.parse(JSON.stringify(successResponse));
          const validationErrors = respData?.validationerrors;
          const hasValidationErrors = validationErrors && Object.keys(validationErrors).length > 0;

          if (hasValidationErrors) {
            this.warn(this.service.getMultilingualLabel('ERR_GENERATEILLUSTRATIONADDMESG'));
          }

          if (respData.data.Entity.quotAddtnlField10 == 'A') {
            this.warn(this.service.getMultilingualLabel('ERR_GENERATEILLUSTRATIONADDMESG'));
          }
          // console.log('solver responser: ', respData.data.BasePlan);
          this.service.responseIO.data.WithdrawalList = respData.data.WithdrawalList;
          this.service.refreshMetaData(respData);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }
  }
  // public pdfFrequencyVal_change(item: FieldItem) {
  //   let pdfFrequencyVal = item.model.pdfFrequencyVal;
  //   if (pdfFrequencyVal < 1 || pdfFrequencyVal > 5) {
  //     this.warn('Please input a value from 1 to 5');
  //   }
  // }
  public slgfiAPO_click() {
    let currentSolverFacetId = 'SLGFIAPOSOLVER';
    this.service.responseIO.data.Entity.currentSolverFacetId = currentSolverFacetId;
    let modelNameListArray = ['Entity', 'BasePlan', 'RiderList'];
    let respData: any;
    if (this.service.responseIO.data && this.service.responseIO.data['RiderList']) {
      this.service.responseIO.data['RiderList'].filter((rider) => {
        if (
          (rider.productId == 'Grepa5YRCT' && rider.selected == 'YES') ||
          (rider.productId == 'HIB' && rider.selected == 'YES') ||
          (rider.productId == 'CIB' && rider.selected == 'YES') ||
          (rider.productId == 'FCI' && rider.selected == 'YES') ||
          (rider.productId == 'FCM' && rider.selected == 'YES')
        ) {
          this.riderApplicableFL = false;
        }
      });
    }
    if (this.riderApplicableFL == false) {
      this.error(this.service.getMultilingualLabel('ERR_RIDERNOTAPPLICABLE'));
    } else {
      this.service.solve(modelNameListArray).subscribe(
        (successResponse) => {
          respData = JSON.parse(JSON.stringify(successResponse));
          console.log('solver responser: ', respData);
          this.service.setModelFieldValue(
            this.service.responseIO.data.Entity,
            'quotAddtnlField10',
            respData.data.Entity.quotAddtnlField10
          );
          // this.service.responseIO.data.WithdrawalList = respData.data.WithdrawalList;
          // this.service.refreshMetaData(respData);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }
  }
}
