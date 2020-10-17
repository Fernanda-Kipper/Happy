import React, { FormEvent, useState, ChangeEvent } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { LeafletMouseEvent } from 'leaflet';

import { FiPlus } from "react-icons/fi";

import mapMarkerImg from '../images/map_marker.svg';

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useHistory } from "react-router-dom";

const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})

export default function CreateOrphanage() {
  const [position, setPosition] = useState({latitude: 0, longitude: 0})
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const {latitude, longitude} = position

  const history = useHistory()

  //variables used to validate the input of opening_hours
  const alfabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  const veryfingHoursBar = opening_hours.includes('/')
  const [veryfingHoursABC, setVeryfingHoursABC] = useState(false)

  function handleMapClick(event: LeafletMouseEvent){
    const {lat, lng} = event.latlng
    setPosition({
      latitude: lat,
      longitude: lng
    })
  }

  async function handleSubmit(event: FormEvent){
    alfabet.forEach(letter =>{
      if(opening_hours.includes(letter)){
        setVeryfingHoursABC(true)
      }
    })

    //validanting opening_hours
    if(opening_hours.length !== 11 || veryfingHoursBar === false || veryfingHoursABC === true){
      alert('Formate o horário de atendimento no modelo indicado (00:00/00:00)')
      return;
    }

    event.preventDefault()
    const data = new FormData();

    data.append('name', name)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('about', about)
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekends', String(open_on_weekends))
  
    images.forEach(image =>{
      data.append('images', image)
    })
  
    await api.post('orphanages', data)

    alert('Cadastro realizado com sucesso!')

    history.push('/app')
  
  }

  function handleSelectedImages(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files){
      return;
    }
    const images1 = Array.from(event.target.files)
    setImages(images1)

    const imagesPreview = images1.map(image => {
      return URL.createObjectURL(image)
    })

    setPreviewImages(imagesPreview)
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar></Sidebar>

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-27.6987904,-48.5011278]}
              zoom={13}
              style={{ width: '100%', height: 280 }}
              onClick={handleMapClick}
            >
              <TileLayer 
               url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              {position.latitude !== 0
              && <Marker interactive={false} icon={happyMapIcon} position={[position.latitude,position.longitude]} />
              }

            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={e => setName(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} value={about} onChange={e => setAbout(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image=>{
                  return (
                    <img key={image} src={image} alt={name}></img>
                  )
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input multiple type="file" id="image[]" onChange={handleSelectedImages}/>

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={e => setInstructions(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horario de Funcionamento</label>
              <input id="opening_hours" value={opening_hours} onChange={e => setOpeningHours(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                type="button" 
                className={open_on_weekends ? 'active' : ''}
                onClick= {()=>setOpenOnWeekends(true)} >
                  Sim
                  </button>
                <button 
                type="button"
                className={!open_on_weekends ? 'active' : ''}
                onClick= {()=>setOpenOnWeekends(false)}>
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
