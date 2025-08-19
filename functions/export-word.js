// Cloudflare Pages Functions run on Workers (no Node.js stdlib),
// so we cannot use 'docx' package here. We'll return a plain text DOCX-like
// fallback by generating a minimal Word-compatible document using HTML (MHT is not allowed).
// Simplest approach: return a .txt with Word MIME so users can open in Word.

export async function onRequestPost({ request }) {
  try {
    const questions = await request.json();
    if (!Array.isArray(questions) || questions.length === 0) {
      return new Response(JSON.stringify({ error: 'No questions data provided' }), {
        status: 400,
        headers: { 'content-type': 'application/json; charset=utf-8' }
      });
    }

    let txtContent = 'DANH SÁCH CÂU HỎI\n';
    txtContent += '='.repeat(50) + '\n\n';
    for (const q of questions) {
      txtContent += `Câu ${q.id}:\n`;
      txtContent += `${sanitize(String(q.question || ''))}\n\n`;
      txtContent += 'Đáp án:\n';
      (q.answers || []).forEach((a, idx) => {
        const option = String.fromCharCode(65 + idx);
        txtContent += `${option}. ${sanitize(String(a.answer || ''))}\n`;
      });
      txtContent += '\n' + '-'.repeat(30) + '\n\n';
    }

    return new Response(txtContent, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'content-disposition': 'attachment; filename="questions.txt"'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: `Error generating export: ${err.message}` }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }
}

function sanitize(text) {
  return text
    .replace(/<o:p[^>]*>/gi, '')
    .replace(/<\/o:p>/gi, '')
    .replace(/<br\s*\/?>(\n)?/gi, ' ')
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


