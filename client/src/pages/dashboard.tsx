import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DashboardStats, ApplicationWithJob, JobWithStatus } from "@shared/schema";
import StatCard from "@/components/dashboard/stat-card";
import ApplicationTable from "@/components/job/application-table";
import AiChat from "@/components/chat/ai-chat";
import JobCard from "@/components/job/job-card";
import { Filter, Plus, CheckSquare, CheckCircle, Clock, XCircle } from "lucide-react";

const Dashboard = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard'],
  });
  
  const { data: applications = [], isLoading: isLoadingApplications } = useQuery<ApplicationWithJob[]>({
    queryKey: ['/api/applications'],
  });
  
  const { data: recommendedJobs = [], isLoading: isLoadingJobs } = useQuery<JobWithStatus[]>({
    queryKey: ['/api/jobs'],
  });
  
  // Get only the first 4 most recent applications
  const recentApplications = applications.slice(0, 4);
  
  // Get only the 3 most recent jobs for recommendations
  const topRecommendedJobs = recommendedJobs.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back. Here's your application overview.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <div className="relative">
            <Button 
              variant="outline" 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center bg-white border border-slate-300 rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Filter className="h-5 w-5 mr-2 text-slate-500" />
              Filter
            </Button>
          </div>
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Applications" 
          value={stats?.totalApplications || 0} 
          icon={<CheckSquare className="h-6 w-6" />}
          iconBgColor="blue"
          iconColor="blue"
        />
        
        <StatCard 
          title="Interview Invites" 
          value={stats?.interviewInvites || 0} 
          icon={<CheckCircle className="h-6 w-6" />}
          iconBgColor="green"
          iconColor="green"
        />
        
        <StatCard 
          title="In Progress" 
          value={stats?.inProgress || 0} 
          icon={<Clock className="h-6 w-6" />}
          iconBgColor="yellow"
          iconColor="yellow"
        />
        
        <StatCard 
          title="Rejected" 
          value={stats?.rejected || 0} 
          icon={<XCircle className="h-6 w-6" />}
          iconBgColor="red"
          iconColor="red"
        />
      </div>

      {/* Recent Applications and AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="px-5 py-4 border-b border-slate-200">
              <CardTitle className="text-lg font-medium text-slate-900">Recent Applications</CardTitle>
            </CardHeader>
            
            <ApplicationTable 
              applications={recentApplications} 
              isLoading={isLoadingApplications} 
            />
            
            <CardFooter className="px-5 py-3 border-t border-slate-200 bg-slate-50 text-right">
              <Link href="/applications">
                <Button variant="link" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  View all applications
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* AI Assistant Widget */}
        <div className="lg:col-span-1 h-[450px]">
          <AiChat />
        </div>
      </div>

      {/* Job Board Preview Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Recommended Jobs</h2>
          <Link href="/job-board">
            <Button variant="link" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoadingJobs ? (
            <p className="text-slate-500">Loading recommended jobs...</p>
          ) : (
            topRecommendedJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                companyName={job.companyName}
                companyInitials={job.companyInitials}
                companyColor={job.companyColor}
                position={job.position}
                location={job.location}
                salary={job.salary}
                postedDate={job.postedDate.toString()}
                tags={job.tags}
                status={job.status}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
