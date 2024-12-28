import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  Timestamp,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private firestore: Firestore) {}

  // Șterge sesiunile active ale utilizatorului
  async deleteActiveSessions(userId: string, restaurantId: string): Promise<void> {
    const sessionsRef = collection(this.firestore, 'sessions');
    const q = query(
      sessionsRef,
      where('createdBy', '==', userId),
      where('restaurantId', '==', restaurantId)
    );

    const querySnapshot = await getDocs(q);
    for (const document of querySnapshot.docs) {
      await deleteDoc(doc(this.firestore, 'sessions', document.id));
      console.log(`Sesiunea ${document.id} a fost ștearsă.`);
    }
  }

  // Creează o nouă sesiune
  async createNewSession(
    userId: string,
    restaurantId: string,
    tableId: number,
    isPublic: boolean,
    password: string | null = null,
    creatorUserName: string
  ): Promise<string> {
    const sessionsRef = collection(this.firestore, 'sessions');
    const sessionId = crypto.randomUUID()
    await addDoc(sessionsRef, {
      createdByUserName: creatorUserName,
      sessionId: sessionId,
      restaurantId,
      tableId,
      createdBy: userId,
      isPublic,
      isStarted: false,
      createdAt: Timestamp.now(),
      password: password
    });
    console.log('Noua sesiune a fost creată.');

    return sessionId;
  }

  async getSessionsByUserId(userId: string): Promise<any[]> {
    const sessions: any[] = [];
    try {
      // Referință către colecția 'sessions'
      const sessionsRef = collection(this.firestore, 'sessions');

      // Construim o interogare pentru a filtra sesiunile după userId
      const q = query(sessionsRef, where('createdBy', '==', userId));

      // Executăm interogarea
      const querySnapshot = await getDocs(q);

      // Parcurgem documentele returnate și le adăugăm într-un array
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });

      return sessions;
    } catch (error) {
      console.error('Error getting sessions by userId: ', error);
      throw error;
    }
  }


  //TOATE SESIUNILE DINTR-UN RESTAURANT CARE NU SUNT ALE USERULUI CONECTAT
  async getCurrentRestaurantSessions(userId: string, restaurantId: string): Promise<any[]> {
    const sessions: any[] = [];

    try{
      const sessionsRef = collection(this.firestore, 'sessions');

      const q = query(sessionsRef, where('createdBy', '!=', userId), where('restaurantId', '==', restaurantId));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });

      return sessions;

    }catch(error) {
      console.error('Error getting sessions by userId: ', error);
      throw error;
    }
  }


  //JOIN SESSION - UTILIZATORUL INTRA INTR-O SESIUNE EXISTENTA
  
  async getSessionInfoBySessionId(sessionId: string): Promise<any>{
    try{
      const sessionsRef = collection(this.firestore, 'sessions');

      const q = query(sessionsRef, where('sessionId', '==', sessionId));

      const querySnapshot = await getDocs(q);

      if(querySnapshot.empty)
        throw new Error('Sesiunea nu a fost găsită.');

      return querySnapshot.docs[0].data();

    }catch(err){
      console.log(err);
      throw err;
    }

  }
}
