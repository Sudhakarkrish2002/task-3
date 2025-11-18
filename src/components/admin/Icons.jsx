import React from 'react'

// Base icon props
const iconProps = {
  className: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// Dashboard Icon
export const DashboardIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

// Users/Students Icon
export const UsersIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

// Building/Employers Icon
export const BuildingIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-4" />
    <path d="M9 9v0" />
    <path d="M9 12v0" />
    <path d="M9 15v0" />
    <path d="M9 18v0" />
  </svg>
)

// School/Colleges Icon
export const SchoolIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <path d="M22 10v6M2 10l9-4 9 4-9 4z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
)

// Book/Courses Icon
export const BookIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

// Document/Blogs Icon
export const DocumentIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

// Upload/Submissions Icon
export const UploadIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

// Briefcase/Internships Icon
export const BriefcaseIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

// Revenue/Money Icon
export const RevenueIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

// Chart/Graph Icon
export const ChartIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

// Clock/Pending Icon
export const ClockIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

// Check/Approved Icon
export const CheckIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// X/Rejected Icon
export const XIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// Search Icon
export const SearchIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

// Filter Icon
export const FilterIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

// Edit Icon
export const EditIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

// Eye/View Icon
export const EyeIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

// Download/Export Icon
export const DownloadIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

// More/Options Icon
export const MoreIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
)

// Arrow Right Icon
export const ArrowRightIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// Arrow Left Icon
export const ArrowLeftIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

// Close/X Close Icon
export const CloseIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// Calendar Icon
export const CalendarIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

// File Icon
export const FileIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
)

// Settings Icon
export const SettingsIcon = ({ className = iconProps.className, ...props }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m15.364 6.364l-4.243-4.243m-4.242 0L5.636 18.364m12.728 0l-4.243-4.243m-4.242 0L5.636 5.636" />
  </svg>
)

