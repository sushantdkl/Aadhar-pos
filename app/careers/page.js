"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MapPin, Briefcase, Clock, Users, ArrowRight, Search } from "lucide-react"
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Navbar from "@/components/marketing/navbar"
import Footer from "@/components/marketing/footer"

export default function CareersPage() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [searchTerm, selectedType, selectedLocation, jobs])

  const fetchJobs = async () => {
    try {
      const jobsRef = collection(db, "job_postings")
      const q = query(
        jobsRef,
        where("status", "==", "active"),
        orderBy("postedAt", "desc")
      )
      const snapshot = await getDocs(q)
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        postedAt: doc.data().postedAt?.toDate()
      }))
      setJobs(jobsData)
      setFilteredJobs(jobsData)
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterJobs = () => {
    let filtered = jobs

    if (selectedType !== "all") {
      filtered = filtered.filter(job => job.type === selectedType)
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(job => job.location === selectedLocation)
    }

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredJobs(filtered)
  }

  const jobTypes = ["all", "full-time", "part-time", "contract", "internship"]
  const locations = [...new Set(jobs.map(job => job.location))]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 py-16 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl">
            Build the future of retail technology with us. Explore open positions and grow your career at Aadhar.
          </p>
        </div>
      </div>

      {/* Why Join Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Great Team</h3>
            <p className="text-gray-600 dark:text-slate-400">Work with talented individuals passionate about technology</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Growth Opportunities</h3>
            <p className="text-gray-600 dark:text-slate-400">Continuous learning and career advancement</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Flexible Work</h3>
            <p className="text-gray-600 dark:text-slate-400">Hybrid work options and work-life balance</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Job Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              {jobTypes.map(type => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            {locations.length > 0 && (
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-slate-400 text-lg">
              {searchTerm || selectedType !== "all" || selectedLocation !== "all"
                ? "No positions found matching your criteria"
                : "No open positions at the moment. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {job.title}
            </h3>
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full">
              {job.type}
            </span>
          </div>

          <p className="text-gray-600 dark:text-slate-400 mb-4">
            {job.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-slate-500 mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>{job.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Posted {job.postedAt?.toLocaleDateString()}</span>
            </div>
          </div>

          {expanded && job.requirements && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements:</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-slate-400 space-y-1">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>

              {job.responsibilities && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Responsibilities:</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-slate-400 space-y-1">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.benefits && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Benefits:</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-slate-400 space-y-1">
                    {job.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex md:flex-col gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            {expanded ? "Show Less" : "View Details"}
          </button>
          <a
            href={`mailto:careers@aadhar.com.np?subject=Application for ${job.title}`}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2 justify-center whitespace-nowrap"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
