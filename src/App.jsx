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

// Noah's assignments - synced from Blackboard calendar + manual adds
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
  'Russian': '#ef4444',
  'Linguistics': '#8b5cf6',
  'Modern Languages': '#6366f1',
  'Spanish': '#f59e0b',
  'Other': '#6b7280'
}

// Onboarding checklist
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
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0a0a0b]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">👋</span> Nudge
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  view === 'list' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  view === 'calendar' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Calendar
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                  : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
              }`}
            >
              All
            </button>
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => setFilter(subject)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  filter === subject
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                    : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: subjectColors[subject] || subjectColors['Other'] }}
                />
                {subject}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
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
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </div>
  )
}

function OnboardingChecklist({ steps, progress, onDismiss }) {
  return (
    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚀</span>
          <span className="font-medium">Complete your setup</span>
        </div>
        <button 
          onClick={onDismiss}
          className="text-gray-500 hover:text-gray-300 text-sm"
        >
          Dismiss
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {steps.map(step => (
          <div 
            key={step.id}
            className={`flex items-center gap-2 text-sm ${
              step.completed ? 'text-green-400' : 'text-gray-400'
            }`}
          >
            {step.completed ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <div className="w-4 h-4 rounded-full border border-gray-500" />
            )}
            {step.label}
          </div>
        ))}
      </div>
    </div>
  )
}

function StudyTimeModal({ assignment, schedule, taskDurations, onClose }) {
  const duration = taskDurations[assignment.taskType] || taskDurations.default
  const dueDate = new Date(assignment.dueDate)
  
  // Get suggested study times
  const suggestions = getSuggestedTimes(assignment, schedule, taskDurations)
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-[#1a1a1e] rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">When to work on this</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-medium mb-1">{assignment.title}</h3>
            <p className="text-sm text-gray-400">
              Due {dueDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })} • 
              Estimated {duration} mins
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Suggested times</p>
            {suggestions.length > 0 ? (
              suggestions.map((slot, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{slot.day}</div>
                      <div className="text-sm text-gray-400">{slot.time}</div>
                    </div>
                    <div className="text-xs text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded-full">
                      {slot.label}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No suggestions available</p>
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
  
  // Look at the next 5 days
  for (let i = 0; i < 5; i++) {
    const checkDate = new Date(now)
    checkDate.setDate(checkDate.getDate() + i)
    
    // Don't suggest times after the due date
    if (checkDate > dueDate) break
    
    const dayName = days[checkDate.getDay()]
    const daySchedule = schedule[dayName]
    
    if (daySchedule && daySchedule.freeSlots) {
      for (const slot of daySchedule.freeSlots) {
        // Check if slot is long enough
        const slotStart = parseInt(slot.start.split(':')[0]) * 60 + parseInt(slot.start.split(':')[1])
        const slotEnd = parseInt(slot.end.split(':')[0]) * 60 + parseInt(slot.end.split(':')[1])
        const slotDuration = slotEnd - slotStart
        
        if (slotDuration >= duration) {
          suggestions.push({
            day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[checkDate.getDay()],
            time: `${slot.start} - ${slot.end}`,
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
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-medium text-gray-300 mb-2">All caught up!</h2>
        <p className="text-gray-500">No assignments due. Enjoy your free time.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {groups.overdue.length > 0 && (
        <Section 
          title="⚠️ Overdue" 
          assignments={groups.overdue} 
          urgency="overdue"
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
          onSelectAssignment={onSelectAssignment}
        />
      )}
      {groups.today.length > 0 && (
        <Section 
          title="🔥 Due Today" 
          assignments={groups.today} 
          urgency="urgent"
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
          onSelectAssignment={onSelectAssignment}
        />
      )}
      {groups.thisWeek.length > 0 && (
        <Section 
          title="📅 This Week" 
          assignments={groups.thisWeek} 
          urgency="upcoming"
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
          onSelectAssignment={onSelectAssignment}
        />
      )}
      {groups.later.length > 0 && (
        <Section 
          title="📆 Later" 
          assignments={groups.later} 
          urgency=""
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
          onSelectAssignment={onSelectAssignment}
        />
      )}
      {groups.completed.length > 0 && (
        <Section 
          title="✅ Completed" 
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

function Section({ title, assignments, urgency, subjectColors, onToggleComplete, onSelectAssignment }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
        {title}
      </h2>
      <div className="space-y-2">
        {assignments.map(assignment => (
          <AssignmentCard 
            key={assignment.id} 
            assignment={assignment}
            urgency={urgency}
            color={subjectColors[assignment.subject] || subjectColors['Other']}
            onToggleComplete={onToggleComplete}
            onSelectAssignment={onSelectAssignment}
          />
        ))}
      </div>
    </div>
  )
}

function AssignmentCard({ assignment, urgency, color, onToggleComplete, onSelectAssignment }) {
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

  const urgencyStyles = {
    overdue: 'border-l-red-500',
    urgent: 'border-l-amber-500',
    upcoming: 'border-l-indigo-500',
    completed: 'border-l-green-500 opacity-60',
    '': 'border-l-gray-600'
  }

  return (
    <div 
      className={`bg-[#1a1a1e] rounded-xl p-4 border-l-4 ${urgencyStyles[urgency]} 
        hover:bg-[#222226] transition-colors
        ${assignment.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleComplete(assignment.id)
          }}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
            ${assignment.completed ? 'bg-green-500 border-green-500' : 'border-gray-500 hover:border-gray-400'}`}
        >
          {assignment.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="w-2 h-2 rounded-full flex-shrink-0" 
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-gray-400">{assignment.subject}</span>
          </div>
          <h3 className={`font-medium ${assignment.completed ? 'line-through text-gray-500' : ''}`}>
            {assignment.title}
          </h3>
          {expanded && assignment.description && (
            <div>
              <p className="text-sm text-gray-400 mt-2">{assignment.description}</p>
              {!assignment.completed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectAssignment(assignment)
                  }}
                  className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
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
            urgency === 'overdue' ? 'text-red-400' : 
            urgency === 'urgent' ? 'text-amber-400' : 
            'text-gray-300'
          }`}>
            {formatDate(dueDate)}
          </div>
          <div className="text-xs text-gray-500">{formatTime(dueDate)}</div>
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
  
  // Previous month padding
  for (let i = 0; i < startPadding; i++) {
    const day = new Date(year, month, -startPadding + i + 1)
    days.push({ date: day, otherMonth: true })
  }
  
  // Current month
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(new Date(year, month - 1))}
          className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
        >
          ←
        </button>
        <h2 className="text-lg font-medium">
          {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
        >
          →
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-xs text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {days.map(({ date, otherMonth }, idx) => {
          const dayAssignments = getAssignmentsForDay(date)
          const isToday = date.toDateString() === today.toDateString()
          
          return (
            <div
              key={idx}
              className={`min-h-[80px] rounded-lg p-1.5 ${
                otherMonth ? 'bg-white/[0.02] opacity-40' : 'bg-[#1a1a1e]'
              } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <div className={`text-xs mb-1 ${isToday ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}>
                {date.getDate()}
              </div>
              {dayAssignments.slice(0, 2).map(a => (
                <div
                  key={a.id}
                  className="text-[10px] px-1 py-0.5 rounded mb-0.5 truncate"
                  style={{ backgroundColor: subjectColors[a.subject] || subjectColors['Other'] }}
                >
                  {a.title}
                </div>
              ))}
              {dayAssignments.length > 2 && (
                <div className="text-[10px] text-gray-500">+{dayAssignments.length - 2} more</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
