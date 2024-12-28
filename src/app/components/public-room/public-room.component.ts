import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionPlayersService } from '../../services/session-players.service';
import { SessionService } from '../../services/session.service';
import { Session } from '../../models/session';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-public-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-room.component.html',
  styleUrl: './public-room.component.css'
})
export class PublicRoomComponent implements OnInit, OnDestroy{

  constructor(private route: ActivatedRoute, private sessionPlayersService: SessionPlayersService, private sessionService: SessionService){}

  sessionId: string | null = null;
  private subscription: Subscription | null = null;
  connectedUsers: any[] = [];
  sessionDetails: Session | null = null;

  async ngOnInit() {
    
    //1. Luam id-ul sesiunii
    this.sessionId = this.route.snapshot.paramMap.get('id');


    //2. Luam datele despre sesiunea la care se incearca conectarea
    if(this.sessionId == null || this.sessionId == undefined)
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

    if(this.sessionDetails.isStarted)
      // TO DO
      // Ar trebui sa punem un mesaj de eroare ca sesiunea este deja inceputa. Un pop-up care sa trimita utilizatorul la pagina de home
      return;


    //3. Subscribe cu lista de jucatori la modificarile care apar in sesiune
    this.subscription = this.sessionPlayersService.getRealtimeParticipantsBySessionId(this.sessionId)
    .subscribe((users) => {
      this.connectedUsers = users;
    });
  }

  ngOnDestroy() {
    // Dezabonare de la stream-ul de date
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
