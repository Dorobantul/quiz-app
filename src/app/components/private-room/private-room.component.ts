import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Session } from '../../models/session';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { SessionPlayersService } from '../../services/session-players.service';


@Component({
  selector: 'app-private-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './private-room.component.html',
  styleUrl: './private-room.component.css'
})
export class PrivateRoomComponent implements OnInit {

  constructor(private route: ActivatedRoute, private sessionService: SessionService, private sessionPlayersService: SessionPlayersService) { }

  async ngOnInit() {
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



    if(this.sessionDetails.isStarted)
      // TO DO
      // Ar trebui sa punem un mesaj de eroare ca sesiunea este deja inceputa. Un pop-up care sa trimita utilizatorul la pagina de home
      return;


    this.subscription = this.sessionPlayersService.getRealtimeParticipantsBySessionId(this.sessionId)
    .subscribe((users) => {
      this.connectedUsers = users;
    });
    

  }

  sessionId: string | null = null;
  private subscription: Subscription | null = null;
  connectedUsers: any[] = [];
  sessionDetails: Session | null = null;



}
