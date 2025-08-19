export async function onRequestPost({ request }) {
  try {
    const { data, options } = await request.json();

    if (!data) {
      return json({ success: false, error: 'No data provided' }, 400);
    }

    // Process questions (ESM-friendly inline implementation)
    const result = processQuestions(data, options || {});

    return json({
      success: true,
      questions: result.questions,
      totalProcessed: result.totalProcessed,
      duplicatesRemoved: result.duplicatesRemoved
    });
  } catch (error) {
    return json({ success: false, error: error.message }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function processQuestions(data, options) {
  const output = [];
  const seenIds = new Set();
  const dataGet = data['data'];

  if (!dataGet || !Array.isArray(dataGet) || dataGet.length === 0) {
    throw new Error('Invalid data format: data array is missing or empty');
  }

  const tests = dataGet[0]['test'];
  if (!tests || !Array.isArray(tests)) {
    throw new Error('Invalid data format: test array is missing or empty');
  }

  const removeDuplicates = options.removeDuplicates !== false; // default true
  const filterImages = options.filterImages === true; // default false
  const cleanHtml = options.cleanHtml !== false; // default true

  let count = 0;

  const cleanHtmlContent = (htmlContent) => {
    if (!htmlContent) return '';
    let cleaned = String(htmlContent)
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
      .replace(/<o:p[^>]*>/gi, '')
      .replace(/<\/o:p>/gi, '')
      .replace(/<br\s*\/?>(\n)?/gi, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned;
  };

  const containsImageTag = (content) => /<img\s[^>]*src=/i.test(String(content));

  const validateQuestion = (question) => {
    if (!question.id || !question.question_direction || !question.answer_option) return false;
    if (!Array.isArray(question.answer_option) || question.answer_option.length === 0) return false;
    return true;
  };

  tests.forEach((question, index) => {
    try {
      if (!validateQuestion(question)) return;

      const idQuestion = question['id'];

      // Check image on RAW content before cleaning if filtering is enabled
      if (filterImages) {
        const rawQ = String(question['question_direction'] || '');
        const rawAnswers = (question['answer_option'] || []).map((a) => String(a['value'] || '')); 
        const hasImg = containsImageTag(rawQ) || rawAnswers.some((v) => containsImageTag(v));
        if (hasImg) return;
      }

      const questionDirection = cleanHtml ? cleanHtmlContent(question['question_direction']) : String(question['question_direction'] || '');
      const answers = (question['answer_option'] || []).map((a) => ({
        id: a['id'],
        answer: cleanHtml ? cleanHtmlContent(a['value']) : String(a['value'] || '')
      }));

      if (removeDuplicates && seenIds.has(idQuestion)) return;
      if (removeDuplicates) seenIds.add(idQuestion);

      output.push({
        id: output.length + 1,
        originalId: idQuestion,
        question: questionDirection,
        answers
      });
      count++;
    } catch (_) {}
  });

  return {
    count,
    questions: output,
    totalProcessed: tests.length,
    duplicatesRemoved: tests.length - count
  };
}


