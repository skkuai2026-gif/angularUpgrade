import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollateralProductMainComponent } from './collateral-product-main/collateral-product-main.component';
import { CollateralProductRoutingModule } from './collateral-product-routing.module';
import { FormsModule } from '@angular/forms';
import { SystemCommonModule } from '../system-common/system-common.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BusinessCommonModule } from '../business-common/business-common.module';
import { CollateralProductService } from './services/collateral-product.service';

@NgModule({
  declarations: [CollateralProductMainComponent],
  imports: [
    CommonModule,
    FormsModule,
    SystemCommonModule,
    CollateralProductRoutingModule,
    // ModalModule.forRoot(),
    BusinessCommonModule,
  ],
  exports: [CollateralProductMainComponent],
  providers: [CollateralProductService],
})
export class CollateralProductModule {}
