import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const {Navigator, Screen} = createStackNavigator()

import OrphanagesMap from  './Pages/OrphanagesMap'
import OrphanageDetails from  './Pages/OrphanageDetails'
import OrphanageData from  './Pages/CreateOrphanages/OrphanageData'
import SelectMap from  './Pages/CreateOrphanages/SelectMapPosistion'
import Header from './components/Header';

export default function Routes(){
    return(
        <NavigationContainer>
            <Navigator screenOptions={{headerShown: false, cardStyle:{backgroundColor: "#f2f3f5"}}}>

                <Screen 
                name="OrphanagesMap" component={OrphanagesMap}
                />

                <Screen 
                name="OrphanageDetails" component={OrphanageDetails}
                options={{
                    headerShown: true,
                    header: ()=> <Header title="Orfanato" showCancel={false}/>
                }}
                />

                <Screen 
                name="OrphanageData" component={OrphanageData}
                options={{
                    headerShown: true, 
                    header: ()=> <Header title="Informe os dados do Orfanato"/>
                }}
                />

                <Screen 
                name="SelectMap" component={SelectMap}
                options={{
                    headerShown: true, 
                    header: ()=> <Header title="Selecione a localidade no mapa"/>
                }}
                />

            </Navigator>
        </NavigationContainer>
    )
}