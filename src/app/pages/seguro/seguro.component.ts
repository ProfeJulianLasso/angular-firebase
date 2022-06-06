import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seguro',
  templateUrl: './seguro.component.html',
  styleUrls: ['./seguro.component.css'],
})
export class SeguroComponent implements OnInit {
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    // Obtener el token JWT para enviar al backend
    this.afAuth.currentUser.then((user) => {
      user?.getIdToken().then((token) => {
        console.log(token);
      });
    });
  }

  ngOnInit(): void {}

  logout(): void {
    this.afAuth.signOut().then((response) => {
      this.router.navigateByUrl('/');
    });
  }
}
