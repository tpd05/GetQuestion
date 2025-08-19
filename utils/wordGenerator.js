const { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Packer, WidthType } = require('docx');

/**
 * Generate Word document from questions data
 * @param {Array} questions - Array of question objects
 * @returns {Buffer} - Word document as buffer
 */
async function generateWordDocument(questions) {
  const doc = new Document({
    creator: "JSON Question Processor",
    title: "Danh sách câu hỏi",
    description: "Tài liệu được tạo tự động từ ứng dụng xử lý câu hỏi",
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440,    // 1 inch
            right: 1440,  // 1 inch
            bottom: 1440, // 1 inch
            left: 1440    // 1 inch
          }
        }
      },
      children: [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: "DANH SÁCH CÂU HỎI",
              bold: true,
              size: 28,
              font: "Times New Roman"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400,
            before: 400
          }
        }),
        
        // Questions
        ...questions.map(question => [
          // Question text
          new Paragraph({
            children: [
              new TextRun({
                text: `Câu ${question.id}: `,
                bold: true,
                size: 26,
                font: "Times New Roman"
              }),
              new TextRun({
                text: sanitizeForWord(question.question),
                bold: true,
                size: 26,
                font: "Times New Roman"
              })
            ],
            spacing: {
              after: 200,
              before: 300
            }
          }),
          
          // Answers
          ...question.answers.map((answer, index) => {
            const option = String.fromCharCode(65 + index); // A, B, C, D...
            return new Paragraph({
              children: [
                new TextRun({
                  text: `${option}. `,
                  size: 24,
                  font: "Times New Roman"
                }),
                new TextRun({
                  text: sanitizeForWord(answer.answer),
                  size: 24,
                  font: "Times New Roman"
                })
              ],
              spacing: {
                after: 100
              },
              indent: {
                left: 720 // 0.5 inch indent for answers
              }
            });
          }),
          // Removed metadata display per request
          
          // Separator line - REMOVED per user request
        ]).flat()
      ]
    }]
  });

  try {
    // Sử dụng options để tạo file an toàn hơn
    const buffer = await Packer.toBuffer(doc, {
      useBase64: false,
      useCDN: false
    });
    return buffer;
  } catch (error) {
    throw new Error(`Failed to generate Word document: ${error.message}`);
  }
}

// Remove MS Office residual tags like <o:p> and any simple HTML remnants
function sanitizeForWord(text) {
  if (!text) return '';
  return String(text)
    .replace(/<o:p[^>]*>/gi, '')
    .replace(/<\/o:p>/gi, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    .replace(/<strong[^>]*>/gi, '')
    .replace(/<\/strong>/gi, '')
    .replace(/<b[^>]*>/gi, '')
    .replace(/<\/b>/gi, '')
    .replace(/<i[^>]*>/gi, '')
    .replace(/<\/i>/gi, '')
    .replace(/<u[^>]*>/gi, '')
    .replace(/<\/u>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = {
  generateWordDocument
};
