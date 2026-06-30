// src/pages/Calendar.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// ── Platform icons (reuse same SVGs from Dashboard) ──────
const LinkedInIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0A66C2"/>
        <path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white"/>
        <circle cx="6.25" cy="6.75" r="1.5" fill="white"/>
        <path d="M19 19H16.5V14C16.5 12.9 15.85 12 14.75 12C13.65 12 13 12.9 13 14V19H10.5V9.5H13V10.75C13.55 9.9 14.6 9.25 15.75 9.25C17.6 9.25 19 10.65 19 12.75V19Z" fill="white"/>
    </svg>
);
const FacebookIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1877F2"/>
        <path d="M13.5 12.5H15.5L16 10H13.5V8.5C13.5 7.8 13.8 7.25 14.75 7.25H16V5.1C15.45 5.05 14.7 5 13.9 5C11.8 5 10.5 6.2 10.5 8.25V10H8V12.5H10.5V19H13.5V12.5Z" fill="white"/>
    </svg>
);
const InstagramIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
            <linearGradient id="ig-cal" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFDC80"/>
                <stop offset="50%" stopColor="#F77737"/>
                <stop offset="100%" stopColor="#833AB4"/>
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-cal)"/>
        <rect x="6" y="6" width="12" height="12" rx="4" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
);
const PLATFORM_ICON = { linkedin: LinkedInIcon, facebook: FacebookIcon, instagram: InstagramIcon };

const STATUS_COLOR = {
    draft:     'bg-amber-100 border-amber-300 text-amber-700',
    published: 'bg-green-100 border-green-300 text-green-700',
    partial:   'bg-orange-100 border-orange-300 text-orange-700',
    failed:    'bg-red-100 border-red-300 text-red-700',
    pending:   'bg-gray-100 border-gray-300 text-gray-700',
};

// ── Date helper functions ─────────────────────────────────
const toDateKey = (date) => date.toISOString().split('T')[0];

const getMonthGrid = (year, month) => {
    // returns array of weeks, each week is array of 7 Date objects
    // includes leading/trailing days from prev/next month to fill grid
    const firstDay   = new Date(year, month, 1);
    const lastDay    = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay(); // 0=Sunday
    const totalDays   = lastDay.getDate();

    const days = [];
    // leading days from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
        const d = new Date(year, month, -i);
        days.push({ date: d, inMonth: false });
    }
    // days of current month
    for (let i = 1; i <= totalDays; i++) {
        days.push({ date: new Date(year, month, i), inMonth: true });
    }
    // trailing days to complete final week
    while (days.length % 7 !== 0) {
        const last = days[days.length - 1].date;
        const next = new Date(last);
        next.setDate(next.getDate() + 1);
        days.push({ date: next, inMonth: false });
    }
    return days;
};

const getWeekDays = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return { date: d, inMonth: true };
    });
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Calendar() {
    const navigate = useNavigate();
    const [view, setView]               = useState('month'); // 'month' | 'week'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [postsByDate, setPostsByDate] = useState({});
    const [loading, setLoading]         = useState(true);
    const [selectedDay, setSelectedDay] = useState(null); // for side panel

    // ── Fetch posts whenever view/date changes ──────────────
    useEffect(() => {
        fetchCalendarData();
    }, [view, currentDate]);

    const fetchCalendarData = async () => {
        setLoading(true);
        try {
            let startDate, endDate;

            if (view === 'month') {
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate   = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            } else {
                const days = getWeekDays(currentDate);
                startDate = days[0].date;
                endDate   = days[6].date;
            }

            const res = await API.get('/api/posts/calendar', {
                params: {
                    startDate: startDate.toISOString(),
                    endDate:   endDate.toISOString()
                }
            });
            setPostsByDate(res.data.postsByDate || {});
        } catch (err) {
            console.error('Failed to load calendar:', err);
        } finally {
            setLoading(false);
        }
    };

    // ── Navigation handlers ──────────────────────────────────
    const goToday = () => setCurrentDate(new Date());

    const goPrev = () => {
        const d = new Date(currentDate);
        if (view === 'month') d.setMonth(d.getMonth() - 1);
        else d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    };

    const goNext = () => {
        const d = new Date(currentDate);
        if (view === 'month') d.setMonth(d.getMonth() + 1);
        else d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    };

    // ── Click a date — opens side panel OR navigates to compose ──
    const handleDayClick = (date) => {
        const key = toDateKey(date);
        setSelectedDay({ date, posts: postsByDate[key] || [] });
    };

    const handleScheduleNew = (date) => {
        // navigate to dashboard with date pre-filled
        // we pass it via query param, Dashboard reads it
        const dateStr = date.toISOString().slice(0, 16);
        navigate(`/dashboard?scheduleDate=${dateStr}`);
    };

    const isToday = (date) => toDateKey(date) === toDateKey(new Date());

    const days = view === 'month'
        ? getMonthGrid(currentDate.getFullYear(), currentDate.getMonth())
        : getWeekDays(currentDate);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Top bar ─────────────────────────────────── */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600">
                            ← Back
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">Content Calendar</h1>
                    </div>

                    {/* View toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                        {['month', 'week'].map(v => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                                    view === v ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                                }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-6">

                {/* ── Calendar header controls ─────────────── */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={goPrev} className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500">‹</button>
                        <h2 className="text-lg font-semibold text-gray-900 min-w-[180px]">
                            {view === 'month'
                                ? `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                                : `Week of ${getWeekDays(currentDate)[0].date.toLocaleDateString()}`
                            }
                        </h2>
                        <button onClick={goNext} className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500">›</button>
                        <button onClick={goToday} className="px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50">
                            Today
                        </button>
                    </div>
                    <button
                        onClick={() => handleScheduleNew(new Date())}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        + New Post
                    </button>
                </div>

                <div className="flex gap-6">

                    {/* ── Calendar Grid ─────────────────────── */}
                    <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden">

                        {/* Day name headers */}
                        <div className="grid grid-cols-7 border-b border-gray-100">
                            {DAY_NAMES.map(d => (
                                <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar cells */}
                        <div className={`grid grid-cols-7 ${view === 'week' ? '' : 'auto-rows-fr'}`}>
                            {days.map((day, i) => {
                                const key       = toDateKey(day.date);
                                const dayPosts  = postsByDate[key] || [];
                                const isPast    = day.date < new Date(new Date().setHours(0,0,0,0));

                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleDayClick(day.date)}
                                        className={`border-b border-r border-gray-100 p-2 cursor-pointer hover:bg-gray-50 transition-colors group relative ${
                                            view === 'week' ? 'min-h-[200px]' : 'min-h-[110px]'
                                        } ${!day.inMonth ? 'bg-gray-50/50' : ''} ${
                                            selectedDay && toDateKey(selectedDay.date) === key ? 'bg-indigo-50 ring-2 ring-indigo-300 ring-inset' : ''
                                        }`}
                                    >
                                        {/* Date number */}
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                                                isToday(day.date)
                                                    ? 'bg-indigo-600 text-white'
                                                    : !day.inMonth
                                                        ? 'text-gray-300'
                                                        : isPast
                                                            ? 'text-gray-400'
                                                            : 'text-gray-700'
                                            }`}>
                                                {day.date.getDate()}
                                            </span>

                                            {/* Quick add button — appears on hover */}
                                            {!isPast && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleScheduleNew(day.date); }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center hover:bg-indigo-200"
                                                >
                                                    +
                                                </button>
                                            )}
                                        </div>

                                        {/* Post mini-cards */}
                                        <div className="space-y-1">
                                            {dayPosts.slice(0, view === 'week' ? 6 : 3).map((post, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`text-[10px] px-1.5 py-1 rounded-md border flex items-center gap-1 truncate ${STATUS_COLOR[post.overallStatus] || STATUS_COLOR.pending}`}
                                                >
                                                    <div className="flex -space-x-1 flex-shrink-0">
                                                        {post.platforms.slice(0, 3).map((p, pi) => {
                                                            const PIcon = PLATFORM_ICON[p.platform];
                                                            return PIcon ? <PIcon key={pi} size={10} /> : null;
                                                        })}
                                                    </div>
                                                    <span className="truncate">
                                                        {post.scheduledAt
                                                            ? new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })
                                                            : 'Published'
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                            {dayPosts.length > (view === 'week' ? 6 : 3) && (
                                                <p className="text-[10px] text-gray-400 px-1.5">
                                                    +{dayPosts.length - (view === 'week' ? 6 : 3)} more
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Side panel — selected day details ──── */}
                    {selectedDay && (
                        <div className="w-80 bg-white rounded-2xl border border-gray-200 p-5 h-fit sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h3>
                                <button onClick={() => setSelectedDay(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
                            </div>

                            {selectedDay.posts.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-3xl mb-2">📭</div>
                                    <p className="text-sm text-gray-400 mb-4">No posts on this day</p>
                                    <button
                                        onClick={() => handleScheduleNew(selectedDay.date)}
                                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700"
                                    >
                                        + Schedule a post
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedDay.posts.map((post, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-xl p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex gap-1">
                                                    {post.platforms.map((p, pi) => {
                                                        const PIcon = PLATFORM_ICON[p.platform];
                                                        return PIcon ? <PIcon key={pi} size={16} /> : null;
                                                    })}
                                                </div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${STATUS_COLOR[post.overallStatus]}`}>
                                                    {post.overallStatus}
                                                </span>
                                            </div>
                                            {post.platforms.map((p, pi) => (
                                                <p key={pi} className="text-xs text-gray-600 truncate mb-0.5">
                                                    <span className="font-medium">{p.platform}:</span> {p.content}
                                                </p>
                                            ))}
                                            <p className="text-[10px] text-gray-400 mt-2">
                                                {post.scheduledAt
                                                    ? `Scheduled: ${new Date(post.scheduledAt).toLocaleTimeString()}`
                                                    : `Published: ${new Date(post.createdAt).toLocaleTimeString()}`
                                                }
                                            </p>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleScheduleNew(selectedDay.date)}
                                        className="w-full px-4 py-2 border border-indigo-200 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-50"
                                    >
                                        + Add another post
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}