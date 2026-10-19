# AlexOS public site

Static public landing page for `alexos.ru`.

It contains no application code, database connection, resident data, or API credentials.

## Qualification quiz

`quiz.html` is a browser-local training tool linked from the staff section.
`quiz-questions.js` contains the 196-question bank, the educational answer key, source links, and review flags. The bank was reviewed on 2026-10-19.
`quiz.js` provides training, a 100-question / 120-minute practice exam, the full bank, an answer reference, and disputed-question review. Sixteen flagged questions are excluded from scored practice; this is not the official GZhI answer key. Progress is stored only in localStorage (`alexos.mkd-quiz.v1`), and the quiz makes no network requests for answers.

Open with a static web server, for example `python3 -m http.server 8000`, then visit `/quiz.html`. No build step or package installation is required. GitHub Pages serves the repository root.
