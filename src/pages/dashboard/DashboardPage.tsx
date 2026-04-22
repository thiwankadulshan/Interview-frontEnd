import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../../store/authSlice';
import SearchBar from '../../template/SearchBar';
import Table from '../../template/Table';
import Pagination from '../../template/Pagination';
import Button from '../../template/Button';
import Loader from '../../template/Loader';
import Popup from '../../template/Popup';
import useFetch from '../../hooks/useFetch';
import Badge from '../../template/Badge';
import alert from '../../utils/alert';

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: string;
  priority: string;
  status: string;
}

const BLANK_ISSUE: Issue = {
  id: '',
  title: '',
  description: '',
  severity: 'Medium',
  priority: 'Medium',
  status: 'Open',
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);

  const { loading, data: apiResponse, fetchData } = useFetch<Issue[]>('/v1/dashboards', {
    autoFetch: true,
  });

  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      setIssues(apiResponse.data as any);
    }
  }, [apiResponse]);

  const getStatusBadge = (status: string) => <Badge text={status} />;

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/login');
    alert.success('Logged out successfully');
  };

  const handleCreateClick = () => {
    setCurrentIssue({ ...BLANK_ISSUE });
    setIsReadOnly(false);
    setIsPopupOpen(true);
  };

  const handleEditClick = (issue: Issue) => {
    setCurrentIssue({ ...issue });
    setIsReadOnly(false);
    setIsPopupOpen(true);
  };

  const handleViewClick = (issue: Issue) => {
    setCurrentIssue({ ...issue });
    setIsReadOnly(true);
    setIsPopupOpen(true);
  };

  const handleSave = async () => {
    if (currentIssue) {
      if (!currentIssue.title || !currentIssue.description) {
        alert.error('Please fill in title and description');
        return;
      }

      const issuePayload = {
        title: currentIssue.title,
        description: currentIssue.description,
        status: currentIssue.status || 'Open',
        severity: currentIssue.severity,
        priority: currentIssue.priority,
      };

      if (currentIssue.id) {
        // Edit mode
        const response = await fetchData({ 
          endpoint: `/v1/dashboards/${currentIssue.id}`, 
          method: 'PUT', 
          data: issuePayload 
        });
        
        if (response?.success) {
          setIssues(issues.map(i => i.id === currentIssue.id ? (response.data as any) : i));
        }
      } else {
        // Create mode
        const response = await fetchData({ 
          endpoint: '/v1/dashboards', 
          method: 'POST', 
          data: issuePayload 
        });
        
        if (response?.success) {
          setIssues([(response.data as any), ...issues]);
        }
      }
      setIsPopupOpen(false);
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
    { header: 'Severity', accessor: 'severity' },
    { header: 'Priority', accessor: 'priority' },
    { header: 'Status', accessor: 'status_badge' },
    { header: 'Actions', accessor: 'actions' },
  ];

  const filteredIssues = issues.filter(
    (issue) => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'All' || issue.severity === severityFilter;
      
      return matchesSearch && matchesSeverity;
    }
  );

  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedIssues = filteredIssues
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((issue) => ({
      ...issue,
      title: <div className="max-w-[180px] truncate" title={issue.title}>{issue.title}</div>,
      description: <div className="max-w-[280px] truncate" title={issue.description}>{issue.description}</div>,
      status_badge: getStatusBadge(issue.status),
      actions: (
        <div className="flex gap-2">
          <Button
            name="View"
            onClick={() => handleViewClick(issue)}
            color="#475569" // slate-600
            borderRadius="8px"
            size="sm"
            className="px-3 py-1.5 text-xs font-semibold hover:bg-slate-500"
          />
          <Button
            name="Edit"
            onClick={() => issue.status !== 'Closed' && handleEditClick(issue)}
            color={issue.status === 'Closed' ? '#1e293b' : '#334155'}
            borderRadius="8px"
            size="sm"
            className={`px-3 py-1.5 text-xs font-semibold ${
              issue.status === 'Closed' 
                ? 'opacity-40 cursor-not-allowed grayscale' 
                : 'hover:bg-slate-700'
            }`}
          />
        </div>
      ),
    }));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Issues Dashboard</h1>
            <Button
              name="Logout"
              onClick={handleLogout}
              color="#ef4444"
              size="sm"
              borderRadius="8px"
              className="px-3 py-1 text-xs font-bold uppercase"
            />
          </div>
          <p className="text-slate-400 mt-1">Manage and track your reported issues efficiently.</p>
        </div>
        <div className="flex flex-col lg:flex-row w-full md:w-auto gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl px-3 items-center">
              <label htmlFor="severity-filter" className="text-xs font-bold text-slate-500 uppercase mr-2 whitespace-nowrap">Severity:</label>
              <select
                id="severity-filter"
                value={severityFilter}
                onChange={(e) => {
                  setSeverityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                title="Filter by severity"
                className="bg-transparent text-white py-2 px-1 text-sm outline-none focus:ring-0 cursor-pointer min-w-[100px]"
              >
                <option value="All" className="bg-slate-900">All Levels</option>
                <option value="Low" className="bg-slate-900">Low</option>
                <option value="Medium" className="bg-slate-900">Medium</option>
                <option value="High" className="bg-slate-900">High</option>
                <option value="Critical" className="bg-slate-900">Critical</option>
              </select>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search issues..."
                className="sm:w-64"
              />
              <Button
                name="Search"
                onClick={() => setCurrentPage(1)}
                color="#2563eb"
                borderRadius="12px"
                className="px-6"
              />
            </div>
          </div>
          <Button
            name="Create Issue"
            onClick={handleCreateClick}
            color="#10b981"
            borderRadius="12px"
            className="px-8 font-bold shadow-lg shadow-emerald-500/20"
          />
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader text="Loading issues..." color="#2563eb" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              rows={paginatedIssues}
              bgColor="transparent"
              headerColor="#0f172a"
              className="py-0 min-w-[1100px]"
            />
            {filteredIssues.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-500 text-lg">No issues found matching your selection.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          color="#2563eb"
        />
      )}

      {/* Edit/View/Create Popup */}
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={
          isReadOnly 
            ? "Issue Details (View Only)" 
            : currentIssue?.id 
              ? "Edit Issue Details" 
              : "Create New Issue"
        }
        className="max-w-2xl"
      >
        {currentIssue && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label htmlFor="issue-title" className="block text-sm font-semibold text-slate-400 mb-2">Title</label>
                <input
                  id="issue-title"
                  type="text"
                  disabled={isReadOnly}
                  value={currentIssue.title}
                  onChange={(e) => setCurrentIssue({ ...currentIssue, title: e.target.value })}
                  placeholder="Summarize the issue"
                  title="Issue title"
                  className={`w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 outline-none transition-all ${
                    isReadOnly ? 'opacity-60 cursor-default' : 'focus:ring-2 focus:ring-blue-500'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="issue-description" className="block text-sm font-semibold text-slate-400 mb-2">Description</label>
                <textarea
                  id="issue-description"
                  rows={3}
                  disabled={isReadOnly}
                  value={currentIssue.description}
                  onChange={(e) => setCurrentIssue({ ...currentIssue, description: e.target.value })}
                  placeholder="Provide steps to reproduce or details"
                  title="Issue description"
                  className={`w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 outline-none transition-all resize-none ${
                    isReadOnly ? 'opacity-60 cursor-default' : 'focus:ring-2 focus:ring-blue-500'
                  }`}
                />
              </div>

              <div>
                <label htmlFor="issue-severity" className="block text-sm font-semibold text-slate-400 mb-2">Severity</label>
                <select
                  id="issue-severity"
                  disabled={isReadOnly}
                  value={currentIssue.severity}
                  onChange={(e) => setCurrentIssue({ ...currentIssue, severity: e.target.value })}
                  title="Severity"
                  className={`w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 outline-none transition-all appearance-none ${
                    isReadOnly ? 'opacity-60 cursor-default' : 'focus:ring-2 focus:ring-blue-500'
                  }`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label htmlFor="issue-priority" className="block text-sm font-semibold text-slate-400 mb-2">Priority</label>
                <select
                  id="issue-priority"
                  disabled={isReadOnly}
                  value={currentIssue.priority}
                  onChange={(e) => setCurrentIssue({ ...currentIssue, priority: e.target.value })}
                  title="Priority"
                  className={`w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 outline-none transition-all appearance-none ${
                    isReadOnly ? 'opacity-60 cursor-default' : 'focus:ring-2 focus:ring-blue-500'
                  }`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {!currentIssue.id ? (
                /* Only show status selector for existing issues or if you want default status to be editable on create */
                <div className="md:col-span-2">
                  <label htmlFor="issue-status-new" className="block text-sm font-semibold text-slate-400 mb-2">Initial Status</label>
                  <select
                    id="issue-status-new"
                    disabled={isReadOnly}
                    value={currentIssue.status}
                    onChange={(e) => setCurrentIssue({ ...currentIssue, status: e.target.value })}
                    title="Status"
                    className={`w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 outline-none transition-all appearance-none ${
                      isReadOnly ? 'opacity-60 cursor-default' : 'focus:ring-2 focus:ring-blue-500'
                    }`}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              ) : (
                <div className="md:col-span-2">
                  <label htmlFor="issue-status" className="block text-sm font-semibold text-slate-400 mb-2">Status</label>
                  <select
                    id="issue-status"
                    disabled={isReadOnly}
                    value={currentIssue.status}
                    onChange={(e) => setCurrentIssue({ ...currentIssue, status: e.target.value })}
                    title="Status"
                    className={`w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 outline-none transition-all appearance-none ${
                      isReadOnly ? 'opacity-60 cursor-default' : 'focus:ring-2 focus:ring-blue-500'
                    }`}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-6 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                aria-label="Close popup"
              >
                {isReadOnly ? 'Close' : 'Cancel'}
              </button>
              {!isReadOnly && (
                <Button
                  name={currentIssue.id ? "Save Changes" : "Create Issue"}
                  onClick={handleSave}
                  color="#10b981"
                  borderRadius="10px"
                  className="px-8"
                />
              )}
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};
