"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { attendanceAPI, studentsAPI } from "@/lib/api"

interface AttendanceFormProps {
  onCancel: () => void
  onSubmitSuccess?: () => void
}

export function AttendanceForm({ onCancel, onSubmitSuccess }: AttendanceFormProps) {
  const [date, setDate] = useState("")
  const [className, setClassName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      })
      return
    }

    if (!className) {
      toast({
        title: "Error",
        description: "Please select a class",
        variant: "destructive",
      })
      return
    }

    // Check if all students have attendance status
    const allMarked = students.every((student) => attendanceStatus[student._id])

    if (!allMarked) {
      toast({
        title: "Warning",
        description: "Not all students have been marked. Continue anyway?",
        action: (
          <Button
            variant="outline"
            onClick={() => {
              submitAttendance()
            }}
            className="border-[#2a3366] text-white hover:bg-[#1a2346] hover:text-white"
          >
            Continue
          </Button>
        ),
      })
      return
    }

    submitAttendance()
  }

  const submitAttendance = async () => {
    setIsSubmitting(true)

    try {
      // Prepare attendance data
      const attendanceData = {
        date,
        class: className,
        students: Object.keys(attendanceStatus).map((studentId) => ({
          student: studentId,
          status: attendanceStatus[studentId],
        })),
      }

      // Submit attendance to API
      await attendanceAPI.createAttendance(attendanceData)

      toast({
        title: "Success",
        description: "Attendance has been recorded successfully",
      })

      // Call the success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess()
      } else {
        onCancel()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-[#111936] border-[#2a3366]">
      <CardHeader>
        <CardTitle>Take Attendance</CardTitle>
        <CardDescription className="text-gray-400">Mark attendance for students</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-[#1a2346] border-[#2a3366] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select value={className} onValueChange={setClassName}>
                  <SelectTrigger className="bg-[#1a2346] border-[#2a3366] text-white">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2346] border-[#2a3366] text-white">
                    <SelectItem value="class-10a">Class 10A</SelectItem>
                    <SelectItem value="class-10b">Class 10B</SelectItem>
                    <SelectItem value="class-9a">Class 9A</SelectItem>
                    <SelectItem value="class-9b">Class 9B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="search">Search Students</Label>
              <Input
                id="search"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1a2346] border-[#2a3366] text-white"
              />
            </div>

            <div className="rounded-md border border-[#2a3366]">
              <Table>
                <TableHeader className="bg-[#1a2346]">
                  <TableRow>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-right">
                          <RadioGroup
                            value={attendanceStatus[student._id] || ""}
                            onValueChange={(value) => handleStatusChange(student._id, value)}
                            className="flex justify-end space-x-4"
                          >
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value="present"
                                id={`present-${student._id}`}
                                className="text-green-400 border-green-400 focus:ring-green-400"
                              />
                              <Label htmlFor={`present-${student._id}`} className="text-green-400">
                                Present
                              </Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value="absent"
                                id={`absent-${student._id}`}
                                className="text-red-400 border-red-400 focus:ring-red-400"
                              />
                              <Label htmlFor={`absent-${student._id}`} className="text-red-400">
                                Absent
                              </Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value="leave"
                                id={`leave-${student._id}`}
                                className="text-yellow-400 border-yellow-400 focus:ring-yellow-400"
                              />
                              <Label htmlFor={`leave-${student._id}`} className="text-yellow-400">
                                Leave
                              </Label>
                            </div>
                          </RadioGroup>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                        No students found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-[#2a3366] text-gray-300 hover:bg-[#1a2346] hover:text-white"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <Toaster />
    </Card>
  )
}
