// Cloudflare Pages Functions run on Workers (no Node.js stdlib),
// so we cannot use 'docx' package here. We'll return a Word-compatible
// .doc file by embedding HTML content with the correct MIME type so
// Microsoft Word opens it properly.

export async function onRequestPost({ request }) {
  try {
    const questions = await request.json();
    if (!Array.isArray(questions) || questions.length === 0) {
      return new Response(JSON.stringify({ error: 'No questions data provided' }), {
        status: 400,
        headers: { 'content-type': 'application/json; charset=utf-8' }
      });
    }

    const html = buildWordHtml(questions);

    return new Response(html, {
      headers: {
        // application/msword works broadly for .doc
        'content-type': 'application/msword; charset=utf-8',
        'content-disposition': 'attachment; filename="questions.doc"'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: `Error generating export: ${err.message}` }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }
}

function buildWordHtml(questions) {
  const rows = questions.map((q) => {
    const answers = (q.answers || []).map((a, i) => `${String.fromCharCode(65 + i)}. ${escapeHtml(String(a.answer || ''))}`).join('<br/>');
    return `
      <p style="margin:8pt 0; font-size:12pt;"><b>Câu ${escapeHtml(String(q.id))}: ${escapeHtml(String(q.question || ''))}</b></p>
      <div style="margin:4pt 0 12pt 18pt; font-size:12pt;">${answers}</div>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Danh sách câu hỏi</title>
<style>
body { font-family: "Times New Roman", serif; }
h1 { text-align:center; margin: 12pt 0 18pt 0; }
</style>
</head>
<body>
<h1><b>DANH SÁCH CÂU HỎI</b></h1>
${rows}
</body>
</html>`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


