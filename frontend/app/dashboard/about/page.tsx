import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">About</h1>
        <p className="text-gray-400">Information about the attendance management system</p>
      </div>

      <Card className="bg-[#111936] border-[#2a3366] mb-6">
        <CardHeader>
          <CardTitle>Attendance Management System</CardTitle>
          <CardDescription className="text-gray-400">Version 1.0</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Attendance Management System is a comprehensive solution designed to streamline the process of tracking
            and managing student attendance records. This system provides educators and administrators with powerful
            tools to monitor attendance patterns, identify at-risk students, and generate insightful reports.
          </p>

          <h3 className="text-lg font-medium mt-4">Key Features</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Real-time attendance tracking</li>
            <li>Detailed analytics and reporting</li>
            <li>Student performance monitoring</li>
            <li>Automated attendance status (Present, Absent, On Leave)</li>
            <li>Historical attendance data access</li>
            <li>User-friendly interface for quick attendance marking</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Benefits</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Reduces administrative workload</li>
            <li>Improves accuracy of attendance records</li>
            <li>Helps identify attendance patterns and trends</li>
            <li>Facilitates communication between school and parents</li>
            <li>Supports data-driven decision making</li>
          </ul>

          <div className="pt-4 border-t border-[#2a3366] mt-6">
            <p className="text-sm text-gray-400">
              Developed by School Management Solutions
              <br />© 2023 All Rights Reserved
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
