# JSON Question Processor

A modern web application for processing JSON data and extracting formatted questions with advanced features.

## ✨ Features

- **Multiple Input Methods**: Paste JSON data or upload JSON files
- **Drag & Drop Support**: Easy file upload with drag and drop interface
- **Advanced Processing**: Remove duplicates, filter image questions, validate data structure
- **Multiple Data Sets**: Process multiple JSON data sets simultaneously
- **Export Options**: Export questions in JSON, CSV, TXT, or Word formats
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Statistics**: View processing statistics and results
- **Keyboard Shortcuts**: Ctrl+Enter to process data, Escape to close modals

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Production

To run in production mode:
```bash
npm start
```

## ☁️ Deploy trên Cloudflare Pages

Ứng dụng có thể deploy trên Cloudflare Pages (Functions) với kiến trúc full static + serverless functions.

### Cấu trúc Pages Functions

- `functions/upload.js`: xử lý POST `/upload`
- `functions/export-word.js`: xử lý POST `/export-word` (trên Cloudflare trả về file `.txt` an toàn; môi trường Node cục bộ vẫn xuất `.docx`)
- `functions/health.js`: xử lý GET `/health`

### Các bước deploy

1. Push mã nguồn lên GitHub/GitLab
2. Trên Cloudflare, tạo dự án Pages mới, kết nối repo
3. Thiết lập Build:
   - Build command: (để trống) hoặc `npm ci` nếu cần
   - Build output directory: `public`
   - Pages Functions: Cloudflare tự phát hiện thư mục `functions/`
4. Deploy

### Lưu ý

- Export Word trên Cloudflare Pages không dùng được gói `docx` (Node API không có trên Workers). Chúng tôi trả về `.txt` thay thế. Khi chạy cục bộ bằng `server.js`, bạn vẫn xuất `.docx` chuẩn.
- Frontend gọi API bằng đường dẫn tương đối (`/upload`, `/export-word`, `/health`) nên hoạt động tốt trên Pages.
- Nếu dùng API thời tiết, không commit API key công khai. Dùng biến môi trường hoặc proxy.

## 📁 Project Structure

```
json-question-processor/
├── public/                 # Static files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styles
│   └── script.js          # Frontend JavaScript
├── utils/                  # Utility modules
│   └── questionProcessor.js # Question processing logic
├── server.js              # Express server
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

### Customization

You can modify the following files to customize the application:

- `public/styles.css`: Change colors, fonts, and layout
- `public/script.js`: Modify frontend functionality
- `utils/questionProcessor.js`: Adjust question processing logic
- `server.js`: Modify server configuration and routes

## 📊 Usage

### 1. Input Data

- **File Upload**: Click the upload area or drag & drop JSON files
- **Text Input**: Paste JSON data directly into textareas
- **Multiple Sets**: Add multiple data sets for batch processing

### 2. Processing Options

- **Remove Duplicates**: Automatically remove duplicate questions
- **Filter Images**: Skip questions containing images
- **Validate Data**: Ensure proper JSON structure

### 3. View Results

- **Statistics**: See total questions, processed count, and duplicates removed
- **Question Display**: View formatted questions with answers
- **Metadata**: Display category and difficulty information if available

### 4. Export Data

- **JSON Format**: Structured data export
- **CSV Format**: Spreadsheet-compatible format
- **TXT Format**: Plain text format for easy reading
- **Word Format**: Professional document format with proper formatting

## 🎯 Supported JSON Format

The application expects JSON data in the following format:

```json
{
  "data": [
    {
      "test": [
        {
          "id": "unique_id",
          "question_direction": "Question text here",
          "answer_option": [
            {
              "id": "answer_id",
              "value": "Answer text"
            }
          ],
          "category": "Optional category",
          "difficulty": "Optional difficulty level"
        }
      ]
    }
  ]
}
```

## 🛠️ API Endpoints

- `GET /`: Main application page
- `POST /upload`: Process JSON data
- `POST /upload-file`: Upload and process JSON files
- `GET /api/questions`: API information
- `GET /health`: Health check endpoint

## 🎨 Customization

### Styling

The application uses CSS custom properties and modern CSS features. You can easily customize:

- Color scheme in `public/styles.css`
- Fonts and typography
- Layout and spacing
- Animations and transitions

### Functionality

Extend the application by:

- Adding new export formats
- Implementing question filtering
- Adding user authentication
- Creating question banks
- Adding search functionality

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `server.js` or kill the process using the port
2. **File upload errors**: Ensure the file is valid JSON format
3. **Processing errors**: Check the JSON structure matches the expected format

### Debug Mode

Enable debug logging by setting `NODE_ENV=development`:

```bash
NODE_ENV=development npm run dev
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review the code comments
3. Create an issue in the repository

## 🔮 Future Enhancements

- Question difficulty analysis
- Question categorization
- User accounts and question banks
- API rate limiting
- Question validation rules
- Bulk import/export
- Question templates
- Multi-language support

---

**Happy Question Processing! 🎉**
