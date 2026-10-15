import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollateralServiceService } from '../../service/collateral-service.service';

import { BreadCrumb } from './../../../models/common/bread-crumb';

@Component({
  selector: 'sym-sub-types',
  templateUrl: './sub-types.component.html',
  styleUrls: ['./sub-types.component.scss', '../../assets/css/collateral_css.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SubTypesComponent implements OnInit {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private collateralServiceService: CollateralServiceService
  ) {}
  arrType: any[];

  public selectedId;
  public thisType;
  public breadCrumbList: BreadCrumb[];
  public breadCrumArray: any;
  ngOnInit() {
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');
    var sId = this.selectedId;
    this.collateralServiceService.getJSON().subscribe((data) => {
      this.thisType = data.data.types.filter(function (item) {
        return item.id == sId;
      });

      this.arrType = this.thisType[0].sub_types;
      this.breadCrumArray = [
        {
          id: 'Home',
          link: '/home',
        },
        {
          id: 'Collateral',
          link: '/collateral',
        },
        {
          id: this.thisType[0].name,
        },
      ];
      this.breadCrumbList = this.getBreadCrumbList(this.breadCrumArray);
    });
  }

  protected getBreadCrumbList(bcArray): BreadCrumb[] {
    return bcArray;
  }
}
