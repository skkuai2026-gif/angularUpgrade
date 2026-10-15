import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';
import { FieldItem } from 'src/app/models/common/field-item';
import { NavigationLink } from 'src/app/models/common/navigation-link';
import { FnaQuestionDetailsComponent } from '../fna-question-details/fna-question-details.component';

@Component({
  selector: 'sym-fna-question-details-api',
  templateUrl: './fna-question-details-api.component.html',
  styleUrls: ['./fna-question-details-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaQuestionDetailsAPIComponent extends FnaQuestionDetailsComponent {
  constructor(csaService: CSASLGFIService) {
    super(csaService);
  }

  protected reasonForRecoCd_focus(item: FieldItem) {
    console.log('reasonForRecoCd', item.fieldCd);
    let newProdList = [];

    this.service.responseIO.data.FNARequestAdditionalAllList.filter((resp) => {
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

  public onAmountChanged() {
    let amountNeeded: any;
    let availableFund: any;
    let gap: any;

    this.service.responseIO.data.FNARequestAdditionalAllList.filter((priorities) => {
      amountNeeded = priorities.field11;
      availableFund = priorities.field12;
      if (amountNeeded != null && availableFund != null) {
        gap = amountNeeded - availableFund;
        console.log('gap', gap);
        this.service.setModelFieldValue(priorities, 'field13', gap);
      }
    });
  }

  public onDataFieldFocus(fieldItem: FieldItem) {
    console.log('focus on field3');
    if (fieldItem.fieldCd == 'field3') {
      let field1: any;
      let index = fieldItem.index;
      this.service.responseIO.data.FNARequestAdditionalAllList.filter((priorities, i) => {
        if (i == index) {
          field1 = priorities.field1;
        }
      });
      this.service.getCSAProductRecommendation(fieldItem, field1);
    }
  }
}
