// Global variables
let processedQuestions = [];
let currentSection = 'home';
let currentTheme = 'light';
let userLocation = null;

// Weather API configuration
const WEATHER_API_KEY = '207e61419b36600ebe514b58917f5dd0'; // Thay thế bằng API key thực tế
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateTime();
    updateGreeting();
    updateTheme();
    initializeWeather();
    initializeFileUpload();
    
    // Update time every second
    setInterval(updateTime, 1000);
    
    // Update weather every 30 minutes
    setInterval(initializeWeather, 30 * 60 * 1000);
    
    // Update theme every minute
    setInterval(updateTheme, 60 * 1000);
}

// Time and greeting functions
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = '';
    
    if (hour >= 5 && hour < 12) {
        greeting = 'Chào buổi sáng!';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Chào buổi chiều!';
    } else {
        greeting = 'Chào buổi tối!';
    }
    
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        greetingElement.textContent = greeting;
    }
}

// Theme switching based on time
function updateTheme() {
    const now = new Date();
    const hour = now.getHours();
    
    // Day theme: 6 AM to 6 PM
    // Night theme: 6 PM to 6 AM
    const isDay = hour >= 6 && hour < 18;
    const newTheme = isDay ? 'light' : 'dark';
    
    if (newTheme !== currentTheme) {
        currentTheme = newTheme;
        applyTheme(newTheme);
    }
}

function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
        root.style.setProperty('--bg-primary', '#1a1a1a');
        root.style.setProperty('--bg-secondary', '#2d2d2d');
        root.style.setProperty('--bg-tertiary', '#404040');
        root.style.setProperty('--text-primary', '#f0f0f0');
        root.style.setProperty('--text-secondary', '#b0b0b0');
        root.style.setProperty('--text-muted', '#808080');
        root.style.setProperty('--border-color', '#404040');
        root.style.setProperty('--border-light', '#505050');
        root.style.setProperty('--shadow-color', 'rgba(0,0,0,0.3)');
        root.style.setProperty('--shadow-light', 'rgba(0,0,0,0.2)');
        root.style.setProperty('--card-bg', '#2d2d2d');
        root.style.setProperty('--input-bg', '#2d2d2d');
        
        // Update background animation for night
        document.body.classList.add('night-theme');
    } else {
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8f9fa');
        root.style.setProperty('--bg-tertiary', '#f0f0f0');
        root.style.setProperty('--text-primary', '#333333');
        root.style.setProperty('--text-secondary', '#666666');
        root.style.setProperty('--text-muted', '#999999');
        root.style.setProperty('--border-color', '#e0e0e0');
        root.style.setProperty('--border-light', '#f0f0f0');
        root.style.setProperty('--shadow-color', 'rgba(0,0,0,0.1)');
        root.style.setProperty('--shadow-light', 'rgba(0,0,0,0.05)');
        root.style.setProperty('--card-bg', '#ffffff');
        root.style.setProperty('--card-bg', '#ffffff');
        root.style.setProperty('--input-bg', '#ffffff');
        
        // Update background animation for day
        document.body.classList.remove('night-theme');
    }
}

// Weather functions with real API
async function initializeWeather() {
    try {
        // First try to get user's location
        if (!userLocation) {
            await getUserLocation();
        }
        
        if (userLocation) {
            // Get weather data from API
            const weatherData = await getWeatherData(userLocation.lat, userLocation.lon);
            updateWeatherDisplay(weatherData);
        } else {
            // Fallback to mock data if location not available
            const mockWeather = getMockWeather();
            updateWeatherDisplay(mockWeather);
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        
        // Show specific error message for API issues
        if (error.message.includes('API Key')) {
            updateWeatherDisplay({
                temperature: '--°C',
                description: 'Lỗi API Key',
                humidity: '--%',
                windSpeed: '-- km/h',
                icon: '🔑',
                location: 'API Key cần được kích hoạt'
            });
            
            // Show notification with detailed error
            showError(`Lỗi thời tiết: ${error.message}`);
        } else if (error.message.includes('vượt quá giới hạn')) {
            updateWeatherDisplay({
                temperature: '--°C',
                description: 'Quá giới hạn API',
                humidity: '--%',
                windSpeed: '-- km/h',
                icon: '⏰',
                location: 'Thử lại sau'
            });
        } else {
            updateWeatherDisplay({
                temperature: '--°C',
                description: 'Không thể tải thời tiết',
                humidity: '--%',
                windSpeed: '-- km/h',
                icon: '🌤️',
                location: 'Vị trí không xác định'
            });
        }
    }
}

// Test weather API directly
async function testWeatherAPI() {
    try {
        // Show loading state
        updateWeatherDisplay({
            temperature: '--°C',
            description: 'Đang test API...',
            humidity: '--%',
            windSpeed: '-- km/h',
            icon: '🔍',
            location: 'Kiểm tra API Key'
        });
        
        // Test with Hanoi coordinates
        const testLat = 21.0285;
        const testLon = 105.8542;
        
        const testResponse = await fetch(
            `${WEATHER_API_BASE}/weather?lat=${testLat}&lon=${testLon}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`
        );
        
        if (testResponse.ok) {
            const testData = await testResponse.json();
            showSuccess('✅ API Key hoạt động bình thường!');
            
            // Update display with test data
            updateWeatherDisplay({
                temperature: `${Math.round(testData.main.temp)}°C`,
                description: getWeatherDescription(testData.weather[0].id, testData.weather[0].main),
                humidity: `${testData.main.humidity}%`,
                windSpeed: `${Math.round(testData.wind.speed * 3.6)} km/h`,
                icon: getWeatherIcon(testData.weather[0].id, testData.weather[0].icon),
                location: 'Hà Nội (Test)'
            });
        } else {
            const errorData = await testResponse.json();
            throw new Error(`API Test failed: ${errorData.message || errorData.cod}`);
        }
        
    } catch (error) {
        console.error('API Test error:', error);
        showError(`Test API thất bại: ${error.message}`);
        
        // Show error state
        updateWeatherDisplay({
            temperature: '--°C',
            description: 'Test thất bại',
            humidity: '--%',
            windSpeed: '-- km/h',
            icon: '❌',
            location: 'API Key có vấn đề'
        });
    }
}

// Get user's current location
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation không được hỗ trợ'));
            return;
        }
        
        // Show loading state
        updateWeatherDisplay({
            temperature: '--°C',
            description: 'Đang lấy vị trí...',
            humidity: '--%',
            windSpeed: '-- km/h',
            icon: '📍',
            location: 'Đang xác định vị trí'
        });
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                console.log('User location:', userLocation);
                resolve(userLocation);
            },
            (error) => {
                console.error('Geolocation error:', error);
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
}

// Get weather data from OpenWeatherMap API
async function getWeatherData(lat, lon) {
    try {
        // Get current weather
        const weatherResponse = await fetch(
            `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`
        );
        
        if (!weatherResponse.ok) {
            const errorData = await weatherResponse.json();
            console.error('Weather API error:', errorData);
            
            if (errorData.cod === 401) {
                throw new Error('API Key không hợp lệ hoặc chưa được kích hoạt. Vui lòng kiểm tra lại hoặc đợi vài giờ để API key được kích hoạt.');
            } else if (errorData.cod === 429) {
                throw new Error('Đã vượt quá giới hạn API calls. Vui lòng thử lại sau.');
            } else {
                throw new Error(`Lỗi API thời tiết: ${errorData.message || errorData.cod}`);
            }
        }
        
        const weatherData = await weatherResponse.json();
        
        // Get city name from reverse geocoding
        const cityResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}&lang=vi`
        );
        
        let cityName = 'Vị trí hiện tại';
        if (cityResponse.ok) {
            const cityData = await cityResponse.json();
            if (cityData.length > 0) {
                cityName = cityData[0].name;
                if (cityData[0].state) {
                    cityName += `, ${cityData[0].state}`;
                }
                if (cityData[0].country) {
                    cityName += `, ${cityData[0].country}`;
                }
            }
        }
        
        // Process weather data
        const processedWeather = {
            temperature: `${Math.round(weatherData.main.temp)}°C`,
            description: getWeatherDescription(weatherData.weather[0].id, weatherData.weather[0].main),
            humidity: `${weatherData.main.humidity}%`,
            windSpeed: `${Math.round(weatherData.wind.speed * 3.6)} km/h`, // Convert m/s to km/h
            icon: getWeatherIcon(weatherData.weather[0].id, weatherData.weather[0].icon),
            location: cityName,
            feelsLike: `${Math.round(weatherData.main.feels_like)}°C`,
            pressure: `${weatherData.main.pressure} hPa`,
            visibility: weatherData.visibility ? `${Math.round(weatherData.visibility / 1000)} km` : '-- km'
        };
        
        return processedWeather;
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Get weather description in Vietnamese
function getWeatherDescription(weatherId, weatherMain) {
    const descriptions = {
        200: 'Giông bão với mưa nhỏ',
        201: 'Giông bão với mưa',
        202: 'Giông bão với mưa lớn',
        210: 'Giông bão nhẹ',
        211: 'Giông bão',
        212: 'Giông bão mạnh',
        221: 'Giông bão dữ dội',
        230: 'Giông bão với mưa phùn nhẹ',
        231: 'Giông bão với mưa phùn',
        232: 'Giông bão với mưa phùn mạnh',
        300: 'Mưa phùn nhẹ',
        301: 'Mưa phùn',
        302: 'Mưa phùn mạnh',
        310: 'Mưa phùn nhẹ',
        311: 'Mưa phùn',
        312: 'Mưa phùn mạnh',
        313: 'Mưa và mưa phùn',
        314: 'Mưa lớn và mưa phùn',
        321: 'Mưa phùn',
        500: 'Mưa nhẹ',
        501: 'Mưa vừa',
        502: 'Mưa cường độ mạnh',
        503: 'Mưa rất mạnh',
        504: 'Mưa cực mạnh',
        511: 'Mưa đá',
        520: 'Mưa rào nhẹ',
        521: 'Mưa rào',
        522: 'Mưa rào mạnh',
        531: 'Mưa rào dữ dội',
        600: 'Tuyết nhẹ',
        601: 'Tuyết',
        602: 'Tuyết dày',
        611: 'Mưa tuyết',
        612: 'Mưa tuyết nhẹ',
        613: 'Mưa tuyết',
        615: 'Mưa nhẹ và tuyết',
        616: 'Mưa và tuyết',
        620: 'Mưa tuyết nhẹ',
        621: 'Mưa tuyết',
        622: 'Mưa tuyết mạnh',
        701: 'Sương mù',
        711: 'Khói mù',
        721: 'Sương mù nhẹ',
        731: 'Cát bay',
        741: 'Sương mù',
        751: 'Cát',
        761: 'Bụi',
        762: 'Tro núi lửa',
        771: 'Gió mạnh',
        781: 'Lốc xoáy',
        800: 'Trời quang',
        801: 'Ít mây',
        802: 'Mây rải rác',
        803: 'Mây cụm',
        804: 'Mây dày'
    };
    
    return descriptions[weatherId] || weatherMain;
}

// Get weather icon based on weather condition
function getWeatherIcon(weatherId, iconCode) {
    const icons = {
        200: '⛈️', 201: '⛈️', 202: '⛈️', 210: '⛈️', 211: '⛈️', 212: '⛈️', 221: '⛈️',
        230: '⛈️', 231: '⛈️', 232: '⛈️',
        300: '🌦️', 301: '🌦️', 302: '🌦️', 310: '🌦️', 311: '🌦️', 312: '🌦️',
        313: '🌦️', 314: '🌦️', 321: '🌦️',
        500: '🌧️', 501: '🌧️', 502: '🌧️', 503: '🌧️', 504: '🌧️', 511: '🧊',
        520: '🌧️', 521: '🌧️', 522: '🌧️', 531: '🌧️',
        600: '❄️', 601: '❄️', 602: '❄️', 611: '🌨️', 612: '🌨️', 613: '🌨️',
        615: '🌨️', 616: '🌨️', 620: '🌨️', 621: '🌨️', 622: '🌨️',
        701: '🌫️', 711: '🌫️', 721: '🌫️', 731: '🌫️', 741: '🌫️',
        751: '🌫️', 761: '🌫️', 762: '🌫️', 771: '💨', 781: '🌪️',
        800: '☀️', 801: '🌤️', 802: '⛅', 803: '☁️', 804: '☁️'
    };
    
    return icons[weatherId] || '🌤️';
}

// Fallback mock weather function
function getMockWeather() {
    const now = new Date();
    const hour = now.getHours();
    
    // Simulate different weather based on time
    if (hour >= 6 && hour < 18) {
        // Day time
        return {
            temperature: `${Math.floor(Math.random() * 15) + 20}°C`,
            description: 'Nắng đẹp',
            humidity: `${Math.floor(Math.random() * 30) + 50}%`,
            windSpeed: `${Math.floor(Math.random() * 20) + 5} km/h`,
            icon: '☀️',
            location: 'Vị trí mẫu (ban ngày)'
        };
    } else {
        // Night time
        return {
            temperature: `${Math.floor(Math.random() * 10) + 15}°C`,
            description: 'Mát mẻ',
            humidity: `${Math.floor(Math.random() * 20) + 60}%`,
            windSpeed: `${Math.floor(Math.random() * 15) + 3} km/h`,
            icon: '🌙',
            location: 'Vị trí mẫu (ban đêm)'
        };
    }
}

function updateWeatherDisplay(weather) {
    const iconElement = document.getElementById('weather-icon');
    const tempElement = document.getElementById('temperature');
    const descElement = document.getElementById('weather-desc');
    const humidityElement = document.getElementById('humidity');
    const windElement = document.getElementById('wind-speed');
    
    if (iconElement) iconElement.textContent = weather.icon;
    if (tempElement) tempElement.textContent = weather.temperature;
    if (descElement) descElement.textContent = weather.description;
    if (humidityElement) humidityElement.textContent = weather.humidity;
    if (windElement) windElement.textContent = weather.windSpeed;
    
    // Update location if available
    if (weather.location) {
        const locationElement = document.getElementById('weather-location');
        if (locationElement) {
            locationElement.textContent = weather.location;
        }
    }
}

// Navigation functions
function showHome() {
    currentSection = 'home';
    document.getElementById('home-section').style.display = 'block';
    document.getElementById('question-processor-section').style.display = 'none';
    
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector('.nav-link[onclick="showHome()"]').classList.add('active');
}

function showQuestionProcessor() {
    currentSection = 'question-processor';
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('question-processor-section').style.display = 'block';
    
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector('.nav-link[onclick="showQuestionProcessor()"]').classList.add('active');
}

function showHelp() {
    alert('Hướng dẫn sử dụng:\n\n1. Chọn "JSON Question Process" từ menu\n2. Tải lên file JSON hoặc nhập dữ liệu trực tiếp\n3. Chọn các tùy chọn xử lý\n4. Nhấn "Xử lý dữ liệu"\n5. Xuất kết quả ra Word hoặc Text');
}

// File upload functions
function initializeFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (fileUploadArea && fileInput) {
        // Click to upload
        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#764ba2';
            fileUploadArea.style.background = 'var(--bg-secondary)';
        });
        
        fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#667eea';
            fileUploadArea.style.background = 'var(--bg-tertiary)';
        });
        
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#667eea';
            fileUploadArea.style.background = 'var(--bg-tertiary)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }
}

function handleFileUpload(file) {
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                document.getElementById('jsonInput').value = content;
                showSuccess('File đã được tải lên thành công!');
            } catch (error) {
                showError('Lỗi khi đọc file: ' + error.message);
            }
        };
        reader.readAsText(file);
    } else {
        showError('Vui lòng chọn file JSON hợp lệ');
    }
}

// Data processing functions
function processData() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    
    if (!jsonInput) {
        showError('Vui lòng nhập dữ liệu JSON hoặc tải file lên');
        return;
    }
    
    try {
        const data = JSON.parse(jsonInput);
        const options = {
            removeDuplicates: document.getElementById('removeDuplicates').checked,
            filterImages: document.getElementById('filterImages').checked,
            cleanHtml: document.getElementById('cleanHtml').checked
        };
        
        // Send to server for processing
        fetch('/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data, options })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                processedQuestions = result.questions;
                displayResults(result);
                showSuccess('Dữ liệu đã được xử lý thành công!');
            } else {
                showError('Lỗi khi xử lý dữ liệu: ' + result.error);
            }
        })
        .catch(error => {
            showError('Lỗi kết nối: ' + error.message);
        });
        
    } catch (error) {
        showError('Dữ liệu JSON không hợp lệ: ' + error.message);
    }
}

function displayResults(result) {
    const resultsSection = document.getElementById('resultsSection');
    const totalQuestions = document.getElementById('totalQuestions');
    const processedQuestions = document.getElementById('processedQuestions');
    const duplicatesRemoved = document.getElementById('duplicatesRemoved');
    const questionsList = document.getElementById('questionsList');
    
    if (resultsSection) resultsSection.style.display = 'block';
    if (totalQuestions) totalQuestions.textContent = result.totalProcessed || 0;
    if (processedQuestions) processedQuestions.textContent = result.questions.length || 0;
    if (duplicatesRemoved) duplicatesRemoved.textContent = result.duplicatesRemoved || 0;
    
    if (questionsList) {
        questionsList.innerHTML = '';
        result.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            questionDiv.innerHTML = `
                <div class="question-content">
                    <strong>Câu ${question.id}:</strong> ${question.question}
                </div>
                <div class="answers-list">
                    ${question.answers.map((answer, ansIndex) => 
                        `<div class="answer-item">${String.fromCharCode(65 + ansIndex)}. ${answer.answer}</div>`
                    ).join('')}
                </div>
            `;
            questionsList.appendChild(questionDiv);
        });
    }
}

// Export functions
function showExportModal() {
    if (processedQuestions.length === 0) {
        showError('Không có dữ liệu để xuất');
        return;
    }
    document.getElementById('exportModal').style.display = 'block';
}

function closeExportModal() {
    document.getElementById('exportModal').style.display = 'none';
}

function exportToTXT() {
    if (processedQuestions.length === 0) {
        showError('Không có câu hỏi để xuất.');
        return;
    }
    
    let txtContent = 'DANH SÁCH CÂU HỎI\n';
    txtContent += '='.repeat(50) + '\n\n';
    
    processedQuestions.forEach((question, index) => {
        txtContent += `Câu ${question.id}:\n`;
        txtContent += `${question.question}\n\n`;
        txtContent += 'Đáp án:\n';
        
        question.answers.forEach((answer, ansIndex) => {
            const option = String.fromCharCode(65 + ansIndex);
            txtContent += `${option}. ${answer.answer}\n`;
        });
        
        txtContent += '\n' + '-'.repeat(30) + '\n\n';
    });
    
    const dataBlob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    downloadFile(dataBlob, 'questions.txt');
    closeExportModal();
}

function exportToWord() {
    if (processedQuestions.length === 0) {
        showError('Không có câu hỏi để xuất.');
        return;
    }
    
    // Send request to server to generate Word document
    fetch('/export-word', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedQuestions)
    })
    .then(async response => {
        if (!response.ok) {
            const message = await response.text().catch(() => '');
            throw new Error(message || 'Không thể tạo tài liệu xuất');
        }
        const contentType = response.headers.get('content-type') || '';
        const disposition = response.headers.get('content-disposition') || '';
        const blob = await response.blob();

        // Determine filename based on content type or header
        let filename = 'questions.docx';
        if (contentType.includes('text/plain')) {
            filename = 'questions.txt';
        } else {
            const match = /filename="?([^";]+)"?/i.exec(disposition);
            if (match && match[1]) filename = match[1];
        }

        downloadFile(blob, filename);
        closeExportModal();
        showSuccess('Tài liệu đã được xuất thành công!');
    })
    .catch(error => {
        showError('Lỗi khi xuất Word: ' + error.message);
    });
}

// Utility functions
function downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    showNotification(notification);
}

function showSuccess(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    showNotification(notification);
}

function showNotification(notification) {
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    if (notification.className.includes('error')) {
        notification.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)';
    }
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations and theme-specific styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .question-item {
        background: var(--card-bg);
        padding: 1.5rem;
        margin: 1rem 0;
        border-radius: 10px;
        box-shadow: 0 2px 10px var(--shadow-color);
        border-left: 4px solid #667eea;
        color: var(--text-primary);
    }
    
    .question-content {
        margin-bottom: 1rem;
        font-size: 1.1rem;
        line-height: 1.6;
        color: var(--text-primary);
    }
    
    .answers-list {
        margin-left: 1rem;
    }
    
    .answer-item {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-light);
        color: var(--text-secondary);
    }
    
    .answer-item:last-child {
        border-bottom: none;
    }
    
    /* Theme-specific background animations */
    .night-theme .background-animation .stars {
        opacity: 0.6;
    }
    
    .night-theme .background-animation .clouds {
        opacity: 0.05;
    }
    
    .night-theme .hero-container {
        background: rgba(45, 45, 45, 0.1);
        border-color: rgba(255, 255, 255, 0.1);
    }
    
    /* Smooth theme transitions */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
`;
document.head.appendChild(style);
