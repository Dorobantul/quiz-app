export const UserSession = {
    userId: '', // GUID unic generat la load-ul aplicației
    restaurantId: '', // ID-ul restaurantului
    restaurantName: '', // Numele restaurantului
    tableId: 0, // ID-ul mesei
    nickName: '',
  
    initialize(restaurantId: string, restaurantName: string, tableId: number) {
      if (!this.userId) {
        this.userId = crypto.randomUUID(); // Generează un GUID unic
      }
      this.restaurantId = restaurantId;
      this.restaurantName = restaurantName;
      this.tableId = tableId;
    },
    
    tempInitialize() {
      this.userId = 'f3f6bcc7-d5c5-4b10-b57a-2fc6acf3fda3'
      this.restaurantId = 'testRestaurantId';
      this.restaurantName = 'testRestaurantName';
      this.tableId = 5;
      this.nickName = 'dorobantuThirs'
    },

    setNickName(nickName: string) {
      this.nickName = nickName;
    },

    isValidUser(){
      if(this.userId === null || this.userId === '' || this.userId === undefined){
        return false
      }
        return true;
    }
  };