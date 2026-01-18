export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type AuthStackParamList = {
    AuthEntry: undefined;
    Login: { email: string };
    Register: { email: string };
    ForgotPassword: undefined;
};

export type MainTabParamList = {
    Dashboard: undefined;
    Search: undefined;
    Favorites: undefined;
    Map: undefined;
    Profile: undefined;
};

export type SettingsStackParamList = {
    Settings: undefined;
    EditProfile: undefined;
    Notifications: undefined;
    Privacy: undefined;
};
