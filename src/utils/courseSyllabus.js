// Comprehensive syllabus data for all courses

export const courseSyllabus = {
  // Full-Stack Web Development
  'Full-Stack Web Development': {
    overview: 'This comprehensive course covers the entire MERN (MongoDB, Express, React, Node.js) stack, from frontend development to backend architecture. You\'ll build real-world applications and learn industry best practices.',
    modules: [
      {
        title: 'HTML, CSS & JavaScript Fundamentals',
        duration: '2 weeks',
        topics: [
          'HTML5 semantic elements and structure',
          'CSS3 advanced styling and Flexbox/Grid',
          'JavaScript ES6+ features (Arrow functions, Destructuring, Promises)',
          'DOM manipulation and event handling',
          'Async/await and fetch API'
        ]
      },
      {
        title: 'React Fundamentals',
        duration: '3 weeks',
        topics: [
          'React components and JSX',
          'State and props management',
          'React Hooks (useState, useEffect, useContext)',
          'Custom hooks and component composition',
          'React Router for navigation',
          'Context API for state management'
        ]
      },
      {
        title: 'Node.js & Express Backend',
        duration: '3 weeks',
        topics: [
          'Node.js fundamentals and NPM',
          'Express.js framework setup',
          'RESTful API design and development',
          'Middleware and authentication',
          'File uploads and error handling',
          'API testing with Postman'
        ]
      },
      {
        title: 'MongoDB Database',
        duration: '2 weeks',
        topics: [
          'MongoDB installation and setup',
          'CRUD operations',
          'Mongoose ODM',
          'Schema design and data modeling',
          'Aggregation and indexing',
          'MongoDB Atlas cloud database'
        ]
      },
      {
        title: 'Full-Stack Integration & Deployment',
        duration: '2 weeks',
        topics: [
          'Connecting frontend and backend',
          'JWT authentication',
          'Deployment on Vercel/Netlify',
          'CI/CD pipelines',
          'Performance optimization',
          'Security best practices'
        ]
      }
    ],
    learningOutcomes: [
      'Build complete full-stack web applications',
      'Design and implement RESTful APIs',
      'Work with MongoDB databases',
      'Implement user authentication and authorization',
      'Deploy applications to production',
      'Write clean, maintainable code following best practices'
    ],
    prerequisites: [
      'Basic understanding of programming concepts',
      'Familiarity with any programming language',
      'Computer with internet connection'
    ],
    projects: [
      {
        name: 'E-Commerce Platform',
        description: 'Build a complete e-commerce site with cart, checkout, and payment integration'
      },
      {
        name: 'Social Media Dashboard',
        description: 'Create a social media dashboard with real-time updates and user profiles'
      },
      {
        name: 'Task Management App',
        description: 'Develop a collaborative task management application with team features'
      }
    ],
    aiTools: [
      {
        name: 'GitHub Copilot',
        description: 'AI-powered code completion and suggestions'
      },
      {
        name: 'ChatGPT for Development',
        description: 'AI assistant for debugging and code explanations'
      }
    ],
    certification: 'Upon completion, you will receive an industry-recognized certificate in Full-Stack Web Development.'
  },

  // Data Science & Machine Learning
  'Data Science & Machine Learning': {
    overview: 'Master data science from fundamentals to advanced machine learning. Learn Python, statistical analysis, data visualization, and build ML models for real-world problems.',
    modules: [
      {
        title: 'Python for Data Science',
        duration: '3 weeks',
        topics: [
          'Python basics and data structures',
          'NumPy for numerical computing',
          'Pandas for data manipulation',
          'Data cleaning and preprocessing',
          'Working with CSV, JSON, and databases'
        ]
      },
      {
        title: 'Data Visualization',
        duration: '2 weeks',
        topics: [
          'Matplotlib and Seaborn',
          'Plotly for interactive visualizations',
          'Creating dashboards',
          'Data storytelling techniques',
          'Best practices in data visualization'
        ]
      },
      {
        title: 'Statistical Analysis',
        duration: '3 weeks',
        topics: [
          'Descriptive and inferential statistics',
          'Hypothesis testing',
          'Correlation and regression analysis',
          'A/B testing',
          'Statistical modeling'
        ]
      },
      {
        title: 'Machine Learning Fundamentals',
        duration: '4 weeks',
        topics: [
          'Supervised learning (Linear Regression, Logistic Regression)',
          'Classification algorithms (Decision Trees, Random Forest, SVM)',
          'Unsupervised learning (K-Means, Hierarchical Clustering)',
          'Model evaluation and validation',
          'Feature engineering and selection'
        ]
      },
      {
        title: 'Advanced ML & Deep Learning',
        duration: '4 weeks',
        topics: [
          'Neural networks and deep learning',
          'TensorFlow and Keras',
          'Natural Language Processing',
          'Computer Vision basics',
          'Model deployment and MLOps'
        ]
      }
    ],
    learningOutcomes: [
      'Analyze and visualize complex datasets',
      'Build predictive machine learning models',
      'Apply statistical methods to solve business problems',
      'Implement deep learning solutions',
      'Deploy ML models to production',
      'Present data insights effectively'
    ],
    prerequisites: [
      'Basic mathematics knowledge',
      'Logical thinking ability',
      'Willingness to learn programming'
    ],
    projects: [
      {
        name: 'Customer Churn Prediction',
        description: 'Predict customer churn using classification algorithms'
      },
      {
        name: 'Sales Forecasting Model',
        description: 'Build time series forecasting models for sales prediction'
      },
      {
        name: 'Image Classification System',
        description: 'Create an image classifier using deep learning'
      }
    ],
    aiTools: [
      {
        name: 'TensorFlow',
        description: 'Open-source machine learning framework by Google'
      },
      {
        name: 'Jupyter AI',
        description: 'AI-powered notebook for data science workflows'
      },
      {
        name: 'Hugging Face',
        description: 'Platform for AI models and transformers'
      }
    ],
    certification: 'Earn a certificate in Data Science & Machine Learning with hands-on project portfolio.'
  },

  // React & Next.js Mastery
  'React & Next.js Mastery': {
    overview: 'Advanced React patterns, Next.js framework, server-side rendering, and modern frontend architecture. Build high-performance, scalable web applications.',
    modules: [
      {
        title: 'Advanced React Patterns',
        duration: '2 weeks',
        topics: [
          'Higher-Order Components (HOCs)',
          'Render Props pattern',
          'Compound Components',
          'React Performance Optimization',
          'Code splitting and lazy loading',
          'Memoization techniques'
        ]
      },
      {
        title: 'Next.js Fundamentals',
        duration: '2 weeks',
        topics: [
          'Next.js setup and routing',
          'Server-Side Rendering (SSR)',
          'Static Site Generation (SSG)',
          'API Routes',
          'Image optimization',
          'Font optimization'
        ]
      },
      {
        title: 'State Management & Data Fetching',
        duration: '2 weeks',
        topics: [
          'Redux Toolkit',
          'Zustand for state management',
          'React Query for data fetching',
          'SWR for data synchronization',
          'Caching strategies'
        ]
      },
      {
        title: 'Testing & Deployment',
        duration: '2 weeks',
        topics: [
          'Jest and React Testing Library',
          'Unit and integration testing',
          'End-to-end testing with Cypress',
          'Vercel deployment',
          'Performance monitoring'
        ]
      }
    ],
    learningOutcomes: [
      'Build production-ready React applications',
      'Implement server-side rendering with Next.js',
      'Optimize application performance',
      'Write comprehensive tests',
      'Deploy applications efficiently',
      'Follow React best practices'
    ],
    prerequisites: [
      'Basic knowledge of JavaScript',
      'Understanding of HTML/CSS',
      'Familiarity with React basics'
    ],
    projects: [
      {
        name: 'E-Commerce Platform',
        description: 'Build a fast e-commerce site with Next.js and SSR'
      },
      {
        name: 'Blog Platform',
        description: 'Create a blog with CMS integration and SEO optimization'
      },
      {
        name: 'Dashboard Application',
        description: 'Develop a real-time dashboard with data visualization'
      }
    ],
    certification: 'Certificate in Advanced React & Next.js Development.'
  },

  // Cloud Computing (AWS & Azure)
  'Cloud Computing (AWS & Azure)': {
    overview: 'Comprehensive cloud training covering AWS and Azure platforms. Learn cloud architecture, services, and earn dual certifications.',
    modules: [
      {
        title: 'Cloud Computing Fundamentals',
        duration: '1 week',
        topics: [
          'Introduction to cloud computing',
          'Cloud service models (IaaS, PaaS, SaaS)',
          'Cloud deployment models',
          'Cloud architecture principles',
          'Cost management strategies'
        ]
      },
      {
        title: 'AWS Core Services',
        duration: '4 weeks',
        topics: [
          'EC2 instances and Auto Scaling',
          'S3 storage and CloudFront',
          'RDS and DynamoDB databases',
          'VPC and networking',
          'IAM and security',
          'Lambda serverless computing'
        ]
      },
      {
        title: 'Azure Core Services',
        duration: '3 weeks',
        topics: [
          'Azure Virtual Machines',
          'Azure Storage and Blob Storage',
          'Azure SQL Database',
          'Azure Virtual Network',
          'Azure Active Directory',
          'Azure Functions'
        ]
      },
      {
        title: 'DevOps & Certification Prep',
        duration: '2 weeks',
        topics: [
          'CI/CD with AWS CodePipeline',
          'Azure DevOps pipelines',
          'Infrastructure as Code (Terraform)',
          'Monitoring and logging',
          'AWS Solutions Architect exam prep',
          'Azure Fundamentals exam prep'
        ]
      }
    ],
    learningOutcomes: [
      'Design scalable cloud architectures',
      'Deploy applications on AWS and Azure',
      'Manage cloud resources efficiently',
      'Implement security best practices',
      'Prepare for cloud certifications',
      'Optimize cloud costs'
    ],
    prerequisites: [
      'Basic understanding of networking',
      'Familiarity with Linux/Windows',
      'Knowledge of basic IT concepts'
    ],
    projects: [
      {
        name: 'Multi-Tier Application Deployment',
        description: 'Deploy a web application on AWS with auto-scaling'
      },
      {
        name: 'Hybrid Cloud Architecture',
        description: 'Design and implement a hybrid cloud solution'
      },
      {
        name: 'Serverless Application',
        description: 'Build a serverless application using Lambda and Azure Functions'
      }
    ],
    certification: 'Prepare for AWS Certified Solutions Architect and Microsoft Azure Fundamentals certifications.'
  },

  // DevOps Engineering
  'DevOps Engineering': {
    overview: 'Master DevOps practices with CI/CD pipelines, containerization, orchestration, and infrastructure automation. Learn industry-standard tools.',
    modules: [
      {
        title: 'Linux & Shell Scripting',
        duration: '1 week',
        topics: [
          'Linux command line basics',
          'Bash scripting',
          'System administration',
          'File permissions and users',
          'Process management'
        ]
      },
      {
        title: 'Docker Containerization',
        duration: '2 weeks',
        topics: [
          'Docker fundamentals',
          'Dockerfile and images',
          'Docker Compose',
          'Container networking',
          'Docker volumes and data management',
          'Best practices'
        ]
      },
      {
        title: 'Kubernetes Orchestration',
        duration: '3 weeks',
        topics: [
          'Kubernetes architecture',
          'Pods, Services, and Deployments',
          'ConfigMaps and Secrets',
          'Ingress and networking',
          'Scaling and auto-scaling',
          'Kubernetes in production'
        ]
      },
      {
        title: 'CI/CD Pipelines',
        duration: '2 weeks',
        topics: [
          'Jenkins setup and configuration',
          'GitHub Actions',
          'GitLab CI/CD',
          'Pipeline as Code',
          'Automated testing integration',
          'Deployment strategies'
        ]
      },
      {
        title: 'Infrastructure as Code',
        duration: '2 weeks',
        topics: [
          'Terraform basics',
          'Ansible automation',
          'CloudFormation (AWS)',
          'Infrastructure provisioning',
          'Configuration management',
          'Version control for infrastructure'
        ]
      },
      {
        title: 'Monitoring & Logging',
        duration: '2 weeks',
        topics: [
          'Prometheus and Grafana',
          'ELK Stack (Elasticsearch, Logstash, Kibana)',
          'CloudWatch and Azure Monitor',
          'Alerting and incident management',
          'Performance monitoring'
        ]
      }
    ],
    learningOutcomes: [
      'Set up and manage CI/CD pipelines',
      'Containerize applications with Docker',
      'Orchestrate containers with Kubernetes',
      'Automate infrastructure provisioning',
      'Monitor and maintain production systems',
      'Implement DevOps best practices'
    ],
    prerequisites: [
      'Basic Linux knowledge',
      'Understanding of software development',
      'Familiarity with command line'
    ],
    projects: [
      {
        name: 'Complete CI/CD Pipeline',
        description: 'Build end-to-end CI/CD pipeline with automated testing and deployment'
      },
      {
        name: 'Kubernetes Cluster Management',
        description: 'Deploy and manage applications on Kubernetes cluster'
      },
      {
        name: 'Infrastructure Automation',
        description: 'Automate cloud infrastructure provisioning using Terraform'
      }
    ],
    certification: 'Certificate in DevOps Engineering with hands-on experience in industry tools.'
  },

  // Mobile App Development (React Native)
  'Mobile App Development (React Native)': {
    overview: 'Build cross-platform mobile applications using React Native. Learn to create native iOS and Android apps with a single codebase.',
    modules: [
      {
        title: 'React Native Fundamentals',
        duration: '2 weeks',
        topics: [
          'React Native setup and environment',
          'Components and styling',
          'Navigation with React Navigation',
          'State management',
          'Platform-specific code',
          'Debugging techniques'
        ]
      },
      {
        title: 'UI/UX for Mobile',
        duration: '2 weeks',
        topics: [
          'Mobile design principles',
          'Responsive layouts',
          'Animations and gestures',
          'Touch interactions',
          'Accessibility',
          'Performance optimization'
        ]
      },
      {
        title: 'APIs and Data Management',
        duration: '2 weeks',
        topics: [
          'RESTful API integration',
          'AsyncStorage for local data',
          'Redux for state management',
          'Context API',
          'Data persistence',
          'Offline capabilities'
        ]
      },
      {
        title: 'Native Features',
        duration: '2 weeks',
        topics: [
          'Camera and image picker',
          'Geolocation and maps',
          'Push notifications',
          'Biometric authentication',
          'Device sensors',
          'Native modules integration'
        ]
      },
      {
        title: 'Testing & Deployment',
        duration: '2 weeks',
        topics: [
          'Unit and integration testing',
          'E2E testing with Detox',
          'Building for iOS and Android',
          'App Store submission',
          'Play Store submission',
          'CI/CD for mobile apps'
        ]
      }
    ],
    learningOutcomes: [
      'Build cross-platform mobile applications',
      'Integrate native device features',
      'Optimize app performance',
      'Publish apps to app stores',
      'Implement modern mobile UI patterns',
      'Handle API integration and data management'
    ],
    prerequisites: [
      'Basic React knowledge',
      'Understanding of JavaScript',
      'Familiarity with mobile apps'
    ],
    projects: [
      {
        name: 'Social Media App',
        description: 'Build a complete social media app with real-time features'
      },
      {
        name: 'E-Commerce Mobile App',
        description: 'Create a shopping app with cart, checkout, and payment'
      },
      {
        name: 'Fitness Tracking App',
        description: 'Develop a fitness app with location tracking and charts'
      }
    ],
    certification: 'Certificate in Mobile App Development with React Native.'
  },

  // UI/UX Design Masterclass
  'UI/UX Design Masterclass': {
    overview: 'Learn design thinking, user experience principles, and create beautiful interfaces using Figma. Master the art of designing user-centered products.',
    modules: [
      {
        title: 'Design Fundamentals',
        duration: '2 weeks',
        topics: [
          'Design principles and elements',
          'Color theory and typography',
          'Layout and composition',
          'Visual hierarchy',
          'Design systems',
          'Responsive design principles'
        ]
      },
      {
        title: 'User Experience (UX)',
        duration: '2 weeks',
        topics: [
          'User research and personas',
          'Information architecture',
          'User journey mapping',
          'Wireframing and prototyping',
          'Usability testing',
          'Accessibility design'
        ]
      },
      {
        title: 'Figma Mastery',
        duration: '2 weeks',
        topics: [
          'Figma interface and tools',
          'Components and styles',
          'Auto Layout and constraints',
          'Prototyping and interactions',
          'Collaboration features',
          'Design handoff to developers'
        ]
      },
      {
        title: 'Advanced Design Techniques',
        duration: '2 weeks',
        topics: [
          'Micro-interactions and animations',
          'Advanced prototyping',
          'Design systems creation',
          'Mobile and web design patterns',
          'Design portfolios',
          'Client presentation skills'
        ]
      }
    ],
    learningOutcomes: [
      'Create user-centered designs',
      'Prototype interactive designs in Figma',
      'Conduct user research and testing',
      'Build comprehensive design systems',
      'Present designs professionally',
      'Work with development teams'
    ],
    prerequisites: [
      'Creative thinking',
      'Basic computer skills',
      'Interest in design'
    ],
    projects: [
      {
        name: 'E-Commerce Website Design',
        description: 'Design a complete e-commerce website with user flows'
      },
      {
        name: 'Mobile App UI Design',
        description: 'Create UI designs for a mobile application'
      },
      {
        name: 'Design System',
        description: 'Build a comprehensive design system with components'
      }
    ],
    certification: 'Certificate in UI/UX Design with professional portfolio.'
  },

  // Cybersecurity Fundamentals
  'Cybersecurity Fundamentals': {
    overview: 'Learn ethical hacking, network security, and security best practices. Protect systems and data from cyber threats.',
    modules: [
      {
        title: 'Cybersecurity Fundamentals',
        duration: '2 weeks',
        topics: [
          'Introduction to cybersecurity',
          'Threat landscape and attack vectors',
          'Security policies and compliance',
          'Risk assessment',
          'Security frameworks (NIST, ISO)'
        ]
      },
      {
        title: 'Network Security',
        duration: '3 weeks',
        topics: [
          'Network protocols and vulnerabilities',
          'Firewalls and intrusion detection',
          'VPN and secure communications',
          'Network monitoring',
          'Wireless security'
        ]
      },
      {
        title: 'Ethical Hacking',
        duration: '4 weeks',
        topics: [
          'Kali Linux and tools',
          'Reconnaissance and scanning',
          'Vulnerability assessment',
          'Penetration testing',
          'Web application security',
          'Social engineering techniques'
        ]
      },
      {
        title: 'Cryptography & Encryption',
        duration: '2 weeks',
        topics: [
          'Cryptographic principles',
          'Symmetric and asymmetric encryption',
          'Digital signatures and certificates',
          'Hash functions',
          'PKI (Public Key Infrastructure)'
        ]
      },
      {
        title: 'Security Operations',
        duration: '3 weeks',
        topics: [
          'Security monitoring and SIEM',
          'Incident response',
          'Forensics and investigation',
          'Security auditing',
          'Compliance and regulations'
        ]
      }
    ],
    learningOutcomes: [
      'Identify and mitigate security threats',
      'Perform ethical hacking and penetration testing',
      'Implement network security measures',
      'Understand cryptography and encryption',
      'Respond to security incidents',
      'Follow security best practices'
    ],
    prerequisites: [
      'Basic networking knowledge',
      'Understanding of operating systems',
      'Logical thinking skills'
    ],
    projects: [
      {
        name: 'Vulnerability Assessment',
        description: 'Perform security assessment on a test network'
      },
      {
        name: 'Security Audit Report',
        description: 'Create comprehensive security audit documentation'
      },
      {
        name: 'Incident Response Plan',
        description: 'Develop and implement an incident response strategy'
      }
    ],
    certification: 'Certificate in Cybersecurity Fundamentals with ethical hacking skills.'
  }
}

// Certification Courses Syllabus
export const certificationCourseSyllabus = {
  'Full-Stack Web Development Certification': {
    overview: 'Comprehensive MERN stack training with industry-recognized certification. Build production-ready full-stack applications.',
    modules: [
      {
        title: 'Frontend Development with React',
        duration: '3 weeks',
        topics: [
          'React fundamentals and hooks',
          'State management with Redux',
          'React Router and navigation',
          'Material-UI and styling',
          'Performance optimization'
        ]
      },
      {
        title: 'Backend Development with Node.js',
        duration: '3 weeks',
        topics: [
          'Node.js and Express.js',
          'RESTful API development',
          'Authentication and authorization',
          'Database integration',
          'API security'
        ]
      },
      {
        title: 'Database Management',
        duration: '2 weeks',
        topics: [
          'MongoDB and Mongoose',
          'Database design and modeling',
          'Query optimization',
          'Data relationships',
          'Database security'
        ]
      },
      {
        title: 'Deployment and DevOps',
        duration: '2 weeks',
        topics: [
          'Cloud deployment (AWS/Vercel)',
          'Docker containerization',
          'CI/CD pipelines',
          'Monitoring and logging',
          'Production best practices'
        ]
      },
      {
        title: 'Capstone Project',
        duration: '2 weeks',
        topics: [
          'Full-stack application development',
          'Code review and optimization',
          'Documentation',
          'Project presentation'
        ]
      }
    ],
    learningOutcomes: [
      'Build complete full-stack applications',
      'Implement secure authentication',
      'Deploy applications to production',
      'Write clean, maintainable code',
      'Work with databases effectively'
    ],
    prerequisites: [
      'Basic programming knowledge',
      'Understanding of web technologies'
    ],
    projects: [
      {
        name: 'E-Commerce Platform',
        description: 'Complete e-commerce solution with payment integration'
      },
      {
        name: 'Social Media Application',
        description: 'Real-time social media platform with chat features'
      }
    ],
    certification: 'Industry-recognized Full-Stack Web Development Certification upon successful completion.'
  },

  'Data Science & ML Certification': {
    overview: 'Master data science with Python, machine learning algorithms, and real-world projects. Earn a data science certification.',
    modules: [
      {
        title: 'Python for Data Science',
        duration: '3 weeks',
        topics: [
          'Python fundamentals',
          'NumPy and Pandas',
          'Data cleaning and preprocessing',
          'Data visualization'
        ]
      },
      {
        title: 'Machine Learning',
        duration: '4 weeks',
        topics: [
          'Supervised learning algorithms',
          'Unsupervised learning',
          'Model evaluation',
          'Feature engineering'
        ]
      },
      {
        title: 'Deep Learning',
        duration: '3 weeks',
        topics: [
          'Neural networks',
          'TensorFlow and Keras',
          'CNN and RNN',
          'Transfer learning'
        ]
      },
      {
        title: 'ML Model Deployment',
        duration: '2 weeks',
        topics: [
          'Model serialization',
          'API development',
          'Cloud deployment',
          'MLOps basics'
        ]
      }
    ],
    learningOutcomes: [
      'Analyze complex datasets',
      'Build ML models',
      'Deploy models to production',
      'Present data insights'
    ],
    prerequisites: [
      'Basic mathematics',
      'Programming interest'
    ],
    projects: [
      {
        name: 'Predictive Analytics Project',
        description: 'Build and deploy a predictive model'
      }
    ],
    certification: 'Data Science & Machine Learning Certification with project portfolio.'
  },

  'Cloud Computing (AWS & Azure) Certification': {
    overview: 'End-to-end cloud training with dual certifications from AWS and Azure.',
    modules: [
      {
        title: 'AWS Core Services',
        duration: '4 weeks',
        topics: [
          'EC2, S3, RDS',
          'VPC and networking',
          'IAM and security',
          'Lambda and serverless'
        ]
      },
      {
        title: 'Azure Core Services',
        duration: '3 weeks',
        topics: [
          'Virtual Machines',
          'Storage and databases',
          'Azure networking',
          'Azure Functions'
        ]
      },
      {
        title: 'Certification Preparation',
        duration: '3 weeks',
        topics: [
          'AWS Solutions Architect prep',
          'Azure Fundamentals prep',
          'Practice exams',
          'Exam strategies'
        ]
      }
    ],
    learningOutcomes: [
      'Deploy on AWS and Azure',
      'Design cloud architectures',
      'Prepare for certifications',
      'Manage cloud resources'
    ],
    prerequisites: [
      'Basic IT knowledge',
      'Networking basics'
    ],
    projects: [
      {
        name: 'Multi-Cloud Deployment',
        description: 'Deploy application on both AWS and Azure'
      }
    ],
    certification: 'Prepare for AWS Certified Solutions Architect and Azure Fundamentals certifications.'
  },

  'DevOps Engineering Certification': {
    overview: 'Complete DevOps training with CI/CD, Docker, Kubernetes, and automation.',
    modules: [
      {
        title: 'Docker & Kubernetes',
        duration: '3 weeks',
        topics: [
          'Docker containerization',
          'Kubernetes orchestration',
          'Container networking',
          'Scaling and management'
        ]
      },
      {
        title: 'CI/CD Pipelines',
        duration: '3 weeks',
        topics: [
          'Jenkins setup',
          'GitHub Actions',
          'Pipeline automation',
          'Deployment strategies'
        ]
      },
      {
        title: 'Infrastructure as Code',
        duration: '2 weeks',
        topics: [
          'Terraform',
          'Ansible',
          'Cloud provisioning',
          'Configuration management'
        ]
      },
      {
        title: 'Monitoring & Logging',
        duration: '2 weeks',
        topics: [
          'Prometheus and Grafana',
          'ELK Stack',
          'Cloud monitoring',
          'Alerting'
        ]
      },
      {
        title: 'DevOps Best Practices',
        duration: '2 weeks',
        topics: [
          'Security in DevOps',
          'Performance optimization',
          'Disaster recovery',
          'Team collaboration'
        ]
      }
    ],
    learningOutcomes: [
      'Set up CI/CD pipelines',
      'Manage containers',
      'Automate infrastructure',
      'Monitor systems'
    ],
    prerequisites: [
      'Linux basics',
      'Software development knowledge'
    ],
    projects: [
      {
        name: 'Complete DevOps Pipeline',
        description: 'Build end-to-end CI/CD pipeline'
      }
    ],
    certification: 'DevOps Engineering Certification with hands-on experience.'
  },

  'React & Next.js Advanced Certification': {
    overview: 'Advanced React patterns, Next.js framework, and modern frontend architecture.',
    modules: [
      {
        title: 'Advanced React',
        duration: '2 weeks',
        topics: [
          'Advanced patterns',
          'Performance optimization',
          'Testing strategies',
          'Code splitting'
        ]
      },
      {
        title: 'Next.js Framework',
        duration: '2 weeks',
        topics: [
          'SSR and SSG',
          'API Routes',
          'Image optimization',
          'Deployment'
        ]
      },
      {
        title: 'State Management',
        duration: '2 weeks',
        topics: [
          'Redux Toolkit',
          'React Query',
          'Context API',
          'Caching'
        ]
      },
      {
        title: 'Production Deployment',
        duration: '2 weeks',
        topics: [
          'Vercel deployment',
          'Performance monitoring',
          'SEO optimization',
          'Best practices'
        ]
      }
    ],
    learningOutcomes: [
      'Build production React apps',
      'Implement SSR',
      'Optimize performance',
      'Deploy efficiently'
    ],
    prerequisites: [
      'React basics',
      'JavaScript knowledge'
    ],
    projects: [
      {
        name: 'Production-Ready App',
        description: 'Build and deploy a complete Next.js application'
      }
    ],
    certification: 'Advanced React & Next.js Certification.'
  }
}

// Placement Training Syllabus
export const placementCourseSyllabus = {
  'Full-Stack Web Development': {
    overview: 'Comprehensive MERN stack training with guaranteed placement assistance. 100+ hours of live coding and 1-on-1 mentoring.',
    modules: [
      {
        title: 'Intensive MERN Stack Training',
        duration: '8 weeks',
        topics: [
          'React and Redux mastery',
          'Node.js and Express backend',
          'MongoDB database design',
          'RESTful API development',
          'Authentication and security'
        ]
      },
      {
        title: 'Live Coding Sessions',
        duration: 'Ongoing',
        topics: [
          '100+ hours of live coding',
          'Real-world problem solving',
          'Code reviews and feedback',
          'Best practices and patterns',
          'Performance optimization'
        ]
      },
      {
        title: 'Placement Preparation',
        duration: '4 weeks',
        topics: [
          'Resume building and optimization',
          'LinkedIn profile enhancement',
          'Mock interviews with industry experts',
          'Technical interview preparation',
          'Behavioral interview training'
        ]
      }
    ],
    learningOutcomes: [
      'Build production-ready applications',
      'Pass technical interviews',
      'Get placed in top companies',
      'Start career as full-stack developer'
    ],
    prerequisites: [
      'Basic programming knowledge',
      'Dedication to learn'
    ],
    projects: [
      {
        name: 'Portfolio Projects',
        description: 'Build 3+ production-ready projects for portfolio'
      }
    ],
    certification: 'Certificate with guaranteed placement assistance for 6 months.'
  },

  'Data Science & Machine Learning': {
    overview: 'Master data science with real-world projects and guaranteed placement support.',
    modules: [
      {
        title: 'Data Science Intensive',
        duration: '12 weeks',
        topics: [
          'Python for data science',
          'Machine learning algorithms',
          'Deep learning with TensorFlow',
          'Data visualization',
          'Statistical analysis'
        ]
      },
      {
        title: 'Portfolio Development',
        duration: 'Ongoing',
        topics: [
          'Real-world datasets',
          'ML model deployment',
          'Portfolio building',
          'GitHub optimization'
        ]
      },
      {
        title: 'Placement Support',
        duration: 'Ongoing',
        topics: [
          'Mock interviews',
          'Job portal access',
          'Company referrals',
          'Interview preparation'
        ]
      }
    ],
    learningOutcomes: [
      'Build ML models',
      'Create data science portfolio',
      'Get placed in data roles',
      'Earn competitive salary'
    ],
    prerequisites: [
      'Mathematics basics',
      'Logical thinking'
    ],
    projects: [
      {
        name: 'Data Science Portfolio',
        description: '5+ real-world data science projects'
      }
    ],
    certification: 'Certificate with 6 months placement support.'
  },

  'DevOps Engineering': {
    overview: 'Complete DevOps training with hands-on experience and placement guarantee.',
    modules: [
      {
        title: 'DevOps Mastery',
        duration: '10 weeks',
        topics: [
          'Docker and Kubernetes',
          'CI/CD pipelines',
          'Infrastructure as Code',
          'Cloud platforms',
          'Monitoring and logging'
        ]
      },
      {
        title: 'Hands-On Projects',
        duration: 'Ongoing',
        topics: [
          'Cloud infrastructure projects',
          'CI/CD pipeline building',
          'Real-world scenarios',
          'Industry best practices'
        ]
      },
      {
        title: 'Career Support',
        duration: 'Ongoing',
        topics: [
          'Technical interview prep',
          'LinkedIn optimization',
          'Resume building',
          'Company connections'
        ]
      }
    ],
    learningOutcomes: [
      'Master DevOps tools',
      'Build CI/CD pipelines',
      'Get DevOps job',
      'Earn high salary'
    ],
    prerequisites: [
      'Linux basics',
      'IT background helpful'
    ],
    projects: [
      {
        name: 'DevOps Portfolio',
        description: 'Complete DevOps projects portfolio'
      }
    ],
    certification: 'DevOps Certification with placement guarantee.'
  },

  'Cloud Computing (AWS & Azure)': {
    overview: 'Dual cloud certifications with guaranteed placement in top tech companies.',
    modules: [
      {
        title: 'AWS & Azure Training',
        duration: '8 weeks',
        topics: [
          'AWS core services',
          'Azure fundamentals',
          'Cloud architecture',
          'Security and compliance',
          'Cost optimization'
        ]
      },
      {
        title: 'Certification Prep',
        duration: '2 weeks',
        topics: [
          'AWS Solutions Architect prep',
          'Azure Fundamentals prep',
          'Practice exams',
          'Exam strategies'
        ]
      },
      {
        title: 'Placement Support',
        duration: '6 months',
        topics: [
          'Career counseling',
          'Interview preparation',
          'Company referrals',
          'Job portal access'
        ]
      }
    ],
    learningOutcomes: [
      'Earn cloud certifications',
      'Design cloud solutions',
      'Get cloud job',
      'Career advancement'
    ],
    prerequisites: [
      'Basic IT knowledge',
      'Networking basics'
    ],
    projects: [
      {
        name: 'Cloud Deployment Projects',
        description: 'Deploy applications on AWS and Azure'
      }
    ],
    certification: 'AWS and Azure certifications with placement support.'
  },

  'Mobile App Development': {
    overview: 'React Native and Flutter training with placement guarantee.',
    modules: [
      {
        title: 'Mobile Development',
        duration: '8 weeks',
        topics: [
          'React Native fundamentals',
          'Cross-platform development',
          'Native features integration',
          'App store deployment',
          'Performance optimization'
        ]
      },
      {
        title: 'Portfolio Building',
        duration: 'Ongoing',
        topics: [
          'App development projects',
          'App store deployment',
          'GitHub portfolio',
          'Showcase apps'
        ]
      },
      {
        title: 'Career Support',
        duration: 'Ongoing',
        topics: [
          'Startup connections',
          'Freelancing opportunities',
          'Interview prep',
          'Job placement'
        ]
      }
    ],
    learningOutcomes: [
      'Build mobile apps',
      'Deploy to app stores',
      'Get mobile developer job',
      'Start freelancing career'
    ],
    prerequisites: [
      'React basics',
      'Programming knowledge'
    ],
    projects: [
      {
        name: 'Mobile App Portfolio',
        description: '3+ published mobile applications'
      }
    ],
    certification: 'Mobile App Development Certificate with placement support.'
  }
}

