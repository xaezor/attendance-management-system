"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { reportsAPI } from "@/lib/api"

export default function ReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "",
    title: "",
    description: "",
    steps: "",
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      issueType: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await reportsAPI.submitReport(formData)
      toast({
        title: "Report submitted",
        description: "Your issue has been reported to the development team.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        issueType: "",
        title: "",
        description: "",
        steps: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Report Issue</h1>
        <p className="text-gray-400">Report any issues or bugs to the development team</p>
      </div>

      <Card className="bg-[#111936] border-[#2a3366] max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Submit a Report</CardTitle>
          <CardDescription className="text-gray-400">
            Please provide details about the issue you encountered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                required
                className="bg-[#1a2346] border-[#2a3366] text-white"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                className="bg-[#1a2346] border-[#2a3366] text-white"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueType">Issue Type</Label>
              <Select required value={formData.issueType} onValueChange={handleSelectChange}>
                <SelectTrigger className="bg-[#1a2346] border-[#2a3366] text-white">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2346] border-[#2a3366] text-white">
                  <SelectItem value="bug">Bug or Error</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                required
                className="bg-[#1a2346] border-[#2a3366] text-white"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide as much detail as possible about the issue..."
                rows={6}
                required
                className="bg-[#1a2346] border-[#2a3366] text-white resize-none"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps">Steps to Reproduce (if applicable)</Label>
              <Textarea
                id="steps"
                placeholder="List the steps to reproduce this issue..."
                rows={4}
                className="bg-[#1a2346] border-[#2a3366] text-white resize-none"
                value={formData.steps}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-400 border-t border-[#2a3366] mt-4 flex justify-center">
          <p>Thank you for helping us improve the Attendance Management System</p>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}
