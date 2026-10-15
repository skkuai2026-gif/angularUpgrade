import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { ProductSelectionHandlerComponent } from './product-selection.handler';
import data from '../../../assets/config/url-config.json';

@Component({
  selector: 'sym-product-selection',
  templateUrl: './product-selection.component.html',
  styleUrls: ['./product-selection.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProductSelectionComponent extends ProductSelectionHandlerComponent {
  companySUNPH: any;
  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService, settingService);
  }
  ngAfterViewInit() {
    let url = data;
    this.companySUNPH = url[1]?.companySUNPH;
  }
  isNoLaunchedProduct(): boolean {
    if (!this.respApplicableProducts?.productFamilyList?.length) {
      return false;
    }

    return this.respApplicableProducts.productFamilyList.every((family) => {
      const products = this.respApplicableProducts.productList?.[family.cd];
      return !products || products.length === 0;
    });
  }
}
