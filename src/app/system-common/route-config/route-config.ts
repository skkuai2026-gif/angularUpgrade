import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class RouteConfig implements RouteReuseStrategy {
  /** Determines if a route should be reused */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Always return false to force the component reload even for the same route.
    return future.routeConfig === curr.routeConfig ? false : true;
  }

  /** Determines if this route (and its subtree) should be detached to be reused later */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  /**
   * Stores the detached route.
   * Storing a `null` value should erase the previously stored value.
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {}

  /** Determines if this route (and its subtree) should be reattached */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  /** Retrieves the previously stored route */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }
}
