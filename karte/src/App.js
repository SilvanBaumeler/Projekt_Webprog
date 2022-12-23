import React, { useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import axios from "axios";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import 'leaflet/dist/leaflet.css';
import { AppBar, Toolbar, Typography, Box, BottomNavigation} from '@mui/material';

function App() {
  const [mapKey, setMapKey] = useState(0);
  const [data, setData] = useState(null);
  const [startLat, setStartLat] = useState(null)
  const [startLon, setStartLon] = useState(null)
  const [endLat, setEndLat] = useState(null)
  const [endLon, setEndLon] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pkt, setPkt] = useState(100)
  

  function do_download() {
     if (pkt < 3) {
      // console.log(pkt)
      alert("Es müssen mehr als 2 Stützpunkte gewählt werden")
      return
    }

    var url = `https://vm9.sourcelab.ch/geodetic/line?startlat=${startLat}&startlng=${startLon}&endlat=${endLat}&endlng=${endLon}&pts=${pkt}`;

    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        updateData(response.data)
        setData(response.data);  
        const updateKey = ()=>{
          const oldKey = mapKey
          const newKey = oldKey + 1
          setMapKey(newKey)
          }
        updateKey()
        console.log("mapkey",mapKey)
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const updateData = (data)=> {
    setData(data)
  }


  useEffect(() => {
    console.log("useeffect aufgerufen")
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
    }, []);

    
    if (startLat > 90 || endLat > 90) {
      alert("Breitengrade dürfen mindestens -90 und maximum 90 sein.");
    }

    if (startLon > 180 || endLon > 180) {
      alert("Längengrade dürfen mindestens -180 und maximum 180 sein.");
    }

    
    if (startLat !== null && endLat !== null && startLon !== null && endLon !== null) {
      if (startLat === endLat && startLon === endLon){
        alert("Start und Endpunkt dürfen nicht gleich sein")
      }}

    


  return (
    <>
   <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <Button  
          onClick={() => {
          window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        }}
        style={{
          zIndex: 10000,
          position: 'fixed',
          bottom: 0,
          right: 10,      
          padding: '1rem 3rem',
          
          fontSize: '10px',
          backgroundColor: '#93acad',
          color: '#fff',
          textAlign: 'center',
        }}
         >
         top
        </Button>       
          <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
            Geodätische Linie 
          </Typography>
          <Button color="inherit" href="http://www.in-dubio-pro-geo.de/?file=guide/gdesic#:~:text=Es%20gibt%20im%20Wesentlichen%206,Breite%20%CF%86Q%20von%20Q">Info Berechnung</Button>
          <Button color="inherit" href="https://www.fhnw.ch/de/die-fhnw/hochschulen/architektur-bau-geomatik/institute/institut-geomatik">Über uns</Button>
        </Toolbar>
      </AppBar>
    </Box><p/>

    <Grid container spacing={2}>
          <Grid container item xs={12} md= {6} spacing={-8}>
            <Grid item xs={2.5}>
                <h4 style={{ fontFamily: "Roboto"}}>Startpunkt:</h4>
            </Grid>
            <Grid item xs={4}>
              <TextField type = "number" label="Breitengrad" variant="outlined" onChange={(e) => setStartLat(e.target.value)} />
            </Grid>
            <Grid item xs={4}>
              <TextField type = "number" label="Längengrad" variant="outlined" onChange={(e) => setStartLon(e.target.value)} />
            </Grid>
          </Grid>

          <Grid container item xs={12} md={6} spacing={-8}>
            <Grid item xs={2.5}>
                <h4 style={{ fontFamily: "Roboto"}}>Endpunkt:</h4>
            </Grid>
            <Grid item xs={4}>
              <TextField type = "number" label="Breitengrad" variant="outlined" onChange={(e) => setEndLat(e.target.value)}/>
            </Grid>
            <Grid item xs={4}>
              <TextField type = "number" label="Längengrad" variant="outlined" onChange={(e) => setEndLon(e.target.value)}/>
            </Grid>
          </Grid>

          <Grid container item xs={12} md={6} spacing={-8}>
              <Grid item xs={2.5}>
                <h4 style={{ fontFamily: "Roboto"}}>Stützpunkte:</h4>
              </Grid>
              <Grid item xs={4}>
                <TextField type = "number" label="Stützpunkte*" variant="outlined" onChange={(e) => setPkt(e.target.value)}/>
              </Grid><p/>
            </Grid>


          <Grid item xs={12}>
            <Button variant="contained" onClick = { () => {do_download()}}>
            Berechnen
            </Button><p/>
          </Grid>

          
      </Grid>


        {!data && <>

          <MapContainer center={[47.5349, 7.6416]} zoom={2} scrollWheelZoom={true}
          style={{ height: "600px", width: "100%" }} >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                  
           <GeoJSON data={data} style={{ weight: 8, opacity: '50%', color: 'blue'}}/>
            
          </MapContainer>
          </>
        }
      

      {loading && <>
                     <div>API Aufruf, bitte warten!</div><br/>
                  </>
      }

      {error &&   <>
                     <div>ERROR API Aufruf fehlgeschlagen</div>{console.log(error)}<br/>
                  </>}

      {data &&  <>
          <MapContainer center={[47.5349, 7.6416]} zoom={2} scrollWheelZoom={true}
          style={{ height: "600px", width: "100%" }} >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                  
           <GeoJSON key={mapKey} data={data} style={{ weight: 8, opacity: '50%', color: 'blue'}}/>
          </MapContainer>
                </>}

      <Grid container item xs = {12} >
        <p style={{ fontFamily: "Roboto"}}>
            <b >*Stützpunkte:</b> Die Geodätische Linie macht eine bogenförmige Bewegung. Damit Koordinaten auf der Linie berechnet werden benötigen wir
            Stützpunkte, welche die Linie unterteilen. Die Stützpunkte geben an in wie viele Strecken der Bogen unterteilt wird. Die Angabe zählt Anfangspunkt
            und Endpunkt mit. Die Anzahl 0, 1, 2 können nicht eingegeben werden. Wenn kein Wert gesetzt wird, wird standardmässig 100 verwendet
        </p>
      </Grid>
      <BottomNavigation>      
      <Grid item xs = {12} >
        <p style={{ fontFamily: "Roboto", fontSize: "15px"}}>Erstellt von Stefan Koch, Matteo Ferrari, Silvan Baumeler / Geomatikstudenten 3. Semester / FHNW / 23.12.2022</p>
      </Grid>
      </BottomNavigation> 
  
      </>
  );
}

export default App;
