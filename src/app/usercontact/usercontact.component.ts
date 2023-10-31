import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserContact } from '../share/usercontact.model';
import { UsercontactService } from '../share/usercontact.service';

@Component({
  selector: 'app-usercontact',
  templateUrl: './usercontact.component.html',
  styleUrls: ['./usercontact.component.css'],
})

export class UsercontactComponent implements OnInit {

  usercontacts: UserContact[] = [];
  usercont!: UserContact;

  constructor(private ucs: UsercontactService, private router: Router) {
  }

  editUserContact(usercontact: UserContact) {
    console.log(usercontact);
    localStorage.removeItem('editUserId');
    localStorage.setItem('editUserId', usercontact.id.toString());
    this.router.navigate(['edit']);
    // this.ucs.update(usercontact);
  }

  deleteUserContact(usercontact: UserContact) {
    console.log(usercontact);
    this.ucs.delete(usercontact);
  }

  ngOnInit() {
    console.log('usercontact:init');
    this.usercontacts = this.ucs.getall();
    console.log(this.usercontacts);
  }
}