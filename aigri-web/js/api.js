// API Communication for AiGRI

const API_BASE_URL = 'https://api.aigri.upt.edu.ph/v1';

// Common headers for API requests
function getHeaders() {
    const token = localStorage.getItem('aigri_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Handle API errors
function handleApiError(error) {
    console.error('API Error:', error);
    
    if (error.status === 401) {
        // Unauthorized - redirect to login
        logout();
    }
    
    return {
        success: false,
        message: error.message || 'An error occurred'
    };
}

// Fetch wrapper for API calls
async function apiFetch(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: getHeaders()
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        return handleApiError(error);
    }
}

// Farmer Management
export async function registerFarmer(farmerData) {
    return apiFetch('/farmers', 'POST', farmerData);
}

export async function getFarmers() {
    return apiFetch('/farmers');
}

export async function getFarmerById(id) {
    return apiFetch(`/farmers/${id}`);
}

// Farm Management
export async function registerFarm(farmData) {
    return apiFetch('/farms', 'POST', farmData);
}

export async function getFarms() {
    return apiFetch('/farms');
}

export async function getFarmById(id) {
    return apiFetch(`/farms/${id}`);
}

// Damage Assessment
export async function initiateAssessment(assessmentData) {
    return apiFetch('/assessments', 'POST', assessmentData);
}

export async function getAssessments() {
    return apiFetch('/assessments');
}

export async function getAssessmentById(id) {
    return apiFetch(`/assessments/${id}`);
}

// Image Upload
export async function uploadImage(file, type) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    
    try {
        const response = await fetch(`${API_BASE_URL}/images/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('aigri_token')}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        return handleApiError(error);
    }
}

// Reports
export async function generateReport(assessmentId) {
    return apiFetch(`/reports/${assessmentId}`);
}

export async function downloadReport(assessmentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/reports/${assessmentId}/download`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.blob();
    } catch (error) {
        return handleApiError(error);
    }
}

// Authentication
export async function login(email, password) {
    return apiFetch('/auth/login', 'POST', { email, password });
}

export async function logout() {
    localStorage.removeItem('aigri_token');
    localStorage.removeItem('aigri_user');
    window.location.href = '/login.html';
}

export async function getCurrentUser() {
    const user = localStorage.getItem('aigri_user');
    return user ? JSON.parse(user) : null;
}