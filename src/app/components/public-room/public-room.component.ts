import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionPlayersService } from '../../services/session-players.service';
import { SessionService } from '../../services/session.service';
import { Session } from '../../models/session';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserSession } from '../../models/global-user-model';



@Component({
  selector: 'app-public-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-room.component.html',
  styleUrl: './public-room.component.css'
})
export class PublicRoomComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private sessionPlayersService: SessionPlayersService, private sessionService: SessionService, private router: Router) { }

  sessionId: string | null = null;
  private participantsSubscription: Subscription | null = null;
  connectedUsers: any[] = [];
  sessionDetails: Session | null = null;
  currentUserId: string | null = null;
  private sessionSubscription!: Subscription;

  async ngOnInit() {
    debugger;
    if (!UserSession.isValidUser()) {
      UserSession.tempInitialize();
    }

    this.currentUserId = UserSession.userId;

    debugger;

    //1. Luam id-ul sesiunii
    this.sessionId = this.route.snapshot.paramMap.get('id');


    //2. Luam datele despre sesiunea la care se incearca conectarea
    if (this.sessionId == null || this.sessionId == undefined)
      // TO DO
      // Ar trebui sa punem un mesaj de eroare general. Un pop-up care sa trimita utilizatorul la pagina de home
      return;


    const sessionData = await this.sessionService.getSessionInfoBySessionId(this.sessionId);

    this.sessionDetails = new Session({
      sessionId: sessionData.sessionId,
      restaurantId: sessionData.restaurantId,
      tableId: sessionData.tableId,
      createdBy: sessionData.createdBy,
      createdByUserName: sessionData.createdByUserName,
      isPublic: sessionData.isPublic,
      isStarted: sessionData.isStarted,
      password: sessionData.password,
      createdAt: sessionData.createdAt,
    });

    if (this.sessionDetails.isStarted)
      // TO DO
      // Ar trebui sa punem un mesaj de eroare ca sesiunea este deja inceputa. Un pop-up care sa trimita utilizatorul la pagina de home
      return;


    //3. Subscribe cu lista de jucatori la modificarile care apar in sesiune
    this.listenToParticipantsChanges(this.sessionId);


    //4. Subscribe la schimbarile sesiunii pentru a stii utilizaorii cand a inceput sesiunea
    this.listenToSessionChanges(this.sessionId);
  }


  async startGame() {
    debugger;
    if (!this.sessionDetails) return;

    try {
      // Logică pentru a marca sesiunea ca "started"
      await this.sessionService.startSession(this.sessionDetails.sessionId, { isStarted: true });


      console.log('Jocul a început!');
      // Afișează un mesaj sau redirecționează utilizatorii
    } catch (error) {
      console.error('Eroare la pornirea jocului:', error);
    }
  }

  ngOnDestroy() {
    // Dezabonare de la stream-ul de date
    if (this.participantsSubscription)
      this.participantsSubscription.unsubscribe();
  }

  private listenToSessionChanges(sessionId: string) {
    this.sessionSubscription = this.sessionService
      .listenToSessionChanges(sessionId!)
      .subscribe({
        next: (sessionData) => {
          if (sessionData.isStarted) {
            this.router.navigate(['/game-category', sessionId]);
          }
        },
        error: (error) => {
          console.error('Eroare la ascultarea sesiunii:', error);
        },
      });
  }

  private listenToParticipantsChanges(sessionId: string) {
    this.participantsSubscription = this.sessionPlayersService.getRealtimeParticipantsBySessionId(sessionId)
      .subscribe((users) => {
        this.connectedUsers = users;
      });
  }
}
