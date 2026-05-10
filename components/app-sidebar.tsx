"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  GraduationCap,
  BarChart3,
  Settings,
  Bot,
  ShieldCheck,
  PenTool,
  School,
} from "lucide-react"

// 🎓 Student OS Admin Data
const data = {
  user: {
    name: "Student OS Admin",
    email: "admin@studentos.app",
    avatar: "/avatars/admin.jpg",
  },

  teams: [
    {
      name: "Student OS",
      logo: <School />,
      plan: "Education SaaS",
    },
    {
      name: "Teacher Panel",
      logo: <GraduationCap />,
      plan: "Instructor",
    },
    {
      name: "Content Studio",
      logo: <PenTool />,
      plan: "Creator",
    },
  ],

  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboard />,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard/overview" },
        { title: "Analytics", url: "/admin/analytics" },
      ],
    },

    {
      title: "Users Control",
      url: "/admin/users",
      icon: <Users />,
      items: [
        { title: "All Users", url: "/dashboard/allusers" },
        { title: "Students", url: "/dashboard/students" },
        { title: "Teachers", url: "/dashboard/teachers" },
        { title: "Roles & Permissions", url: "/dashboard/roles" },
      ],
    },

    {
      title: "Courses / LMS",
      url: "/admin/courses",
      icon: <BookOpen />,
      items: [
        { title: "All Courses", url: "/admin/courses" },
        { title: "Create Course", url: "/admin/courses/new" },
        { title: "Enrollments", url: "/admin/courses/enrollments" },
      ],
    },

    {
      title: "Blogs",
      url: "/admin/blogs",
      icon: <FileText />,
      items: [
        { title: "All Posts", url: "/admin/blogs" },
        { title: "Create Post", url: "/admin/blogs/new" },
        { title: "Categories", url: "/admin/blogs/categories" },
      ],
    },

    {
      title: "AI Assistant",
      url: "/admin/ai",
      icon: <Bot />,
      items: [
        { title: "Student Helper", url: "/admin/ai/helper" },
        { title: "Content Generator", url: "/admin/ai/content" },
      ],
    },

    {
      title: "Security",
      url: "/admin/security",
      icon: <ShieldCheck />,
      items: [
        { title: "Access Logs", url: "/admin/security/logs" },
        { title: "Admin Roles", url: "/admin/security/roles" },
      ],
    },

    {
      title: "Settings",
      url: "/admin/settings",
      icon: <Settings />,
      items: [
        { title: "General", url: "/admin/settings" },
        { title: "System", url: "/admin/settings/system" },
      ],
    },
  ],

  projects: [
    {
      name: "Content Studio",
      url: "/admin/studio",
      icon: <PenTool />,
    },
    {
      name: "Reports",
      url: "/admin/reports",
      icon: <BarChart3 />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}