import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UserSession } from '../../models/global-user-model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionPlayersService } from '../../services/session-players.service';

@Component({
  selector: 'app-select-game-type',
  templateUrl: './select-game-type.component.html',
  styleUrls: ['./select-game-type.component.css'],
  standalone: true,
  imports:[FormsModule, CommonModule]
})
export class SelectGameTypeComponent implements OnInit{

  ngOnInit(): void {
    debugger;
    console.log(UserSession);
  }

  showPasswordPopup: boolean = false; // Controlăm afișarea popup-ului
  password: string = ''; // Parola introdusă de utilizator

  constructor(private router: Router, private sessionService: SessionService, private sessionPlayersService: SessionPlayersService) {}


  async createPublicGame() {
   
    if(!UserSession.isValidUser()) {
      UserSession.tempInitialize();
    }
    
    //stergem toate sesiunile pe care le are utilizatorul conectat
    await this.sessionService.deleteActiveSessions(UserSession.userId, UserSession.restaurantId);

    //adaugam sesiunea curenta de joc
    const sessionId = await this.sessionService.createNewSession(UserSession.userId,UserSession.restaurantId,UserSession.tableId,true,null,UserSession.nickName);

    //stergem toate inregistrarile care pot exista intre userId si restul sesiunilor, pentru ca un jucator poate exista intr-o singura sesiune
    await this.sessionPlayersService.removePlayerFromExistingSessions(UserSession.userId)
    
    //adaugam jucatorul creator in sesiune
    await this.sessionPlayersService.addPlayerToSession(sessionId,UserSession.userId,UserSession.nickName);

    //mergem pe pagina de public/sessionId
    this.router.navigate(['/public', sessionId]);
  }

  showPrivateGamePopUp() {
    // Deschide popup-ul pentru introducerea parolei
    this.showPasswordPopup = true;
  }

  async createPrivateRoom() {
    
    if(!UserSession.isValidUser()) {
      UserSession.tempInitialize();
    }
    
    // Ștergem sesiunile active
    await this.sessionService.deleteActiveSessions(UserSession.userId, UserSession.restaurantId);

    // Adăugăm o nouă sesiune privată cu parola introdusă
    const sessionId = await this.sessionService.createNewSession(
      UserSession.userId,
      UserSession.restaurantId,
      UserSession.tableId,
      false,
      this.password,
      UserSession.nickName
    );

    // Ascundem popup-ul și navigăm către pagina dorită
    this.showPasswordPopup = false;
    this.router.navigate(['/private', sessionId]);
  }

  closePopup() {
    this.showPasswordPopup = false; // Închide popup-ul
  }

  goBack() { 
    this.router.navigate(['/']);
  }
}