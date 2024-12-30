import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Session } from '../../models/session';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { SessionPlayersService } from '../../services/session-players.service';
import { UserSession } from '../../models/global-user-model';


@Component({
  selector: 'app-private-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './private-room.component.html',
  styleUrl: './private-room.component.css'
})
export class PrivateRoomComponent implements OnInit, OnDestroy {

  sessionId: string | null = null;
  private participantsSubscription: Subscription | null = null;
  connectedUsers: any[] = [];
  sessionDetails: Session | null = null;
  currentUserId = UserSession.userId;
  private sessionSubscription!: Subscription;



  constructor(private route: ActivatedRoute, private sessionService: SessionService, private sessionPlayersService: SessionPlayersService, private router: Router) { }

  async ngOnInit() {

    if (!UserSession.isValidUser()) {
      UserSession.tempInitialize();
    }

    this.sessionId = this.route.snapshot.paramMap.get('id');

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


  ngOnDestroy() {
    if (this.participantsSubscription)
      this.participantsSubscription.unsubscribe();

    if (this.sessionSubscription)
      this.sessionSubscription.unsubscribe();
  }

  async startGame() {
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

  private listenToParticipantsChanges(sessionId: string) {
    this.participantsSubscription = this.sessionPlayersService.getRealtimeParticipantsBySessionId(sessionId)
      .subscribe((users) => {
        this.connectedUsers = users;
      });
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
}
