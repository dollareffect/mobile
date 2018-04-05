import {
  TabNavigator,
  StackNavigator,
  SwitchNavigator,
} from 'react-navigation';
import LoginScreen from '../screens/Login';
import HelloScreen from '../screens/Hello';
import AuthLoadingScreen from '../screens/AuthLoading';

const AppStack = TabNavigator({
  Home: HelloScreen,
});
const AuthStack = StackNavigator({ Login: LoginScreen });

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
