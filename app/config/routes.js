import {
  TabNavigator,
  StackNavigator,
  SwitchNavigator,
} from 'react-navigation';
import SplashScreen from '../screens/Splash';
import LoginScreen from '../screens/Login';
import SignUpScreen from '../screens/SignUp';
import HomeScreen from '../screens/Home';
import ExploreScreen from '../screens/Explore';
import NotifictionsScreen from '../screens/Notifications';
import ProfileScreen from '../screens/Profile';
import AuthLoadingScreen from '../screens/AuthLoading';

const ProfileStack = StackNavigator({
  Profile: ProfileScreen,
});

const AppStack = TabNavigator({
  Home: HomeScreen,
  Explore: ExploreScreen,
  Notifications: NotifictionsScreen,
  Profile: ProfileStack,
});

const AuthStack = StackNavigator({
  Splash: SplashScreen,
  Login: LoginScreen,
  SignUp: SignUpScreen,
});

const AppSwitchNavigator = SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export { AppSwitchNavigator };
