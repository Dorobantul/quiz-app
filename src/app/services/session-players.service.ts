import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, Timestamp, addDoc, onSnapshot, writeBatch } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class SessionPlayersService {
  constructor(private firestore: Firestore) { }

  getRealtimeParticipantsBySessionId(sessionId: string): Observable<any[]> {
    return new Observable((observer) => {
      const sessionPlayersRef = collection(this.firestore, 'session_players');
      const q = query(sessionPlayersRef, where('sessionId', '==', sessionId));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const participants: any[] = [];
        querySnapshot.forEach((doc) => {
          participants.push({ id: doc.id, ...doc.data() });
        });
        observer.next(participants);
      });

      return () => unsubscribe();
    });
  }

  //TO DO
  // Sterge metoda daca nu are nicio referinta
  async getConnectedUsersToSession(sessionId: string) {
    const connectedUsers: any[] = [];
    try {

      const sessionPlayersRef = collection(this.firestore, 'session_players');

      const q = query(
        sessionPlayersRef,
        where('sessionId', '==', sessionId)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        connectedUsers.push({ id: doc.id, ...doc.data() });
      });

      return connectedUsers;

    } catch (error) {
      console.error('Eroare la eliminarea jucătorului din sesiune:', error);
      throw error;
    }
  }

  async removePlayerFromExistingSessions(userId: string) {
    try {
      const sessionPlayersRef = collection(this.firestore, 'session_players');

      // Creează o interogare pentru a găsi documentele corespunzătoare
      const q = query(
        sessionPlayersRef,
        where('playerId', '==', userId)
      );

      // Obține documentele din interogare
      const querySnapshot = await getDocs(q);

      // Șterge fiecare document găsit
      const batch = writeBatch(this.firestore);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Commit la batch pentru a șterge toate documentele
      await batch.commit();
      console.log(`Jucătorul cu ID-ul ${userId}`);
    } catch (error) {
      console.error('Eroare la eliminarea jucătorului din sesiune:', error);
      throw error;
    }
  }


  async removePlayerFromOtherSessions(userId: string, sessionId: string) {
    try {
      const sessionPlayersRef = collection(this.firestore, 'session_players');

      const q = query(
        sessionPlayersRef,
        where('playerId', '==', userId),
        where('sessionId', '!=', sessionId)
      );

      const querySnapshot = await getDocs(q);

      const batch = writeBatch(this.firestore);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Jucătorul cu ID-ul ${userId} a fost sters din toate sesiunile, mai putin ${sessionId}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async addPlayerToSession(sessionId: string, playerId: string, nickname: string): Promise<void> {
    try {
      const sessionPlayersRef = collection(this.firestore, 'session_players');

      // Verificăm dacă utilizatorul este deja participant
      const q = query(
        sessionPlayersRef,
        where('sessionId', '==', sessionId),
        where('playerId', '==', playerId)
      );

      const existingPlayer = await getDocs(q);

      if (!existingPlayer.empty) {
        console.log('Jucătorul este deja participant în sesiune.');
        return;
      }

      // Adăugăm jucătorul în sesiune
      await addDoc(sessionPlayersRef, {
        sessionId,
        playerId,
        nickname,
        joinedAt: Timestamp.now(),
      });

      console.log('Jucătorul a fost adăugat în sesiune.');
    } catch (error) {
      console.error('Eroare la adăugarea jucătorului în sesiune:', error);
      throw error;
    }
  }

}