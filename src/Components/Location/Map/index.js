import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import { useRouter } from 'next/router'
import { Button, Dialog } from '@mui/material'
import { BiExitFullscreen, BiFullscreen } from 'react-icons/bi'
import styled from '@emotion/styled'

const Welc = ({ location, setFieldValue }) => {
  const { locale } = useRouter()
  const [userLocation, setUserLocation] = useState(location ? location : null)
  const [placeOpenLoaction, setPlaceOpenLoaction] = useState(true)
  const mapRef = useRef()
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const handleMapMove = event => {
    const { lat, lng } = event.target.getCenter()
    setUserLocation([lat, lng])
    setFieldValue('location', {
      type: 'Point',
      coordinates: [lat, lng]
    })
  }

  const CustomizerSpacing = styled(Button)(({ theme }) => ({
    width: '35px ',
    minWidth: '35px ',
    height: '35px',
    backgroundColor: 'white',
    border: '2px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0px 4px 18px 0px rgba(15, 20, 34, 0.1)',
    position: 'absolute',
    right: '10px',
    top: '10px',
    fontSize: '22px',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#f4f4f4'
    }
  }))

  return (
    <div
      style={{ height: '100%', minHeight: '300px', borderRadius: '4px', overflow: 'hidden' }}
      className='relative flex flex-col'
    >
      <CustomizerSpacing style={{ zIndex: 555 }} onClick={handleClickOpen}>
        <BiFullscreen />
      </CustomizerSpacing>
      <Dialog fullScreen onClose={handleClose} aria-labelledby='full-screen-dialog-title' open={open}>
        <CustomizerSpacing style={{ zIndex: 555 }} onClick={handleClose}>
          <BiExitFullscreen />
        </CustomizerSpacing>
        {placeOpenLoaction ? (
          <>
            <div className='flex-1 flex flex-col relative'>
              {userLocation ? (
                <MapContainer center={userLocation} zoom={18} className='flex-1' ref={mapRef}>
                  <TileLayer
                    url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                    attribution='Map data &copy; OpenStreetMap contributors'
                  />

                  <Marker position={userLocation} icon={customIcon} />
                  <MapEvents onMove={handleMapMove} />
                </MapContainer>
              ) : (
                <div className='flex-1 bg-white flex justify-center items-center px-4'>
                  <span className='loaderMap before:border-mainColor'></span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='flex-1 bg-white flex justify-center items-center px-4 text-center font-bold'>
            {locale === 'ar' ? 'من فظلك قم بفتح تحديد الموقع' : ' Please Allow Location'}
          </div>
        )}
      </Dialog>
      <div className='flex-1 flex flex-col relative'>
        {userLocation ? (
          <MapContainer center={userLocation} zoom={18} className='flex-1' ref={mapRef}>
            <TileLayer
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
              attribution='Map data &copy; OpenStreetMap contributors'
            />

            <Marker position={userLocation} icon={customIcon} />
            <MapEvents onMove={handleMapMove} />
          </MapContainer>
        ) : (
          <div className='flex-1 bg-white flex justify-center items-center px-4'>
            <span className='loaderMap before:border-mainColor'></span>
          </div>
        )}
      </div>
    </div>
  )
}

const MapEvents = ({ onMove, onMoveend }) => {
  useMapEvents({
    move: onMove,
    moveend: onMoveend
  })
}

const customIcon = new Icon({
  iconUrl: '/images/location.png',

  iconSize: [32, 32]
})

export default Welc
