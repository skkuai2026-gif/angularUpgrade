import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { TypesComponent } from './components/types/types.component';
import { SubTypesComponent } from './components/sub-types/sub-types.component';
import { FeaturesComponent } from './components/features/features.component';
import { DetailsComponent } from './components/details/details.component';

const routes: Routes = [
  {
    path: 'collateral',
    component: TypesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'collateral/sub_types',
    children: [
      {
        path: ':id',
        component: SubTypesComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'collateral/features',
    children: [
      {
        path: ':module_name/:id',
        component: FeaturesComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'collateral/details',
    children: [
      {
        path: ':module_name/:feature/:id',
        component: DetailsComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollateralRoutingModule {}
