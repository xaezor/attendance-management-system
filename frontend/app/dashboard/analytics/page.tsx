"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceChart } from "@/components/attendance-chart"
import { StudentTable } from "@/components/student-table"
import { analyticsAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("all")
  const [chartData, setChartData] = useState([])
  const [topStudents, setTopStudents] = useState([])
  const [bottomStudents, setBottomStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true)
      try {
        // Fetch chart data based on selected period
        const graphData = await analyticsAPI.getAttendanceGraph(period)
        setChartData(graphData)

        // Fetch top and bottom students
        const topData = await analyticsAPI.getTopStudents()
        const bottomData = await analyticsAPI.getBottomStudents()

        setTopStudents(topData)
        setBottomStudents(bottomData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [period, toast])

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-400">View attendance statistics and trends</p>
      </div>

      <Tabs defaultValue="all" value={period} onValueChange={handlePeriodChange} className="mb-6">
        <TabsList className="bg-[#1a2346]">
          <TabsTrigger value="all">All Time</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card className="bg-[#111936] border-[#2a3366]">
            <CardHeader>
              <CardTitle>Attendance Percentage</CardTitle>
              <CardDescription className="text-gray-400">Percentage of present students vs date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <AttendanceChart data={chartData} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="mt-4">
          <Card className="bg-[#111936] border-[#2a3366]">
            <CardHeader>
              <CardTitle>Monthly Attendance</CardTitle>
              <CardDescription className="text-gray-400">Attendance trends by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <AttendanceChart data={chartData} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly" className="mt-4">
          <Card className="bg-[#111936] border-[#2a3366]">
            <CardHeader>
              <CardTitle>Weekly Attendance</CardTitle>
              <CardDescription className="text-gray-400">Attendance trends by week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <AttendanceChart data={chartData} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-[#111936] border-[#2a3366]">
          <CardHeader>
            <CardTitle>Most Present Students</CardTitle>
            <CardDescription className="text-gray-400">Students with highest attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <StudentTable students={topStudents} />
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#111936] border-[#2a3366]">
          <CardHeader>
            <CardTitle>Most Absent Students</CardTitle>
            <CardDescription className="text-gray-400">Students with lowest attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <StudentTable students={bottomStudents} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
