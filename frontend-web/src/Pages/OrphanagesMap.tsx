import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, {Marker,PROVIDER_GOOGLE, Callout} from 'react-native-maps';
import {Feather} from  '@expo/vector-icons'
import {useFonts} from 'expo-font'
import {Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold} from '@expo-google-fonts/nunito'

import mapMarker from '../images/map-marker.png'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage{
  id:number,
  latitude: number,
  longitude: number,
  name: string
}

export default function OrphanagesMap() {
   const navigation = useNavigation()

   const [orphanages, setOrphanages] = useState<Orphanage[]>([])

   useFocusEffect(()=>{
     api.get('orphanages').then(response => {
       setOrphanages(response.data)
     })
   })

   function handleNavigateToOrphanageDetails(id: number){
      navigation.navigate('OrphanageDetails', {id})
    }

    function handleNavigateToCreateOrphanage(){
        navigation.navigate('SelectMap')
      }

    const [fontsLoaded] = useFonts({
    Nunito_600SemiBold, 
    Nunito_700Bold, 
    Nunito_800ExtraBold
    })

    if(!fontsLoaded){
    return null
   }

    return (
    <View style={styles.container}> 
      <MapView style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: -27.7015099,
        longitude: -48.5076815,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008
      }}>
        {orphanages.map(orphanage =>{
          return(
            <Marker
            key={orphanage.id}
            icon={mapMarker}
            calloutAnchor={{
              x: 2.7,
              y: 0.8
            }} 
            coordinate={{
              latitude: orphanage.latitude,
              longitude: orphanage.longitude}}>
              <Callout tooltip={true} onPress={()=> handleNavigateToOrphanageDetails(orphanage.id)}>
                <View style={styles.callOutContainer}>
                    <Text style={styles.callOutText}>{orphanage.name}</Text>
                </View>
              </Callout>
          </Marker>
          )
        })}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}> {orphanages.length} Orfanatos encontrados</Text>
        <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage}>
            <Feather name="plus" size={20} color="#FFF"></Feather>
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  callOutContainer:{
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    justifyContent: 'center'
  },
  callOutText:{
    color: '#0089a5',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold'
  },
  footer:{
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 56,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText:{
    color: '#8fa7b3',
    marginLeft: 8,
    fontFamily: 'Nunito_700Bold'
  },
  createOrphanageButton:{
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center'

  }
});

//