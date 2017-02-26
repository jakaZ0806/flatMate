import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router,) { }

  ngOnInit() {

  }

  private logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
