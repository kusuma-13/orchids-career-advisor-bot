const testResume = async () => {
  const response = await fetch('http://localhost:3000/api/resume-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resumeText: `John Doe
Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567 | New York, NY

SUMMARY
Experienced software engineer with 5+ years of experience in full-stack web development. Passionate about building scalable applications and leading technical teams.

SKILLS
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB, Git, CI/CD

EXPERIENCE
Senior Software Engineer | TechCo Inc. | 2020 - Present
- Led a team of 5 developers in building a new customer portal that increased user engagement by 40%
- Implemented microservices architecture that reduced system downtime by 60%
- Mentored 3 junior developers through code reviews and pair programming sessions

Software Engineer | StartupXYZ | 2018 - 2020
- Developed RESTful APIs serving 10,000+ daily active users
- Reduced page load time by 50% through performance optimization
- Built automated testing pipeline that increased code coverage to 85%

EDUCATION
Bachelor of Science in Computer Science | MIT | 2018
GPA: 3.8/4.0`
    })
  });
  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
};

testResume().catch(console.error);
