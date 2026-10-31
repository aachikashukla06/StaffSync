import { CalendarIcon, DashboardIcon, DocumentIcon, UsersIcon, WalletIcon, MegaphoneIcon } from './dashboardIcons';
import WorkspaceLayout from './WorkspaceLayout';
const navigation = [
  {label:'Dashboard',path:'/dashboard/hr',icon:DashboardIcon},{label:'Employees',path:'/dashboard/hr/employees',icon:UsersIcon},
  {label:'Departments',path:'/dashboard/hr/departments',icon:UsersIcon},{label:'Attendance',path:'/dashboard/hr/attendance',icon:CalendarIcon},
  {label:'Leave Management',path:'/dashboard/hr/leaves',icon:DocumentIcon},{label:'Payroll',path:'/dashboard/hr/payroll',icon:WalletIcon},
  {label:'Announcements',path:'/dashboard/hr/announcements',icon:MegaphoneIcon},
];
function getHRRoleLabel(user){return user?.profileRole||user?.designation||'HR Manager';}
function HRWorkspaceLayout(){return <WorkspaceLayout navigation={navigation} brandIcon={UsersIcon} brandSubtitle="Management Suite" navigationLabel="HR navigation" logoutPath="/hr-login" defaultName="HR User" getRoleLabel={getHRRoleLabel}/>;}
export default HRWorkspaceLayout;
