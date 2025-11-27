import React, { useEffect, useState } from 'react'

const blogContent = {
  1: {
    title: '10 Tips to Crack Your First Technical Interview',
    category: 'Career Advice',
    author: 'John Smith',
    date: '2024-01-15',
    readTime: '5 min read',
    content: `
      <p>Technical interviews can be intimidating, especially for freshers entering the job market. However, with the right preparation and mindset, you can excel and land your dream job. Here are 10 proven strategies to help you succeed:</p>
      
      <h2>1. Master the Fundamentals</h2>
      <p>Before diving into complex algorithms, ensure you have a solid understanding of programming fundamentals. Review data structures (arrays, linked lists, stacks, queues, trees, graphs), algorithms (sorting, searching, dynamic programming), and complexity analysis (Big O notation).</p>
      
      <h2>2. Practice Coding Problems</h2>
      <p>Regular practice is key to success. Use platforms like LeetCode, HackerRank, or CodeSignal to solve problems daily. Start with easy problems and gradually move to medium and hard ones. Focus on understanding patterns rather than memorizing solutions.</p>
      
      <h2>3. Communicate Your Thought Process</h2>
      <p>Interviewers value clear communication. Always think out loud, explain your approach before coding, and discuss trade-offs. If you're stuck, ask clarifying questions and walk through your reasoning step by step.</p>
      
      <h2>4. Prepare for System Design</h2>
      <p>Even for entry-level positions, understanding system design basics is valuable. Learn about scalability, databases, caching, load balancing, and distributed systems. Practice designing simple systems like a URL shortener or a chat application.</p>
      
      <h2>5. Review Your Resume Projects</h2>
      <p>Be ready to discuss any project mentioned on your resume in detail. Understand the technologies used, challenges faced, and solutions implemented. Prepare to explain your role and contributions clearly.</p>
      
      <h2>6. Practice Behavioral Questions</h2>
      <p>Technical skills alone aren't enough. Prepare STAR (Situation, Task, Action, Result) stories for common behavioral questions. Examples include handling conflicts, working in teams, and overcoming challenges.</p>
      
      <h2>7. Mock Interviews</h2>
      <p>Practice with peers or use platforms like Pramp or InterviewBit for mock interviews. This helps you get comfortable with the interview format and receive feedback on your performance.</p>
      
      <h2>8. Research the Company</h2>
      <p>Understand the company's products, culture, and recent news. This shows genuine interest and helps you tailor your answers. Prepare thoughtful questions to ask the interviewer.</p>
      
      <h2>9. Manage Your Time</h2>
      <p>During coding interviews, manage your time wisely. Don't spend too long on one approach. If stuck, communicate your thought process and ask for hints rather than staying silent.</p>
      
      <h2>10. Stay Calm and Confident</h2>
      <p>Nervousness is normal, but confidence comes from preparation. Take deep breaths, stay positive, and remember that it's okay not to know everything. Focus on demonstrating your problem-solving abilities.</p>
      
      <p><strong>Remember:</strong> Technical interviews are not just about getting the right answer—they're about demonstrating your problem-solving skills, communication abilities, and cultural fit. With consistent practice and the right mindset, you can crack your first technical interview!</p>
    `,
  },
  2: {
    title: 'Top 5 Programming Languages to Learn in 2024',
    category: 'Skill Development',
    author: 'Sarah Johnson',
    date: '2024-01-10',
    readTime: '8 min read',
    content: `
      <p>The technology landscape is constantly evolving, and staying current with in-demand programming languages is crucial for career growth. Here are the top 5 programming languages that will give you a competitive edge in 2024:</p>
      
      <h2>1. Python</h2>
      <p>Python continues to dominate as one of the most versatile and beginner-friendly languages. Its applications span web development, data science, artificial intelligence, machine learning, automation, and more. With a massive community and extensive libraries, Python is ideal for both beginners and experienced developers.</p>
      <p><strong>Why Learn Python:</strong> High demand in data science and AI, excellent for automation, extensive job opportunities, and a supportive community.</p>
      
      <h2>2. JavaScript</h2>
      <p>JavaScript remains essential for web development, powering both frontend and backend (Node.js) applications. With frameworks like React, Vue, and Angular, JavaScript is the backbone of modern web development. Full-stack developers proficient in JavaScript are highly sought after.</p>
      <p><strong>Why Learn JavaScript:</strong> Universal web language, strong ecosystem, high demand for full-stack developers, and continuous evolution with new frameworks.</p>
      
      <h2>3. TypeScript</h2>
      <p>TypeScript, a superset of JavaScript, is gaining rapid adoption in enterprise applications. It adds static typing, making code more maintainable and reducing errors. Major frameworks like Angular and many React projects now use TypeScript by default.</p>
      <p><strong>Why Learn TypeScript:</strong> Better code quality, improved developer experience, growing adoption in enterprise, and seamless JavaScript integration.</p>
      
      <h2>4. Go (Golang)</h2>
      <p>Developed by Google, Go is known for its simplicity, performance, and excellent concurrency support. It's widely used in cloud services, microservices, and distributed systems. Companies like Docker, Kubernetes, and Uber use Go for their critical infrastructure.</p>
      <p><strong>Why Learn Go:</strong> Excellent performance, simple syntax, strong concurrency model, and growing adoption in cloud-native applications.</p>
      
      <h2>5. Rust</h2>
      <p>Rust is gaining popularity for systems programming, offering memory safety without garbage collection. It's used in performance-critical applications, embedded systems, and blockchain development. While it has a steeper learning curve, Rust developers are highly valued.</p>
      <p><strong>Why Learn Rust:</strong> Memory safety, high performance, growing adoption in systems programming, and strong community support.</p>
      
      <p><strong>Choosing the Right Language:</strong> Consider your career goals, industry trends, and personal interests. For web development, focus on JavaScript/TypeScript. For data science and AI, Python is essential. For systems programming, consider Go or Rust.</p>
    `,
  },
  3: {
    title: 'From Fresher to Frontend Developer: A Success Story',
    category: 'Career Advice',
    author: 'Priya Kumar',
    date: '2024-01-05',
    readTime: '6 min read',
    content: `
      <p>Meet Ananya, a recent computer science graduate who transformed her career from a confused fresher to a confident frontend developer at a top tech company—all within 6 months. Here's her inspiring journey:</p>
      
      <h2>The Beginning: Uncertainty and Doubt</h2>
      <p>After graduating in 2023, Ananya felt overwhelmed by the job market. Despite having a CS degree, she lacked practical skills and confidence. "I knew the theory but couldn't build anything real," she recalls. "I applied to dozens of companies but kept getting rejected."</p>
      
      <h2>The Turning Point: Finding the Right Path</h2>
      <p>Ananya discovered KiwisEdutech's Full-Stack Web Development certification program. What attracted her was the hands-on approach and industry-relevant curriculum. "The course focused on building real projects, not just learning concepts," she says.</p>
      
      <h2>The Journey: 6 Months of Intensive Learning</h2>
      <p><strong>Month 1-2: Foundations</strong><br/>
      Ananya started with HTML, CSS, and JavaScript fundamentals. She built her first responsive website and learned about modern CSS frameworks like Tailwind CSS.</p>
      
      <p><strong>Month 3-4: React and Modern Frameworks</strong><br/>
      She dove deep into React, learning hooks, state management, and component architecture. She built several projects, including a task management app and an e-commerce product page.</p>
      
      <p><strong>Month 5: Advanced Concepts</strong><br/>
      Ananya learned about routing, API integration, authentication, and deployment. She completed a full-stack project that showcased her skills.</p>
      
      <p><strong>Month 6: Portfolio and Interview Prep</strong><br/>
      With guidance from mentors, Ananya created a professional portfolio, optimized her LinkedIn profile, and practiced technical interviews. She applied to 20 companies and received 8 interview calls.</p>
      
      <h2>The Success: Landing the Dream Job</h2>
      <p>Ananya received offers from three companies and chose a position as a Frontend Developer at a leading fintech startup. "The interviewers were impressed by my portfolio and practical knowledge," she shares. "I could explain my code and discuss trade-offs confidently."</p>
      
      <h2>Key Takeaways from Ananya's Journey</h2>
      <ul>
        <li><strong>Consistency is Key:</strong> She dedicated 4-6 hours daily to learning and practice.</li>
        <li><strong>Build Real Projects:</strong> Portfolio projects demonstrated her skills better than certificates.</li>
        <li><strong>Seek Mentorship:</strong> Regular feedback from instructors helped her improve quickly.</li>
        <li><strong>Network Actively:</strong> She joined developer communities and attended webinars.</li>
        <li><strong>Stay Persistent:</strong> Rejections didn't stop her; she kept learning and applying.</li>
      </ul>
      
      <p><strong>Ananya's Advice to Freshers:</strong> "Don't wait for the perfect moment. Start learning today, build projects, and believe in yourself. The tech industry values skills over degrees. With dedication and the right guidance, anyone can make it!"</p>
    `,
  },
  4: {
    title: 'The Future of AI in Software Development',
    category: 'Industry Trends',
    author: 'Dr. Rajesh Verma',
    date: '2024-01-01',
    readTime: '10 min read',
    content: `
      <p>Artificial Intelligence is revolutionizing software development, transforming how we write code, test applications, and solve complex problems. Let's explore the current trends and future implications:</p>
      
      <h2>AI-Powered Development Tools</h2>
      <p>Tools like GitHub Copilot, ChatGPT, and Amazon CodeWhisperer are becoming integral to developers' workflows. These AI assistants can generate code, suggest improvements, debug errors, and even write tests—significantly increasing productivity.</p>
      
      <h2>Code Generation and Autocomplete</h2>
      <p>AI models trained on millions of code repositories can now generate functional code from natural language descriptions. This doesn't replace developers but augments their capabilities, allowing them to focus on architecture and problem-solving rather than boilerplate code.</p>
      
      <h2>Automated Testing and Quality Assurance</h2>
      <p>AI is transforming QA processes through automated test generation, intelligent bug detection, and predictive analytics. Machine learning algorithms can identify patterns in code that are likely to cause issues, enabling proactive fixes.</p>
      
      <h2>Intelligent Code Review</h2>
      <p>AI-powered code review tools analyze code for security vulnerabilities, performance issues, and best practices. They provide instant feedback, helping developers write better code faster.</p>
      
      <h2>Natural Language to Code</h2>
      <p>The ability to convert natural language descriptions directly into executable code is becoming a reality. This democratizes programming, allowing non-developers to create applications through conversational interfaces.</p>
      
      <h2>Predictive Maintenance</h2>
      <p>AI can predict when systems might fail, analyze performance metrics, and suggest optimizations. This proactive approach reduces downtime and improves system reliability.</p>
      
      <h2>The Developer's Role Evolution</h2>
      <p>Rather than replacing developers, AI is shifting their role toward:</p>
      <ul>
        <li>Architecture and system design</li>
        <li>Problem-solving and innovation</li>
        <li>AI tool integration and optimization</li>
        <li>Code review and quality assurance</li>
        <li>Collaboration and communication</li>
      </ul>
      
      <h2>Challenges and Considerations</h2>
      <p>While AI offers tremendous benefits, developers must consider:</p>
      <ul>
        <li>Code quality and security implications</li>
        <li>Intellectual property concerns</li>
        <li>The need for human oversight</li>
        <li>Learning curve for new tools</li>
        <li>Potential job market shifts</li>
      </ul>
      
      <h2>The Future Outlook</h2>
      <p>As AI continues to evolve, we can expect more sophisticated tools that understand context better, integrate seamlessly with development workflows, and provide more accurate suggestions. The developers who embrace AI tools while maintaining strong fundamentals will have a significant advantage.</p>
      
      <p><strong>Conclusion:</strong> AI in software development is not a threat but an opportunity. By leveraging AI tools effectively, developers can focus on creative problem-solving and building innovative solutions. The future belongs to developers who can work alongside AI, not against it.</p>
    `,
  },
  5: {
    title: 'How to Build an Impressive Tech Portfolio',
    category: 'Skill Development',
    author: 'Mike Chen',
    date: '2023-12-28',
    readTime: '7 min read',
    content: `
      <p>A well-crafted portfolio is your strongest asset when applying for tech jobs. It showcases your skills, demonstrates your problem-solving abilities, and sets you apart from other candidates. Here's how to build a portfolio that impresses hiring managers:</p>
      
      <h2>1. Choose Quality Over Quantity</h2>
      <p>Instead of including every project you've ever built, curate 3-5 of your best projects. Each project should demonstrate different skills and technologies. Quality projects that solve real problems are more impressive than numerous incomplete or simple projects.</p>
      
      <h2>2. Tell a Story with Each Project</h2>
      <p>For each project, include:</p>
      <ul>
        <li><strong>Problem Statement:</strong> What problem were you solving?</li>
        <li><strong>Solution Approach:</strong> How did you approach the problem?</li>
        <li><strong>Technologies Used:</strong> List all technologies, frameworks, and tools.</li>
        <li><strong>Challenges Faced:</strong> What obstacles did you overcome?</li>
        <li><strong>Results:</strong> What was the outcome? Include metrics if possible.</li>
        <li><strong>Live Demo:</strong> Link to deployed application.</li>
        <li><strong>Source Code:</strong> Link to GitHub repository.</li>
      </ul>
      
      <h2>3. Make It Visually Appealing</h2>
      <p>Your portfolio website should be:</p>
      <ul>
        <li>Clean and professional</li>
        <li>Responsive across all devices</li>
        <li>Fast-loading and optimized</li>
        <li>Easy to navigate</li>
        <li>Reflective of your design skills</li>
      </ul>
      
      <h2>4. Include Diverse Projects</h2>
      <p>Showcase variety in your portfolio:</p>
      <ul>
        <li>A full-stack application</li>
        <li>A frontend-focused project</li>
        <li>An API or backend project</li>
        <li>A mobile app (if applicable)</li>
        <li>A project using modern technologies</li>
      </ul>
      
      <h2>5. Write Clean, Documented Code</h2>
      <p>Your GitHub repositories should demonstrate:</p>
      <ul>
        <li>Clean, readable code</li>
        <li>Proper comments and documentation</li>
        <li>Good commit messages</li>
        <li>README files with setup instructions</li>
        <li>Consistent coding style</li>
      </ul>
      
      <h2>6. Add Personal Touches</h2>
      <p>Include an "About Me" section that shows your personality, passion for technology, and career goals. Add a contact section and links to your social profiles (LinkedIn, GitHub, etc.).</p>
      
      <h2>7. Keep It Updated</h2>
      <p>Regularly update your portfolio with new projects, skills, and achievements. Remove outdated projects and technologies. Keep your portfolio current with industry trends.</p>
      
      <h2>8. Get Feedback</h2>
      <p>Share your portfolio with peers, mentors, and professionals. Incorporate feedback to improve. Consider posting on platforms like Reddit or Dev.to for community feedback.</p>
      
      <p><strong>Remember:</strong> Your portfolio is a reflection of your skills and professionalism. Invest time in making it exceptional, and it will open doors to opportunities you never imagined!</p>
    `,
  },
  6: {
    title: 'Remote Work Trends: What Employers Look For',
    category: 'Industry Trends',
    author: 'Emily Davis',
    date: '2023-12-25',
    readTime: '6 min read',
    content: `
      <p>Remote work has become a permanent fixture in the tech industry. As companies adapt to distributed teams, understanding what employers value in remote candidates is crucial for career success. Here's what top companies are looking for:</p>
      
      <h2>1. Strong Communication Skills</h2>
      <p>Remote work relies heavily on written and verbal communication. Employers value candidates who can:</p>
      <ul>
        <li>Write clear, concise emails and messages</li>
        <li>Communicate effectively in video calls</li>
        <li>Document their work thoroughly</li>
        <li>Provide regular status updates</li>
        <li>Ask questions proactively</li>
      </ul>
      
      <h2>2. Self-Motivation and Discipline</h2>
      <p>Working remotely requires strong self-discipline. Employers look for candidates who can:</p>
      <ul>
        <li>Manage their time effectively</li>
        <li>Work independently without constant supervision</li>
        <li>Meet deadlines consistently</li>
        <li>Maintain productivity in a home environment</li>
        <li>Set and achieve personal goals</li>
      </ul>
      
      <h2>3. Technical Proficiency</h2>
      <p>Remote roles often require stronger technical skills because:</p>
      <ul>
        <li>Less in-person support is available</li>
        <li>You need to troubleshoot independently</li>
        <li>Collaboration happens through tools</li>
        <li>You must be comfortable with remote collaboration tools</li>
      </ul>
      
      <h2>4. Adaptability</h2>
      <p>The remote work environment is constantly evolving. Employers value candidates who can:</p>
      <ul>
        <li>Adapt to new tools and technologies quickly</li>
        <li>Handle changing priorities</li>
        <li>Work across different time zones</li>
        <li>Adjust to different communication styles</li>
      </ul>
      
      <h2>5. Results-Oriented Mindset</h2>
      <p>Remote work focuses on outcomes rather than hours worked. Employers appreciate candidates who:</p>
      <ul>
        <li>Focus on delivering results</li>
        <li>Set measurable goals</li>
        <li>Track and report progress</li>
        <li>Take ownership of their work</li>
      </ul>
      
      <h2>6. Cultural Fit</h2>
      <p>Even in remote settings, cultural fit matters. Employers look for:</p>
      <ul>
        <li>Alignment with company values</li>
        <li>Positive attitude and teamwork</li>
        <li>Respect for diversity and inclusion</li>
        <li>Commitment to continuous learning</li>
      </ul>
      
      <h2>How to Demonstrate These Qualities</h2>
      <p>In your resume and interviews, highlight:</p>
      <ul>
        <li>Experience with remote collaboration tools</li>
        <li>Projects completed independently</li>
        <li>Examples of proactive communication</li>
        <li>Time management achievements</li>
        <li>Remote work experience (if any)</li>
      </ul>
      
      <p><strong>Conclusion:</strong> Remote work is here to stay, and developing these skills will make you a highly sought-after candidate. Focus on building strong communication skills, self-discipline, and technical expertise to thrive in the remote work environment.</p>
    `,
  },
}

export default function BlogDetail() {
  const [blogId, setBlogId] = useState(null)
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    // Get blog ID from URL hash
    const hash = window.location.hash || ''
    const params = new URLSearchParams(hash.split('?')[1] || '')
    const id = parseInt(params.get('id'))
    
    if (id && blogContent[id]) {
      setBlogId(id)
      setBlog(blogContent[id])
    } else {
      // Redirect to blog page if invalid ID
      window.location.hash = '#/blog'
    }
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  if (!blog) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading article...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 pt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <a
            href="#/blog"
            className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </a>
          
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
              {blog.category}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700">
                  {blog.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="font-semibold text-gray-900">{blog.author}</span>
            </div>
            <span>•</span>
            <span>{formatDate(blog.date)}</span>
            <span>•</span>
            <span>{blog.readTime}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-12 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 sm:p-10 lg:p-12">
            <style>{`
              .blog-article-content {
                line-height: 1.8;
                color: #374151;
                font-size: 1.0625rem;
              }
              .blog-article-content h2 {
                font-size: 1.75rem;
                font-weight: 700;
                color: #111827;
                margin-top: 2.5rem;
                margin-bottom: 1rem;
                line-height: 1.3;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #e5e7eb;
              }
              .blog-article-content h2:first-of-type {
                margin-top: 0;
              }
              .blog-article-content p {
                margin-bottom: 1.25rem;
                color: #374151;
                font-size: 1.0625rem;
                line-height: 1.8;
              }
              .blog-article-content p:last-child {
                margin-bottom: 0;
              }
              .blog-article-content ul {
                margin: 1.25rem 0;
                padding-left: 2rem;
                list-style-type: disc;
                color: #374151;
              }
              .blog-article-content ul li {
                margin-bottom: 0.75rem;
                color: #374151;
                line-height: 1.7;
                padding-left: 0.5rem;
              }
              .blog-article-content ul li:last-child {
                margin-bottom: 0;
              }
              .blog-article-content ol {
                margin: 1.25rem 0;
                padding-left: 2rem;
                list-style-type: decimal;
                color: #374151;
              }
              .blog-article-content ol li {
                margin-bottom: 0.75rem;
                color: #374151;
                line-height: 1.7;
                padding-left: 0.5rem;
              }
              .blog-article-content strong {
                font-weight: 600;
                color: #111827;
              }
              .blog-article-content em {
                font-style: italic;
                color: #4b5563;
              }
              .blog-article-content a {
                color: #9333ea;
                text-decoration: underline;
                transition: color 0.2s ease;
              }
              .blog-article-content a:hover {
                color: #7e22ce;
              }
              @media (max-width: 640px) {
                .blog-article-content {
                  font-size: 1rem;
                }
                .blog-article-content h2 {
                  font-size: 1.5rem;
                  margin-top: 2rem;
                }
                .blog-article-content p {
                  font-size: 1rem;
                }
              }
            `}</style>
            <div 
              className="blog-article-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>
      </article>

      {/* Related Articles CTA */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to Read More?</h2>
          <p className="text-gray-600 mb-6">Explore more articles on career advice, skill development, and industry trends.</p>
          <a
            href="#/blog"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-lg hover:scale-105 hover:bg-primary-700"
          >
            Browse All Articles
          </a>
        </div>
      </section>
    </main>
  )
}

