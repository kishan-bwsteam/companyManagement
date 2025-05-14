import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { Role } from "../../models/role.model";
import { RoleService } from "../../services/role.service";
import { GlobalService } from "../../services/global.service";

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule, ToastModule],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  providers: [MessageService]
})
export class RoleComponent {
  rolesform: FormGroup;
  submitted = false;
  RoleID = 0;
  editmode = false;
  userID: any;
  RoleVM: Role = new Role();
f: any;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private global: GlobalService,
    private roleService: RoleService
  ) {
    this.rolesform = this.fb.group({
      RoleID: [0],
      RoleName: ['', Validators.required],
      RoleLevel: ['', Validators.required],
      Abbreviation: ['', Validators.required]
    });
  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    debugger
    if (params['roleId']) {
      this.RoleID = +params['roleId'];
      if (this.RoleID != 0){
        this.editmode = true;
        this.GetSingleRole(this.RoleID);
      }
    }
    this.userID = this.global.token.userId;
  }

  OnSubmit() {
    debugger
    this.submitted = true;
    if (this.rolesform.invalid) return;

    const formValue = {
      ...this.rolesform.value,
      RoleID: this.RoleID,
      userid: Number(this.userID)
    };

    this.RoleVM = formValue;

    this.roleService.upsert(this.RoleVM).subscribe((res: any) => {
      if (res.status == 200) {
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message
        });
        setTimeout(() => {
          this.router.navigateByUrl('/roleTable');
        }, 1000);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: res.message
        });
      }
    });
  }

  GetSingleRole(RoleID: number) {
    this.roleService.getSingle(RoleID).subscribe((res: any) => {
      if (res.status == 200 && res.rModel) {
        this.editmode = true;
        this.rolesform.patchValue({
          RoleID: res.rModel.roleID,
          RoleName: res.rModel.roleName,
          Abbreviation: res.rModel.abbreviation,
          RoleLevel: res.rModel.roleLevel
        });
      }
    });
  }
}
