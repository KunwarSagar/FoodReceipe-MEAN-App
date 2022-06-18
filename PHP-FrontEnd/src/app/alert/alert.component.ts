import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  alertTypes:any = [
    "success",
    "danger",
    "warning",
    "info"
  ]
  type!:string;

  constructor() { }

  ngOnInit(): void {
  }

}
