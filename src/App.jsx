import { useState, useEffect } from 'react'

// Noah's assignments - synced from Blackboard calendar + manual adds
const initialAssignments = [
  // Week 14 - This week (Jan 27 - Feb 2)
  {
    id: 1,
    title: "СМИ Presentation",
    subject: "Russian",
    dueDate: "2026-01-31T12:00:00",
    description: "Oral presentation on СМИ (media)",
    completed: false
  },
  {
    id: 2,
    title: "Grammar revision test",
    subject: "Russian",
    dueDate: "2026-01-31T23:59:00",
    description: "Revise то что; все что; тот кто; те кто; все кто. Complete exercises and upload to Bb Discussion forum.",
    completed: false
  },
  {
    id: 3,
    title: "Reading/Essay homework",
    subject: "Russian",
    dueDate: "2026-01-30T12:00:00",
    description: "Check 'Homework for after Christmas' in Read/Essay Folder / Weeks 13-23",
    completed: false
  },
  // Week 15 (Feb 3-9)
  {
    id: 4,
    title: "Vocabulary test prep",
    subject: "Russian",
    dueDate: "2026-02-07T12:00:00",
    description: "Learn vocabulary p. 32 of handbook. Read phrases p. 31. Do exercises p. 33.",
    completed: false
  },
  {
    id: 5,
    title: "Debate: Best entertainment",
    subject: "Russian",
    dueDate: "2026-02-07T12:00:00",
    description: "Prepare for debate about best type of entertainment",
    completed: false
  },
  {
    id: 6,
    title: "Grammar revision test",
    subject: "Russian",
    dueDate: "2026-02-07T23:59:00",
    description: "Revise conjunctions of time. Complete exercises and upload to Bb Discussion forum.",
    completed: false
  },
  {
    id: 7,
    title: "Prepare translation",
    subject: "Russian",
    dueDate: "2026-02-09T23:59:00",
    description: "R-E Translation - prepare for submission in Week 16",
    completed: false
  },
  // Week 16 (Feb 10-16)
  {
    id: 8,
    title: "Submit translation",
    subject: "Russian",
    dueDate: "2026-02-13T12:00:00",
    description: "R-E Translation Group A - submit translation",
    completed: false
  },
  {
    id: 9,
    title: "Grammar revision test",
    subject: "Russian",
    dueDate: "2026-02-14T23:59:00",
    description: "Revise conjunctions of cause. Complete exercises and upload to Bb Discussion forum.",
    completed: false
  },
  // From Blackboard calendar
  {
    id: 10,
    title: "10-min In-class Presentation",
    subject: "Modern Languages",
    dueDate: "2026-03-20T12:00:00",
    description: "Assignment 1 - 10 minute In-class Presentation",
    completed: false
  }
]

const subjectColors = {
  'Russian': '#ef4444',
  'Linguistics': '#8b5cf6',
  'Modern Languages': '#6366f1',
  'Other': '#6b7280'
}

function App() {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [view, setView] = useState('list')
  const [filter, setFilter] = useState('all')

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
        {view === 'list' ? (
          <ListView 
            groups={groups} 
            subjectColors={subjectColors}
            onToggleComplete={toggleComplete}
          />
        ) : (
          <CalendarView 
            assignments={sortedAssignments}
            subjectColors={subjectColors}
          />
        )}
      </main>
    </div>
  )
}

function ListView({ groups, subjectColors, onToggleComplete }) {
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
        />
      )}
      {groups.today.length > 0 && (
        <Section 
          title="🔥 Due Today" 
          assignments={groups.today} 
          urgency="urgent"
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
        />
      )}
      {groups.thisWeek.length > 0 && (
        <Section 
          title="📅 This Week" 
          assignments={groups.thisWeek} 
          urgency="upcoming"
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
        />
      )}
      {groups.later.length > 0 && (
        <Section 
          title="📆 Later" 
          assignments={groups.later} 
          urgency=""
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
        />
      )}
      {groups.completed.length > 0 && (
        <Section 
          title="✅ Completed" 
          assignments={groups.completed} 
          urgency="completed"
          subjectColors={subjectColors}
          onToggleComplete={onToggleComplete}
        />
      )}
    </div>
  )
}

function Section({ title, assignments, urgency, subjectColors, onToggleComplete }) {
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
          />
        ))}
      </div>
    </div>
  )
}

function AssignmentCard({ assignment, urgency, color, onToggleComplete }) {
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
            <p className="text-sm text-gray-400 mt-2">{assignment.description}</p>
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
