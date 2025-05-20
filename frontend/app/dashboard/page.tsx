"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, Calendar, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AttendanceChart } from "@/components/attendance-chart"
import { StudentTable } from "@/components/student-table"
import { analyticsAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>({
    totalStudents: 0,
    totalAttendanceSessions: 0,
    topStudents: [],
    bottomStudents: [],
    attendanceData: [],
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await analyticsAPI.getDashboardData()
        setDashboardData(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Loading dashboard data...</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-[#111936] border-[#2a3366]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-5 w-24 bg-[#1a2346] rounded animate-pulse"></div>
                <div className="h-5 w-5 bg-[#1a2346] rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-[#1a2346] rounded animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-[#1a2346] rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Welcome to the attendance management system</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/attendance">
              <Calendar className="mr-2 h-4 w-4" />
              Take Attendance
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Link href="/dashboard/students">
          <Card className="bg-[#111936] border-[#2a3366] hover:border-blue-500 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Total Students</CardTitle>
              <Users className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.totalStudents}</div>
              <p className="text-xs text-gray-400 mt-1">Enrolled in the system</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="bg-[#111936] border-[#2a3366]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Attendance Sessions</CardTitle>
            <Calendar className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.totalAttendanceSessions}</div>
            <p className="text-xs text-gray-400 mt-1">Total attendance records</p>
          </CardContent>
        </Card>

        <Link href="/dashboard/attendance">
          <Card className="bg-[#111936] border-[#2a3366] hover:border-blue-500 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">View Logs</CardTitle>
              <BarChart3 className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">View</div>
              <p className="text-xs text-gray-400 mt-1">Check attendance records</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="bg-[#111936] border-[#2a3366] md:col-span-3">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription className="text-gray-400">Percentage of present students over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <AttendanceChart data={dashboardData.attendanceData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-[#111936] border-[#2a3366]">
          <CardHeader>
            <CardTitle>Most Present Students</CardTitle>
            <CardDescription className="text-gray-400">Students with highest attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentTable students={dashboardData.topStudents} />
          </CardContent>
        </Card>

        <Card className="bg-[#111936] border-[#2a3366]">
          <CardHeader>
            <CardTitle>Most Absent Students</CardTitle>
            <CardDescription className="text-gray-400">Students with lowest attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentTable students={dashboardData.bottomStudents} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
