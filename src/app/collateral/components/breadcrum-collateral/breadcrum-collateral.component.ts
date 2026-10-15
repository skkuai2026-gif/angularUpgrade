import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { BreadCrumb } from 'src/app/models/common/bread-crumb';

@Component({
  selector: 'sym-breadcrum-collateral',
  templateUrl: './breadcrum-collateral.component.html',
  styleUrls: ['./breadcrum-collateral.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BreadcrumCollateralComponent implements OnInit {
  @Input() breadCrumbList: BreadCrumb[];

  constructor() {}

  ngOnInit() {}
}
