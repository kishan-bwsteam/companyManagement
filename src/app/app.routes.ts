import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuardService } from './services/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { LeaveComponent } from './leave-management/leave.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateAdminComponent } from './SuperAdmin/create-admin/create-admin.component';
import { CompanyEmployeeTableComponent } from './admin/company-employee-table/company-employee-table.component';
import { CompanyTableComponent } from './admin/company-table/company-table.component';
import { DepartmentTableComponent } from './company/department-table/department-table.component';
import { PositionTableComponent } from './company/position-table/position-table.component';
import { CompanyComponent } from './company/company.component';
import { DepartmentUpsertComponent } from './company/department-upsert/department-upsert.component';
import { PositionUpsertComponent } from './company/position-upsert/position-upsert.component';
import { CompanyUpsertComponent } from './admin/company-upsert/company-upsert.component';
import { CompanyEmployeeUpsertComponent } from './admin/company-employee-upsert/company-employee-upsert.component';
import { RoleDetailComponent } from './admin/role/role-detail/role-detail.component';
import { RoleComponent } from './admin/role/role.component';
import { AdminUserComponent } from './admin/admin-user/admin-user.component';
import { AdminUserDetailsComponent } from './admin/admin-user/admin-user-details/admin-user-details.component';
import { LeaveRequestsComponent } from './admin/leave-requests/leave-requests.component';
import { HolidayUpsertComponent } from './company/holiday-upsert/holiday-upsert.component';
import { HolidayTableComponent } from './company/holiday-table/holiday-table.component';
import { HolidaysComponent } from './employee/holidays/holidays.component';
export const routes: Routes = [
    {
        path: "createAdmin/:id",
        component: CreateAdminComponent,
        canActivate: [AuthGuardService]
    },

    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuardService],
        canActivateChild: [AuthGuardService]
    },
    {
        path: 'leave',
        component: LeaveComponent,
        canActivate: [AuthGuardService],
    },
      {
        path: 'holidays',
        component: HolidaysComponent,
        canActivate: [AuthGuardService],
    },

    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'roleTable',
        component: RoleDetailComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'roleTable/:roleId',
        component: RoleComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'companyTable',
        component: CompanyTableComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'companyTable/:id',
        component: CompanyUpsertComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'leaveRequest',
        component: LeaveRequestsComponent,
        canActivate: [AuthGuardService],
    },

    
    {
        path: 'company/:companyId',
        component: CompanyComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: 'adminUserTable',
                component: AdminUserDetailsComponent,
                canActivate: [AuthGuardService],
            }, {
                path: 'adminUserTable/:userId',
                component: AdminUserComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: "employeeTable",
                component: CompanyEmployeeTableComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: "employeeTable/:empId",
                component: CompanyEmployeeUpsertComponent,
                canActivate: [AuthGuardService]
            },

            {
                path: 'departmentTable',
                component: DepartmentTableComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'positionTable',
                component: PositionTableComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'departmentTable/:depId',
                component: DepartmentUpsertComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'positionTable/:posId',
                component: PositionUpsertComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'holidayTable',
                component: HolidayTableComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'holidayTable/:holiId',
                component: HolidayUpsertComponent,
                canActivate: [AuthGuardService],
            },
            
        ]
    },

    {
        path: 'company/department',
        component: DepartmentTableComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'company/postion',
        component: PositionTableComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'auth',
        component: AuthComponent
    },
    {
        path: "unauthorized",
        component: UnauthorizedComponent
    },
    {
        path: "not-found",
        component: NotFoundComponent
    },
    { path: '**', redirectTo: 'not-found' }
];
