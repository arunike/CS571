import { Text } from "react-native";
import BadgerPreferencesScreen from "../screens/BadgerPreferencesScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import BadgerNewsStack from "../BadgerNewsStack";

function BadgerTabs(props) {
    const tab = createBottomTabNavigator();

    return <tab.Navigator screenOptions={{ headerShown: false }}>
        <tab.Screen 
            name="News"
            component={BadgerNewsStack}
            options={{
                tabBarIcon: ({color, size, focused}) => (
                    <Ionicons name="newspaper"
                        color={focused ? "#c5050c" : color}
                        size={size}/>
                )
            }}/>
        <tab.Screen 
            name="Preferences"
            component={BadgerPreferencesScreen}
            options={{
                tabBarIcon: ({color, size, focused}) => (
                    <Ionicons name="settings-outline"
                            color={focused ? "#c5050c" : color}
                            size={size}/>
                )
            }}/>
    </tab.Navigator>
}

export default BadgerTabs;