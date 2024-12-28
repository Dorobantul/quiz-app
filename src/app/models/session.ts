export class Session {
    sessionId: string;
    restaurantId: string;
    tableId: number;
    createdBy: string;
    createdByUserName: string;
    isPublic: boolean;
    isStarted: boolean;
    password: string | null;
    createdAt: Date;
  
    constructor(data: {
      sessionId: string;
      restaurantId: string;
      tableId: number;
      createdBy: string;
      createdByUserName: string;
      isPublic: boolean;
      isStarted: boolean;
      password: string | null;
      createdAt: any; // Firestore Timestamp
    }) {
      this.sessionId = data.sessionId;
      this.restaurantId = data.restaurantId;
      this.tableId = data.tableId;
      this.createdBy = data.createdBy;
      this.createdByUserName = data.createdByUserName;
      this.isPublic = data.isPublic;
      this.isStarted = data.isStarted;
      this.password = data.password;
      this.createdAt = data.createdAt.toDate(); // Convertim Firestore Timestamp în Date
    }
    
  }