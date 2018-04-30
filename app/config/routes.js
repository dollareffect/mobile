import {
  TabNavigator,
  StackNavigator,
  SwitchNavigator,
} from 'react-navigation';
import LoginScreen from '../screens/Login';
import SignUpScreen from '../screens/SignUp';
import HomeScreen from '../screens/Home';
import ExploreScreen from '../screens/Explore';
import NotifictionsScreen from '../screens/Notifications';
import ProfileScreen from '../screens/Profile';
import AuthLoadingScreen from '../screens/AuthLoading';

const AppStack = TabNavigator({
  Home: HomeScreen,
  Explore: ExploreScreen,
  Notifications: NotifictionsScreen,
  Profile: ProfileScreen,
});
const AuthStack = StackNavigator({ Login: LoginScreen, SignUp: SignUpScreen });

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
