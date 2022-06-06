import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { v4 as uuidv4 } from 'uuid';
import * as CryptoJS from 'crypto-js';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private usersCollection: AngularFirestoreCollection<Usuario>;
  users: Observable<Usuario[]>;
  usersSuscribe!: Subscription;
  id: string;
  user: string;
  userLogin: string;
  passLogin: string;

  constructor(
    private storage: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.id = '';
    this.user = '';
    this.userLogin = '';
    this.passLogin = '';
    this.usersCollection = storage.collection<Usuario>('usuarios');
    this.users = this.usersCollection
      .valueChanges(['added', 'removed'])
      .pipe(distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)));
  }

  ngOnInit(): void {
    this.usersSuscribe = this.users.subscribe({
      next: (users) => {
        console.log('datos');
        console.log(users);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getData(): void {
    const query = this.usersCollection.ref.where('user', '==', this.user);
    query.get().then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('no hay datos');
      } else {
        // console.log(querySnapshot.docs.values());
        querySnapshot.forEach((documentSnapshot) => {
          console.log(documentSnapshot.data());
        });
      }
    });

    // this.usersCollection.snapshotChanges().subscribe({
    //   next: (data) => {
    //     data.forEach((doc) => {
    //       console.log(doc.payload.doc.data());
    //     });
    //   },
    // });
  }

  ngOnDestroy(): void {
    this.usersSuscribe.unsubscribe();
  }

  addUser(): void {
    // Guardar información cuando necesitamos controlar el ID
    // const id = this.storage.createId();
    const id = uuidv4();
    this.usersCollection
      .doc(id)
      .set({
        id: id,
        user: this.user,
        password: 'test',
        email: 'test@example.com',
      })
      .then(() => {
        console.log('Documento creado');
      });

    // Agregar información cuando no necesitamos controlar el ID
    // this.usersCollection.add({
    //   id: this.id,
    //   user: this.user,
    //   password: 'test',
    //   email: 'test@example.com',
    // });
  }

  updateUser(): void {
    this.usersCollection.doc(this.id).update({
      user: this.user,
    });
  }

  deleteUser(): void {
    this.usersCollection.doc(this.id).delete();
  }

  login(): void {
    this.passLogin = CryptoJS.SHA512(this.passLogin).toString();
    this.afAuth
      .signInWithEmailAndPassword(this.userLogin, this.passLogin)
      .then((result) => {
        console.log('emailVerified: ', result.user?.emailVerified);
        if (result.user?.emailVerified === false) {
          this.afAuth.signOut();
        } else {
          // Obtener el token JWT para enviar al backend
          this.afAuth.currentUser.then((user) => {
            user?.getIdToken().then((token) => {
              console.log('TOKEN LOGIN :', token);
            });
          });
          // redirecciono a la página que pide seguridad
          this.router.navigateByUrl('/seguro');
        }
      });
  }

  create(): void {
    this.passLogin = CryptoJS.SHA512(this.passLogin).toString();
    this.afAuth
      .createUserWithEmailAndPassword(this.userLogin, this.passLogin)
      .then((result) => {
        console.log(result);

        // ---------
        this.afAuth.currentUser
          .then((user) => {
            user
              ?.sendEmailVerification()
              ?.then(() => {
                console.log('email sent');
              })
              ?.catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
        // ---------
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
