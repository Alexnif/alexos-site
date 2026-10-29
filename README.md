# AlexOS public site

Static public landing page for `alexos.ru`.

It contains no application code, database connection, resident data, or API credentials.

## Qualification quiz

`quiz.html` is a browser-local training tool linked from the staff section.
`quiz-questions.js` contains the 196-question bank, the educational answer key, source links, and review flags. The bank was reviewed on 2026-10-19.
`quiz.js` provides training, a 100-question / 120-minute practice exam, the full bank, an answer reference, and disputed-question review. Sixteen flagged questions are excluded from scored practice; this is not the official GZhI answer key. Progress is stored only in localStorage (`alexos.mkd-quiz.v1`), and the quiz makes no network requests for answers.

Open with a static web server, for example `python3 -m http.server 8000`, then visit `/quiz.html`. No build step or package installation is required. GitHub Pages serves the repository root.

## Daily Public History

Maintain `updates.html` with newest dated entries first (Asia/Novokuznetsk).
Update the date navigation alongside each entry. Merge updates for the same date
instead of creating duplicate entries. Preserve previous entries and past plans.
Only verified, deployed changes belong under completed work. Clearly separate
testing, future directions and tentative next-day plans. Do not invent releases
or present payment preparation as enabled payment acceptance.
Publish no personal records, account numbers, financial totals, credentials,
private addresses or operational logs. Keep the homepage history link compact.
Before publishing, check page links, mobile layout and the existing resident guide.
