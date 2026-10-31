import { BrandIcon, CalendarIcon, DashboardIcon, DocumentIcon, UsersIcon, WalletIcon, MegaphoneIcon } from './dashboardIcons';
import WorkspaceLayout from './WorkspaceLayout';
const navigation = [
  { label:'Dashboard', path:'/dashboard/admin', icon:DashboardIcon }, { label:'HR Profiles', path:'/dashboard/admin/hr-profiles', icon:UsersIcon },
  { label:'Employees', path:'/dashboard/admin/employees', icon:UsersIcon }, { label:'Departments', path:'/dashboard/admin/departments', icon:UsersIcon },
  { label:'Attendance', path:'/dashboard/admin/attendance', icon:CalendarIcon }, { label:'Leave Management', path:'/dashboard/admin/leaves', icon:DocumentIcon },
  { label:'Payroll', path:'/dashboard/admin/payroll', icon:WalletIcon }, { label:'Announcements', path:'/dashboard/admin/announcements', icon:MegaphoneIcon },
];
function AdminWorkspaceLayout(){return <WorkspaceLayout navigation={navigation} brandIcon={BrandIcon} brandSubtitle="Management Suite" navigationLabel="Admin navigation" logoutPath="/admin-login" defaultName="Admin User" getRoleLabel={()=>'Administrator'}/>;}
export default AdminWorkspaceLayout;
