import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  
  // UI States
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'team'
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  
  // Form States
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '' });

  const authConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  const fetchData = async () => {
    try {
      const taskRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, authConfig);
      setTasks(taskRes.data);
      if (user.role === 'Admin') {
        const memberRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, authConfig);
        setMembers(memberRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // --- Task Functions ---
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, newTask, authConfig);
      setShowTaskForm(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
      fetchData();
    } catch (err) { alert('Error creating task'); }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, { status: newStatus }, authConfig);
      fetchData();
    } catch (err) { alert('Error updating status'); }
  };

  // --- Member Functions (Admin Only) ---
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, newMember, authConfig);
      setShowMemberForm(false);
      setNewMember({ name: '', email: '', password: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.msg || 'Error adding member'); }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${memberId}`, authConfig);
      fetchData();
    } catch (err) { alert('Error removing member'); }
  };

  if (!user) return null;

  const today = new Date();
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < today && t.status !== 'Done').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <span className="text-xl font-bold tracking-wide text-blue-400">TeamSync</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('tasks')} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <span className="font-medium">My Dashboard</span>
          </button>
          
          {user.role === 'Admin' && (
            <button 
              onClick={() => setActiveTab('team')} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${activeTab === 'team' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <span className="font-medium">Manage Team</span>
            </button>
          )}
        </nav>
        <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-950">
          <div>
            <p className="text-sm font-bold">{user.name}</p>
            <span className="text-xs px-2 py-0.5 bg-slate-700 rounded-full text-slate-300">{user.role}</span>
          </div>
          <button onClick={logout} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition text-sm font-medium">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-3xl font-bold text-slate-800">
            {activeTab === 'tasks' ? `Welcome, ${user.name}` : 'Team Management'}
          </h2>
          <p className="text-slate-500 mt-1">
            {activeTab === 'tasks' ? (user.role === 'Admin' ? 'Manage your team projects and tasks.' : 'Here are the tasks assigned to you.') : 'Add or remove members from your workspace.'}
          </p>
        </header>

        {/* TAB 1: TASKS DASHBOARD */}
        {activeTab === 'tasks' && (
          <>
            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100"><p className="text-sm text-slate-500 mb-1">Total Tasks</p><p className="text-3xl font-bold text-slate-800">{tasks.length}</p></div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100"><p className="text-sm text-slate-500 mb-1">In Progress</p><p className="text-3xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'In Progress').length}</p></div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100"><p className="text-sm text-slate-500 mb-1">Completed</p><p className="text-3xl font-bold text-green-600">{tasks.filter(t => t.status === 'Done').length}</p></div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 border-b-4 border-b-red-500"><p className="text-sm text-slate-500 mb-1">Overdue</p><p className="text-3xl font-bold text-red-600">{overdueTasks}</p></div>
            </div>

            {/* Admin: Create Task Button & Form */}
            {user.role === 'Admin' && (
              <div className="mb-6">
                <button onClick={() => setShowTaskForm(!showTaskForm)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow transition">
                  {showTaskForm ? 'Cancel Creation' : '+ Assign New Task'}
                </button>
                {showTaskForm && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 mt-4">
                    <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Task Title" required className="border p-2 rounded outline-none focus:border-blue-500" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                      <select required className="border p-2 rounded outline-none focus:border-blue-500" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                        <option value="" disabled>Assign to Member...</option>
                        {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
                      </select>
                      <input type="date" required className="border p-2 rounded outline-none focus:border-blue-500" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                      <select className="border p-2 rounded outline-none focus:border-blue-500" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                        <option value="Low">Low Priority</option><option value="Medium">Medium Priority</option><option value="High">High Priority</option>
                      </select>
                      <textarea placeholder="Description" className="border p-2 rounded md:col-span-2 outline-none focus:border-blue-500" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
                      <button type="submit" className="bg-blue-600 text-white p-2 rounded md:col-span-2 font-medium hover:bg-blue-700">Submit Task</button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Task List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800">{user.role === 'Admin' ? 'All Team Tasks' : 'My Assigned Tasks'}</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {tasks.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No tasks found.</div>
                ) : (
                  tasks.map(task => (
                    <div key={task._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50">
                      <div className="mb-4 md:mb-0">
                        <h4 className="font-semibold text-slate-800 text-lg">{task.title}</h4>
                        <p className="text-sm text-slate-500 mt-1 max-w-xl">{task.description}</p>
                        <div className="flex items-center gap-3 mt-3 text-xs font-medium text-slate-500">
                          <span className="px-2 py-1 rounded bg-slate-100">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100'}`}>{task.priority} Priority</span>
                          {user.role === 'Admin' && task.assignedTo && (
                            <span className="px-2 py-1 rounded bg-blue-50 text-blue-700">Assigned to: {task.assignedTo.name}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500">Status:</span>
                        <select 
                          value={task.status} onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                          className={`border p-2 rounded text-sm font-semibold outline-none cursor-pointer ${task.status === 'Done' ? 'bg-green-50 text-green-700 border-green-200' : task.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-white text-slate-700'}`}
                        >
                          <option value="To Do">To Do</option><option value="In Progress">In Progress</option><option value="Done">Done</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: TEAM MANAGEMENT (Admin Only) */}
        {activeTab === 'team' && user.role === 'Admin' && (
          <>
            <div className="mb-6">
              <button onClick={() => setShowMemberForm(!showMemberForm)} className="bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-900 shadow transition">
                {showMemberForm ? 'Cancel Creation' : '+ Add New Member'}
              </button>
              {showMemberForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-4">
                  <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Full Name" required className="border p-2 rounded outline-none focus:border-slate-800" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
                    <input type="email" placeholder="Email Address" required className="border p-2 rounded outline-none focus:border-slate-800" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
                    <input type="password" placeholder="Temporary Password" required className="border p-2 rounded outline-none focus:border-slate-800" value={newMember.password} onChange={e => setNewMember({...newMember, password: e.target.value})} />
                    <button type="submit" className="bg-slate-800 text-white p-2 rounded md:col-span-3 font-medium hover:bg-slate-900">Create Member Account</button>
                  </form>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50"><h3 className="font-bold text-slate-800">Active Team Members</h3></div>
              <div className="divide-y divide-slate-100">
                {members.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No members found.</div>
                ) : (
                  members.map(member => (
                    <div key={member._id} className="p-6 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <h4 className="font-semibold text-slate-800">{member.name}</h4>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded text-sm font-medium transition"
                      >
                        Remove Access
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}