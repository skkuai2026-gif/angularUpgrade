export class MenuItem {
  code: string;
  description: string;
  action: string;
  imageSrc?: string;
  serviceType?: string;
  isChildSelected?: boolean;
  childList?: MenuItem[];
}
