import * as supabaseService from './supabase.js';

// Global state
let currentUser = null;
let currentTable = 'dashboard';
let currentPage = 1;
let pageSize = 10;
let totalRecords = 0;
let currentRecordId = null;
let isEditing = false;

// Table schemas and configurations
const tableConfigs = {
    users: {
        title: 'Users',
        columns: [
            { name: 'id', label: 'ID', type: 'uuid', primary: true, hidden: true },
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'profile_image_url', label: 'Profile Image', type: 'image' },
            { name: 'role', label: 'Role', type: 'select', options: ['teacher', 'admin'], required: true },
            { name: 'created_at', label: 'Created At', type: 'datetime', readonly: true },
            { name: 'updated_at', label: 'Updated At', type: 'datetime', readonly: true }
        ]
    },
    subjects: {
        title: 'Subjects',
        columns: [
            { name: 'id', label: 'ID', type: 'uuid', primary: true, hidden: true },
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'code', label: 'Code', type: 'text' },
            { name: 'created_at', label: 'Created At', type: 'datetime', readonly: true },
            { name: 'updated_at', label: 'Updated At', type: 'datetime', readonly: true }
        ]
    },
    courses: {
        title: 'Courses',
        columns: [
            { name: 'id', label: 'ID', type: 'uuid', primary: true, hidden: true },
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'code', label: 'Code', type: 'text' },
            { name: 'created_at', label: 'Created At', type: 'datetime', readonly: true },
            { name: 'updated_at', label: 'Updated At', type: 'datetime', readonly: true }
        ]
    },
    classes: {
        title: 'Classes',
        columns: [
            { name: 'id', label: 'ID', type: 'uuid', primary: true, hidden: true },
            { name: 'teacher_id', label: 'Teacher', type: 'select', required: true, foreignTable: 'users', foreignKey: 'id', foreignLabel: 'name' },
            { name: 'subject_id', label: 'Subject', type: 'select', required: true, foreignTable: 'subjects', foreignKey: 'id', foreignLabel: 'name' },
            { name: 'course_id', label: 'Course', type: 'select', required: true, foreignTable: 'courses', foreignKey: 'id', foreignLabel: 'name' },
            { name: 'semester', label: 'Semester', type: 'number', required: true },
            { name: 'section', label: 'Section', type: 'text' },
            { name: 'created_at', label: 'Created At', type: 'datetime', readonly: true },
            { name: 'updated_at', label: 'Updated At', type: 'datetime', readonly: true }
        ]
    },
    students: {
        title: 'Students',
        columns: [
            { name: 'id', label: 'ID', type: 'uuid', primary: true, hidden: true },
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'roll_number', label: 'Roll Number', type: 'text', required: true },
            { name: 'image_url', label: 'Image', type: 'image' },
            { name: 'created_at', label: 'Created At', type: 'datetime', readonly: true },
            { name: 'updated_at', label: 'Updated At', type: 'datetime', readonly: true }
        ]
    },
    class_students: {
        title: 'Class Students',
        columns: [
            { name: 'id', label: 'ID', type: 'uuid', primary: true, hidden: true },
            { name: 'class_id', label: 'Class', type: 'select', required: true, foreignTable: 'classes', foreignKey: 'id', foreignLabel: 'id' },
            { name: 'student_id', label: 'Student', type: 'select', required: true, foreignTable: 'students', foreignKey: 'id', foreignLabel: 'name' },
            { name: 'created_at', label: 'Created At', type: 'datetime', readonly: true }
        ]
    },
    attendance_sessions: {
        title: 'Attendance Sessions',
        columns: [
            { name: 'id', label: 'ID', type: 'uuid', primary: true, hidden: true },
            { name: 'class_id', label: 'Class', type: 'select', required: true, foreignTable: 'classes', foreignKey: 'id', foreignLabel: 'id' },
            { name: 'date', label: 'Date', type: 'date', required: true },
            { name: 'start_time', label: 'Start Time', type: 'time' },
            { name: 'end_time', label: 'End Time', type: 'time' },
            { name: 'status', label: 'Status', type: 'select', options: ['open', 'closed'], required: true },
            { name: 'created_by', label: 'Created By', type: 'select', required: true, foreignTable: 'users', foreignKey: 'id', foreignLabel: 'name' },
            { name: 'created_at', label: 'Created At', type: 'datetime', readonly: true },
            { name: 'updated_at', label: 'Updated At', type: 'datetime', readonly: true }
        ]
    },
    attendance_records: {
        title: 'Attendance Records',
        columns: [
            { name: 'id', label: 'ID', type: 'uuid', primary: true, hidden: true },
            { name: 'session_id', label: 'Session', type: 'select', required: true, foreignTable: 'attendance_sessions', foreignKey: 'id', foreignLabel: 'id' },
            { name: 'student_id', label: 'Student', type: 'select', required: true, foreignTable: 'students', foreignKey: 'id', foreignLabel: 'name' },
            { name: 'status', label: 'Status', type: 'select', options: ['present', 'absent', 'late', 'excused'], required: true },
            { name: 'remarks', label: 'Remarks', type: 'textarea' },
            { name: 'created_at', label: 'Created At', type: 'datetime', readonly: true },
            { name: 'updated_at', label: 'Updated At', type: 'datetime', readonly: true }
        ]
    },
    user_feedback: {
        title: 'User Feedback',
        columns: [
            { name: 'id', label: 'ID', type: 'serial', primary: true, hidden: true },
            { name: 'user_id', label: 'User', type: 'select', foreignTable: 'users', foreignKey: 'id', foreignLabel: 'name' },
            { name: 'user_email', label: 'User Email', type: 'text' },
            { name: 'rating', label: 'Rating', type: 'number', min: 1, max: 5, required: true },
            { name: 'feedback', label: 'Feedback', type: 'textarea' },
            { name: 'created_at', label: 'Created At', type: 'datetime', readonly: true }
        ]
    },
    audit_logs: {
        title: 'Audit Logs',
        columns: [
            { name: 'id', label: 'ID', type: 'uuid', primary: true, hidden: true },
            { name: 'user_id', label: 'User', type: 'select', readonly:true },
            { name: 'action', label: 'Action', type: 'text', readonly: true },
            { name: 'table_name', label: 'Table', type: 'text', readonly: true },
            { name: 'record_id', label: 'Record ID', type: 'text', readonly: true },
            { name: 'old_data', label: 'Old Data', type: 'json', readonly: true },
            { name: 'new_data', label: 'New Data', type: 'json', readonly: true },
            { name: 'ip_address', label: 'IP Address', type: 'text', readonly: true },
            { name: 'created_at', label: 'Created At', type: 'datetime', readonly: true }
        ],
        readonly: true
    }
};

// DOM Elements
const dashboardContainer = document.getElementById('dashboard-container');
const tableContainer = document.getElementById('table-container');
const tableTitle = document.getElementById('table-title');
const tableHeaders = document.getElementById('table-headers');
const tableBody = document.getElementById('table-body');
const addRecordBtn = document.getElementById('add-record-btn');
const formModal = document.getElementById('form-modal');
const formTitle = document.getElementById('form-title');
const recordForm = document.getElementById('record-form');
const formFields = document.getElementById('form-fields');
const formError = document.getElementById('form-error');
const cancelForm = document.getElementById('cancel-form');
const confirmModal = document.getElementById('confirm-modal');
const confirmMessage = document.getElementById('confirm-message');
const cancelConfirm = document.getElementById('cancel-confirm');
const confirmAction = document.getElementById('confirm-action');
const userEmail = document.getElementById('user-email');
const userAvatar = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');
const prevPage = document.getElementById('prev-page');
const nextPage = document.getElementById('next-page');
const prevPageMobile = document.getElementById('prev-page-mobile');
const nextPageMobile = document.getElementById('next-page-mobile');
const paginationInfo = document.getElementById('pagination-info');
const startRecord = document.getElementById('start-record');
const endRecord = document.getElementById('end-record');
const totalRecordsElement = document.getElementById('total-records');
const paginationNumbers = document.getElementById('pagination-numbers');

// Initialize the application
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Check if user is logged in
    try {
        const session = await supabaseService.getCurrentSession();
        
        if (session) {
            await handleAuthenticated(session.user);
        } else {
            // Redirect to login page if not logged in
            window.location.href = 'login.html';
            return;
        }
    } catch (error) {
        console.error('Error during initialization:', error);
        window.location.href = 'login.html';
        return;
    }

    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Sidebar menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const table = item.getAttribute('data-table');
            switchTable(table);
        });
    });
    
    // Add record button
    addRecordBtn.addEventListener('click', () => showFormModal(false));
    
    // Form modal
    cancelForm.addEventListener('click', hideFormModal);
    recordForm.addEventListener('submit', handleFormSubmit);
    
    // Confirm modal
    cancelConfirm.addEventListener('click', hideConfirmModal);
    
    // Pagination
    prevPage.addEventListener('click', () => changePage(currentPage - 1));
    nextPage.addEventListener('click', () => changePage(currentPage + 1));
    prevPageMobile.addEventListener('click', () => changePage(currentPage - 1));
    nextPageMobile.addEventListener('click', () => changePage(currentPage + 1));
}

async function handleAuthenticated(user) {
    try {
        // Get user details from the database
        const userData = await supabaseService.getUserProfile(user.id);
        
        // Check if user is an admin
        if (userData.role !== 'admin') {
            alert('Access denied. Only admin users can access this panel.');
            await supabaseService.signOut();
            window.location.href = 'login.html';
            return;
        }
        
        // Set current user
        currentUser = userData;
        
        // Display user info
        userEmail.textContent = userData.email;
        userAvatar.textContent = userData.name.charAt(0).toUpperCase();
        
        // Load dashboard data
        loadDashboard();
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Error loading user profile');
        await supabaseService.signOut();
        window.location.href = 'login.html';
    }
}

async function handleLogout() {
    try {
        await supabaseService.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Navigation and UI functions
function switchTable(table) {
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.getAttribute('data-table') === table) {
            item.classList.add('active-menu', 'bg-indigo-700');
        } else {
            item.classList.remove('active-menu', 'bg-indigo-700');
        }
    });
    
    // Update page title
    const pageTitle = document.getElementById('page-title');
    
    currentTable = table;
    currentPage = 1;
    
    if (table === 'dashboard') {
        pageTitle.textContent = 'Dashboard';
        dashboardContainer.classList.remove('hidden');
        tableContainer.classList.add('hidden');
        loadDashboard();
    } else {
        const config = tableConfigs[table];
        pageTitle.textContent = config.title;
        tableTitle.textContent = config.title;
        dashboardContainer.classList.add('hidden');
        tableContainer.classList.remove('hidden');
        
        // Show/hide add button based on table config
        if (config.readonly) {
            addRecordBtn.classList.add('hidden');
        } else {
            addRecordBtn.classList.remove('hidden');
        }
        
        loadTableData();
    }
}

// Dashboard functions
async function loadDashboard() {
    try {
        // Fetch counts for dashboard cards
        const stats = await supabaseService.getDashboardStats();
        
        document.getElementById('total-users').textContent = stats.usersCount;
        document.getElementById('total-students').textContent = stats.studentsCount;
        document.getElementById('total-classes').textContent = stats.classesCount;
        document.getElementById('total-sessions').textContent = stats.sessionsCount;
        
        // Load recent attendance sessions
        const recentSessions = await supabaseService.getRecentSessions();
        
        const recentSessionsBody = document.getElementById('recent-sessions-body');
        recentSessionsBody.innerHTML = '';
        
        if (recentSessions && recentSessions.length > 0) {
            recentSessions.forEach(session => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-4 py-2 whitespace-nowrap">${formatDate(session.date)}</td>
                    <td class="px-4 py-2 whitespace-nowrap">${session.subject_name} (${session.course_name} - Sem ${session.semester})</td>
                    <td class="px-4 py-2 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ${session.status || 'open'}
                        </span>
                    </td>
                `;
                recentSessionsBody.appendChild(row);
            });
        } else {
            recentSessionsBody.innerHTML = `
                <tr>
                    <td colspan="3" class="px-4 py-2 text-center text-gray-500">No recent sessions found</td>
                </tr>
            `;
        }
        
        // Load recent feedback
        const recentFeedback = await supabaseService.getRecentFeedback();
        
        const recentFeedbackContainer = document.getElementById('recent-feedback');
        recentFeedbackContainer.innerHTML = '';
        
        if (recentFeedback && recentFeedback.length > 0) {
            recentFeedback.forEach(feedback => {
                const userName = feedback.users ? feedback.users.name : feedback.user_email;
                const feedbackItem = document.createElement('div');
                feedbackItem.className = 'bg-gray-50 p-4 rounded';
                
                // Create stars for rating
                let stars = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= feedback.rating) {
                        stars += '<i class="fas fa-star text-yellow-400"></i>';
                    } else {
                        stars += '<i class="far fa-star text-yellow-400"></i>';
                    }
                }
                
                feedbackItem.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="font-medium">${userName || 'Anonymous'}</p>
                            <p class="text-sm text-gray-500">${formatDateTime(feedback.created_at)}</p>
                        </div>
                        <div class="flex">${stars}</div>
                    </div>
                    <p class="mt-2 text-gray-700">${feedback.feedback || 'No comments provided'}</p>
                `;
                recentFeedbackContainer.appendChild(feedbackItem);
            });
        } else {
            recentFeedbackContainer.innerHTML = `
                <div class="text-center text-gray-500 py-4">No feedback found</div>
            `;
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadTableData() {
    try {
        const config = tableConfigs[currentTable];
        
        // Set up table headers
        setupTableHeaders(config);
        
        // Determine if we need to fetch relations
        let relations = null;
        const hasRelations = config.columns.some(col => col.foreignTable);
        
        if (hasRelations) {
            // Special case for audit_logs table
            if (currentTable === 'audit_logs') {
                // Don't include the users relation for audit_logs
                relations = '*';
            } else {
                const relationsList = config.columns
                    .filter(col => col.foreignTable)
                    .map(col => `${col.foreignTable}:${col.name} (id, ${col.foreignLabel})`)
                    .join(', ');
                
                relations = `*, ${relationsList}`;
            }
        }
        
        // Fetch data with pagination
        const { data, count } = await supabaseService.fetchTableData(
            currentTable, 
            currentPage, 
            pageSize, 
            relations
        );
        
        totalRecords = count;
        updatePagination();
        
        // For audit_logs, try to fetch user names separately
        if (currentTable === 'audit_logs' && data && data.length > 0) {
            const userIds = [...new Set(data.filter(log => log.user_id).map(log => log.user_id))];
            
            if (userIds.length > 0) {
                const { data: users } = await supabaseService.supabase
                    .from('users')
                    .select('id, name')
                    .in('id', userIds);
                
                if (users && users.length > 0) {
                    // Create a map of user IDs to names
                    const userMap = {};
                    users.forEach(user => {
                        userMap[user.id] = user.name;
                    });
                    
                    // Add user_name property to each log entry
                    data.forEach(log => {
                        if (log.user_id && userMap[log.user_id]) {
                            log.user_name = userMap[log.user_id];
                        } else {
                            log.user_name = 'Unknown User';
                        }
                    });
                }
            }
        }
        
        // Render table rows
        renderTableRows(data, config);
    } catch (error) {
        console.error(`Error loading ${currentTable} data:`, error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="${tableConfigs[currentTable].columns.length + 1}" class="px-4 py-2 text-center text-red-500">
                    Error loading data: ${error.message}
                </td>
            </tr>
        `;
    }
}


function setupTableHeaders(config) {
    tableHeaders.innerHTML = '';
    
    // Add column headers
    config.columns.forEach(column => {
        if (!column.hidden) {
            const th = document.createElement('th');
            th.className = 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
            th.textContent = column.label;
            tableHeaders.appendChild(th);
        }
    });
    
    // Add actions column if table is not readonly
    if (!config.readonly) {
        const th = document.createElement('th');
        th.className = 'px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider';
        th.textContent = 'Actions';
        tableHeaders.appendChild(th);
    }
}

function renderTableRows(data, config) {
    tableBody.innerHTML = '';
    
    if (!data || data.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="${config.columns.length + 1}" class="px-4 py-2 text-center text-gray-500">
                No records found
            </td>
        `;
        tableBody.appendChild(tr);
        return;
    }
    
    data.forEach(record => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        
        // Add cells for each column
        config.columns.forEach(column => {
            if (!column.hidden) {
                const td = document.createElement('td');
                td.className = 'px-4 py-2 whitespace-nowrap';
                
                // Handle different column types
                if (column.type === 'image' && record[column.name]) {
                    td.innerHTML = `<img src="${record[column.name]}" alt="Image" class="h-10 w-10 rounded-full object-cover">`;
                } else if (column.type === 'datetime' && record[column.name]) {
                    td.textContent = formatDateTime(record[column.name]);
                } else if (column.type === 'date' && record[column.name]) {
                    td.textContent = formatDate(record[column.name]);
                } else if (column.type === 'json' && record[column.name]) {
                    td.innerHTML = `<pre class="text-xs">${JSON.stringify(record[column.name], null, 2)}</pre>`;
                } else if (column.foreignTable && record[column.foreignTable]) {
                    // Display foreign key relation
                    const foreignRecord = record[column.foreignTable];
                    td.textContent = foreignRecord[column.foreignLabel] || 'Unknown';
                } else {
                    td.textContent = record[column.name] || '';
                }
                
                tr.appendChild(td);
            }
        });
        
        // Add actions column if table is not readonly
        if (!config.readonly) {
            const td = document.createElement('td');
            td.className = 'px-4 py-2 whitespace-nowrap text-right text-sm font-medium';
            td.innerHTML = `
                <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-btn" data-id="${record.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${record.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            tr.appendChild(td);
        }
        
        tableBody.appendChild(tr);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            editRecord(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            showDeleteConfirmation(id);
        });
    });
}

function updatePagination() {
    const totalPages = Math.ceil(totalRecords / pageSize);
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, totalRecords);
    
    // Update pagination info
    startRecord.textContent = totalRecords > 0 ? start : 0;
    endRecord.textContent = end;
    totalRecordsElement.textContent = totalRecords;
    
    // Disable/enable pagination buttons
    prevPage.disabled = currentPage <= 1;
    nextPage.disabled = currentPage >= totalPages;
    prevPageMobile.disabled = currentPage <= 1;
    nextPageMobile.disabled = currentPage >= totalPages;
    
    if (prevPage.disabled) {
        prevPage.classList.add('opacity-50', 'cursor-not-allowed');
        prevPageMobile.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        prevPage.classList.remove('opacity-50', 'cursor-not-allowed');
        prevPageMobile.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    if (nextPage.disabled) {
        nextPage.classList.add('opacity-50', 'cursor-not-allowed');
        nextPageMobile.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        nextPage.classList.remove('opacity-50', 'cursor-not-allowed');
        nextPageMobile.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    // Generate pagination numbers
    paginationNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            i === currentPage 
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
        }`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => changePage(i));
        paginationNumbers.appendChild(pageBtn);
    }
}

function changePage(page) {
    if (page < 1 || page > Math.ceil(totalRecords / pageSize)) return;
    
    currentPage = page;
    loadTableData();
}

// Form functions
async function showFormModal(isEdit, recordId = null) {
    isEditing = isEdit;
    currentRecordId = recordId;
    
    const config = tableConfigs[currentTable];
    formTitle.textContent = isEdit ? 'Edit Record' : 'Add New Record';
    formError.classList.add('hidden');
    
    // Clear previous form fields
    formFields.innerHTML = '';
    
    // Create form fields based on table config
    for (const column of config.columns) {
        if (column.primary && !isEdit) continue; // Skip primary key for new records
        
        const fieldContainer = document.createElement('div');
        
        // Create label
        const label = document.createElement('label');
        label.className = 'block text-gray-700 mb-2';
        label.textContent = column.label;
        if (column.required) {
            const required = document.createElement('span');
            required.className = 'text-red-500 ml-1';
            required.textContent = '*';
            label.appendChild(required);
        }
        fieldContainer.appendChild(label);
        
        // Create input based on column type
        let input;
        
        switch (column.type) {
            case 'textarea':
                input = document.createElement('textarea');
                input.className = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';
                input.rows = 3;
                break;
                
            case 'select':
                input = document.createElement('select');
                input.className = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';
                
                if (column.options) {
                    // Static options
                    column.options.forEach(option => {
                        const optionEl = document.createElement('option');
                        optionEl.value = option;
                        optionEl.textContent = option;
                        input.appendChild(optionEl);
                    });
                } else if (column.foreignTable) {
                    // Will be populated with foreign table data
                    const loadingOption = document.createElement('option');
                    loadingOption.textContent = 'Loading...';
                    input.appendChild(loadingOption);
                    
                    // Load foreign table data
                    loadForeignTableOptions(input, column);
                }
                break;
                
            case 'image':
                input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.className = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';
                break;
                
            default:
                input = document.createElement('input');
                             input.type = column.type === 'number' ? 'number' : 
                             column.type === 'email' ? 'email' : 
                             column.type === 'date' ? 'date' : 
                             column.type === 'time' ? 'time' : 'text';
                input.className = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';
                
                if (column.min !== undefined) input.min = column.min;
                if (column.max !== undefined) input.max = column.max;
        }
        
        input.id = column.name;
        input.name = column.name;
        input.required = column.required;
        input.disabled = column.readonly;
        
        fieldContainer.appendChild(input);
        formFields.appendChild(fieldContainer);
    }
    
    // If editing, load record data
    if (isEdit && recordId) {
        await loadRecordData(recordId);
    }
    
    formModal.classList.remove('hidden');
}

async function loadForeignTableOptions(selectElement, column) {
    try {
        const data = await supabaseService.fetchForeignTableData(
            column.foreignTable, 
            column.foreignKey, 
            column.foreignLabel
        );
        
        // Clear loading option
        selectElement.innerHTML = '';
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = `-- Select ${column.label} --`;
        selectElement.appendChild(emptyOption);
        
        // Add options from foreign table
        data.forEach(record => {
            const option = document.createElement('option');
            option.value = record[column.foreignKey];
            option.textContent = record[column.foreignLabel];
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error(`Error loading options for ${column.name}:`, error);
        selectElement.innerHTML = `<option value="">Error loading options</option>`;
    }
}

async function loadRecordData(recordId) {
    try {
        // Fetch record data
        const data = await supabaseService.fetchRecord(currentTable, recordId);
        
        // Populate form fields with record data
        const config = tableConfigs[currentTable];
        
        config.columns.forEach(column => {
            const field = document.getElementById(column.name);
            if (!field) return;
            
            if (column.type === 'image') {
                // Can't set file input value, will need to handle this differently
                // Maybe show current image preview
                if (data[column.name]) {
                    const previewContainer = document.createElement('div');
                    previewContainer.className = 'mt-2 mb-2';
                    previewContainer.innerHTML = `
                        <p class="text-sm text-gray-500 mb-1">Current image:</p>
                        <img src="${data[column.name]}" alt="Current image" class="h-20 w-20 object-cover rounded">
                    `;
                    field.parentNode.insertBefore(previewContainer, field.nextSibling);
                }
            } else if (column.type === 'datetime' || column.type === 'date') {
                // Format date for input
                if (data[column.name]) {
                    const date = new Date(data[column.name]);
                    if (column.type === 'date') {
                        field.value = date.toISOString().split('T')[0];
                    } else {
                        field.value = data[column.name];
                    }
                }
            } else {
                field.value = data[column.name] || '';
            }
        });
    } catch (error) {
        console.error('Error loading record data:', error);
        formError.textContent = `Error loading record data: ${error.message}`;
        formError.classList.remove('hidden');
    }
}

function hideFormModal() {
    formModal.classList.add('hidden');
    recordForm.reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    formError.classList.add('hidden');
    
    try {
        const formData = new FormData(recordForm);
        const data = {};
        
        // Convert form data to object
        for (const [key, value] of formData.entries()) {
            if (value !== '') {
                data[key] = value;
            }
        }
        
        // Handle file uploads if any
        const fileInputs = recordForm.querySelectorAll('input[type="file"]');
        for (const fileInput of fileInputs) {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fieldName = fileInput.name;
                
                // Upload file to storage
                const bucket = getStorageBucketForField(fieldName);
                const publicUrl = await supabaseService.uploadFile(bucket, file);
                
                data[fieldName] = publicUrl;
            }
        }
        
        if (isEditing) {
            // Update existing record
            await supabaseService.updateRecord(currentTable, currentRecordId, data);
        } else {
            // Insert new record
            await supabaseService.insertRecord(currentTable, data);
        }
        
        // Success
        hideFormModal();
        loadTableData();
    } catch (error) {
        console.error('Error submitting form:', error);
        formError.textContent = `Error: ${error.message}`;
        formError.classList.remove('hidden');
    }
}

function getStorageBucketForField(fieldName) {
    // Map field names to storage buckets
    const bucketMap = {
        'profile_image_url': 'profile_images',
        'image_url': 'student_images'
    };
    
    return bucketMap[fieldName] || 'profile_images';
}

// Delete record functions
function showDeleteConfirmation(recordId) {
    currentRecordId = recordId;
    confirmMessage.textContent = `Are you sure you want to delete this record? This action cannot be undone.`;
    
    // Set up confirm button
    confirmAction.onclick = () => deleteRecord(recordId);
    
    confirmModal.classList.remove('hidden');
}

async function deleteRecord(recordId) {
    try {
        await supabaseService.deleteRecord(currentTable, recordId);
        hideConfirmModal();
        loadTableData();
    } catch (error) {
        console.error('Error deleting record:', error);
        alert(`Error deleting record: ${error.message}`);
    }
}

function hideConfirmModal() {
    confirmModal.classList.add('hidden');
}

async function editRecord(recordId) {
    await showFormModal(true, recordId);
}

// Utility functions
function formatDateTime(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

