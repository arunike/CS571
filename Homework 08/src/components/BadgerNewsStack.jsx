import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BadgerNewsScreen from './screens/BadgerNewsScreen';
import BadgerArticleScreen from './screens/BadgerArticleScreen';

const Stack = createNativeStackNavigator();

function BadgerNewsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Articles" 
                component={BadgerNewsScreen}
            />
            <Stack.Screen 
                name="Article" 
                component={BadgerArticleScreen}
                options={{
                    headerTitle: '',
                    headerTintColor: '#000000',
                }}
            />
        </Stack.Navigator>
    );
}

export default BadgerNewsStack;