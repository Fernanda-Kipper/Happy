import React, {useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

import {FiArrowRight, FiPlus } from  'react-icons/fi';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import leaflet from 'leaflet'

import api from '../services/api'

import mapMarkerImg from '../images/map_marker.svg'
import mapMarkerImgOpen from '../images/map-marker-open.svg'
import mapMarkerImgClose from '../images/map-marker-close.svg'

import '../styles/pages/orphanages_map.css'

interface Orphanage{
    id: number,
    latitude: number,
    longitude: number,
    name: string,
    opening_hours: string,
    open_on_weekends: boolean
}

const mapIconOpen = leaflet.icon({
    iconUrl: mapMarkerImgOpen,
    iconAnchor: [29, 68],
    iconSize: [58, 68],

    popupAnchor: [170, 2]
})

const mapIconClose = leaflet.icon({
    iconUrl: mapMarkerImgClose,
    iconAnchor: [29, 68],
    iconSize: [58, 68],

    popupAnchor: [170, 2]
})

function OrphanagesMap(){
    const [orphanages, setOrphanages] = useState<Orphanage[]>([])
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)
    const [dayOfWeek, setDayOfWeek] = useState(0)

    useEffect(()=>{
        api.get('/orphanages').then(response => {
            setOrphanages(response.data)})

        //getting the exact hour to verify if the orphanages are open or not
        var hours = new Date().getHours()
        var minutes = new Date().getMinutes();
        var day = new Date().getDay();
        setDayOfWeek(day)
        setHours(hours)
        setMinutes(minutes)
    }, [])

    //function to do the verification
    function verifyingIfIsOpen(time: string, OpenOnWeekends: boolean){
        const open = time.split('/')[0]
        const close = time.split('/')[1]

        if(OpenOnWeekends === true){
            console.log(open)
            if(hours > parseInt(open.slice(0,2))){
                if(hours < parseInt(close.slice(0,2))){
                    return mapIconOpen
                }
            }
            else if(hours === parseInt(open.slice(0,2)) && minutes >= (parseInt(open.slice(3)) + parseInt(open.slice(4)))){
                return mapIconOpen
            }
        }

        else if(OpenOnWeekends === false){
            if(dayOfWeek !== 0 && dayOfWeek !==6){
                if(hours > parseInt(open.slice(0,2))){
                    if(hours < parseInt(close.slice(0,2))){
                        return mapIconOpen
                    }
                }
                else if(hours === parseInt(open.slice(0,2)) && minutes >= (parseInt(open.slice(3)) + parseInt(open.slice(4)))){
                    return mapIconOpen
                }
            }
            else{
                return mapIconClose
            }
        }
        
        return mapIconClose
    }

    return (
        <div className="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt=""/>
                    <p>Muitas crianças estão esperando sua visita :)</p>
                    <p className="warning"> As casas de acolhimento sinalizadas em verde estão abertas no momento, confira no mapa as próximas a você!</p>
                </header>

                <footer>
                    <strong>Florianopólis</strong>
                    <span>Santa Catarina</span>
                </footer>
            </aside>

            <Map
            center={[-27.6987904,-48.5011278]}
            zoom={13}
            style={{width: '100%', height:'100%'}}
            >
                <TileLayer url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
                {orphanages.map(orphanage => {
                    return(
                        <Marker 
                        position={[orphanage.latitude, orphanage.longitude]} 
                        icon={verifyingIfIsOpen(orphanage.opening_hours, orphanage.open_on_weekends)}
                        key={orphanage.id}>
                            <Popup closeButton={false} minWidth={240} maxWidth={240} className="mapPopup">
                                {orphanage.name}
                                <Link to={`orphanages/${orphanage.id}`}>
                                    <FiArrowRight size={20} color="#FFF"/>
                                </Link>
                            </Popup>
                        </Marker>
                    )
                })}
            </Map>

            <Link to='/orphanages/create' className="create-orphanage">
                <FiPlus size={32} color="#FFF"></FiPlus>
            </Link>
        </div>
    );
}

export default OrphanagesMap;