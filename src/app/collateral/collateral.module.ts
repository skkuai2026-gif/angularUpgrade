import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollateralRoutingModule } from './collateral-routing.module';
import { TypesComponent } from './components/types/types.component';
import { SubTypesComponent } from './components/sub-types/sub-types.component';
import { FeaturesComponent } from './components/features/features.component';
import { SystemCommonModule } from '../system-common/system-common.module';
import { CollateralServiceService } from './service/collateral-service.service';
import { DetailsComponent } from './components/details/details.component';
import { BreadcrumCollateralComponent } from './components/breadcrum-collateral/breadcrum-collateral.component';

@NgModule({
  declarations: [
    TypesComponent,
    SubTypesComponent,
    FeaturesComponent,
    DetailsComponent,
    BreadcrumCollateralComponent,
  ],
  imports: [CommonModule, CollateralRoutingModule, SystemCommonModule],
  providers: [CollateralServiceService],
})
export class CollateralModule {}
