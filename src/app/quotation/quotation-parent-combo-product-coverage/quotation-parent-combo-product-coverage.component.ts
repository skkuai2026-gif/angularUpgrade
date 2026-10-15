import { TabItem } from './../../models/common/tab-items';
import { QuotationService } from './../services/quotation.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { Component, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sym-quotation-parent-combo-product-coverage',
  templateUrl: './quotation-parent-combo-product-coverage.component.html',
  styleUrls: ['./quotation-parent-combo-product-coverage.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationParentComboProductCoverageComponent
  extends BaseComponent<QuotationService>
  implements OnChanges
{
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }

  idList: string[] = [];
  childQuoteTabList: TabItem[];
  selectedChildQuoteTab: TabItem;
  @Input() isDataSaved: boolean;
  @Output() notifyChildComboChange = new EventEmitter<QuotationService>();

  ngOnInit() {
    this.loadChildQuoteTab();
  }

  private loadChildQuoteTab() {
    let ids = this.service.responseIO.data.Entity.childQuoteReference;
    JSON.parse(ids).forEach((childQuoteReference) => {
      this.idList.push(childQuoteReference['quotationSeq']);
    });

    this.childQuoteTabList = [];
    this.idList.filter((id, index) => {
      let tab = new TabItem();
      //    tab.text = this.service.getMultilingualLabel('Quote') + id;
      tab.text = this.service.getMultilingualLabel('Product') + ' ' + (index + 1);
      tab.isSelected = false;
      tab.id = id;
      this.childQuoteTabList.push(tab);
    });

    if (this.childQuoteTabList.length > 0) {
      this.childQuoteTabList[0].isSelected = true;
      this.selectedChildQuoteTab = this.childQuoteTabList[0];
    }
  }

  setTab(tab: TabItem) {
    this.selectedChildQuoteTab = tab;
  }

  onChildComboChange(childQuotationService) {
    this.notifyChildComboChange.emit(childQuotationService);
    //console.log('Parent combo ', childQuotationService);
  }
}
