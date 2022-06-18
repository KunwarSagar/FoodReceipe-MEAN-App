import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  @ViewChild('searchForm')
  searchForm!:NgForm;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  /**
   * search based on the given search string
   */
  search():void{
    const searchString = this.searchForm.value.searchQuery;
    this.router.navigate(["foods"], {queryParams:{'searchString':searchString}});
  }
}
