import { AfterContentChecked, Component, Input, Output, ViewChild } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer';
import { SliderModule } from 'primeng/slider';
import { GlobalService } from '../../services/global.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
@Component({
  selector: 'app-navigation-drawer',
  imports: [DrawerModule,
    CommonModule,
    SliderModule,
    DrawerModule,
    ButtonModule,
    AvatarModule,
    MatSidenavModule,
    ButtonModule,
    RouterLink],
  templateUrl: './navigation-drawer.component.html',
  styleUrl: './navigation-drawer.component.css'
})

export class NavigationDrawerComponent  {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: Event): void {
    this.drawerRef.close(e);
  }
  constructor(public global: GlobalService, public router: Router,private activeRoute: ActivatedRoute) {

   }

  changeDrawerVisibility() {
    if (this.drawerWidth == "50px") {
      this.drawerWidth = "200px";
    } else {
      this.drawerWidth = "50px";
    }
  }
  navigateCompanyChild(route:string){
    var url = this.router.url.split("/");
    var i = url.findIndex(ob => ob == "company");
    if (i < 0){
      return
    }
    this.router.navigate(["company",url[i+1],route]);
  }
  companyId = 0;
  drawerWidth = "200px";
  drawerActiveLink = "role";
  drawerActiveLinks: { [key: string]: boolean } = {
    profile: false,
    report: false,
    leave: false,
  };
  changeActive(El: any) {
    try {
      let activelink = El.srcElement.dataset.link;
      Object.keys(this.drawerActiveLinks).forEach((link: string) => {
        if (link != activelink) {
          this.drawerActiveLinks[link] = false;
        } else {
          this.drawerActiveLinks[link] = true;
        }
      });
      this.global.drawerVisible = false;
    } catch {
      console.log("Unknown element!!");
    }

  }
}
