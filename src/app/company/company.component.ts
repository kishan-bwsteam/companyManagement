import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CompanyService } from './company.service';

@Component({
  selector: 'app-company',
  imports: [RouterOutlet],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements AfterContentChecked{
  constructor(private activeRoute: ActivatedRoute, private company:CompanyService){}

  ngAfterContentChecked(): void {
    
    // this.activeRoute.paramMap.subscribe(params => {
    //   console.log(params.keys);
    // });
    // let id = this.activeRoute.snapshot.paramMap.get("companyId");
    // if (id == null || id == undefined) return;
    // this.company.companyId = parseInt(id);
  }

}
