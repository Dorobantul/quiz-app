import { Injectable } from '@angular/core';
import { Firestore, collectionData, doc, setDoc, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  //Aici va fi service-ul care comunica cu baza de date


  // Adaugă o sesiune nouă
  // addSession(session: any) {
  //   const sessionRef = doc(collection(this.firestore, 'sessions'));
  //   return setDoc(sessionRef, session);
  // }

  // Obține sesiunile existente
  // getSessions(): Observable<any[]> {
  //   const sessionsRef = collection(this.firestore, 'sessions');
  //   return collectionData(sessionsRef, { idField: 'id' });
  // }
}