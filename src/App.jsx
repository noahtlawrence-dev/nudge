import { useState, useEffect } from 'react'

// Noah's weekly schedule - free time windows
const weeklySchedule = {
  monday: {
    classes: [
      { start: '11:00', end: '12:00', name: 'Russian Oral/Presentation' },
      { start: '14:00', end: '15:00', name: 'Russian Translation' },
      { start: '15:30', end: '16:30', name: 'Spanish Int.Skills' }
    ],
    freeSlots: [
      { start: '09:00', end: '11:00', label: 'Morning' },
      { start: '12:00', end: '14:00', label: 'Lunch break' },
      { start: '16:30', end: '20:00', label: 'Evening' }
    ]
  },
  tuesday: {
    classes: [
      { start: '10:00', end: '11:00', name: 'Latin American Poetry' },
      { start: '12:00', end: '13:00', name: 'Russian Read/Essay' },
      { start: '15:00', end: '16:00', name: 'Spanish Grammar' },
      { start: '16:00', end: '17:00', name: 'Engineers of the Human Soul' },
      { start: '17:00', end: '18:00', name: 'Careers Talk' }
    ],
    freeSlots: [
      { start: '09:00', end: '10:00', label: 'Early morning' }
    ]
  },
  wednesday: {
    classes: [
      { start: '09:00', end: '10:00', name: 'Spanish Int.Skills' },
      { start: '11:00', end: '12:00', name: 'Russian Grammar' },
      { start: '13:00', end: '15:00', name: 'Therapy' }
    ],
    freeSlots: [
      { start: '10:00', end: '11:00', label: 'Mid-morning' },
      { start: '15:00', end: '20:00', label: 'Afternoon/Evening' }
    ]
  },
  thursday: {
    classes: [
      { start: '13:00', end: '14:00', name: 'Engineers of the Human Soul' }
    ],
    freeSlots: [
      { start: '09:00', end: '13:00', label: 'Morning' },
      { start: '14:00', end: '20:00', label: 'Afternoon/Evening' }
    ]
  },
  friday: {
    classes: [],
    freeSlots: [
      { start: '09:00', end: '20:00', label: 'All day' }
    ]
  },
  saturday: {
    classes: [],
    freeSlots: [
      { start: '10:00', end: '20:00', label: 'All day' }
    ]
  },
  sunday: {
    classes: [],
    freeSlots: [
      { start: '10:00', end: '20:00', label: 'All day' }
    ]
  }
}

// Task duration estimates (in minutes)
const taskDurations = {
  'presentation': 120,
  'essay': 180,
  'homework': 60,
  'test': 90,
  'revision': 60,
  'translation': 90,
  'debate': 45,
  'vocabulary': 45,
  'default': 60
}

// Noah's assignments
const initialAssignments = [
  {
    id: 1,
    title: "СМИ Presentation",
    subject: "Russian",
    dueDate: "2026-01-31T12:00:00",
    description: "Oral presentation on СМИ (media)",
    completed: false,
    taskType: 'presentation'
  },
  {
    id: 2,
    title: "Grammar revision test",
    subject: "Russian",
    dueDate: "2026-01-31T23:59:00",
    description: "Revise то что; все что; тот кто; те кто; все кто. Complete exercises and upload to Bb Discussion forum.",
    completed: false,
    taskType: 'revision'
  },
  {
    id: 3,
    title: "Reading/Essay homework",
    subject: "Russian",
    dueDate: "2026-01-30T12:00:00",
    description: "Check 'Homework for after Christmas' in Read/Essay Folder / Weeks 13-23",
    completed: false,
    taskType: 'homework'
  },
  {
    id: 4,
    title: "Vocabulary test prep",
    subject: "Russian",
    dueDate: "2026-02-07T12:00:00",
    description: "Learn vocabulary p. 32 of handbook. Read phrases p. 31. Do exercises p. 33.",
    completed: false,
    taskType: 'vocabulary'
  },
  {
    id: 5,
    title: "Debate: Best entertainment",
    subject: "Russian",
    dueDate: "2026-02-07T12:00:00",
    description: "Prepare for debate about best type of entertainment",
    completed: false,
    taskType: 'debate'
  },
  {
    id: 6,
    title: "Grammar revision test",
    subject: "Russian",
    dueDate: "2026-02-07T23:59:00",
    description: "Revise conjunctions of time. Complete exercises and upload to Bb Discussion forum.",
    completed: false,
    taskType: 'revision'
  },
  {
    id: 7,
    title: "Prepare translation",
    subject: "Russian",
    dueDate: "2026-02-09T23:59:00",
    description: "R-E Translation - prepare for submission in Week 16",
    completed: false,
    taskType: 'translation'
  },
  {
    id: 8,
    title: "Submit translation",
    subject: "Russian",
    dueDate: "2026-02-13T12:00:00",
    description: "R-E Translation Group A - submit translation",
    completed: false,
    taskType: 'translation'
  },
  {
    id: 9,
    title: "Grammar revision test",
    subject: "Russian",
    dueDate: "2026-02-14T23:59:00",
    description: "Revise conjunctions of cause. Complete exercises and upload to Bb Discussion forum.",
    completed: false,
    taskType: 'revision'
  },
  {
    id: 10,
    title: "10-min In-class Presentation",
    subject: "Modern Languages",
    dueDate: "2026-03-20T12:00:00",
    description: "Assignment 1 - 10 minute In-class Presentation",
    completed: false,
    taskType: 'presentation'
  }
]

const subjectColors = {
  'Russian': { bg: '#fef2f2', text: '#dc2626', accent: '#ef4444' },
  'Linguistics': { bg: '#f5f3ff', text: '#7c3aed', accent: '#8b5cf6' },
  'Modern Languages': { bg: '#eef2ff', text: '#4f46e5', accent: '#6366f1' },
  'Spanish': { bg: '#fffbeb', text: '#d97706', accent: '#f59e0b' },
  'Other': { bg: '#f9fafb', text: '#4b5563', accent: '#6b7280' }
}

const onboardingSteps = [
  { id: 'lms', label: 'Connect your LMS', completed: true },
  { id: 'schedule', label: 'Add class schedule', completed: true },
  { id: 'preferences', label: 'Set study preferences', completed: false },
  { id: 'notifications', label: 'Enable notifications', completed: false }
]

function App() {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [view, setView] = useState('list')
  const [filter, setFilter] = useState('all')
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  const subjects = [...new Set(assignments.map(a => a.subject))]
  
  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(a => a.subject === filter)

  const sortedAssignments = [...filteredAssignments].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  )

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today.getTime() + 86400000)
  const nextWeek = new Date(today.getTime() + 7 * 86400000)

  const groups = {
    overdue: sortedAssignments.filter(a => new Date(a.dueDate) < now && !a.completed),
    today: sortedAssignments.filter(a => {
      const d = new Date(a.dueDate)
      return d >= today && d < tomorrow && !a.completed
    }),
    thisWeek: sortedAssignments.filter(a => {
      const d = new Date(a.dueDate)
      return d >= tomorrow && d < nextWeek && !a.completed
    }),
    later: sortedAssignments.filter(a => new Date(a.dueDate) >= nextWeek && !a.completed),
    completed: sortedAssignments.filter(a => a.completed)
  }

  const toggleComplete = (id) => {
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ))
  }

  const completedSteps = onboardingSteps.filter(s => s.completed).length
  const totalSteps = onboardingSteps.length
  const onboardingProgress = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              <img src="/logo.svg" alt="Nudge" className="w-10 h-10" />
              Nudge
            </h1>
            <div className="flex items-center gap-2">
            <button
              onClick={() => {
                console.log('Settings button clicked')
                setShowSettings(true)
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  view === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  view === 'calendar' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Calendar
              </button>
            </div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              All tasks
            </button>
            {subjects.map(subject => {
              const colors = subjectColors[subject] || subjectColors['Other']
              return (
                <button
                  key={subject}
                  onClick={() => setFilter(subject)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                    filter === subject
                      ? 'text-white'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                  style={filter === subject ? { backgroundColor: colors.accent } : { color: colors.text }}
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: colors.accent }}
                  />
                  {subject}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Onboarding Checklist */}
        {showOnboarding && onboardingProgress < 100 && (
          <OnboardingChecklist 
            steps={onboardingSteps}
            progress={onboardingProgress}
            onDismiss={() => setShowOnboarding(false)}
          />
        )}

        {view === 'list' ? (
          <ListView 
            groups={groups} 
            subjectColors={subjectColors}
            onToggleComplete={toggleComplete}
            onSelectAssignment={setSelectedAssignment}
          />
        ) : (
          <CalendarView 
            assignments={sortedAssignments}
            subjectColors={subjectColors}
          />
        )}
      </main>

      {/* Study Time Modal */}
      {selectedAssignment && (
        <StudyTimeModal 
          assignment={selectedAssignment}
          schedule={weeklySchedule}
          taskDurations={taskDurations}
          subjectColors={subjectColors}
          onClose={() => setSelectedAssignment(null)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <>
          {console.log('Rendering SettingsModal', showSettings)}
          <SettingsModal onClose={() => setShowSettings(false)} />
        </>
      )}
    </div>
  )
}

function SettingsModal({ onClose }) {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(false)
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Account Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">N</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Noah</p>
                  <p className="text-sm text-gray-500">University of Bristol</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Services */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Connected Services</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">Bb</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Blackboard</p>
                    <p className="text-sm text-green-600">Connected</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Google Calendar</p>
                    <p className="text-sm text-gray-500">Sync your events</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Preferences</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Dark mode</span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-7 rounded-full transition-colors ${darkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Notifications</span>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-7 rounded-full transition-colors ${notifications ? 'bg-indigo-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Schedule</h3>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Class timetable</p>
                  <p className="text-sm text-gray-500">Edit your weekly schedule</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">About</h3>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <img src="/logo.svg" alt="Nudge" className="w-10 h-10" />
                <div>
                  <p className="font-semibold text-gray-900">Nudge</p>
                  <p className="text-sm text-gray-500">Version 1.0.0</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">Your assignments, clear. Built with 💜 for students.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OnboardingChecklist({ steps, progress, onDismiss }) {
  return (
    <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <span className="text-xl">🚀</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Complete your setup</h2>
            <p className="text-sm text-gray-500">{progress}% complete</p>
          </div>
        </div>
        <button 
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {steps.map(step => (
          <div 
            key={step.id}
            className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
              step.completed ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
            }`}
          >
            {step.completed ? (
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
            )}
            {step.label}
          </div>
        ))}
      </div>
    </div>
  )
}

function StudyTimeModal({ assignment, schedule, taskDurations, subjectColors, onClose }) {
  const duration = taskDurations[assignment.taskType] || taskDurations.default
  const dueDate = new Date(assignment.dueDate)
  const colors = subjectColors[assignment.subject] || subjectColors['Other']
  const suggestions = getSuggestedTimes(assignment, schedule, taskDurations)
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.bg }}
              >
                <svg className="w-5 h-5" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">When to work on this</h2>
                <p className="text-sm text-gray-500">Based on your schedule</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-5">
          <div className="mb-5 p-4 rounded-xl" style={{ backgroundColor: colors.bg }}>
            <h3 className="font-medium text-gray-900 mb-1">{assignment.title}</h3>
            <p className="text-sm" style={{ color: colors.text }}>
              Due {dueDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })} • ~{duration} mins
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Suggested times</p>
            {suggestions.length > 0 ? (
              suggestions.map((slot, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{slot.day}</div>
                      <div className="text-sm text-gray-500">{slot.time}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-200">
                        {slot.label}
                      </span>
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No suggestions available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getSuggestedTimes(assignment, schedule, taskDurations) {
  const dueDate = new Date(assignment.dueDate)
  const now = new Date()
  const duration = taskDurations[assignment.taskType] || taskDurations.default
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  const suggestions = []
  
  for (let i = 0; i < 5; i++) {
    const checkDate = new Date(now)
    checkDate.setDate(checkDate.getDate() + i)
    
    if (checkDate > dueDate) break
    
    const dayName = days[checkDate.getDay()]
    const daySchedule = schedule[dayName]
    
    if (daySchedule && daySchedule.freeSlots) {
      for (const slot of daySchedule.freeSlots) {
        const slotStart = parseInt(slot.start.split(':')[0]) * 60 + parseInt(slot.start.split(':')[1])
        const slotEnd = parseInt(slot.end.split(':')[0]) * 60 + parseInt(slot.end.split(':')[1])
        const slotDuration = slotEnd - slotStart
        
        if (slotDuration >= duration) {
          suggestions.push({
            day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[checkDate.getDay()],
            time: `${slot.start} – ${slot.end}`,
            label: slot.label
          })
        }
      }
    }
    
    if (suggestions.length >= 4) break
  }
  
  return suggestions
}

function ListView({ groups, subjectColors, onToggleComplete, onSelectAssignment }) {
  const hasAssignments = Object.values(groups).some(g => g.length > 0)

  if (!hasAssignments) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h2>
        <p className="text-gray-500">No assignments due. Enjoy your free time.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {groups.overdue.length > 0 && (
        <Section 
          title="Overdue" 
          icon="⚠️"
          iconBg="bg-red-100"
          assignments={groups.overdue} 
          urgency="overdue"
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
          onSelectAssignment={onSelectAssignment}
        />
      )}
      {groups.today.length > 0 && (
        <Section 
          title="Due today" 
          icon="🔥"
          iconBg="bg-orange-100"
          assignments={groups.today} 
          urgency="urgent"
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
          onSelectAssignment={onSelectAssignment}
        />
      )}
      {groups.thisWeek.length > 0 && (
        <Section 
          title="This week" 
          icon="📅"
          iconBg="bg-blue-100"
          assignments={groups.thisWeek} 
          urgency="upcoming"
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
          onSelectAssignment={onSelectAssignment}
        />
      )}
      {groups.later.length > 0 && (
        <Section 
          title="Later" 
          icon="📆"
          iconBg="bg-gray-100"
          assignments={groups.later} 
          urgency=""
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
          onSelectAssignment={onSelectAssignment}
        />
      )}
      {groups.completed.length > 0 && (
        <Section 
          title="Completed" 
          icon="✅"
          iconBg="bg-green-100"
          assignments={groups.completed} 
          urgency="completed"
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
          onSelectAssignment={onSelectAssignment}
        />
      )}
    </div>
  )
}

function Section({ title, icon, iconBg, assignments, urgency, subjectColors, onToggleComplete, onSelectAssignment }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
          <span className="text-sm">{icon}</span>
        </div>
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-400">({assignments.length})</span>
      </div>
      <div className="space-y-2">
        {assignments.map(assignment => (
          <AssignmentCard 
            key={assignment.id} 
            assignment={assignment}
            urgency={urgency}
            colors={subjectColors[assignment.subject] || subjectColors['Other']}
            onToggleComplete={onToggleComplete}
            onSelectAssignment={onSelectAssignment}
          />
        ))}
      </div>
    </div>
  )
}

function AssignmentCard({ assignment, urgency, colors, onToggleComplete, onSelectAssignment }) {
  const [expanded, setExpanded] = useState(false)
  const dueDate = new Date(assignment.dueDate)
  
  const formatDate = (date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 86400000)
    
    if (date < now && !assignment.completed) return 'Overdue'
    if (date >= today && date < tomorrow) return 'Today'
    if (date >= tomorrow && date < new Date(tomorrow.getTime() + 86400000)) return 'Tomorrow'
    
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div 
      className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow
        ${assignment.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleComplete(assignment.id)
          }}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${assignment.completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 hover:border-gray-400'}`}
        >
          {assignment.completed && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {assignment.subject}
            </span>
          </div>
          <h3 className={`font-medium text-gray-900 ${assignment.completed ? 'line-through text-gray-400' : ''}`}>
            {assignment.title}
          </h3>
          {expanded && assignment.description && (
            <div className="mt-3">
              <p className="text-sm text-gray-500">{assignment.description}</p>
              {!assignment.completed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectAssignment(assignment)
                  }}
                  className="mt-3 text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  When should I do this?
                </button>
              )}
            </div>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-sm font-medium ${
            urgency === 'overdue' ? 'text-red-500' : 
            urgency === 'urgent' ? 'text-orange-500' : 
            'text-gray-600'
          }`}>
            {formatDate(dueDate)}
          </div>
          <div className="text-xs text-gray-400">{formatTime(dueDate)}</div>
        </div>
      </div>
    </div>
  )
}

function CalendarView({ assignments, subjectColors }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPadding = (firstDay.getDay() + 6) % 7
  
  const today = new Date()
  
  const days = []
  
  for (let i = 0; i < startPadding; i++) {
    const day = new Date(year, month, -startPadding + i + 1)
    days.push({ date: day, otherMonth: true })
  }
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push({ date: new Date(year, month, day), otherMonth: false })
  }

  const getAssignmentsForDay = (date) => {
    return assignments.filter(a => {
      const d = new Date(a.dueDate)
      return d.getFullYear() === date.getFullYear() && 
             d.getMonth() === date.getMonth() && 
             d.getDate() === date.getDate()
    })
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(new Date(year, month - 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
        
        {days.map(({ date, otherMonth }, idx) => {
          const dayAssignments = getAssignmentsForDay(date)
          const isToday = date.toDateString() === today.toDateString()
          
          return (
            <div
              key={idx}
              className={`min-h-[90px] rounded-xl p-2 ${
                otherMonth ? 'bg-gray-50 opacity-40' : 'bg-gray-50'
              } ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
            >
              <div className={`text-sm mb-1 ${
                isToday ? 'text-blue-600 font-bold' : 'text-gray-500 font-medium'
              }`}>
                {date.getDate()}
              </div>
              {dayAssignments.slice(0, 2).map(a => {
                const colors = subjectColors[a.subject] || subjectColors['Other']
                return (
                  <div
                    key={a.id}
                    className="text-[10px] px-1.5 py-0.5 rounded mb-0.5 truncate font-medium"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {a.title}
                  </div>
                )
              })}
              {dayAssignments.length > 2 && (
                <div className="text-[10px] text-gray-400 font-medium">+{dayAssignments.length - 2} more</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
