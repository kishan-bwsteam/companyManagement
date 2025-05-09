import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private router:Router,private global:GlobalService) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    let adminUrls = ["report","employee"]
    
    if (this.global.isAuthenticated()) {
      if (adminUrls.some((p) =>{
        if (childRoute.routeConfig?.path){
          return p == childRoute.routeConfig?.path;
        }return false;
      })){
        if(this.global.isAdmin()){
          return true;
        }else{
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.global.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
