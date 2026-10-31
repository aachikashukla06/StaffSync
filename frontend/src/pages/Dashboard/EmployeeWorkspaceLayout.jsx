import { CalendarIcon, DashboardIcon, DocumentIcon, UsersIcon, WalletIcon, MegaphoneIcon } from './dashboardIcons';
import WorkspaceLayout from './WorkspaceLayout';
const navigation = [
 {label:'Dashboard',path:'/dashboard/employee',icon:DashboardIcon},{label:'Attendance',path:'/dashboard/employee/attendance',icon:CalendarIcon},
 {label:'Leave Requests',path:'/dashboard/employee/leaves',icon:DocumentIcon},{label:'Payroll',path:'/dashboard/employee/payroll',icon:WalletIcon},
 {label:'My Profile',path:'/dashboard/employee/profile',icon:UsersIcon},{label:'Announcements',path:'/dashboard/employee/announcements',icon:MegaphoneIcon},
];
function getEmployeeRoleLabel(user){return user?.designation||user?.profileRole||'Team Member';}
function EmployeeWorkspaceLayout(){return <WorkspaceLayout navigation={navigation} brandIcon={UsersIcon} brandSubtitle="Employee Self Service" navigationLabel="Employee navigation" logoutPath="/employee-login" defaultName="Employee" getRoleLabel={getEmployeeRoleLabel}/>;}
export default EmployeeWorkspaceLayout;
