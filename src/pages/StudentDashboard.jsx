import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { authAPI, courseAPI, paymentAPI } from '../utils/api.js'

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('courses')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myCourses, setMyCourses] = useState([])
  const [myCertificates, setMyCertificates] = useState([])
  const [myInternships, setMyInternships] = useState([])
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    certificatesEarned: 0,
    totalSpent: 0,
    learningStreak: 0,
    totalHours: 0,
    points: 0,
    level: 1
  })
  
  // Notes and Resources State
  const [notes, setNotes] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [newNote, setNewNote] = useState({ courseId: '', title: '', content: '' })
  
  // Career Development State
  const [resume, setResume] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: []
  })
  
  // Study Schedule State
  const [schedule, setSchedule] = useState([])
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: 'study' })
  
  // Gamification State
  const [badges, setBadges] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  
  // Social Features State
  const [connections, setConnections] = useState([])
  const [discussions, setDiscussions] = useState([])
  
  // Profile State
  const [linkedInProfile, setLinkedInProfile] = useState('')
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    collegeName: ''
  })

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
      try {
        // Fetch fresh user data from API (real-time data only)
        try {
          const response = await authAPI.getMe()
          if (response.success) {
            setUser(response.user)
            // Set profile data from API response (real-time data)
            setProfileData({
              name: response.user.name || '',
              email: response.user.email || '',
              phone: response.user.phone || '',
              collegeName: response.user.studentDetails?.collegeName || ''
            })
            if (response.user.studentDetails) {
              setMyCertificates(response.user.studentDetails.certificates || [])
              setMyInternships(response.user.studentDetails.internships || [])
            }
            // Update localStorage user data
            localStorage.setItem('user', JSON.stringify(response.user))
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          // Fallback to localStorage only if API fails
          const userData = localStorage.getItem('user')
          if (userData) {
            const parsedUser = JSON.parse(userData)
            setUser(parsedUser)
            setProfileData({
              name: parsedUser.name || '',
              email: parsedUser.email || '',
              phone: parsedUser.phone || '',
              collegeName: parsedUser.studentDetails?.collegeName || ''
            })
            if (parsedUser.studentDetails) {
              setMyCertificates(parsedUser.studentDetails.certificates || [])
              setMyInternships(parsedUser.studentDetails.internships || [])
            }
          }
        }
      
      await Promise.all([
        fetchEnrolledCourses(),
        fetchPayments(),
        loadLocalStorageData()
      ])
      
      calculateStats()
      } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Unable to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

  const fetchEnrolledCourses = async () => {
    try {
      const response = await courseAPI.getMyEnrolledCourses()
      if (response.success && response.data.enrolledCourses) {
        const courses = response.data.enrolledCourses.map(enrollment => ({
          id: enrollment.courseId,
          enrollmentId: enrollment.enrollmentId,
          title: enrollment.course.title,
          progress: enrollment.progress || 0,
          status: enrollment.status === 'completed' ? 'Completed' : 
                  enrollment.status === 'in_progress' ? 'In Progress' : 
                  enrollment.status === 'dropped' ? 'Dropped' : 'Enrolled',
          enrolledDate: enrollment.enrolledDate,
          course: enrollment.course
        }))
        setMyCourses(courses)
      } else {
        setMyCourses([])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      setMyCourses([])
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await paymentAPI.getMyPayments()
      if (response.success && response.data) {
        setPayments(response.data.payments || response.data || [])
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
      setPayments([])
    }
  }

  const loadLocalStorageData = () => {
    // Load notes
    const savedNotes = localStorage.getItem('studentNotes')
    if (savedNotes) setNotes(JSON.parse(savedNotes))
    
    // Load bookmarks
    const savedBookmarks = localStorage.getItem('studentBookmarks')
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks))
    
    // Load resume
    const savedResume = localStorage.getItem('studentResume')
    if (savedResume) setResume(JSON.parse(savedResume))
    
    // Load schedule
    const savedSchedule = localStorage.getItem('studentSchedule')
    if (savedSchedule) setSchedule(JSON.parse(savedSchedule))
    
    // Load badges
    const savedBadges = localStorage.getItem('studentBadges')
    if (savedBadges) setBadges(JSON.parse(savedBadges))
    
    // Load connections
    const savedConnections = localStorage.getItem('studentConnections')
    if (savedConnections) setConnections(JSON.parse(savedConnections))
    
    // Load discussions
    const savedDiscussions = localStorage.getItem('studentDiscussions')
    if (savedDiscussions) setDiscussions(JSON.parse(savedDiscussions))
    
    // Load LinkedIn profile
    const savedLinkedIn = localStorage.getItem('studentLinkedInProfile')
    if (savedLinkedIn) setLinkedInProfile(savedLinkedIn)
    
    // Note: Profile data is loaded from API in fetchAllData, not from localStorage
  }

  const calculateStats = () => {
    const completed = myCourses.filter(c => c.status === 'Completed').length
    const inProgress = myCourses.filter(c => c.status === 'In Progress').length
    const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const totalProgress = myCourses.reduce((sum, c) => sum + (c.progress || 0), 0)
    const avgProgress = myCourses.length > 0 ? totalProgress / myCourses.length : 0
    const estimatedHours = Math.round((avgProgress / 100) * myCourses.length * 10) // Rough estimate
    
    // Calculate points (gamification)
    const coursePoints = completed * 100 + inProgress * 50
    const certificatePoints = myCertificates.length * 200
    // Calculate learning streak based on recent activity
    const streakPoints = 0 // Will be calculated based on actual learning activity dates
    const totalPoints = coursePoints + certificatePoints + streakPoints
    const level = Math.floor(totalPoints / 500) + 1
    
    setStats({
      totalCourses: myCourses.length,
      completedCourses: completed,
      inProgressCourses: inProgress,
      certificatesEarned: myCertificates.length,
      totalSpent,
      learningStreak: streakPoints,
      totalHours: estimatedHours,
      points: totalPoints,
      level
    })
  }

  useEffect(() => {
    calculateStats()
  }, [myCourses, myCertificates, payments])

  // Notes Functions
  const saveNote = () => {
    if (!newNote.title || !newNote.content) {
      toast.error('Please fill in title and content')
      return
    }
    const note = {
      id: Date.now().toString(),
      ...newNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updatedNotes = [...notes, note]
    setNotes(updatedNotes)
    localStorage.setItem('studentNotes', JSON.stringify(updatedNotes))
    setNewNote({ courseId: '', title: '', content: '' })
    toast.success('Note saved successfully')
  }

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(n => n.id !== noteId)
    setNotes(updatedNotes)
    localStorage.setItem('studentNotes', JSON.stringify(updatedNotes))
    toast.success('Note deleted')
  }

  const addBookmark = (courseId, courseTitle) => {
    if (bookmarks.find(b => b.courseId === courseId)) {
      toast.info('Already bookmarked')
      return
    }
    const bookmark = { id: Date.now().toString(), courseId, courseTitle, createdAt: new Date().toISOString() }
    const updatedBookmarks = [...bookmarks, bookmark]
    setBookmarks(updatedBookmarks)
    localStorage.setItem('studentBookmarks', JSON.stringify(updatedBookmarks))
    toast.success('Bookmarked successfully')
  }

  // Resume Functions
  const saveResume = () => {
    const updatedResume = { ...resume, name: user?.name || '', email: user?.email || '' }
    setResume(updatedResume)
    localStorage.setItem('studentResume', JSON.stringify(updatedResume))
    toast.success('Resume saved successfully')
  }

  const downloadResume = () => {
    const resumeText = `
RESUME
${resume.name}
${resume.email} | ${resume.phone}

SUMMARY
${resume.summary}

EDUCATION
${resume.education.map(edu => `${edu.degree} - ${edu.institution} (${edu.year})`).join('\n')}

EXPERIENCE
${resume.experience.map(exp => `${exp.title} at ${exp.company} (${exp.duration})`).join('\n')}

SKILLS
${resume.skills.join(', ')}

PROJECTS
${resume.projects.map(proj => `${proj.name}: ${proj.description}`).join('\n')}
    `
    const blob = new Blob([resumeText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.txt'
    a.click()
    toast.success('Resume downloaded')
  }

  // Schedule Functions
  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error('Please fill in title and date')
      return
    }
    const event = {
      id: Date.now().toString(),
      ...newEvent,
      createdAt: new Date().toISOString()
    }
    const updatedSchedule = [...schedule, event]
    setSchedule(updatedSchedule)
    localStorage.setItem('studentSchedule', JSON.stringify(updatedSchedule))
    setNewEvent({ title: '', date: '', time: '', type: 'study' })
    toast.success('Event added to schedule')
  }

  const deleteEvent = (eventId) => {
    const updatedSchedule = schedule.filter(e => e.id !== eventId)
    setSchedule(updatedSchedule)
    localStorage.setItem('studentSchedule', JSON.stringify(updatedSchedule))
    toast.success('Event deleted')
  }

  // Badge icon renderer
  const getBadgeIcon = (iconType) => {
    const iconMap = {
      'certificate': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
      'star': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
      'trophy': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
      'flame': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    }
    return iconMap[iconType] || iconMap['certificate']
  }

  // Badge Functions
  const checkBadges = () => {
    const newBadges = []
    if (stats.completedCourses >= 1 && !badges.find(b => b.id === 'first-course')) {
      newBadges.push({ 
        id: 'first-course', 
        name: 'First Course Complete', 
        iconType: 'certificate'
      })
    }
    if (stats.completedCourses >= 5 && !badges.find(b => b.id === 'five-courses')) {
      newBadges.push({ 
        id: 'five-courses', 
        name: 'Five Courses Master', 
        iconType: 'star'
      })
    }
    if (stats.certificatesEarned >= 1 && !badges.find(b => b.id === 'certified')) {
      newBadges.push({ 
        id: 'certified', 
        name: 'Certified Learner', 
        iconType: 'trophy'
      })
    }
    if (stats.learningStreak >= 7 && !badges.find(b => b.id === 'streak-7')) {
      newBadges.push({ 
        id: 'streak-7', 
        name: '7 Day Streak', 
        iconType: 'flame'
      })
    }
    if (newBadges.length > 0) {
      const updatedBadges = [...badges, ...newBadges]
      setBadges(updatedBadges)
      localStorage.setItem('studentBadges', JSON.stringify(updatedBadges))
      newBadges.forEach(badge => toast.success(`Earned badge: ${badge.name}`))
    }
  }

  useEffect(() => {
    checkBadges()
  }, [stats])

  const handleContinueLearning = (courseId) => {
    window.location.hash = `#/courses/${courseId}`
  }

  const handleDownloadCertificate = (certificate) => {
    if (certificate.certificateUrl) {
      window.open(certificate.certificateUrl, '_blank')
    } else {
      toast.info('Certificate download will be available soon')
    }
  }

  const handleViewInternshipDetails = (internshipId) => {
    if (!internshipId) return
    window.location.hash = `#/student-internship-application-details?id=${internshipId}`
  }

  const getUserInitials = () => {
    if (!user || !user.name) return 'U'
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  const menuItems = [
    { 
      id: 'courses', 
      label: 'My Courses', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    },
    { 
      id: 'schedule', 
      label: 'Schedule', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
      id: 'notes', 
      label: 'Notes', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    },
    { 
      id: 'certificates', 
      label: 'Certificates', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
    },
    { 
      id: 'internships', 
      label: 'Internships', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="mt-2 text-gray-600">Welcome back{user?.name ? `, ${user.name}` : ''}!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Level {stats.level}</div>
                <div className="text-lg font-bold text-primary-600">{stats.points} Points</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-700">{getUserInitials()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {menuItems.map((item) => (
              <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden flex items-center gap-2 ${
                    activeTab === item.id
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                }`}
              >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
              </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Study Schedule */}
            {activeTab === 'schedule' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Study Schedule</h2>
                <div className="space-y-6">
                  {/* Add Event Form */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Event</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input
                        type="text"
                        placeholder="Event Title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-gray-300"
                      />
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-gray-300"
                      />
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-gray-300"
                      />
                      <select
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-gray-300"
                      >
                        <option value="study">Study</option>
                        <option value="assignment">Assignment</option>
                        <option value="exam">Exam</option>
                        <option value="live-class">Live Class</option>
                      </select>
                    </div>
                    <button
                      onClick={addEvent}
                      className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
                    >
                      Add Event
                    </button>
                  </div>

                  {/* Schedule List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                    <div className="space-y-3">
                      {schedule.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No events scheduled</p>
                      ) : (
                        schedule.map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{event.title}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                              </p>
                              <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-primary-100 text-primary-700">
                                {event.type}
                              </span>
                            </div>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes and Resources */}
            {activeTab === 'notes' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notes & Resources</h2>
                <div className="space-y-6">
                  {/* Add Note Form */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Note</h3>
                    <div className="space-y-4">
                      <select
                        value={newNote.courseId}
                        onChange={(e) => setNewNote({ ...newNote, courseId: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300"
                      >
                        <option value="">Select Course</option>
                        {myCourses.map((course) => (
                          <option key={course.id} value={course.id}>{course.title}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Note Title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300"
                      />
                      <textarea
                        placeholder="Note Content"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={saveNote}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>

                  {/* Notes List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Notes</h3>
                    <div className="space-y-3">
                      {notes.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No notes yet</p>
                      ) : (
                        notes.map((note) => (
                          <div key={note.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900">{note.title}</p>
                                <p className="text-sm text-gray-600">
                                  {myCourses.find(c => c.id === note.courseId)?.title || 'General Note'}
                                </p>
                              </div>
                              <button
                                onClick={() => deleteNote(note.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Bookmarks */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookmarked Courses</h3>
                    <div className="space-y-3">
                      {bookmarks.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No bookmarks yet</p>
                      ) : (
                        bookmarks.map((bookmark) => (
                          <div key={bookmark.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">{bookmark.courseTitle}</span>
                            <button
                              onClick={() => {
                                const updated = bookmarks.filter(b => b.id !== bookmark.id)
                                setBookmarks(updated)
                                localStorage.setItem('studentBookmarks', JSON.stringify(updated))
                                toast.success('Bookmark removed')
                              }}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment History */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment History</h2>
                <div className="space-y-4">
                  {payments.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payments Yet</h3>
                      <p className="text-gray-600">Your payment history will appear here</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-primary-50 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="text-2xl font-bold text-primary-600">₹{stats.totalSpent.toLocaleString()}</p>
                      </div>
                      {payments.map((payment) => (
                        <div key={payment._id || payment.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">
                                {payment.items?.[0]?.itemName || 'Course Payment'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(payment.createdAt || payment.paymentDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">₹{payment.amount?.toLocaleString() || '0'}</p>
                              <span className={`text-xs px-2 py-1 rounded ${
                                payment.paymentStatus === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : payment.paymentStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.paymentStatus || 'pending'}
                              </span>
                            </div>
                          </div>
                          {payment.orderId && (
                            <p className="text-xs text-gray-500">Order ID: {payment.orderId}</p>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* My Courses Tab */}
            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Courses</h2>
                {myCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
                    <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                    <button 
                      onClick={() => window.location.hash = '#/courses'}
                      className="rounded-lg bg-primary-600 px-6 py-2 text-white text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-primary-700"
                    >
                      Browse Courses
                    </button>
                  </div>
                ) : (
                <div className="space-y-4">
                  {myCourses.map((course) => (
                      <div key={course.id || course.enrollmentId} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => addBookmark(course.id, course.title)}
                              className="text-gray-400 hover:text-yellow-500"
                              title="Bookmark"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </button>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                                : course.status === 'Dropped'
                                ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {course.status}
                        </span>
                      </div>
                        </div>
                        {course.enrolledDate && (
                          <p className="text-xs text-gray-500 mb-2">
                            Enrolled on: {new Date(course.enrolledDate).toLocaleDateString()}
                          </p>
                        )}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-900">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => handleContinueLearning(course.id)}
                        className="mt-3 text-sm text-primary-700 hover:text-primary-800 font-medium transition-all duration-300 ease-in-out hover:font-bold hover:shadow-lg hover:shadow-primary-400/30 inline-block"
                      >
                        Continue Learning →
                      </button>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Certificates</h2>
                {myCertificates.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
                    <p className="text-gray-600">Complete courses to earn certificates.</p>
                  </div>
                ) : (
                <div className="space-y-4">
                    {myCertificates.map((cert, index) => (
                      <div key={cert._id || cert.courseId || index} className="p-6 rounded-lg border-2 border-primary-200 bg-primary-50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">{cert.courseName || 'Course Certificate'}</h3>
                            {cert.certificateId && (
                          <p className="text-sm text-gray-600">Certificate ID: {cert.certificateId}</p>
                            )}
                            {cert.issueDate && (
                          <p className="text-sm text-gray-600">Issued on: {new Date(cert.issueDate).toLocaleDateString()}</p>
                            )}
                        </div>
                        <div className="w-16 h-16 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                      </div>
                      <button 
                          onClick={() => handleDownloadCertificate(cert)}
                        className="w-full rounded-lg bg-primary-600 px-4 py-2 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] relative overflow-hidden"
                      >
                        <span className="relative z-10">Download Certificate</span>
                        <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                      </button>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* Internships Tab */}
            {activeTab === 'internships' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Internships</h2>
                {myInternships.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Internships Applied</h3>
                    <p className="text-gray-600 mb-4">You haven't applied for any internships yet.</p>
                    <button 
                      onClick={() => window.location.hash = '#/internships'}
                      className="rounded-lg bg-primary-600 px-6 py-2 text-white text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-primary-700"
                    >
                      Browse Internships
                    </button>
                  </div>
                ) : (
                <div className="space-y-4">
                    {myInternships.map((internship, index) => {
                      const status = internship.status || 'applied'
                      const statusLabel = status === 'accepted' ? 'Accepted' :
                                         status === 'shortlisted' ? 'Shortlisted' :
                                         status === 'rejected' ? 'Rejected' : 'Applied'
                      return (
                        <div key={internship._id || internship.internshipId || index} className="p-6 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                              <h3 className="font-bold text-gray-900 mb-1">Internship Application</h3>
                              {internship.appliedDate && (
                                <p className="text-sm text-gray-600">Applied on: {new Date(internship.appliedDate).toLocaleDateString()}</p>
                              )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                                : status === 'shortlisted'
                                ? 'bg-blue-100 text-blue-800'
                                : status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                              {statusLabel}
                        </span>
                      </div>
                          {internship.internshipId && (
                        <button 
                              onClick={() => handleViewInternshipDetails(internship.internshipId)}
                          className="text-sm text-primary-700 hover:text-primary-800 font-medium transition-all duration-300 ease-in-out hover:font-bold hover:shadow-lg hover:shadow-primary-400/30 inline-block"
                        >
                          View Details →
                        </button>
                      )}
                    </div>
                      )
                    })}
                </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Profile</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-700">{getUserInitials()}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{user?.name || 'User'}</h3>
                      <p className="text-sm text-gray-600">{user?.email || 'user@example.com'}</p>
                      {linkedInProfile && (
                        <a
                          href={linkedInProfile.startsWith('http') ? linkedInProfile : `https://${linkedInProfile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          View LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+91"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                      <input
                        type="text"
                        value={profileData.collegeName}
                        onChange={(e) => setProfileData({ ...profileData, collegeName: e.target.value })}
                        placeholder="Enter your college name"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn Profile URL
                        <span className="text-gray-500 text-xs ml-2">(Connect with other students)</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={linkedInProfile}
                            onChange={(e) => setLinkedInProfile(e.target.value)}
                            placeholder="linkedin.com/in/your-profile or https://linkedin.com/in/your-profile"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm"
                          />
                        </div>
                        {linkedInProfile && (
                          <a
                            href={linkedInProfile.startsWith('http') ? linkedInProfile : `https://${linkedInProfile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            Open
                          </a>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Add your LinkedIn profile to connect with other students</p>
                    </div>
                  </div>

                  <button 
                    onClick={async () => {
                      try {
                        // Save LinkedIn profile to localStorage (frontend-only feature)
                        localStorage.setItem('studentLinkedInProfile', linkedInProfile)
                        
                        // Update profile via API (real-time data)
                        const updateData = {
                          name: profileData.name,
                          phone: profileData.phone,
                          collegeName: profileData.collegeName
                        }
                        
                        const response = await authAPI.updateProfile(updateData)
                        
                        if (response.success) {
                          // Update local state with fresh data from API
                          setUser(response.user)
                          setProfileData({
                            name: response.user.name || '',
                            email: response.user.email || '',
                            phone: response.user.phone || '',
                            collegeName: response.user.studentDetails?.collegeName || ''
                          })
                          // Update localStorage with fresh data
                          localStorage.setItem('user', JSON.stringify(response.user))
                          toast.success('Profile updated successfully!')
                        } else {
                          throw new Error(response.message || 'Failed to update profile')
                        }
                      } catch (error) {
                        console.error('Error updating profile:', error)
                        toast.error(error.message || 'Failed to update profile. Please try again.')
                      }
                    }}
                    className="rounded-lg bg-primary-600 px-6 py-3 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_35px_80px_rgba(147,51,234,0.9)] relative overflow-hidden"
                  >
                    <span className="relative z-10">Update Profile</span>
                    <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
