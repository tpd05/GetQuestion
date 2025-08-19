# 🌤️ Hướng dẫn thiết lập API thời tiết

## 📋 Yêu cầu
Để sử dụng tính năng dự báo thời tiết thực tế, bạn cần:

1. **API Key từ OpenWeatherMap** (miễn phí)
2. **Trình duyệt hỗ trợ Geolocation**
3. **Quyền truy cập vị trí** từ người dùng

## 🔑 Lấy API Key OpenWeatherMap

### Bước 1: Đăng ký tài khoản
1. Truy cập [OpenWeatherMap](https://openweathermap.org/)
2. Click "Sign Up" để tạo tài khoản mới
3. Xác nhận email

### Bước 2: Lấy API Key
1. Đăng nhập vào tài khoản
2. Vào [API Keys](https://home.openweathermap.org/api_keys)
3. Copy API Key (thường bắt đầu bằng `...`)
4. **Lưu ý**: API Key mới có thể mất vài giờ để kích hoạt

### Bước 3: Cập nhật code
1. Mở file `public/script.js`
2. Tìm dòng: `const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';`
3. Thay thế `YOUR_OPENWEATHERMAP_API_KEY` bằng API Key thực tế

```javascript
const WEATHER_API_KEY = 'abc123def456ghi789'; // API Key thực tế của bạn
```

## 🌍 Tính năng

### Vị trí tự động
- Sử dụng **Geolocation API** để lấy vị trí hiện tại
- **Reverse Geocoding** để hiển thị tên thành phố/tỉnh
- Hỗ trợ **tiếng Việt** cho mô tả thời tiết

### Dữ liệu thời tiết
- **Nhiệt độ** hiện tại (độ C)
- **Mô tả** thời tiết bằng tiếng Việt
- **Độ ẩm** (%)
- **Tốc độ gió** (km/h)
- **Vị trí** chính xác (thành phố, tỉnh, quốc gia)

### Cập nhật tự động
- **Thời tiết**: Cập nhật mỗi 30 phút
- **Vị trí**: Lưu cache trong 5 phút
- **Fallback**: Sử dụng dữ liệu mẫu nếu API lỗi

## 🚀 Sử dụng

### Lần đầu
1. Mở trang web
2. Cho phép truy cập vị trí khi trình duyệt hỏi
3. Widget thời tiết sẽ hiển thị dữ liệu thực tế

### Nếu không có quyền vị trí
- Widget sẽ hiển thị dữ liệu mẫu
- Vẫn có thể sử dụng các tính năng khác

## ⚠️ Lưu ý bảo mật

### API Key
- **KHÔNG** chia sẻ API Key công khai
- **KHÔNG** commit API Key vào Git repository
- Sử dụng **Environment Variables** trong production

### Vị trí
- Chỉ lấy vị trí khi cần thiết
- Không lưu trữ vị trí lâu dài
- Tuân thủ quyền riêng tư của người dùng

## 🔧 Troubleshooting

### Lỗi "Geolocation không được hỗ trợ"
- Kiểm tra trình duyệt có hỗ trợ Geolocation
- Đảm bảo sử dụng HTTPS (yêu cầu cho Geolocation)

### Lỗi "Weather API error"
- Kiểm tra API Key có đúng không
- Đợi vài giờ nếu API Key mới tạo
- Kiểm tra giới hạn API calls (1000 calls/ngày cho free tier)

### Không hiển thị vị trí
- Kiểm tra quyền truy cập vị trí
- Refresh trang và thử lại
- Kiểm tra console để xem lỗi

## 📱 Hỗ trợ trình duyệt

### Geolocation API
- ✅ Chrome 5+
- ✅ Firefox 3.5+
- ✅ Safari 5+
- ✅ Edge 12+
- ❌ Internet Explorer

### Fetch API
- ✅ Chrome 42+
- ✅ Firefox 39+
- ✅ Safari 10.1+
- ✅ Edge 14+
- ❌ Internet Explorer

## 💡 Tối ưu hóa

### Performance
- Cache vị trí trong 5 phút
- Cập nhật thời tiết mỗi 30 phút
- Sử dụng fallback data khi cần

### User Experience
- Loading state rõ ràng
- Error handling thân thiện
- Fallback data khi API lỗi

## 🆘 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra Console (F12) để xem lỗi
2. Xác nhận API Key đã được kích hoạt
3. Kiểm tra quyền truy cập vị trí
4. Thử refresh trang

---

**Lưu ý**: API thời tiết miễn phí có giới hạn 1000 calls/ngày. Nếu cần nhiều hơn, hãy nâng cấp lên gói trả phí.
