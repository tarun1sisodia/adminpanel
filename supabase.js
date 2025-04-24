import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
// Supabase configuration
const SUPABASE_URL = 'https://aytvjwwnuyebddcwleut.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dHZqd3dudXllYmRkY3dsZXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDI3MTIsImV4cCI6MjA2MDcxODcxMn0.rMubCVjGFTLo7JA_zm2FA62jK5Bzu__xw9QDqWVEYf8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Authentication functions
async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    
    if (error) throw error;
    return data;
}

async function signUp(email, password, userData) {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: userData.name,
                role: userData.role || 'user'
            }
        }
    });
    
    if (authError) throw authError;
    
    // Then create the user profile in the users table
    const { error: profileError } = await supabase
        .from('users')
        .insert({
            id: authData.user.id,
            email: email,
            name: userData.name,
            role: userData.role || 'user',
            phone: userData.phone || null,
            profile_image_url: userData.profile_image_url || null
        });
    
    if (profileError) throw profileError;
    
    return authData;
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

async function getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getUserProfile(userId) {
    console.log("Fetching user profile for ID:", userId);
    
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) {
        console.error("Error fetching user profile:", error);
        console.error("Error details:", JSON.stringify(error));
        throw error;
    }
    
    console.log("User profile data:", data);
    return data;
}


// Database operations
async function fetchTableData(table, page, pageSize, relations = null) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    let query;
    if (relations) {
        query = supabase
            .from(table)
            .select(relations, { count: 'exact' });
    } else {
        query = supabase
            .from(table)
            .select('*', { count: 'exact' });
    }
    
    const { data, count, error } = await query
        .range(from, to)
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, count };
}

async function fetchRecord(table, id) {
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
}

async function insertRecord(table, data) {
    const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();
    
    if (error) throw error;
    return result;
}

async function updateRecord(table, id, data) {
    const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();
    
    if (error) throw error;
    return result;
}

async function deleteRecord(table, id) {
    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
    
    if (error) throw error;
}

async function fetchForeignTableData(table, keyField, labelField) {
    const { data, error } = await supabase
        .from(table)
        .select(`${keyField}, ${labelField}`)
        .order(labelField, { ascending: true });
    
    if (error) throw error;
    return data;
}

// File storage operations
async function uploadFile(bucket, file) {
    const fileName = `${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
    
    return publicUrl;
}

// Dashboard data operations
async function getDashboardStats() {
    const [
        { count: usersCount }, 
        { count: studentsCount }, 
        { count: classesCount }, 
        { count: sessionsCount }
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('classes').select('*', { count: 'exact', head: true }),
        supabase.from('attendance_sessions').select('*', { count: 'exact', head: true })
    ]);
    
    return {
        usersCount,
        studentsCount,
        classesCount,
        sessionsCount
    };
}

async function getRecentSessions(limit = 5) {
    const { data, error } = await supabase
        .from('attendance_session_details')
        .select('*')
        .order('date', { ascending: false })
        .limit(limit);
    
    if (error) throw error;
    return data;
}

async function getRecentFeedback(limit = 3) {
    const { data, error } = await supabase
        .from('user_feedback')
        .select(`
            *,
            users:user_id (name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
    
    if (error) throw error;
    return data;
}

// Export all functions
export {
    supabase,
    signIn,
    signUp,
    signOut,
    getCurrentSession,
    getCurrentUser,
    fetchTableData,
    fetchRecord,
    insertRecord,
    updateRecord,
    deleteRecord,
    fetchForeignTableData,
    uploadFile,
    getDashboardStats,
    getRecentSessions,
    getRecentFeedback
};