import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollateralServiceService } from '../../service/collateral-service.service';
import { BreadCrumb } from './../../../models/common/bread-crumb';

@Component({
  selector: 'sym-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss', '../../assets/css/collateral_css.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FeaturesComponent implements OnInit {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private collateralServiceService: CollateralServiceService
  ) {}
  arrType: any[];
  public selectedModule;
  public selectedId;
  public thisType;
  public thisFeature;
  public breadCrumbList: BreadCrumb[];
  public breadCrumArray: any;

  ngOnInit() {
    this.selectedModule = this.activatedRoute.snapshot.paramMap.get('module_name');
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');
    var sType = this.selectedModule;
    var sId = this.selectedId;
    this.collateralServiceService.getJSON().subscribe((data) => {
      this.thisType = data.data.types.filter(function (item) {
        return item.id == sType;
      });

      this.thisFeature = this.thisType[0].sub_types.filter(function (item) {
        return item.id == sId;
      });
      this.arrType = this.thisFeature[0].features;

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
          link: '/collateral/sub_types/' + this.thisType[0].id,
        },
        {
          id: this.thisFeature[0].name,
        },
      ];
      this.breadCrumbList = this.getBreadCrumbList(this.breadCrumArray);
    });
  }

  protected getBreadCrumbList(bcArray): BreadCrumb[] {
    return bcArray;
  }
}
