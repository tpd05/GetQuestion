/**
 * Question Processor Utility
 * Handles the processing of JSON data to extract and format questions
 */

function processQuestions(data) {
  const output = [];
  const seenIds = new Set(); // Set to track seen IDs
  const dataGet = data['data'];
  
  if (!dataGet || !Array.isArray(dataGet) || dataGet.length === 0) {
    throw new Error('Invalid data format: data array is missing or empty');
  }
  
  const tests = dataGet[0]['test'];
  
  if (!tests || !Array.isArray(tests)) {
    throw new Error('Invalid data format: test array is missing or empty');
  }
  
  let count = 0; // Counter for valid questions

  // Function to clean HTML content
  function cleanHtmlContent(htmlContent) {
    if (!htmlContent) return '';
    
    // Remove unnecessary HTML tags but keep content
    let cleaned = htmlContent
      .replace(/<p[^>]*>/gi, '') // Remove <p> tags
      .replace(/<\/p>/gi, '') // Remove closing </p> tags
      .replace(/<span[^>]*>/gi, '') // Remove <span> tags
      .replace(/<\/span>/gi, '') // Remove closing </span> tags
      .replace(/<div[^>]*>/gi, '') // Remove <div> tags
      .replace(/<\/div>/gi, '') // Remove closing </div> tags
      .replace(/<strong[^>]*>/gi, '') // Remove <strong> tags
      .replace(/<\/strong>/gi, '') // Remove closing </strong> tags
      .replace(/<b[^>]*>/gi, '') // Remove <b> tags
      .replace(/<\/b>/gi, '') // Remove closing </b> tags
      .replace(/<i[^>]*>/gi, '') // Remove <i> tags
      .replace(/<\/i>/gi, '') // Remove closing </i> tags
      .replace(/<u[^>]*>/gi, '') // Remove <u> tags
      .replace(/<\/u>/gi, '') // Remove closing </u> tags
      .replace(/<o:p[^>]*>/gi, '') // Remove <o:p> tag
      .replace(/<\/o:p>/gi, '') // Remove closing </o:p>
      .replace(/<br\s*\/?>/gi, ' ') // Replace <br> with space
      .replace(/&nbsp;/gi, ' ') // Replace &nbsp; with space
      .replace(/\s+/g, ' ') // Remove extra whitespace
      .trim(); // Remove leading/trailing whitespace
    
    return cleaned;
  }

  // Function to validate question data
  function validateQuestion(question) {
    if (!question.id || !question.question_direction || !question.answer_option) {
      return false;
    }
    
    if (!Array.isArray(question.answer_option) || question.answer_option.length === 0) {
      return false;
    }
    
    return true;
  }

  tests.forEach((question, index) => {
    try {
      // Validate question structure
      if (!validateQuestion(question)) {
        console.warn(`Skipping invalid question at index ${index}:`, question);
        return;
      }

      const idQuestion = question["id"];
      const questionDirection = cleanHtmlContent(question['question_direction']);
      const answers = question['answer_option'].map(a => ({
        id: a['id'],
        answer: cleanHtmlContent(a['value'])
      }));

      // Check if question contains images
      const containsImage = questionDirection.includes('<img') || 
                           answers.some(answer => answer.answer.includes('<img'));

      // If no images and ID hasn't been seen, add to output
      if (!containsImage && !seenIds.has(idQuestion)) {
        seenIds.add(idQuestion);
        output.push({
          id: count + 1,
          originalId: idQuestion,
          question: questionDirection,
          answers: answers
        });
        count++;
      }
    } catch (error) {
      console.error(`Error processing question at index ${index}:`, error);
    }
  });

  return {
    count: count,
    questions: output,
    totalProcessed: tests.length,
    duplicatesRemoved: tests.length - count
  };
}

module.exports = {
  processQuestions
};
