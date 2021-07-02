import useSupercluster from "use-supercluster";
import { Marker } from '@react-google-maps/api';
import { useState } from "react";
import { useEffect } from "react";
import iconStop from './fixtures/icon-stop.png';
import iconClusterPurple from './fixtures/icon-cluster-purple.png';
import iconClusterRed from './fixtures/icon-cluster-red.png';
import iconClusterOrange from './fixtures/icon-cluster-orange.png';
import iconClusterYellow from './fixtures/icon-cluster-yellow.png';
import iconClusterBlue from './fixtures/icon-cluster-blue.png';
import iconClusterWhite from './fixtures/icon-cluster-white.png';

const MarkerClusters = ({ stops, mapRef }) => {
   // initial states that change when the user moves around the map
   const [zoom, setZoom] = useState(mapRef.getZoom());
   const [bounds, setBounds] = useState([
      mapRef.getBounds().getSouthWest().lng(),
      mapRef.getBounds().getSouthWest().lat(),
      mapRef.getBounds().getNorthEast().lng(),
      mapRef.getBounds().getNorthEast().lat()
   ]);

   // map event listeners. We add them the first time the component renders
   useEffect(() => {
      mapRef.addListener('idle', () => {
         setZoom(mapRef.getZoom());
         const b = mapRef.getBounds();
         setBounds([
            b.getSouthWest().lng(),
            b.getSouthWest().lat(),
            b.getNorthEast().lng(),
            b.getNorthEast().lat()
         ]);
      });
   }, [mapRef]);


   // convert stops to the proper format for supercluster
   const points = stops.map(stop => ({
      type: "Feature",
      properties: {
         cluster: false,
         stopId: stop.stop_id,
      },
      geometry: {
         type: "Point",
         coordinates: [
            parseFloat(stop.stop_lon),
            parseFloat(stop.stop_lat)]
      }
   }));

   // get clusters
   const { clusters, supercluster } = useSupercluster({
      points,
      bounds,
      zoom,
      options: { radius: 100, maxZoom: 16 }
   });


   return (
      <>
         {clusters.map(cluster => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } = cluster.properties;

            const iconType = handleIconType(isCluster, pointCount);

            if (isCluster) {
               return (
                  <Marker
                     key={cluster.id}
                     position={{
                        lat: latitude,
                        lng: longitude
                     }}
                     options={{
                        map: mapRef,
                        icon: {
                           url: iconType,
                        },
                        label: {
                           className: "labelMarker",
                           text: "" + pointCount + "",
                           fontSize: "14px",
                           fontWeight: "500",
                           fontFamily: "Roboto, sans-serif",
                        }
                     }}
                     onClick={() => {
                        const expansionZoom = Math.min(
                           supercluster.getClusterExpansionZoom(cluster.id),
                           17 // max zoom
                        );
                        mapRef.setZoom(expansionZoom);
                        mapRef.panTo({ lat: latitude, lng: longitude });
                     }}>
                  </Marker>
               )
            }

            return (
               <Marker
                  key={'marker' + cluster.properties.stopId}
                  position={{
                     lat: latitude,
                     lng: longitude
                  }}
                  options={{
                     map: mapRef,
                     icon: {
                        url: iconType,
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(10, 10),
                     }
                  }} />
            )

         })}
      </>
   );

   // function to handle the icon type for the clusters and stops
   function handleIconType(isCluster, pointCount) {
      var iconType = iconStop;
      // if it is not a cluster return a bus stop marker
      if (!isCluster) {
         iconType = iconStop;
         return iconType
      }

      // if it is a cluster the icon depends on the point count
      if (pointCount >= 2000) {
         iconType = iconClusterPurple;
         return iconType;
      }
      else if (700 <= pointCount && pointCount < 2000) {
         iconType = iconClusterRed;
         return iconType
      }
      else if (300 <= pointCount && pointCount < 700) {
         iconType = iconClusterOrange;
         return iconType
      }
      else if (100 <= pointCount && pointCount < 300) {
         iconType = iconClusterYellow;
         return iconType
      }
      else if (30 <= pointCount && pointCount < 100) {
         iconType = iconClusterBlue;
         return iconType
      }
      else {
         iconType = iconClusterWhite;
         return iconType
      }

   }
}

export default MarkerClusters;