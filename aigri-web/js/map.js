// Initialize the map
function initMap() {
    // Default coordinates - center of Philippines
    const map = L.map('farm-map').setView([12.8797, 121.7740], 13);
    
    // Add base map layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Initialize the draw control
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    
    const drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
            polygon: {
                shapeOptions: {
                    color: '#2c7d3f',
                    fillOpacity: 0.5
                },
                allowIntersection: false,
                showArea: true,
                metric: true
            },
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
            polyline: false
        },
        edit: {
            featureGroup: drawnItems
        }
    });
    
    map.addControl(drawControl);
    
    // Handle drawing events
    map.on(L.Draw.Event.CREATED, function (e) {
        const type = e.layerType;
        const layer = e.layer;
        
        if (type === 'polygon') {
            // Add the polygon to the feature group
            drawnItems.addLayer(layer);
            
            // Calculate area in hectares
            const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
            const areaHectares = (area / 10000).toFixed(2);
            
            // Update the form field
            document.getElementById('farm-area').value = areaHectares;
            
            // Store the polygon coordinates
            document.getElementById('boundary-coords').value = JSON.stringify(layer.getLatLngs()[0]);
        }
    });
    
    // Handle editing events
    map.on(L.Draw.Event.EDITED, function (e) {
        const layers = e.layers;
        let totalArea = 0;
        
        layers.eachLayer(function(layer) {
            if (layer instanceof L.Polygon) {
                const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
                totalArea += area;
            }
        });
        
        const areaHectares = (totalArea / 10000).toFixed(2);
        document.getElementById('farm-area').value = areaHectares;
    });
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initMap);