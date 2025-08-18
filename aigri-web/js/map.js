// Initialize the map for farm registration
function initFarmMap() {
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
            // Clear any existing layers
            drawnItems.clearLayers();
            
            // Add the polygon to the feature group
            drawnItems
            // Calculate area in hectares
            const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
            const areaHectares = (area / 10000).toFixed(2);
            
            // Update the form field
            document.getElementById('farm-area').value = areaHectares;
            
            // Store the polygon coordinates
            document.getElementById('boundary-coords').value = JSON.stringify(layer.getLatLngs()[0]);
            
            // Add the layer to the map
            drawnItems.addLayer(layer);
            
            // Zoom to the drawn polygon
            map.fitBounds(layer.getBounds());
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
                
                // Update the stored coordinates
                document.getElementById('boundary-coords').value = JSON.stringify(layer.getLatLngs()[0]);
            }
        });
        
        const areaHectares = (totalArea / 10000).toFixed(2);
        document.getElementById('farm-area').value = areaHectares;
    });
    
    // Handle deletion events
    map.on(L.Draw.Event.DELETED, function () {
        document.getElementById('farm-area').value = '';
        document.getElementById('boundary-coords').value = '';
    });
    
    return map;
}

// Initialize map for damage assessment visualization
function initDamageMap(beforeImageUrl, afterImageUrl, boundaryCoords) {
    const map = L.map('damage-map').setView([12.8797, 121.7740], 13);
    
    // Add base map layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Convert boundary coordinates to LatLng objects
    const boundary = JSON.parse(boundaryCoords);
    const latLngs = boundary.map(coord => L.latLng(coord.lat, coord.lng));
    
    // Add farm boundary polygon
    const farmPolygon = L.polygon(latLngs, {
        color: '#2c7d3f',
        fillOpacity: 0.3,
        weight: 2
    }).addTo(map);
    
    // Add image overlays if provided
    if (beforeImageUrl) {
        const beforeOverlay = L.imageOverlay(beforeImageUrl, map.getBounds(), {
            opacity: 0.7,
            interactive: true
        }).addTo(map);
    }
    
    if (afterImageUrl) {
        const afterOverlay = L.imageOverlay(afterImageUrl, map.getBounds(), {
            opacity: 0.7,
            interactive: true
        }).addTo(map);
    }
    
    // Zoom to the farm boundary
    map.fitBounds(farmPolygon.getBounds());
    
    return map;
}

// Initialize map when page loads for farm registration
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('farm-map')) {
        initFarmMap();
    }
    
    if (document.getElementById('damage-map')) {
        // These would come from your backend in a real implementation
        const beforeImageUrl = document.getElementById('before-image-url').value;
        const afterImageUrl = document.getElementById('after-image-url').value;
        const boundaryCoords = document.getElementById('boundary-coords').value;
        
        if (boundaryCoords) {
            initDamageMap(beforeImageUrl, afterImageUrl, boundaryCoords);
        }
    }
});