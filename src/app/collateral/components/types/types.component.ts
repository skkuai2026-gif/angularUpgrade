import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CollateralServiceService } from '../../service/collateral-service.service';

import { BreadCrumb } from './../../../models/common/bread-crumb';

@Component({
  selector: 'sym-types',
  templateUrl: './types.component.html',
  styleUrls: ['../../assets/css/collateral_css.css', './types.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TypesComponent implements OnInit {
  constructor(private collateralServiceService: CollateralServiceService) {}
  arrType: any[];
  public breadCrumbList: BreadCrumb[];
  ngOnInit() {
    this.breadCrumbList = this.getBreadCrumbList();
    this.collateralServiceService.getJSON().subscribe((data) => {
      this.arrType = data.data.types;
    });
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'Home',
        link: '/home',
      },
      {
        id: 'Collateral',
      },
    ];
  }
}
