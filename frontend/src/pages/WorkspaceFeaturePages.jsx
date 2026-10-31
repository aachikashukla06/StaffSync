import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  applyLeave, checkIn, checkOut, createDepartment, createEmployeeAccount, createPayroll,
  deleteAnnouncement, getAllLeaves, getAnnouncements, getDepartments, getEmployees,
  getMyAttendance, getMyEmployeeProfile, getMyLeaves, getMyPayrollRecords,
  getPayrollRecords, getAttendance, postAnnouncement, updateLeaveStatus, updateEmployee,
} from '../services/api';
import { readSessionUser } from '../utils/session';
import './workspaceFeatures.css';

const dateText = (date) => date ? new Date(date).toLocaleDateString() : '—';
const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
const list = (result) => Array.isArray(result?.data) ? result.data : [];
const errorText = (error) => error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';

function FeaturePage({ kind }) {
  const user = readSessionUser();
  const employeeRole = user?.role === 'employee';
  const hrRole = user?.role === 'hr';
  const [rows, setRows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});

  const load = async () => {
    setLoading(true); setError('');
    try {
      if (kind === 'employees') {
        const [people, teams] = await Promise.all([getEmployees(), getDepartments()]);
        setRows(list(people)); setDepartments(list(teams));
      } else if (kind === 'departments') {
        const result = await getDepartments(); setRows(list(result));
      } else if (kind === 'attendance') {
        const result = employeeRole ? await getMyAttendance() : await getAttendance(); setRows(list(result));
      } else if (kind === 'leaves') {
        const result = employeeRole ? await getMyLeaves() : await getAllLeaves(); setRows(list(result));
      } else if (kind === 'payroll') {
        const result = employeeRole ? await getMyPayrollRecords() : await getPayrollRecords(); setRows(list(result));
        if (!employeeRole) { const people = await getEmployees(); setEmployees(list(people)); }
      } else if (kind === 'announcements') {
        const result = await getAnnouncements(); setRows(list(result));
      } else if (kind === 'profile') {
        const result = await getMyEmployeeProfile(); setProfile(result?.data || null);
      }
    } catch (loadError) { setError(errorText(loadError)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [kind]);

  const action = async (operation, successText) => {
    setWorking(true); setError(''); setNotice('');
    try { await operation(); setNotice(successText); setForm({}); setShowForm(false); await load(); }
    catch (actionError) { setError(errorText(actionError)); }
    finally { setWorking(false); }
  };

  const titles = {
    employees: ['Employees', 'Manage employee accounts and their HR details.'],
    departments: ['Departments', 'View and organize teams across your company.'],
    attendance: ['Attendance', employeeRole ? 'Record today’s attendance and review your history.' : 'Review employee check-in and check-out records.'],
    leaves: ['Leave management', employeeRole ? 'Request time off and track decisions.' : 'Review employee leave requests and update their status.'],
    payroll: ['Payroll', employeeRole ? 'Review your published payslips.' : 'Create and review monthly payroll records.'],
    announcements: ['Announcements', 'Company updates and people operations notices.'],
    profile: ['My profile', 'Your employee record and work details.'],
  };
  const [title, subtitle] = titles[kind] || ['Workspace', ''];
  const filtered = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  const todayRecord = rows.find((row) => new Date(row.date).toDateString() === new Date().toDateString());

  return <div className="feature-page">
    <header className="feature-heading"><div><p className="feature-eyebrow">STAFFSYNC WORKSPACE</p><h1>{title}</h1><p>{subtitle}</p></div>
      {['employees','departments','payroll','announcements'].includes(kind) && !employeeRole && (kind !== 'departments' || !hrRole) && <button className="feature-primary" onClick={() => { setShowForm((open) => !open); setForm({}); }}>{showForm ? 'Close' : `+ ${kind === 'employees' ? 'Add employee' : kind === 'departments' ? 'Add department' : kind === 'payroll' ? 'Create payroll' : 'Post update'}`}</button>}
    </header>
    {notice && <div className="feature-alert success">{notice}</div>}{error && <div className="feature-alert error">{error}<button onClick={load}>Retry</button></div>}
    {showForm && <form className="feature-form" onSubmit={(event) => { event.preventDefault();
      if (kind === 'employees') action(() => form.userId ? updateEmployee(form.userId,{name:form.name,loginId:form.loginId,email:form.email,designation:form.designation,department:form.department,salary:form.salary,joinDate:form.joinDate,status:form.status}) : createEmployeeAccount({name:form.name,loginId:form.loginId,email:form.email,password:form.password,designation:form.designation,profileRole:form.designation,joinDate:form.joinDate||undefined,department:form.department,salary:form.salary}), form.userId ? 'Employee profile updated.' : 'Employee account and profile created.');
      if (kind === 'departments') action(() => createDepartment({ name: form.name, description: form.description }), 'Department created.');
      if (kind === 'payroll') action(() => createPayroll({ employeeId: form.employeeId, month: form.month, year: form.year, basicPay: form.basicPay, hra: form.hra || 0, deductions: form.deductions || 0 }), 'Payroll record published.');
      if (kind === 'announcements') action(() => postAnnouncement({ title: form.title, content: form.content, targetRole: form.targetRole || 'all' }), 'Announcement posted.');
    }}>
      {kind === 'employees' && <><Field label="Full name" name="name" form={form} setForm={setForm} required/><Field label="Employee ID" name="loginId" form={form} setForm={setForm} required/><Field label="Work email" name="email" form={form} setForm={setForm} type="email"/><Field label="Temporary password" name="password" form={form} setForm={setForm} type="password" required={!form.userId}/><Field label="Designation" name="designation" form={form} setForm={setForm} required/><label>Department<select value={form.department||''} onChange={(e)=>setForm({...form,department:e.target.value})}><option value="">Not assigned</option>{departments.map((d)=><option key={d._id} value={d._id}>{d.name}</option>)}</select></label><Field label="Salary (₹)" name="salary" form={form} setForm={setForm} type="number"/><Field label="Join date" name="joinDate" form={form} setForm={setForm} type="date"/></>}
      {kind === 'departments' && <><Field label="Department name" name="name" form={form} setForm={setForm} required/><Field label="Description" name="description" form={form} setForm={setForm}/></>}
      {kind === 'payroll' && <><label>Employee<select value={form.employeeId || ''} onChange={(e) => setForm({...form, employeeId:e.target.value})} required><option value="">Choose an employee</option>{employees.map((e)=><option key={e._id} value={e._id}>{e.name} · {e.loginId}</option>)}</select></label><Field label="Month (1–12)" name="month" form={form} setForm={setForm} type="number" required/><Field label="Year" name="year" form={form} setForm={setForm} type="number" required/><Field label="Basic pay (₹)" name="basicPay" form={form} setForm={setForm} type="number" required/><Field label="HRA (₹)" name="hra" form={form} setForm={setForm} type="number"/><Field label="Deductions (₹)" name="deductions" form={form} setForm={setForm} type="number"/></>}
      {kind === 'announcements' && <><Field label="Title" name="title" form={form} setForm={setForm} required/><label>Audience<select value={form.targetRole || 'all'} onChange={(e)=>setForm({...form,targetRole:e.target.value})}><option value="all">Everyone</option><option value="hr">HR</option><option value="employee">Employees</option><option value="admin">Admins</option></select></label><label className="wide">Message<textarea rows="4" value={form.content || ''} onChange={(e)=>setForm({...form,content:e.target.value})} required/></label></>}
      <div className="feature-form-actions"><button type="button" className="feature-secondary" onClick={()=>setShowForm(false)}>Cancel</button><button className="feature-primary" disabled={working}>{working ? 'Saving…' : 'Save'}</button></div>
    </form>}
    {kind === 'attendance' && employeeRole && <div className="feature-toolbar"><div><strong>{todayRecord?.checkIn ? `Checked in ${new Date(todayRecord.checkIn).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}` : 'Not checked in today'}</strong><p>Use the buttons to record your workday.</p></div><div className="feature-actions"><button className="feature-primary" disabled={working || Boolean(todayRecord)} onClick={()=>action(checkIn,'Check-in recorded.')}>Check in</button><button className="feature-secondary" disabled={working || !todayRecord || Boolean(todayRecord.checkOut)} onClick={()=>action(checkOut,'Check-out recorded.')}>Check out</button></div></div>}
    {kind === 'leaves' && employeeRole && <div className="feature-toolbar"><span>Have a planned absence? Submit a request for HR to review.</span><button className="feature-primary" onClick={()=>{setForm({});setShowForm(!showForm)}}>{showForm?'Close':'Request leave'}</button></div>}
    {kind === 'leaves' && showForm && employeeRole && <form className="feature-form" onSubmit={(e)=>{e.preventDefault();action(()=>applyLeave(form),'Leave request submitted.')}}><label>Leave type<select value={form.leaveType||'casual'} onChange={(e)=>setForm({...form,leaveType:e.target.value})}><option value="casual">Casual</option><option value="sick">Sick</option><option value="paid">Paid</option></select></label><Field label="Start date" name="startDate" form={form} setForm={setForm} type="date" required/><Field label="End date" name="endDate" form={form} setForm={setForm} type="date" required/><label className="wide">Reason<textarea rows="3" value={form.reason||''} onChange={(e)=>setForm({...form,reason:e.target.value})}/></label><div className="feature-form-actions"><button className="feature-primary" disabled={working}>Submit request</button></div></form>}
    {['employees','departments','attendance','leaves','payroll','announcements'].includes(kind) && <div className="feature-tools"><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`}/><span>{filtered.length} record{filtered.length===1?'':'s'}</span></div>}
    {loading ? <div className="feature-empty">Loading {title.toLowerCase()}…</div> : kind === 'profile' ? <ProfileCard profile={profile} user={user}/> : kind === 'announcements' ? <div className="announcement-grid">{filtered.map((row)=><article className="announcement-card" key={row._id}><div><span className="feature-tag">{row.targetRole === 'all' ? 'Everyone' : row.targetRole}</span><small>{dateText(row.createdAt)}</small></div><h2>{row.title}</h2><p>{row.content}</p><footer><span>By {row.postedBy?.name || 'StaffSync HR'}</span>{!employeeRole && <button onClick={()=>action(()=>deleteAnnouncement(row._id),'Announcement removed.')}>Remove</button>}</footer></article>)}{!filtered.length&&<Empty text="No announcements yet."/>}</div> : <div className="feature-table-wrap"><table className="feature-table"><thead><tr>{headerFor(kind,employeeRole).map((h)=><th key={h}>{h}</th>)}</tr></thead><tbody>{filtered.map((row)=><tr key={row._id}>{cellsFor(kind,row,employeeRole,action,working,setForm,setShowForm)}</tr>)}</tbody></table>{!filtered.length&&<Empty text={emptyFor(kind)}/>}</div>}
    {kind === 'profile' && !loading && !profile && <div className="feature-alert error">No employee profile is linked to this login yet. Ask HR to update your employee record.</div>}
    {kind === 'profile' && profile && <div className="profile-detail-grid">{[['Employee ID',profile.User?.loginId||user?.loginId],['Email',profile.User?.email||user?.email],['Designation',profile.designation],['Department',profile.Department?.name||'Not assigned'],['Join date',dateText(profile.User?.joinDate)],['Status',profile.User?.isActive?'Active':'Inactive']].map(([label,value])=><div key={label}><span>{label}</span><strong>{value||'—'}</strong></div>)}</div>}
    {kind==='profile' && <div className="profile-detail-grid"><div><span>Full name</span><strong>{profile?.User?.name||user?.name||'—'}</strong></div><div><span>Employee ID</span><strong>{profile?.User?.loginId||user?.loginId||'—'}</strong></div></div>}
  </div>;
}

function Field({label,name,form,setForm,type='text',required=false}) { return <label>{label}<input type={type} value={form[name]||''} onChange={(e)=>setForm({...form,[name]:e.target.value})} required={required}/></label>; }
function Empty({text}) { return <div className="feature-empty">{text}</div>; }
function ProfileCard({profile,user}) { return <section className="profile-hero"><div className="profile-mark">{(profile?.firstName||user?.name||'E').slice(0,1).toUpperCase()}</div><div><h2>{profile?.User?.name||user?.name||'Employee'}</h2><p>{profile?.designation||user?.designation||'Team Member'} · {profile?.Department?.name||'Department not assigned'}</p><span>{profile?.User?.email||user?.email||'Add a work email with HR'}</span></div></section>; }
function headerFor(kind, self) { return ({employees:['Employee','Employee ID','Email','Designation','Department','Status','Access'],departments:['Department','Description','Created'],attendance:self?['Date','Check in','Check out','Hours','Status']:['Employee','Employee ID','Date','Check in','Check out','Hours'],leaves:self?['Leave type','Dates','Reason','Status']:['Employee','Leave type','Dates','Reason','Status','Review'],payroll:['Period',...(self?[]:['Employee']), 'Basic pay','HRA','Deductions','Net pay'],announcements:[]})[kind]||[]; }
function cellsFor(kind,row,self,action,working,setForm,setShowForm) {
  const status=(value)=><span className={`feature-status ${value||'pending'}`}>{value||'pending'}</span>;
  if(kind==='employees')return <><td>{row.name}</td><td>{row.loginId}</td><td>{row.email||'—'}</td><td>{row.designation||'—'}</td><td>{row.Department?.name||'—'}</td><td>{status(row.isActive?'active':'inactive')}</td><td><div className="roster-actions"><button className="roster-toggle" onClick={()=>{setForm({userId:row.userId,name:row.name,loginId:row.loginId,email:row.email,designation:row.designation,department:row.Department?._id||'',salary:row.salary||'',joinDate:row.joinDate?.slice?.(0,10)||'',status:row.isActive?'Active':'Inactive'});setShowForm(true);window.scrollTo({top:0,behavior:'smooth'});}}>Edit</button><button className="roster-toggle" disabled={working} onClick={()=>action(()=>updateEmployee(row.userId,{status:row.isActive?'Inactive':'Active'}),row.isActive?'Employee access paused.':'Employee access restored.')}>{row.isActive?'Deactivate':'Activate'}</button></div></td></>;
  if(kind==='departments')return <><td>{row.name}</td><td>{row.description||'—'}</td><td>{dateText(row.createdAt)}</td></>;
  if(kind==='attendance')return <>{self?<td>{dateText(row.date)}</td>:<><td>{row.employeeId?.User?.name||`${row.employeeId?.firstName||''} ${row.employeeId?.lastName||''}`}</td><td>{row.employeeId?.User?.loginId||'—'}</td><td>{dateText(row.date)}</td></>}<td>{row.checkIn?new Date(row.checkIn).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):'—'}</td><td>{row.checkOut?new Date(row.checkOut).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):'—'}</td><td>{row.workingHours?`${row.workingHours} hrs`:'—'}</td>{self&&<td>{row.checkOut?'Complete':row.checkIn?'In progress':'—'}</td>}</>;
  if(kind==='leaves')return <>{self?<td>{row.leaveType}</td>:<td>{row.employeeId?.name||row.employeeId?.loginId||'Employee'}</td>}{!self&&<td>{row.leaveType}</td>}<td>{dateText(row.startDate)} – {dateText(row.endDate)}</td><td>{row.reason||'—'}</td><td>{status(row.status)}</td>{!self&&<td>{row.status==='pending'?<div className="review-actions"><button disabled={working} onClick={()=>action(()=>updateLeaveStatus(row._id,'approved'),'Leave approved.')}>Approve</button><button disabled={working} onClick={()=>action(()=>updateLeaveStatus(row._id,'rejected'),'Leave rejected.')}>Decline</button></div>:'Reviewed'}</td>}</>;
  if(kind==='payroll')return <><td>{new Date(2000,Number(row.month||1)-1).toLocaleString('en',{month:'long'})} {row.year}</td>{!self&&<td>{row.employeeId?.User?.name||row.employeeId?.firstName||'Employee'}</td>}<td>{money(row.basicPay)}</td><td>{money(row.hra)}</td><td>{money(row.deductions)}</td><td><strong>{money(row.netSalary)}</strong></td></>;
  return null;
}
function emptyFor(kind) { return ({employees:'No employee records found.',departments:'No departments created yet.',attendance:'No attendance records found.',leaves:'No leave requests found.',payroll:'No payroll records published yet.',announcements:'No announcements yet.'})[kind]; }
export default FeaturePage;
