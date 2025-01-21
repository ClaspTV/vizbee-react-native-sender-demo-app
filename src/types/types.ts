export type RootStackParamList = {
    Login: {
      isFromTVSignIn?: boolean;
    };
    // Add other screens here
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }