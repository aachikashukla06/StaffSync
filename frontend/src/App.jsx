import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Auth/Login';
import AdminLogin from './pages/Auth/AdminLogin';
import HRLogin from './pages/Auth/HRLogin';
import EmployeeLogin from './pages/Auth/EmployeeLogin';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import AdminWorkspaceLayout from './pages/Dashboard/AdminWorkspaceLayout';
import HRProfiles from './pages/Dashboard/HRProfiles';
import HRDashboard from './pages/Dashboard/HRDashboard';
import HRWorkspaceLayout from './pages/Dashboard/HRWorkspaceLayout';
import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard';
import EmployeeWorkspaceLayout from './pages/Dashboard/EmployeeWorkspaceLayout';
import FeaturePage from './pages/WorkspaceFeaturePages';

function Protected({ roles, children }) {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch { /* invalid local session */ }
  if (!localStorage.getItem('token') || !user) return <Navigate to="/" replace />;
  if (!roles.includes(user.role)) return <Navigate to={`/dashboard/${user.role}`} replace />;
  return children;
}

function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Login />} />
    <Route path="/portal" element={<Navigate to="/" replace />} />
    <Route path="/admin-login" element={<AdminLogin />} />
    <Route path="/hr-login" element={<HRLogin />} />
    <Route path="/employee-login" element={<EmployeeLogin />} />
    <Route path="/dashboard/admin" element={<Protected roles={['admin']}><AdminWorkspaceLayout /></Protected>}>
      <Route index element={<AdminDashboard />} /><Route path="hr-profiles" element={<HRProfiles />} />
      <Route path="employees" element={<FeaturePage kind="employees" />} /><Route path="departments" element={<FeaturePage kind="departments" />} />
      <Route path="attendance" element={<FeaturePage kind="attendance" />} /><Route path="leaves" element={<FeaturePage kind="leaves" />} />
      <Route path="payroll" element={<FeaturePage kind="payroll" />} /><Route path="announcements" element={<FeaturePage kind="announcements" />} />
    </Route>
    <Route path="/dashboard/hr" element={<Protected roles={['hr']}><HRWorkspaceLayout /></Protected>}>
      <Route index element={<HRDashboard />} /><Route path="employees" element={<FeaturePage kind="employees" />} />
      <Route path="departments" element={<FeaturePage kind="departments" />} /><Route path="attendance" element={<FeaturePage kind="attendance" />} />
      <Route path="leaves" element={<FeaturePage kind="leaves" />} /><Route path="payroll" element={<FeaturePage kind="payroll" />} />
      <Route path="announcements" element={<FeaturePage kind="announcements" />} />
    </Route>
    <Route path="/dashboard/employee" element={<Protected roles={['employee']}><EmployeeWorkspaceLayout /></Protected>}>
      <Route index element={<EmployeeDashboard />} /><Route path="attendance" element={<FeaturePage kind="attendance" />} />
      <Route path="leaves" element={<FeaturePage kind="leaves" />} /><Route path="payroll" element={<FeaturePage kind="payroll" />} />
      <Route path="profile" element={<FeaturePage kind="profile" />} /><Route path="announcements" element={<FeaturePage kind="announcements" />} />
    </Route>
    <Route path="/login" element={<Navigate to="/" replace />} /><Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}
export default App;
