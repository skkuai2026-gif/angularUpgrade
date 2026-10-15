import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { CollateralProductMainComponent } from './collateral-product-main/collateral-product-main.component';

const routes: Routes = [
  {
    path: 'collateral-product',
    component: CollateralProductMainComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollateralProductRoutingModule {}
