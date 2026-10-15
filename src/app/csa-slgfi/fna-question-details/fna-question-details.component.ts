import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { FieldItem } from 'src/app/models/common/field-item';
import { NavigationLink } from 'src/app/models/common/navigation-link';

@Component({
  selector: 'sym-fna-question-details',
  templateUrl: './fna-question-details.component.html',
  styleUrls: ['./fna-question-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaQuestionDetailsComponent extends BaseComponent<CSASLGFIService> implements OnChanges {
  navigationLinkList: NavigationLink[];
  public model: any;
  constructor(csaService: CSASLGFIService) {
    super(csaService);
  }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes');
    if (changes['model'] && changes['model'].currentValue) {
      console.log('amount changed');
    }
    super.ngOnChanges(changes);
  }

  protected reasonForRecoCd_focus(item: FieldItem) {
    console.log('reasonForRecoCd', item.fieldCd);
    let newProdList = [];

    this.service.responseIO.data.FNARequestAdditionalPriorityList.filter((resp) => {
      console.log('resp', resp.field3);
      if (resp.field3 != undefined && resp.field3 != null) {
        if (
          !newProdList.some(
            (product) =>
              product.cd === resp.field3 || product.desc === this.service.getFieldLookupDesc(resp, 'field3')
          )
        ) {
          var productRecommended = new Object(); //
          productRecommended['cd'] = resp.field3;
          productRecommended['desc'] = this.service.getFieldLookupDesc(resp, 'field3');
          newProdList.push(productRecommended);
        }
      }
      console.log('productRecommended', newProdList);
    });

    let respOccupationCd: any;
    respOccupationCd = JSON.parse(JSON.stringify(newProdList));
    console.log('respOccupationCd', newProdList.length);
    this.service.setItemOptions(item, respOccupationCd, false);
  }
  // protected onAmountChange(item: FieldItem){
  //   console.log("amount changed",item);
  // }

  public onAmountChanged() {
    let amountNeeded: any;
    let availableFund: any;
    let gap: any;

    this.service.responseIO.data.FNARequestAdditionalPriorityList.filter((priorities) => {
      amountNeeded = priorities.field11;
      availableFund = priorities.field12;
      if (amountNeeded != null && availableFund != null) {
        gap = amountNeeded - availableFund;
        console.log('gap', gap);
        this.service.setModelFieldValue(priorities, 'field13', gap);
      }
    });
  }

  public field11_change() {
    this.onAmountChanged();
  }

  public field12_change() {
    this.onAmountChanged();
  }

  public field3_change() {
    this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'proposerLASame', 'YES');

    this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'addtnfield3str', 'YES');
    console.log('this.service.responseIO.data.Entity', this.service.responseIO.data.Entity.addtnfield3str);

    this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'reasonForRecoCd', null);
  }

  public onDataFieldFocus(fieldItem: FieldItem) {
    console.log('focus on field3');
    if (fieldItem.fieldCd == 'field3') {
      let field1: any;
      let index = fieldItem.index;
      this.service.responseIO.data.FNARequestAdditionalPriorityList.filter((priorities, i) => {
        if (i == index) {
          field1 = priorities.field1;
        }
      });
      this.service.getCSAProductRecommendation(fieldItem, field1);
    }
  }
}
