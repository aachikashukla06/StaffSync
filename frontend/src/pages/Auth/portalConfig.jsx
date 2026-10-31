function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.3 5.2 6.2v4.7c0 4.2 2.8 8 6.8 9.1 4-1.1 6.8-4.9 6.8-9.1V6.2L12 3.3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9.3 11.9 1.8 1.8 3.8-3.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HRIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8.4 11a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Zm7 .5a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.6 18.3c0-2.4 2-4.2 4.6-4.2h.2c2.6 0 4.7 1.8 4.7 4.2M14.6 17.5c.5-1.2 1.8-1.9 3.2-1.9 1.6 0 2.9.8 3.6 2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmployeeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 10.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.2 19.1c0-3 3-5.2 6.8-5.2s6.8 2.2 6.8 5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const portals = [
  {
    role: 'employee',
    label: 'EMPLOYEE WORKSPACE',
    status: 'Self service',
    title: 'Employee Login',
    description:
      'Check attendance, review leave requests, and keep your employee profile up to date.',
    features: ['Attendance', 'Leave & profile'],
    loginPath: '/employee-login',
    primaryColor: '#3478f0',
    secondaryColor: '#1ca8d5',
    shadowColor: 'rgba(28, 168, 213, 0.2)',
    icon: <EmployeeIcon />,
  },
  {
    role: 'hr',
    label: 'PEOPLE OPERATIONS',
    status: 'HR team',
    title: 'HR Login',
    description:
      'Manage employee profiles, review leave requests, and coordinate day-to-day attendance.',
    features: ['People directory', 'Leave approvals'],
    loginPath: '/hr-login',
    primaryColor: '#953bef',
    secondaryColor: '#ed3f97',
    shadowColor: 'rgba(217, 63, 151, 0.22)',
    icon: <HRIcon />,
  },
  {
    role: 'admin',
    label: 'ADMINISTRATION',
    status: 'Admin team',
    title: 'Admin Login',
    description:
      'Manage accounts and departments, oversee payroll records, and maintain workspace access.',
    features: ['Access control', 'Workforce overview'],
    loginPath: '/admin-login',
    primaryColor: '#5f5cf7',
    secondaryColor: '#8f39ff',
    shadowColor: 'rgba(95, 92, 247, 0.22)',
    icon: <AdminIcon />,
  },
];
