import React, { useState , useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup ,Tooltip} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import tollStations from "./MapData";
import L from "leaflet"; // Για custom icons
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';



// Δημιουργία προσαρμοσμένου εικονιδίου
const tollIcon = L.icon({
  iconUrl: "/toll.png", // Βεβαιώσου ότι η εικόνα είναι στον σωστό φάκελο
  iconSize: [40, 40],   // Μέγεθος εικόνας
  iconAnchor: [20, 40], // Σημείο αγκύρωσης
  popupAnchor: [0, -40] // Τοποθέτηση του pop-up
});



const TollMap = () => {
  const [passes, setPasses] = useState(null); // Αποθήκευση διελεύσεων
  const [selectedToll, setSelectedToll] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (!selectedToll || !startDate || !endDate) return; 
    
    let start=new Date(startDate);
    let end=new Date(endDate);
   ;

    if( start > end ) alert("Εισάγετε έγκυρο χρονικό διάστημα");
    //Το backend πρέπει να επιστρέφει ένα json της μορφής {passes:9}
    
    else{
      console.log(selectedToll.TollID);
      console.log(startDate);
      console.log(endDate);
      const url = new URL('http://localhost:9115/api/passes');
      url.searchParams.append('stationId', selectedToll.TollID);
      url.searchParams.append('startDate', startDate);
      url.searchParams.append('endDate', endDate);
      
      fetch(url, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "X-OBSERVATORY-AUTH": localStorage.getItem("jwt")
        }
      })
  .then(response => {
    console.log(response.status);
      if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message); }); // Αν status ≠ 200, πετάμε error με το μήνυμα του server
      }
      return response.json(); // Αν status = 200, συνεχίζουμε κανονικά
  })
  .then(data => {
    setPasses(data.passes);
    console.log(passes);
  })
  .catch((error) => {
    console.error("Error fetching passes:", error);
  });

    }
  }, [selectedToll, startDate, endDate]); // Επαναφόρτωση όταν αλλάζουν τα φίλτρα

  /*
    // Φιλτράρισμα διελεύσεων σύμφωνα με την επιλεγμένη ημερομηνία
  const filterPasses = (passes) => {
    if (!startDate || !endDate) return passes; // Αν δεν έχουν επιλεγεί ημερομηνίες, επιστρέφουμε όλες τις διελεύσεις
    return passes.filter(pass => pass.date >= startDate && pass.date <= endDate);
  };
*/


  return (
    <div >

  <h2>Φίλτρο Αναζήτησης</h2>

 <br></br>

    
  {/* Επιλογή ημερομηνιών */}
 <div style={{ marginBottom: "10px" }}>
  <label>Από: </label>
  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

  <label> Έως: </label>
  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
   </div>

    <h1 style={{ textAlign: "center" }} >Χάρτης Διοδίων και Διελεύσεων</h1>
    
    

      <MapContainer center={[40, 22]} zoom={10} style={{ height: "600\px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
          
            
       {/* Τοποθέτηση markers */}
       {tollStations.map((station) => (
          <Marker 
            key={station.TollID} 
            position={[station.Lat, station.Long]} 
            icon={tollIcon} 
            eventHandlers={{ click: () => setSelectedToll(station) }}
          >
            <Tooltip direction="top" offset={[0, -30]} opacity={1}>
              {station.Name}
            </Tooltip>
          </Marker>
        ))}

        {/* Popup με τα δεδομένα */}
        {selectedToll && (
          <Popup 
            position={[selectedToll.Lat, selectedToll.Long]} 
            onClose={() => {
              setSelectedToll(0);
              setPasses(null); // Καθαρισμός δεδομένων
            }}
          >
            <h3>{selectedToll.Name}</h3>
            {passes != null ? (
              <ul>
          
                  <li >Συνολικές διελεύσεις: {passes}</li>
               
              </ul>
            ) : (
              <p>Δεν βρέθηκαν διελεύσεις για αυτήν την περίοδο.</p>
            )}
          </Popup>
        )}
      </MapContainer>
      <br></br>
      <br></br>
      <br></br>
      <div class="position-relative">
         
          <div class="position-absolute bottom-0 end-0">
         <button type="button"  class="btn btn-success btn-lg"><Link className="nav-link" to="/statistics">Διαγράμματα Στατιστικών</Link></button>
         </div>

        </div>
        </div>
      )}



    
export default TollMap;
