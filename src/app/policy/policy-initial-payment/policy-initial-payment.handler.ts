import { TabItem } from './../../models/common/tab-items';
import { FieldItem } from 'src/app/models/common/field-item';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyInitialPaymentHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  paymentDetailTabList: TabItem[];
  selectedPaymentDetailTab: TabItem;
  public fieldIds: string;
  responseUpdated: boolean;

  constructor(policyService: PolicyService) {
    super(policyService);
    // console.log(this.service.responseIO);
    this.loadInitialPaymentDetailTab(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['responseUpdated'] && changes['responseUpdated'].currentValue) {
      if (this.responseUpdated) {
        this.loadInitialPaymentDetailTab(true);
      }
    }
  }

  public setSelectedTab(tab: TabItem) {
    this.selectedPaymentDetailTab = tab;
    if (tab != undefined) {
      let paymentMethodCd =
        this.service.responseIO.data['InitialPayment']['InitialPaymentDetailsList'][
          this.selectedPaymentDetailTab.index
        ].paymentMethodCd;
      this.paymentFieldIdsOnbasisOfPaymentMethod(paymentMethodCd);
    }
  }

  protected paymentMethodCd_change(item: FieldItem) {
    let paymentMethodCd = item.model.paymentMethodCd;
    this.paymentFieldIdsOnbasisOfPaymentMethod(paymentMethodCd);
    if (paymentMethodCd != 'CHEQUE') {
      item.model.micrNum = null;
      item.model.accountName = null;
      item.model.bankCd = null;
      item.model.bankBranch = null;
      item.model.instrumentDt = null;
    }
    if (paymentMethodCd == 'CASH' || paymentMethodCd == 'IPG') {
      item.model.inwardNum = null;
    }
  }

  protected paymentFieldIdsOnbasisOfPaymentMethod(paymentMethodCd: string) {
    if (paymentMethodCd == 'CHEQUE')
      this.fieldIds = 'micrNum,accountName,bankCd,bankBranch,instrumentDt,inwardNum,inwardAmount';
    else if (paymentMethodCd == 'CASH') this.fieldIds = 'inwardAmount';
    else if (paymentMethodCd == 'IPG') this.fieldIds = 'inwardAmount';
    else if (paymentMethodCd == 'ATM') this.fieldIds = 'inwardNum,inwardAmount';
  }
  private loadInitialPaymentDetailTab(loadInitially: boolean) {
    let tabIndex = 0;
    if (
      this.service.responseIO.data['InitialPayment']['InitialPaymentDetailsList'] != undefined &&
      this.service.responseIO.data['InitialPayment']['InitialPaymentDetailsList'].length != 0
    ) {
      this.paymentDetailTabList = [];
      this.service.responseIO.data['InitialPayment']['InitialPaymentDetailsList'].filter((paymentDetail) => {
        let tab = new TabItem();
        tab.id = 'initialPayment_' + tabIndex;
        tab.index = tabIndex;
        tab.text = 'Payment Method ' + (tabIndex + 1);
        this.paymentDetailTabList[tabIndex] = tab;

        if (paymentDetail.status == 'D' || paymentDetail.removed == 'YES') {
          tab.visible = false;
        }
        tabIndex++;
      });
      //this.selectedPartyDocumentTab = new TabItem();
      if (loadInitially) {
        this.paymentDetailTabList[0].isSelected = true;
        this.selectedPaymentDetailTab = this.paymentDetailTabList[0];
        let paymentMethodCd =
          this.service.responseIO.data['InitialPayment']['InitialPaymentDetailsList'][
            this.selectedPaymentDetailTab.index
          ].paymentMethodCd;
        this.paymentFieldIdsOnbasisOfPaymentMethod(paymentMethodCd);
      }
    }
  }

  public addInitialPaymentDetailsList(event) {
    let response: any;
    let body = {};
    this.service.addInitialPaymentDetailsList().subscribe(
      (body) => {
        response = JSON.parse(JSON.stringify(body));
        // console.log(response);
        let newInitialPayment = [];
        Array.prototype.push.apply(
          newInitialPayment,
          this.service.responseIO.data['InitialPayment']['InitialPaymentDetailsList']
        );
        newInitialPayment.push(response.data.InitialPayment);
        //need to change the entire array instance in order to reflect in the dom
        this.service.responseIO.data['InitialPayment']['InitialPaymentDetailsList'] = [];
        this.service.responseIO.data['InitialPayment']['InitialPaymentDetailsList'] = newInitialPayment;
        // console.log(
        //     this.service.responseIO.data['InitialPayment'][
        //         'InitialPaymentDetailsList'
        //     ]
        // );

        this.service.refreshMetaData(response);
        this.loadInitialPaymentDetailTab(false);
        this.paymentDetailTabList[this.paymentDetailTabList.length - 1].isSelected = true;
        this.selectedPaymentDetailTab = this.paymentDetailTabList[this.paymentDetailTabList.length - 1];
        let paymentMethodCd =
          this.service.responseIO.data['InitialPayment']['InitialPaymentDetailsList'][
            this.selectedPaymentDetailTab.index
          ].paymentMethodCd;
        this.paymentFieldIdsOnbasisOfPaymentMethod(paymentMethodCd);
        // console.log(this.responseIO);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  public onDeletePaymentDetail(tabItem) {
    //alert("delete supplementary " +index );
    this.confirm(this.service.getMultilingualMessage('deleteConfirmation', [tabItem.text]), () => {
      tabItem.visible = false;
      this.service.setDeleted(
        this.service.responseIO.data['InitialPayment']['InitialPaymentDetailsList'][tabItem.index]
      );
      this.selectedPaymentDetailTab = this.paymentDetailTabList[tabItem.index - 1];
    });
  }
}
