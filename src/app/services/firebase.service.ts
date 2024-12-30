import { Injectable } from '@angular/core';
import { Firestore, collectionData, doc, setDoc, collection, query, where, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  // Cauta un document dintr-o anumita sesiune pe baza unui identificator unic al sesiunii respective
  async findDocumentIdByField(collectionName: string, field: string, value: string): Promise<string | null> {
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, where(field, '==', value));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id; 
    }

    return null; 
  } 
}