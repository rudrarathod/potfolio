const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function generate() {
  console.log('Generating PDF CV...');

  const dataPath = path.join(__dirname, '..', 'src', 'data', 'resume.json');
  if (!fs.existsSync(dataPath)) {
    console.error('ERROR: resume.json not found!');
    process.exit(1);
  }

  const resume = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Define clean HTML template
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resume.name} - Resume</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #2c3e50;
      line-height: 1.4;
      font-size: 9.5pt;
      padding: 0;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #2c3e50;
      padding-bottom: 10px;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .header-left h1 {
      font-size: 24pt;
      color: #2c3e50;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header-left p {
      font-size: 11pt;
      color: #7f8c8d;
      font-weight: 500;
      margin-top: 2px;
    }
    .header-right {
      text-align: right;
      font-size: 8.5pt;
      color: #34495e;
      line-height: 1.5;
    }
    .header-right a {
      color: #34495e;
      text-decoration: none;
    }
    .header-right a:hover {
      text-decoration: underline;
    }
    .container {
      display: flex;
      gap: 0.4in;
    }
    .left-col {
      width: 32%;
    }
    .right-col {
      width: 68%;
    }
    .section {
      margin-bottom: 15px;
    }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      color: #2c3e50;
      text-transform: uppercase;
      border-bottom: 1px solid #bdc3c7;
      padding-bottom: 3px;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .objective-text {
      color: #34495e;
      text-align: justify;
      font-size: 9.5pt;
    }
    .job {
      margin-bottom: 12px;
    }
    .job-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      color: #2c3e50;
      font-size: 9.5pt;
    }
    .job-company {
      color: #2980b9;
      font-weight: 600;
      margin-top: 1px;
      font-size: 9pt;
    }
    .job-bullets {
      margin-top: 4px;
      margin-left: 15px;
    }
    .job-bullets li {
      margin-bottom: 3px;
      color: #34495e;
      font-size: 9pt;
    }
    .edu-item {
      margin-bottom: 10px;
    }
    .edu-degree {
      font-weight: bold;
      color: #2c3e50;
      font-size: 9pt;
    }
    .edu-school {
      color: #34495e;
      font-size: 8.5pt;
      margin-top: 1px;
    }
    .skill-cat {
      margin-bottom: 8px;
    }
    .skill-cat-title {
      font-weight: bold;
      color: #2c3e50;
      font-size: 8.5pt;
      margin-bottom: 2px;
    }
    .skill-list {
      color: #34495e;
      font-size: 8.5pt;
    }
    .list-bullets {
      margin-left: 15px;
      margin-top: 4px;
    }
    .list-bullets li {
      margin-bottom: 2px;
      color: #34495e;
      font-size: 9pt;
    }
    
    @page {
      margin: 0.4in;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>${resume.name}</h1>
      <p>${resume.title}</p>
    </div>
    <div class="header-right">
      Email: <a href="mailto:${resume.email}">${resume.email}</a><br>
      GitHub: <a href="${resume.github}" target="_blank">${resume.github.replace('https://', '')}</a><br>
      LinkedIn: <a href="${resume.linkedin}" target="_blank">${resume.linkedin.replace('https://www.linkedin.com/in/', '')}</a>
    </div>
  </div>

  <div class="container">
    <div class="left-col">
      <div class="section">
        <div class="section-title">Education</div>
        ${resume.education.map(edu => `
          <div class="edu-item">
            <div class="edu-degree">${edu.degree}</div>
            <div class="edu-school">${edu.school}</div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skill-cat">
          <div class="skill-cat-title">Languages</div>
          <div class="skill-list">${resume.skills.languages.join(', ')}</div>
        </div>
        <div class="skill-cat">
          <div class="skill-cat-title">Frontend</div>
          <div class="skill-list">${resume.skills.frontend.join(', ')}</div>
        </div>
        <div class="skill-cat">
          <div class="skill-cat-title">Backend</div>
          <div class="skill-list">${resume.skills.backend.join(', ')}</div>
        </div>
        <div class="skill-cat">
          <div class="skill-cat-title">Databases</div>
          <div class="skill-list">${resume.skills.databases.join(', ')}</div>
        </div>
        <div class="skill-cat">
          <div class="skill-cat-title">AI & ML</div>
          <div class="skill-list">${resume.skills['ai-ml'].join(', ')}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Languages</div>
        <div class="skill-list">${resume.languages.join('<br>')}</div>
      </div>
    </div>

    <div class="right-col">
      <div class="section">
        <div class="section-title">Objective</div>
        <div class="objective-text">${resume.objective}</div>
      </div>

      <div class="section">
        <div class="section-title">Experience</div>
        ${resume.experience.map(exp => `
          <div class="job">
            <div class="job-header">
              <span>${exp.role}</span>
              <span style="font-weight: normal; color: #7f8c8d; font-size: 8.5pt;">${exp.period}</span>
            </div>
            <div class="job-company">${exp.company}</div>
            <ul class="job-bullets">
              ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Achievements</div>
        <ul class="list-bullets">
          ${resume.certifications.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</body>
</html>`;

  const tempHtmlPath = path.join(__dirname, '..', 'public', 'temp-resume.html');
  const pdfPath = path.join(__dirname, '..', 'public', 'cv.pdf');

  fs.writeFileSync(tempHtmlPath, html, 'utf-8');

  // Verify Chrome installation
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(chromePath)) {
    console.warn(`WARNING: Google Chrome was not found at "${chromePath}".`);
    console.warn('Skipping CV PDF generation (will retain existing cv.pdf).');
    try {
      fs.unlinkSync(tempHtmlPath);
    } catch {}
    process.exit(0);
  }

  try {
    console.log('Running headless Google Chrome to compile PDF...');
    execSync(`"${chromePath}" --headless --disable-gpu --no-sandbox --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${tempHtmlPath}"`);
    console.log(`Successfully generated printable PDF CV at: ${pdfPath}`);
  } catch (err) {
    console.error('Error generating PDF via Google Chrome:', err.message);
  } finally {
    try {
      fs.unlinkSync(tempHtmlPath);
    } catch {}
  }
}

generate();
