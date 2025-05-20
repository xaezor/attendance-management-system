import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Student {
  _id?: string
  id?: number
  name: string
  attendance?: string
  attendancePercentage?: number
  status?: string
}

interface StudentTableProps {
  students: Student[]
}

export function StudentTable({ students = [] }: StudentTableProps) {
  // Determine status based on attendance percentage
  const getStatus = (percentage: number | string) => {
    const numPercentage = typeof percentage === "string" ? Number.parseInt(percentage.replace("%", "")) : percentage

    if (numPercentage >= 90) return "Excellent"
    if (numPercentage >= 80) return "Good"
    if (numPercentage >= 70) return "Fair"
    return "Poor"
  }

  return (
    <div className="rounded-md border border-[#2a3366]">
      <Table>
        <TableHeader className="bg-[#1a2346]">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? (
            students.map((student) => {
              // Format attendance percentage
              const attendanceDisplay =
                student.attendance ||
                (student.attendancePercentage !== undefined ? `${student.attendancePercentage}%` : "N/A")

              // Determine status
              const status =
                student.status ||
                (student.attendancePercentage !== undefined ? getStatus(student.attendancePercentage) : "N/A")

              return (
                <TableRow key={student._id || student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{attendanceDisplay}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        status === "Excellent"
                          ? "bg-green-600"
                          : status === "Good"
                            ? "bg-blue-600"
                            : status === "Fair"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                      }
                    >
                      {status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-gray-400">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
