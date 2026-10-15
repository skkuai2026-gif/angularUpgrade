import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SettingService } from '../services/setting.service';
// declare const updatePageSCroll: any;

@Component({
  selector: 'sym-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PanelComponent implements OnInit {
  /**
   * This is used to set panel's id attribute.
   */
  @Input() id: string;

  /**
   * This set the header text on panel header.
   */
  @Input() name: string;

  /**
   * This adds additional text to the header text in panel
   */
  @Input() additionalInfo: string;

  /**
   * Input indicating the Panel should be collapsed during initialization
   */
  @Input() blockCollapse: boolean;

  /**
   * It expects boolean value.
   * If the panel displayed is inside another panel then this attribute needs to be set true.
   * Defualt value is false
   */
  @Input() isSubPanel: boolean;

  /**
   * It will hide the panel header but still show the content. Default value is false.
   */
  @Input() isHidden: boolean;
  /**
   * Output event when the panel is collapsed/expaneded
   * true - Collapsed, false - Expanded
   */
  @Output() panelCollapse = new EventEmitter<boolean>();

  constructor(public settingService: SettingService) {
    this.isHidden = false;
  }

  ngOnInit() {
    if (this.blockCollapse != true) this.blockCollapse = false;
  }

  ngOnChanges(changes: SimpleChanges) {}

  /**
   * @ignore
   */
  onPanelClick() {
    this.blockCollapse = !this.blockCollapse;
    this.panelCollapse.emit(this.blockCollapse);
    // setTimeout(() => {
    //   updatePageSCroll();
    // }, 5);
  }
}
