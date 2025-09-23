import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserDetailScreen from './screens/UserDetailScreen';
import UserListScreen from './screens/UserListScreen'; // இந்த கோப்புகளை அடுத்து உருவாக்குவோம்

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserList">
        <Stack.Screen name="UserList" component={UserListScreen} options={{ title: 'User Directory' }} />
        <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ title: 'User Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}