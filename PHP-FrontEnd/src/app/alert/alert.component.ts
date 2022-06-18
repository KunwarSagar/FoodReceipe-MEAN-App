import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input()
  alert_type!:string;
  @Input()
  alert_message!:string;

  constructor() { }

  ngOnInit(): void {
  }

}
