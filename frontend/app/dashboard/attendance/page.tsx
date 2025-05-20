"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AttendanceForm } from "@/components/attendance-form"
import { attendanceAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [attendanceLogs, setAttendanceLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAttendanceLogs = async () => {
      try {
        const data = await attendanceAPI.getAttendanceLogs()
        setAttendanceLogs(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load attendance logs",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (!showForm) {
      fetchAttendanceLogs()
    }
  }, [showForm, toast])

  const filteredLogs = attendanceLogs.filter(
    (log: any) => log.date?.includes(searchTerm) || log.class?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAttendanceSubmit = async () => {
    setShowForm(false)
    // Refresh the attendance logs
    setLoading(true)
    try {
      const data = await attendanceAPI.getAttendanceLogs()
      setAttendanceLogs(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh attendance logs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-gray-400">Manage attendance records</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Take Attendance
          </Button>
        </div>
      </div>

      {showForm ? (
        <AttendanceForm onCancel={() => setShowForm(false)} onSubmitSuccess={handleAttendanceSubmit} />
      ) : (
        <Card className="bg-[#111936] border-[#2a3366]">
          <CardHeader>
            <CardTitle>Attendance Logs</CardTitle>
            <CardDescription className="text-gray-400">View and manage attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search by date or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1a2346] border-[#2a3366] text-white"
              />
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="rounded-md border border-[#2a3366]">
                <Table>
                  <TableHeader className="bg-[#1a2346]">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>On Leave</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log: any) => (
                        <TableRow key={log._id}>
                          <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                          <TableCell>{log.time || "N/A"}</TableCell>
                          <TableCell>{log.class}</TableCell>
                          <TableCell className="text-green-400">{log.presentCount}</TableCell>
                          <TableCell className="text-red-400">{log.absentCount}</TableCell>
                          <TableCell className="text-yellow-400">{log.onLeaveCount}</TableCell>
                          <TableCell>{log.totalStudents}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300 hover:bg-[#1a2346]"
                              onClick={() => {
                                // View attendance details
                                // This could open a modal or navigate to a details page
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
