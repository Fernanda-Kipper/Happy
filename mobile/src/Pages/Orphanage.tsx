import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import L from 'leaflet';
import {useParams} from  'react-router-dom';

import mapMarkerImg from '../images/map_marker.svg';

import '../styles/pages/orphanage.css';
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})

interface Orphanage{
  latitude: number,
  longitude: number,
  name: string,
  about: string,
  instructions: string,
  open_on_weekends: boolean,
  opening_hours: string,
  images: Array<{
    url: string,
    id: number
  }>
}

interface OrphanageParams{
  id: string
}

export default function Orphanage() {
  const params: OrphanageParams = useParams();
  const [orphanage, setOrphanage] = useState<Orphanage>()

  const [activeImageIndex, setActiveImageIndex] = useState(0); 


  useEffect(()=>{
      api.get(`/orphanages/${params.id}`).then(response => {
          setOrphanage(response.data)})
  }, [params.id])

  if (!orphanage){
    return <p>Carregando...</p>
  }

  return (
    <div id="page-orphanage">
      <Sidebar></Sidebar>

      <main>
        <div className="orphanage-details">
          <img src={orphanage.images[activeImageIndex].url} alt={orphanage.images[0].url}/>
          <div className="images">
            {orphanage.images.map((image, index)=>{
              return (
                <button key={image.id} 
                type="button"
                onClick={()=>{
                  setActiveImageIndex(index)
                }}
                className={activeImageIndex === index ? 'active': ''}
                >
                <img src={image.url} alt={orphanage.name} />
              </button>
              )
            })}
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map 
                center={[orphanage.latitude,orphanage.longitude]} 
                zoom={14} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'}
                />
                <Marker interactive={false} icon={happyMapIcon} position={[orphanage.latitude,orphanage.longitude]} />
              </Map>

              <footer>
                <a rel="noopener noreferrer" target="_blank" href={`https:www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                {orphanage.opening_hours}
              </div>
                {orphanage.open_on_weekends ? (               
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                     Atendemos <br />
                    fim de semana
                </div>) : (
                <div className="open-on-weekends" id="dont-open">
                    <FiInfo size={32} color="#FF669D" />
                      Não abrimos finais de semana
                </div>
              )}
            </div>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}