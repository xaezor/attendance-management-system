"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Calendar, ClipboardList, HelpCircle, Home, LogOut, Menu, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { authAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const userData = await authAPI.getCurrentUser()
        setUser(userData)
      } catch (error) {
        // Redirect to login if not authenticated
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    authAPI.logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }

  const navItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/analytics",
      title: "Analytics",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/attendance",
      title: "Attendance",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/students",
      title: "Students",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/about",
      title: "About",
      icon: <HelpCircle className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/report",
      title: "Report Issue",
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f29] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0a0f29] text-white">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-[#111936] border-r border-[#2a3366]">
        <div className="p-6">
          <div className="flex items-center gap-2 font-semibold text-xl">
            <BarChart3 className="h-6 w-6 text-blue-400" />
            <span>Attendance</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-[#1a2346] hover:text-white",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-[#2a3366]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#2a3366] text-gray-300 hover:bg-[#1a2346] hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-10">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-[#111936] border-r border-[#2a3366]">
          <div className="p-6">
            <div className="flex items-center gap-2 font-semibold text-xl">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              <span>Attendance</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      pathname === item.href
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-[#1a2346] hover:text-white",
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-[#2a3366]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-gray-400">{user?.email || "user@example.com"}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-[#2a3366] text-gray-300 hover:bg-[#1a2346] hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
