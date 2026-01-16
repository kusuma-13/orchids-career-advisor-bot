import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Briefcase, TrendingUp, FileText, Search, MessageSquare, BookOpen, ArrowRight, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Career Advisor</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4" />
                Powered by Advanced AI
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
                Your Personal
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Career Advisor</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Get personalized career guidance, skill gap analysis, resume optimization, and real-time job recommendations tailored to your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-14 px-8 text-lg shadow-xl shadow-blue-500/25">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-gray-300 hover:bg-gray-50">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need for Career Success</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive tools and AI-powered insights to accelerate your professional growth
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "Career Recommendations",
                  description: "Get personalized career path suggestions based on your skills, experience, and goals.",
                  color: "blue"
                },
                {
                  icon: Search,
                  title: "Skill Gap Analysis",
                  description: "Identify missing skills and get actionable recommendations to bridge the gap.",
                  color: "emerald"
                },
                {
                  icon: BookOpen,
                  title: "Course Recommendations",
                  description: "Discover curated courses from top platforms to enhance your skillset.",
                  color: "violet"
                },
                {
                  icon: FileText,
                  title: "Resume Analysis",
                  description: "ATS-optimized resume review with detailed suggestions for improvement.",
                  color: "amber"
                },
                {
                  icon: Briefcase,
                  title: "Real-Time Job Search",
                  description: "Access thousands of job listings from top companies worldwide.",
                  color: "rose"
                },
                {
                  icon: MessageSquare,
                  title: "AI Career Chat",
                  description: "Get instant answers to your career questions from our AI advisor.",
                  color: "cyan"
                }
              ].map((feature, index) => (
                <div key={index} className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                  <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Why Choose Career Advisor?</h2>
                <p className="text-blue-100 text-lg mb-8">
                  Join thousands of professionals who have transformed their careers with our AI-powered platform.
                </p>
                <ul className="space-y-4">
                  {[
                    "Personalized recommendations based on your unique profile",
                    "Real-time job market insights and opportunities",
                    "AI-powered resume optimization for ATS compatibility",
                    "Comprehensive skill gap analysis with learning paths",
                    "24/7 AI career advisor at your fingertips"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-blue-200 flex-shrink-0 mt-0.5" />
                      <span className="text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">10,000+</div>
                  <div className="text-blue-200 mb-8">Career Paths Analyzed</div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-3xl font-bold text-white">95%</div>
                      <div className="text-blue-200 text-sm">Success Rate</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">500+</div>
                      <div className="text-blue-200 text-sm">Companies Hiring</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Career?</h2>
            <p className="text-lg text-gray-600 mb-10">
              Join Career Advisor today and take the first step towards your dream job.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-14 px-10 text-lg shadow-xl shadow-blue-500/25">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">Career Advisor</span>
            </div>
            <p className="text-sm">© 2026 Career Advisor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
