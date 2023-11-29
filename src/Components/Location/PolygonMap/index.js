import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Polygon, TileLayer, useMapEvents, FeatureGroup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import { BiExitFullscreen, BiFullscreen, BiSearch } from 'react-icons/bi'
import { Button, Dialog } from '@mui/material'
import { styled } from '@mui/system'

const PolygonMap = ({ location, setFieldValue, delivery_area, refs }) => {
  const feaRef = useRef()
  const [userLocation, setUserLocation] = useState(location ? location : null)
  const mapRef = useRef()
  const [open, setOpen] = useState(false)
  const [pol, setPol] = useState(false)

  const handleClickOpen = () => {
    console.log(open)
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const handleMapMove = event => {
    const { lat, lng } = event.target.getCenter()
    setUserLocation([lat, lng])
  }
  const [selectedPolygon, setSelectedPolygon] = useState([])

  useEffect(() => {
    setFieldValue('delivery_area', {
      type: 'Polygon',
      coordinates: [...selectedPolygon]
    })
  }, [selectedPolygon, selectedPolygon.length, setFieldValue])
  console.log(feaRef)

  const onCreated = e => {
    const newData = Object.keys(feaRef.current._layers).map((layerid, index) => feaRef.current._layers[layerid])
    const newLangData = newData.filter((_, i) => i !== newData.length - 1)
    newLangData.forEach((ele, i) => {
      feaRef.current.removeLayer(ele._leaflet_id)
    })
    setSelectedPolygon(newData.at(-1)._latlngs)
    setPol(
      newData.at(-1)._latlngs.map(ele => {
        return [
          ...ele.map(num => {
            return [num.lat, num.lng]
          })
        ]
      })
    )
  }
  useEffect(() => {
    if (delivery_area) {
      setPol(
        delivery_area.map(ele => {
          return [
            ...ele.map(num => {
              return [num.lat, num.lng]
            })
          ]
        })
      )
    }
  }, [delivery_area])

  console.log(pol)

  const _onEdited = e => {
    const {
      layers: { _layers }
    } = e

    Object.values(_layers).map(({ _leaflet_id, editing }) => {
      setSelectedPolygon(editing.latlngs[0])
    })
  }

  const _onDeleted = e => {
    setSelectedPolygon([])
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
    <div style={{ height: '100%', minHeight: '300px' }} className='relative  flex flex-col'>
      <CustomizerSpacing style={{ zIndex: 555 }} onClick={handleClickOpen}>
        <BiFullscreen />
      </CustomizerSpacing>

      <Dialog fullScreen onClose={handleClose} aria-labelledby='full-screen-dialog-title' open={open}>
        <CustomizerSpacing style={{ zIndex: 555 }} onClick={handleClose}>
          <BiExitFullscreen />
        </CustomizerSpacing>
        <>
          <div className='flex-1 flex flex-col relative'>
            {userLocation ? (
              <MapContainer center={userLocation} zoom={18} className='flex-1' ref={mapRef}>
                <TileLayer
                  url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                  attribution='Map data &copy; OpenStreetMap contributors'
                />
                <FeatureGroup ref={feaRef}>
                  <EditControl
                    pathOptions={{ color: 'yellow' }}
                    positions='topright'
                    onCreated={onCreated}
                    onEdited={_onEdited}
                    onDeleted={_onDeleted}
                    draw={{
                      rectangle: false,
                      polyline: false,
                      circle: false,
                      circlemarker: false,
                      marker: false
                    }}
                  />
                </FeatureGroup>
                {pol && <Polygon pathOptions={{ color: '#3388ff' }} positions={pol} />}
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
      </Dialog>
      <div style={{ height: '100%', minHeight: '300px' }} className='relative  flex flex-col'>
        <div className='flex-1 flex flex-col relative'>
          {userLocation ? (
            <MapContainer center={userLocation} zoom={18} className='flex-1' ref={mapRef}>
              <TileLayer
                url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                attribution='Map data &copy; OpenStreetMap contributors'
              />
              {pol && <Polygon pathOptions={{ color: '#3388ff' }} positions={pol} />}
              <FeatureGroup ref={feaRef}>
                <EditControl
                  pathOptions={{ color: 'yellow' }}
                  positions='topright'
                  onCreated={onCreated}
                  onEdited={_onEdited}
                  onDeleted={_onDeleted}
                  draw={{
                    rectangle: false,
                    polyline: false,
                    circle: false,
                    circlemarker: false,
                    marker: false
                  }}
                />
              </FeatureGroup>
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

export default PolygonMap
