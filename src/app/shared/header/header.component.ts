import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SecondIntoTimePipePipe } from '../../second-into-time-pipe.pipe';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CompanyService } from '../../company/company.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule,
    ButtonModule,
    SecondIntoTimePipePipe,
    ConfirmDialogModule,
    RouterLink,
    ToggleButtonModule,
    FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [ConfirmationService]
})
export class HeaderComponent implements OnInit {
  // @Output() drawerVisible = new EventEmitter<boolean>();

  constructor(public global: GlobalService, private companyService: CompanyService, private router: Router, private confirmationService: ConfirmationService, private http: HttpClient) {
  }
  ngOnInit(): void {
    this.authToggle = this.global.isAuthenticated();
    if (this.global.token.userTypeId == 2){
      this.getcompanylist();
    }
  }
  companyList: any[] = [];
  getcompanylist() {
    debugger
    var token = sessionStorage.getItem("token");
    var header = new HttpHeaders({
      "Authorization": "Bearer " + token
    })
    this.http.get(this.global.baseUrl + "api/Company", { headers: header }).subscribe((res: any) => {
      this.companyList = res.data;

    }, (error) => {
      console.log(error);

    })
  }
  authToggle: boolean = false;
  check(e: any) {
    console.log(e);
  }
  navbarActiveLink = "projects";
  navbarActiveLinks: { [key: string]: boolean } = {
    home: true,
    managements: false,
    click: false,
    portfolio: false,
    department: false
  };
  changedrawerVisibily() {
    console.log(this.global.drawerVisible);

    if (this.global.drawerVisible == true) {
      this.global.drawerVisible = false;
    } else {
      this.global.drawerVisible = true
    }
  }
  async authEvent(e: any): Promise<void> {



    const element = (e.target as HTMLInputElement);
    element.checked = false;

    e.preventDefault();
    if (await this.global.isAuthenticated()) {
      this.confirmationService.confirm({
        key: "authDialog",
        target: e.target,
        message: 'Are you sure you want to Logout?',
        header: 'Confirm Logout',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.global.logout();
        },
        // reject: () => {
        //   debugger
        //   console.log('Item not deleted');
        // }
      });
    } else {
      this.router.navigate(["/auth"]);
    }

  }
  changeActive(El: any) {
    try {
      let activelink = El.srcElement.dataset.link;
      console.log(El.target.dataset.link);

      Object.keys(this.navbarActiveLinks).forEach((link: string) => {
        if (link != activelink) {
          this.navbarActiveLinks[link] = false;
        } else {
          this.navbarActiveLinks[link] = true;
        }
      });
    } catch {
      console.log("Unknown element!!");
    }

  }
  setDrawerVisibility(visible: boolean) {
    this.global.drawerVisible = true;
  }
}
