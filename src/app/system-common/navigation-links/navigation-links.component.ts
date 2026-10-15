import { NavigationLink } from './../../models/common/navigation-link';
import { Component, Input, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from '../services/setting.service';
import { ResponseIO } from 'src/app/models/responseIO';
import { BaseService } from '../services/base.service';
declare const setScrollAndScreenHeight: any;

@Component({
  selector: 'sym-navigation-links',
  templateUrl: './navigation-links.component.html',
  styleUrls: ['./navigation-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NavigationLinksComponent implements OnInit {
  /**
   * It expects JSON Object of NavigationLink Which is rendered on the right side of the page
   * for navigating the panels displayed based on their headings
   */
  @Input() navigationLinkList: NavigationLink[];
  /**
   * This is a required Object for XML loading. It expects XML DOM format Object
   * e.g: This would be a HTMLCollection type.
   */
  @Input() xmlNavigationLinkList: any;
  /**
   * This is provided so that the current service is accesible to the component to reload or re-fresh the
   * search-list if list is updated.
   * e.g : QuotationService
   */
  @Input() service: BaseService;
  /**
   * It is required input. It is of type ResposeIO.
   *
   * It contains the value to be displayed in the UI.
   * @ResponseIO contains JSON Object of { data; metadata; lookups; validationerrors; }
   */
  @Input() responseIO: ResponseIO;

  /**
   * It expects product facet
   */
  @Input() productFacets: any;
  /**
   * It expects company facet
   */
  @Input() companyFacets: any;

  /**
   * it contain current index for XML
   */
  @Input() symIndex: number;

  activeIndex: number | null = null;

  constructor(public settingService: SettingService) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['navigationLinkList'] && changes['navigationLinkList'].currentValue) {
      if (!$(this).hasClass('mCustomScrollbar')) {
        setScrollAndScreenHeight();
      }
    }

    if (
      (changes['xmlNavigationLinkList'] && changes['xmlNavigationLinkList'].currentValue) ||
      (changes['responseIO'] && changes['responseIO'].currentValue) ||
      changes['symIndex']
    ) {
      if (this.navigationLinkList != undefined && this.navigationLinkList.length > 0) {
        this.navigationLinkList = [];
        for (let i = 0; i < this.xmlNavigationLinkList.children.length; i++) {
          /**
           * Removed available logic. since the order was not setting properly.
           * Now we have simply empty the list and reset it again
           */
          // let isAvailable = this.navigationLinkList.find(
          //   (nav: NavigationLink) =>
          //     nav != undefined && nav.link == this.xmlNavigationLinkList.children[i].getAttribute('linkId')
          // );
          // if (!isAvailable) this.setNavigationLink(this.xmlNavigationLinkList.children[i]);
          // let index = this.navigationLinkList.findIndex(
          //   (nav: NavigationLink) =>
          //     nav != undefined && nav.link == this.xmlNavigationLinkList.children[i].getAttribute('linkId')
          // );
          // if (isAvailable)
          //   this.navigationLinkList[index] = this.setNavigationLink(this.xmlNavigationLinkList.children[i], true);
          this.setNavigationLink(this.xmlNavigationLinkList.children[i]);
        }
      } else {
        for (let i = 0; i < this.xmlNavigationLinkList.children.length; i++) {
          this.setNavigationLink(this.xmlNavigationLinkList.children[i]);
        }
        // console.log(this.navigationLinkList);
      }
      if (!$(this).hasClass('mCustomScrollbar')) {
        setScrollAndScreenHeight();
      }
    }
  }

  setNavigationLink(newNav: any) {
    let isFeatureApplicableChild = true;
    let expStr =
      this.symIndex != undefined && newNav.getAttribute('symIf') != undefined
        ? newNav.getAttribute('symIf').replaceAll('symIndex', this.symIndex)
        : newNav.getAttribute('symIf');
    let exp = this.service.isApplicable(expStr, this.service.responseIO, this.productFacets, this.companyFacets);
    if (newNav.getAttribute('feature') != undefined) {
      isFeatureApplicableChild = this.service.checkFeatureIsApplicable(newNav.getAttribute('feature'));
    }

    if ((exp === true || exp == undefined) && isFeatureApplicableChild) {
      let nav = new NavigationLink();
      nav.link = newNav.getAttribute('linkId');
      nav.labelKey = newNav.getAttribute('linkName');
      if (this.navigationLinkList == undefined) this.navigationLinkList = [];
      // if (isAvailable != undefined && isAvailable) return nav;
      this.navigationLinkList.push(nav);
    }
  }

  setActive(index: number): void {
    this.activeIndex = index;
  }
}
