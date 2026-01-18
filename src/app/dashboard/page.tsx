"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  Briefcase, Search, FileText, BookOpen, TrendingUp, MessageSquare, 
  LogOut, User, MapPin, Building2, Clock, ExternalLink, Loader2,
  Send, Upload, Target, GraduationCap, Star, ChevronRight, Menu, X,
  DollarSign, Calendar, Bookmark, CheckCircle, AlertCircle, Settings, Plus, Trash2
} from "lucide-react"
import { toast } from "sonner"

interface Job {
  title: string
  company_name: string
  location: string
  description: string
  detected_extensions?: {
    posted_at?: string
    schedule_type?: string
    salary?: string
  }
  job_highlights?: Array<{
    title: string
    items: string[]
  }>
  apply_options?: Array<{
    title: string
    link: string
  }>
  thumbnail?: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface Course {
  title: string
  provider: string
  url: string
  rating: number
  duration: string
  level: string
  category: string
}

const COURSES: Course[] = [
  { title: "Complete Web Development Bootcamp", provider: "Udemy", url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/", rating: 4.7, duration: "65 hours", level: "Beginner", category: "Web Development" },
  { title: "Python for Data Science and Machine Learning", provider: "Udemy", url: "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/", rating: 4.6, duration: "25 hours", level: "Intermediate", category: "Data Science" },
  { title: "AWS Certified Solutions Architect", provider: "Udemy", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", rating: 4.7, duration: "27 hours", level: "Intermediate", category: "Cloud Computing" },
  { title: "React - The Complete Guide", provider: "Udemy", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", rating: 4.6, duration: "48 hours", level: "Beginner", category: "Web Development" },
  { title: "Machine Learning A-Z", provider: "Udemy", url: "https://www.udemy.com/course/machinelearning/", rating: 4.5, duration: "44 hours", level: "Beginner", category: "Data Science" },
  { title: "Google Data Analytics Professional Certificate", provider: "Coursera", url: "https://www.coursera.org/professional-certificates/google-data-analytics", rating: 4.8, duration: "6 months", level: "Beginner", category: "Data Analytics" },
  { title: "Full Stack Web Development with React", provider: "Coursera", url: "https://www.coursera.org/specializations/full-stack-react", rating: 4.5, duration: "4 months", level: "Intermediate", category: "Web Development" },
  { title: "Java Programming Masterclass", provider: "Udemy", url: "https://www.udemy.com/course/java-the-complete-java-developer-course/", rating: 4.6, duration: "80 hours", level: "Beginner", category: "Programming" },
  { title: "Digital Marketing Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/digital-marketing", rating: 4.5, duration: "8 months", level: "Beginner", category: "Marketing" },
  { title: "Product Management Certification", provider: "Udemy", url: "https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/", rating: 4.5, duration: "13 hours", level: "Beginner", category: "Product Management" },
  { title: "SQL for Data Science", provider: "Coursera", url: "https://www.coursera.org/learn/sql-for-data-science", rating: 4.6, duration: "4 weeks", level: "Beginner", category: "Data Science" },
  { title: "Cybersecurity Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/cyber-security", rating: 4.4, duration: "8 months", level: "Beginner", category: "Cybersecurity" },
  { title: "UI/UX Design Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/ui-ux-design", rating: 4.7, duration: "4 months", level: "Beginner", category: "Design" },
  { title: "DevOps on AWS Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/aws-devops", rating: 4.5, duration: "4 months", level: "Intermediate", category: "DevOps" },
  { title: "Blockchain Basics", provider: "Coursera", url: "https://www.coursera.org/learn/blockchain-basics", rating: 4.5, duration: "4 weeks", level: "Beginner", category: "Blockchain" },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState(false)
  const [jobQuery, setJobQuery] = useState("")
  const [jobLocation, setJobLocation] = useState("")
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([])
  const [recommendedJobsLoading, setRecommendedJobsLoading] = useState(false)
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  
  const [resumeText, setResumeText] = useState("")
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  
  const [careerRecs, setCareerRecs] = useState<any>(null)
  const [careerLoading, setCareerLoading] = useState(false)
  
  const [skillGap, setSkillGap] = useState<any>(null)
  const [skillGapLoading, setSkillGapLoading] = useState(false)
  const [targetRole, setTargetRole] = useState("")
  
  const [courseFilter, setCourseFilter] = useState("all")
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [savedCourses, setSavedCourses] = useState<string[]>([])
  const [savingJob, setSavingJob] = useState<string | null>(null)
  const [savingCourse, setSavingCourse] = useState<string | null>(null)
  const [savedJobsList, setSavedJobsList] = useState<any[]>([])
  const [savedCoursesList, setSavedCoursesList] = useState<any[]>([])
  const [loadingSaved, setLoadingSaved] = useState(false)
  
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    desired_role: "",
    experience_years: 0,
    education: "",
    location: "",
    skills: [] as string[],
  })
  const [newSkill, setNewSkill] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
      
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      
      if (profileData) {
        setProfile(profileData)
        setProfileForm({
          full_name: profileData.full_name || "",
          desired_role: profileData.desired_role || "",
          experience_years: profileData.experience_years || 0,
          education: profileData.education || "",
          location: profileData.location || "",
          skills: profileData.skills || [],
        })
      } else {
        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
        }
        await supabase.from("profiles").upsert(newProfile)
        setProfile(newProfile)
      }
      
      const { data: chatData } = await supabase
        .from("chat_history")
        .select("message, role, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(50)
      
if (chatData && chatData.length > 0) {
          setChatMessages(chatData.map(c => ({ 
            role: c.role as "user" | "assistant", 
            content: c.message 
          })))
        }

        const savedJobsRes = await fetch("/api/saved-jobs")
        if (savedJobsRes.ok) {
          const savedJobsData = await savedJobsRes.json()
          setSavedJobs(savedJobsData.jobs?.map((j: any) => `${j.job_title}-${j.company}`) || [])
          setSavedJobsList(savedJobsData.jobs || [])
        }

        const savedCoursesRes = await fetch("/api/saved-courses")
        if (savedCoursesRes.ok) {
          const savedCoursesData = await savedCoursesRes.json()
          setSavedCourses(savedCoursesData.courses?.map((c: any) => c.course_title) || [])
          setSavedCoursesList(savedCoursesData.courses || [])
        }
        
        setLoading(false)
    }
    loadUserData()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileForm.full_name,
          desired_role: profileForm.desired_role,
          experience_years: profileForm.experience_years,
          education: profileForm.education,
          location: profileForm.location,
          skills: profileForm.skills,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
      
      if (error) throw error
      
      setProfile({ ...profile, ...profileForm })
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    }
    setSavingProfile(false)
  }

  const addSkill = () => {
    if (newSkill.trim() && !profileForm.skills.includes(newSkill.trim())) {
      setProfileForm({
        ...profileForm,
        skills: [...profileForm.skills, newSkill.trim()]
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfileForm({
      ...profileForm,
      skills: profileForm.skills.filter(s => s !== skillToRemove)
    })
  }

  const searchJobs = async () => {
    if (!jobQuery.trim()) {
      toast.error("Please enter a job title or keywords")
      return
    }
    setJobsLoading(true)
    try {
      const res = await fetch(`/api/jobs?query=${encodeURIComponent(jobQuery)}&location=${encodeURIComponent(jobLocation)}`)
      const data = await res.json()
      setJobs(data.jobs || [])
    } catch (error) {
      toast.error("Failed to search jobs")
    }
    setJobsLoading(false)
  }

  const fetchRecommendedJobs = async (role?: string) => {
    setRecommendedJobsLoading(true)
    try {
      const searchQuery = role || profile?.desired_role || "software developer"
      const searchLocation = profile?.location || ""
      const res = await fetch(`/api/jobs?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchLocation)}`)
      const data = await res.json()
      setRecommendedJobs(data.jobs?.slice(0, 6) || [])
    } catch (error) {
      console.error("Failed to fetch recommended jobs")
    }
    setRecommendedJobsLoading(false)
  }

  useEffect(() => {
    if (profile && !loading) {
      fetchRecommendedJobs()
    }
  }, [profile, loading])

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return
    const userMessage = chatInput
    setChatInput("")
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }])
    setChatLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage, 
          history: chatMessages,
          profile 
        })
      })
      const data = await res.json()
      setChatMessages(prev => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      toast.error("Failed to get response")
    }
    setChatLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    const isValidExtension = ["pdf", "docx"].includes(fileExtension || "")

    if (!validTypes.includes(file.type) && !isValidExtension) {
      toast.error("Please upload a PDF or DOCX file")
      return
    }

    setUploadingPdf(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.text) {
        setResumeText(data.text)
        setUploadedFileName(file.name)
        toast.success("Resume uploaded successfully!")
      } else {
        toast.error(data.error || "Failed to parse file")
      }
    } catch (error) {
      toast.error("Failed to upload and parse file")
    }
    setUploadingPdf(false)
  }

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      toast.error("Please paste your resume content")
      return
    }
    setResumeLoading(true)
    try {
      const res = await fetch("/api/resume-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText })
      })
      const data = await res.json()
      setResumeAnalysis(data)
    } catch (error) {
      toast.error("Failed to analyze resume")
    }
    setResumeLoading(false)
  }

  const getCareerRecommendations = async () => {
    setCareerLoading(true)
    try {
      const res = await fetch("/api/career-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, resumeText })
      })
      const data = await res.json()
      setCareerRecs(data)
    } catch (error) {
      toast.error("Failed to get recommendations")
    }
    setCareerLoading(false)
  }

  const analyzeSkillGap = async () => {
    if (!targetRole.trim()) {
      toast.error("Please enter your target role")
      return
    }
    setSkillGapLoading(true)
    try {
      const res = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, profile, resumeText })
      })
      const data = await res.json()
      setSkillGap(data)
    } catch (error) {
      toast.error("Failed to analyze skill gap")
    }
    setSkillGapLoading(false)
  }

  const filteredCourses = courseFilter === "all" 
    ? COURSES 
    : COURSES.filter(c => c.category.toLowerCase() === courseFilter.toLowerCase())

  const saveJob = async (job: Job) => {
    const jobKey = `${job.title}-${job.company_name}`
    setSavingJob(jobKey)
    try {
      const res = await fetch("/api/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: job.title,
          company: job.company_name,
          location: job.location,
          description: job.description,
          apply_link: job.apply_options?.[0]?.link || "",
          salary: job.detected_extensions?.salary || ""
        })
      })
      if (res.ok) {
        setSavedJobs(prev => [...prev, jobKey])
        const data = await res.json()
        setSavedJobsList(prev => [data.job, ...prev])
        toast.success("Job saved successfully!")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save job")
      }
    } catch {
      toast.error("Failed to save job")
    }
    setSavingJob(null)
  }

  const saveCourse = async (course: Course) => {
    setSavingCourse(course.title)
    try {
      const res = await fetch("/api/saved-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_title: course.title,
          provider: course.provider,
          url: course.url,
          rating: course.rating,
          duration: course.duration,
          level: course.level,
          category: course.category
        })
      })
      if (res.ok) {
        setSavedCourses(prev => [...prev, course.title])
        const data = await res.json()
        setSavedCoursesList(prev => [data.course, ...prev])
        toast.success("Course saved successfully!")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save course")
      }
    } catch {
      toast.error("Failed to save course")
    }
    setSavingCourse(null)
  }

  const removeSavedJob = async (id: string, jobKey: string) => {
    try {
      const res = await fetch(`/api/saved-jobs?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setSavedJobsList(prev => prev.filter(j => j.id !== id))
        setSavedJobs(prev => prev.filter(k => k !== jobKey))
        toast.success("Job removed from saved")
      }
    } catch {
      toast.error("Failed to remove job")
    }
  }

  const removeSavedCourse = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/saved-courses?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setSavedCoursesList(prev => prev.filter(c => c.id !== id))
        setSavedCourses(prev => prev.filter(t => t !== title))
        toast.success("Course removed from saved")
      }
    } catch {
      toast.error("Failed to remove course")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

const navItems = [
      { id: "dashboard", label: "Dashboard", icon: Briefcase },
      { id: "profile", label: "Edit Profile", icon: Settings },
      { id: "jobs", label: "Job Search", icon: Search },
      { id: "saved", label: "Saved Items", icon: Bookmark },
      { id: "career", label: "Career Recommendations", icon: TrendingUp },
      { id: "skills", label: "Skill Gap Analysis", icon: Target },
      { id: "courses", label: "Courses", icon: BookOpen },
      { id: "resume", label: "Resume Analysis", icon: FileText },
      { id: "chat", label: "Career Chat", icon: MessageSquare },
    ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Career Advisor</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{profile?.full_name || user?.email}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </header>

      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.full_name || "User"}!</h1>
                <p className="text-gray-600">Here&apos;s your career overview</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Profile Complete", value: profile?.skills?.length ? "80%" : "40%", icon: User, color: "blue" },
                  { label: "Jobs Matched", value: "150+", icon: Briefcase, color: "emerald" },
                  { label: "Skills Added", value: profile?.skills?.length || 0, icon: Target, color: "violet" },
                  { label: "Courses Available", value: "15+", icon: BookOpen, color: "amber" }
                ].map((stat, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Search Jobs", action: () => setActiveTab("jobs"), icon: Search },
                      { label: "Analyze Resume", action: () => setActiveTab("resume"), icon: FileText },
                      { label: "Get Career Advice", action: () => setActiveTab("chat"), icon: MessageSquare },
                      { label: "Browse Courses", action: () => setActiveTab("courses"), icon: BookOpen }
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={item.action}
                        className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Featured Courses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {COURSES.slice(0, 4).map((course, i) => (
                      <a
                        key={i}
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{course.title}</p>
                            <p className="text-sm text-gray-500">{course.provider} • {course.duration}</p>
                          </div>
                          <Badge variant="secondary">{course.level}</Badge>
                        </div>
                      </a>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Real-Time Job Search</h1>
                <p className="text-gray-600">Find your next opportunity from thousands of listings</p>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Job title, keywords, or company"
                        value={jobQuery}
                        onChange={(e) => setJobQuery(e.target.value)}
                        className="pl-10 h-12"
                        onKeyPress={(e) => e.key === "Enter" && searchJobs()}
                      />
                    </div>
                    <div className="flex-1 relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Location (e.g., New York, Remote)"
                        value={jobLocation}
                        onChange={(e) => setJobLocation(e.target.value)}
                        className="pl-10 h-12"
                        onKeyPress={(e) => e.key === "Enter" && searchJobs()}
                      />
                    </div>
                    <Button 
                      onClick={searchJobs} 
                      disabled={jobsLoading}
                      className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {jobsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search Jobs"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {jobs.length > 0 && (
                <div className="grid gap-4">
                  {jobs.map((job, i) => (
                    <Card key={i} className="border-0 shadow-sm job-card-hover">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                          <div className="flex-shrink-0">
                            {job.thumbnail ? (
                              <img src={job.thumbnail} alt={job.company_name} className="w-16 h-16 rounded-lg object-contain bg-gray-50" />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <p className="text-blue-600 font-medium">{job.company_name}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              {job.detected_extensions?.posted_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {job.detected_extensions.posted_at}
                                </span>
                              )}
                              {job.detected_extensions?.schedule_type && (
                                <Badge variant="secondary">{job.detected_extensions.schedule_type}</Badge>
                              )}
                              {job.detected_extensions?.salary && (
                                <span className="flex items-center gap-1 text-green-600 font-medium">
                                  <DollarSign className="w-4 h-4" />
                                  {job.detected_extensions.salary}
                                </span>
                              )}
                            </div>
                            <p className="mt-3 text-gray-600 line-clamp-2">{job.description}</p>
                            {job.job_highlights && job.job_highlights.length > 0 && (
                              <div className="mt-4 space-y-2">
                                {job.job_highlights.slice(0, 2).map((highlight, hi) => (
                                  <div key={hi}>
                                    <p className="text-sm font-medium text-gray-700">{highlight.title}:</p>
                                    <ul className="text-sm text-gray-600 list-disc list-inside">
                                      {highlight.items.slice(0, 3).map((item, ii) => (
                                        <li key={ii} className="truncate">{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                              {job.apply_options && job.apply_options.length > 0 && (
                                <a href={job.apply_options[0].link} target="_blank" rel="noopener noreferrer">
                                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                    Apply Now
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                  </Button>
                                </a>
                              )}
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => saveJob(job)}
                                disabled={savingJob === `${job.title}-${job.company_name}` || savedJobs.includes(`${job.title}-${job.company_name}`)}
                              >
                                {savingJob === `${job.title}-${job.company_name}` ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : savedJobs.includes(`${job.title}-${job.company_name}`) ? (
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                ) : (
                                  <Bookmark className="w-4 h-4 mr-2" />
                                )}
                                {savedJobs.includes(`${job.title}-${job.company_name}`) ? "Saved" : "Save"}
                              </Button>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

{!jobsLoading && jobs.length === 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Recommended Jobs</h2>
                        <p className="text-gray-500 text-sm">Based on your profile{profile?.desired_role ? ` as ${profile.desired_role}` : ""}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fetchRecommendedJobs()}
                        disabled={recommendedJobsLoading}
                      >
                        {recommendedJobsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
                      </Button>
                    </div>
                    
                    {recommendedJobsLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    ) : recommendedJobs.length > 0 ? (
                      <div className="grid gap-4">
                        {recommendedJobs.map((job, i) => (
                          <Card key={i} className="border-0 shadow-sm job-card-hover">
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                <div className="flex-shrink-0">
                                  {job.thumbnail ? (
                                    <img src={job.thumbnail} alt={job.company_name} className="w-16 h-16 rounded-lg object-contain bg-gray-50" />
                                  ) : (
                                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                      <Building2 className="w-8 h-8 text-blue-600" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                  <p className="text-blue-600 font-medium">{job.company_name}</p>
                                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      {job.location}
                                    </span>
                                    {job.detected_extensions?.posted_at && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {job.detected_extensions.posted_at}
                                      </span>
                                    )}
                                    {job.detected_extensions?.schedule_type && (
                                      <Badge variant="secondary">{job.detected_extensions.schedule_type}</Badge>
                                    )}
                                    {job.detected_extensions?.salary && (
                                      <span className="flex items-center gap-1 text-green-600 font-medium">
                                        <DollarSign className="w-4 h-4" />
                                        {job.detected_extensions.salary}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-3 text-gray-600 line-clamp-2">{job.description}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                  {job.apply_options && job.apply_options.length > 0 && (
                                    <a href={job.apply_options[0].link} target="_blank" rel="noopener noreferrer">
                                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                        Apply Now
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                      </Button>
                                    </a>
                                  )}
                                  <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => saveJob(job)}
                                    disabled={savingJob === `${job.title}-${job.company_name}` || savedJobs.includes(`${job.title}-${job.company_name}`)}
                                  >
                                    {savingJob === `${job.title}-${job.company_name}` ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : savedJobs.includes(`${job.title}-${job.company_name}`) ? (
                                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                    ) : (
                                      <Bookmark className="w-4 h-4 mr-2" />
                                    )}
                                    {savedJobs.includes(`${job.title}-${job.company_name}`) ? "Saved" : "Save"}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-12 text-center">
                          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommended Jobs Found</h3>
                          <p className="text-gray-500 mb-4">Update your profile with a desired role to get personalized job recommendations</p>
                          <Button variant="outline" onClick={() => setActiveTab("profile")}>
                            Update Profile
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Saved Items</h1>
                  <p className="text-gray-600">View your saved jobs and courses</p>
                </div>

                <Tabs defaultValue="jobs" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="jobs">Saved Jobs ({savedJobsList.length})</TabsTrigger>
                    <TabsTrigger value="courses">Saved Courses ({savedCoursesList.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="jobs">
                    {savedJobsList.length > 0 ? (
                      <div className="grid gap-4">
                        {savedJobsList.map((job) => (
                          <Card key={job.id} className="border-0 shadow-sm">
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                                  <Building2 className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg font-semibold text-gray-900">{job.job_title}</h3>
                                  <p className="text-blue-600 font-medium">{job.company}</p>
                                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      {job.location}
                                    </span>
                                    {job.salary && (
                                      <span className="flex items-center gap-1 text-green-600 font-medium">
                                        <DollarSign className="w-4 h-4" />
                                        {job.salary}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-3 text-gray-600 line-clamp-2">{job.description}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                  {job.apply_link && (
                                    <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                        Apply Now
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                      </Button>
                                    </a>
                                  )}
                                  <Button 
                                    variant="outline" 
                                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeSavedJob(job.id, `${job.job_title}-${job.company}`)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-12 text-center">
                          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Jobs</h3>
                          <p className="text-gray-500 mb-4">Save jobs from the Job Search to view them here</p>
                          <Button onClick={() => setActiveTab("jobs")} variant="outline">
                            Search Jobs
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="courses">
                    {savedCoursesList.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedCoursesList.map((course) => (
                          <Card key={course.id} className="border-0 shadow-sm">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <Badge variant="secondary">{course.category}</Badge>
                                <div className="flex items-center gap-1 text-amber-500">
                                  <Star className="w-4 h-4 fill-current" />
                                  <span className="text-sm font-medium">{course.rating}</span>
                                </div>
                              </div>
                              <h3 className="font-semibold text-gray-900 mb-2">{course.course_title}</h3>
                              <div className="space-y-2 text-sm text-gray-500">
                                <p className="flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4" />
                                  {course.provider}
                                </p>
                                <p className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  {course.duration}
                                </p>
                                <p className="flex items-center gap-2">
                                  <Target className="w-4 h-4" />
                                  {course.level}
                                </p>
                              </div>
                              <a href={course.url} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                  View Course
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                              </a>
                              <Button 
                                variant="outline"
                                className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeSavedCourse(course.id, course.course_title)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-12 text-center">
                          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Courses</h3>
                          <p className="text-gray-500 mb-4">Save courses from the Courses section to view them here</p>
                          <Button onClick={() => setActiveTab("courses")} variant="outline">
                            Browse Courses
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeTab === "career" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Career Recommendations</h1>
                <p className="text-gray-600">Personalized career paths based on your profile and skills</p>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Get AI-powered career recommendations based on your profile and resume</p>
                    <Button 
                      onClick={getCareerRecommendations}
                      disabled={careerLoading}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {careerLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <TrendingUp className="w-5 h-5 mr-2" />}
                      Get Recommendations
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {careerRecs && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Your Career Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700">{careerRecs.recommendations}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Skill Gap Analysis</h1>
                <p className="text-gray-600">Identify skills needed for your target role</p>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="max-w-xl mx-auto space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
                      <Input
                        placeholder="e.g., Senior Software Engineer, Data Scientist"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <Button 
                      onClick={analyzeSkillGap}
                      disabled={skillGapLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {skillGapLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Target className="w-5 h-5 mr-2" />}
                      Analyze Skill Gap
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {skillGap && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Skill Gap Analysis for {targetRole}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700">{skillGap.analysis}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recommended Courses</h1>
                <p className="text-gray-600">Upskill with courses from top platforms</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["all", "Web Development", "Data Science", "Cloud Computing", "Programming", "Design", "Marketing"].map(filter => (
                  <Button
                    key={filter}
                    variant={courseFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCourseFilter(filter)}
                    className={courseFilter === filter ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {filter === "all" ? "All Courses" : filter}
                  </Button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course, i) => (
                  <Card key={i} className="border-0 shadow-sm job-card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="secondary">{course.category}</Badge>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <div className="space-y-2 text-sm text-gray-500">
                        <p className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          {course.provider}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </p>
                        <p className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {course.level}
                        </p>
                      </div>
                      <a href={course.url} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            View Course
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </a>
                        <Button 
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => saveCourse(course)}
                          disabled={savingCourse === course.title || savedCourses.includes(course.title)}
                        >
                          {savingCourse === course.title ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : savedCourses.includes(course.title) ? (
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          ) : (
                            <Bookmark className="w-4 h-4 mr-2" />
                          )}
                          {savedCourses.includes(course.title) ? "Saved" : "Save Course"}
                        </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "resume" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Resume Analysis</h1>
                <p className="text-gray-600">Get ATS-optimized feedback on your resume</p>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-blue-400 transition-colors bg-gray-50/50">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload PDF Resume</h3>
                        <p className="text-sm text-gray-500 mb-6">Drag and drop or click to upload</p>
                        <input
                          type="file"
                          id="resume-upload"
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileUpload}
                        />
                        <Button 
                          asChild
                          disabled={uploadingPdf}
                          className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
                        >
                          <label htmlFor="resume-upload" className="cursor-pointer">
                            {uploadingPdf ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2 text-blue-600" />}
                            {uploadingPdf ? "Parsing..." : "Select PDF File"}
                          </label>
                        </Button>
                      </div>

                      <div className="flex flex-col justify-center">
                        <h4 className="font-medium text-gray-900 mb-2">Why PDF?</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Best format for ATS compatibility
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Preserves professional formatting
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Instant text extraction and analysis
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400 font-medium">Or paste resume text</span>
                      </div>
                    </div>

                    <div>
                      <Textarea
                        placeholder="Paste your resume text here for manual analysis..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="min-h-[200px] border-gray-200 focus:ring-blue-500"
                      />
                    </div>
                    
                    <Button 
                      onClick={analyzeResume}
                      disabled={resumeLoading || !resumeText.trim()}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20"
                    >
                      {resumeLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <TrendingUp className="w-5 h-5 mr-2" />}
                      Start Comprehensive Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {resumeAnalysis && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Resume Analysis Results
                      {resumeAnalysis.score >= 70 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">ATS Score</span>
                        <span className="text-2xl font-bold text-blue-600">{resumeAnalysis.score}%</span>
                      </div>
                      <Progress value={resumeAnalysis.score} className="h-3" />
                    </div>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700">{resumeAnalysis.analysis}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Career Chat</h1>
                <p className="text-gray-600">Get instant career advice from our AI assistant</p>
              </div>

              <Card className="border-0 shadow-sm h-[600px] flex flex-col">
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-6">
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Start a Conversation</h3>
                        <p className="text-gray-500 mb-6">Ask me anything about your career!</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {[
                            "What skills should I learn for tech?",
                            "How do I prepare for interviews?",
                            "Tips for career change"
                          ].map((suggestion, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              onClick={() => { setChatInput(suggestion); }}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              msg.role === "user" 
                                ? "bg-blue-600 text-white" 
                                : "bg-gray-100 text-gray-900"
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        ))}
                        {chatLoading && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-2xl px-4 py-3">
                              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                        className="flex-1 h-12"
                      />
                      <Button 
                        onClick={sendChatMessage}
                        disabled={chatLoading || !chatInput.trim()}
                        className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                  <p className="text-gray-600">Update your profile information to get better recommendations</p>
                </div>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <CardDescription>This information will help us provide personalized career advice</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input
                          placeholder="Your full name"
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                          value={user?.email || ""}
                          disabled
                          className="h-12 bg-gray-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Desired Role</label>
                        <Input
                          placeholder="e.g., Software Engineer, Data Scientist"
                          value={profileForm.desired_role}
                          onChange={(e) => setProfileForm({ ...profileForm, desired_role: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Years of Experience</label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          value={profileForm.experience_years}
                          onChange={(e) => setProfileForm({ ...profileForm, experience_years: parseInt(e.target.value) || 0 })}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Education</label>
                        <Input
                          placeholder="e.g., Bachelor's in Computer Science"
                          value={profileForm.education}
                          onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <Input
                          placeholder="e.g., New York, NY"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-gray-700">Skills</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill (e.g., Python, JavaScript)"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addSkill()}
                          className="h-12"
                        />
                        <Button onClick={addSkill} className="h-12 px-6 bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profileForm.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-2">
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                        {profileForm.skills.length === 0 && (
                          <p className="text-sm text-gray-500">No skills added yet. Add some skills to get better recommendations.</p>
                        )}
                      </div>
                    </div>

                    <Button 
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {savingProfile ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    )
}
