"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { studentsAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [studentDetails, setStudentDetails] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentsAPI.getAllStudents()
        setStudents(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load students",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [toast])

  const fetchStudentDetails = async (studentId: string) => {
    setLoadingDetails(true)
    try {
      const details = await studentsAPI.getStudentAttendance(studentId)
      setStudentDetails(details)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load student details",
        variant: "destructive",
      })
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student)
    fetchStudentDetails(student._id)
  }

  const filteredStudents = students.filter(
    (student: any) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-gray-400">View and manage student records</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="bg-[#111936] border-[#2a3366]">
            <CardHeader>
              <CardTitle>Student List</CardTitle>
              <CardDescription className="text-gray-400">All students enrolled in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search by name or roll number..."
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
                        <TableHead>Name</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student: any) => (
                          <TableRow key={student._id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.rollNumber}</TableCell>
                            <TableCell>{student.class}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  student.attendancePercentage > 85
                                    ? "bg-green-600"
                                    : student.attendancePercentage > 75
                                      ? "bg-yellow-600"
                                      : "bg-red-600"
                                }
                              >
                                {student.attendancePercentage}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300 hover:bg-[#1a2346]"
                                onClick={() => handleStudentSelect(student)}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                            No students found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedStudent ? (
            <Card className="bg-[#111936] border-[#2a3366]">
              <CardHeader>
                <CardTitle>{selectedStudent.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {selectedStudent.rollNumber} | {selectedStudent.class}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingDetails ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  studentDetails && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#1a2346] p-4 rounded-md">
                          <p className="text-sm text-gray-400">Total Events</p>
                          <p className="text-2xl font-bold">{studentDetails.totalEvents}</p>
                        </div>
                        <div className="bg-[#1a2346] p-4 rounded-md">
                          <p className="text-sm text-gray-400">Attendance</p>
                          <p className="text-2xl font-bold">{studentDetails.attendancePercentage}%</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Present</span>
                          <span className="text-green-400">{studentDetails.presentCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Absent</span>
                          <span className="text-red-400">{studentDetails.absentCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">On Leave</span>
                          <span className="text-yellow-400">{studentDetails.onLeaveCount}</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          variant="outline"
                          className="w-full border-[#2a3366] text-gray-300 hover:bg-[#1a2346] hover:text-white"
                        >
                          View Attendance History
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#111936] border-[#2a3366]">
              <CardHeader>
                <CardTitle>Student Details</CardTitle>
                <CardDescription className="text-gray-400">Select a student to view details</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8 text-gray-400">
                <p>No student selected</p>
                <p className="text-sm mt-2">Click "View Details" on a student to see their information</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
