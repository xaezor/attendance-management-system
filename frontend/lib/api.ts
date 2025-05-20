// API utility functions to interact with the backend

// Base URL for API calls
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function for making authenticated API requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Get the token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // Set up headers with authentication
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    // Handle unauthorized responses
    if (response.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
      throw new Error("Unauthorized")
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }

    return data
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Authentication API calls
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token)
    }

    return data
  },

  logout: () => {
    localStorage.removeItem("token")
  },

  getCurrentUser: async () => {
    return fetchWithAuth("/auth/me")
  },
}

// Analytics API calls
export const analyticsAPI = {
  getDashboardData: async () => {
    return fetchWithAuth("/analytics/dashboard")
  },

  getAttendanceGraph: async (period = "all") => {
    return fetchWithAuth(`/analytics/attendance-graph?period=${period}`)
  },

  getTopStudents: async () => {
    return fetchWithAuth("/analytics/top-students")
  },

  getBottomStudents: async () => {
    return fetchWithAuth("/analytics/bottom-students")
  },
}

// Attendance API calls
export const attendanceAPI = {
  getAttendanceLogs: async () => {
    return fetchWithAuth("/attendance")
  },

  createAttendance: async (attendanceData: any) => {
    return fetchWithAuth("/attendance", {
      method: "POST",
      body: JSON.stringify(attendanceData),
    })
  },

  getAttendanceById: async (id: string) => {
    return fetchWithAuth(`/attendance/${id}`)
  },
}

// Students API calls
export const studentsAPI = {
  getAllStudents: async () => {
    return fetchWithAuth("/students")
  },

  getStudentById: async (id: string) => {
    return fetchWithAuth(`/students/${id}`)
  },

  getStudentAttendance: async (id: string) => {
    return fetchWithAuth(`/students/${id}/attendance`)
  },
}

// Reports API calls
export const reportsAPI = {
  submitReport: async (reportData: any) => {
    return fetchWithAuth("/reports", {
      method: "POST",
      body: JSON.stringify(reportData),
    })
  },
}
