import { Text } from "react-native";
import BadgerPreferencesScreen from "../screens/BadgerPreferencesScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import BadgerNewsScreen from "../screens/BadgerNewsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BadgerArticleScreen from "../screens/BadgerArticleScreen";

const Stack = createNativeStackNavigator();

function NewsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="NewsList" component={BadgerNewsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Article" component={BadgerArticleScreen} />
        </Stack.Navigator>
    );
}

function BadgerTabs(props) {
    const tab = createBottomTabNavigator();

    return <>
        <tab.Navigator>
            <tab.Screen 
                name="News"
                component={NewsStack}
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
    </>
}

export default BadgerTabs;