import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin, DollarSign, Building, Calendar, ArrowLeft } from "lucide-react";
import StatusBadge from "@/components/job/status-badge";
import { ApplicationStatus } from "@shared/schema";

interface JobDetail {
  id: number;
  companyName: string;
  companyInitials: string;
  companyColor: string;
  position: string;
  location: string;
  salary: string;
  jobType: string;
  description: string;
  requirements: string;
  postedDate: string;
  tags: string[];
  applicationStatus?: string;
  applicationId?: number;
}

const JobDetails = () => {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const jobId = parseInt(params.id);
  
  const { data: job, isLoading } = useQuery<JobDetail>({
    queryKey: [`/api/jobs/${jobId}`],
  });
  
  const applyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/applications", {
        jobId,
        status: "Applied",
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted",
        description: `You have successfully applied for ${job?.position} at ${job?.companyName}`,
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/jobs/${jobId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to apply",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!job?.applicationId) return;
      
      const res = await apiRequest("PATCH", `/api/applications/${job.applicationId}/status`, {
        status,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Application status has been updated successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/jobs/${jobId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update status",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });
  
  const handleApply = () => {
    applyMutation.mutate();
  };
  
  const handleStatusChange = (status: string) => {
    updateStatusMutation.mutate(status);
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-slate-500">Loading job details...</p>
        </div>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-slate-500">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card className="mb-6">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Avatar className="h-16 w-16">
                <AvatarFallback color={job.companyColor} className="text-xl">
                  {job.companyInitials}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <CardTitle className="text-2xl font-bold">{job.position}</CardTitle>
                <p className="text-slate-600">{job.companyName}</p>
              </div>
            </div>
            
            {job.applicationStatus ? (
              <div className="flex flex-col items-end space-y-2">
                <StatusBadge status={job.applicationStatus} />
                
                <Select defaultValue={job.applicationStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ApplicationStatus.Values).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <Button 
                onClick={handleApply}
                disabled={applyMutation.isPending}
              >
                {applyMutation.isPending ? "Applying..." : "Apply Now"}
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-slate-600">
              <MapPin className="h-5 w-5 mr-2 text-slate-500" />
              {job.location}
            </div>
            
            <div className="flex items-center text-slate-600">
              <DollarSign className="h-5 w-5 mr-2 text-slate-500" />
              {job.salary}
            </div>
            
            <div className="flex items-center text-slate-600">
              <Building className="h-5 w-5 mr-2 text-slate-500" />
              {job.jobType}
            </div>
            
            <div className="flex items-center text-slate-600">
              <Calendar className="h-5 w-5 mr-2 text-slate-500" />
              Posted {formatDate(job.postedDate)}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="requirements" className="mt-4">
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{job.requirements}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex justify-end">
          {job.applicationStatus ? (
            <div className="flex space-x-4">
              <Button variant="outline">Contact Recruiter</Button>
              <Button variant="outline">Withdraw Application</Button>
            </div>
          ) : (
            <Button 
              onClick={handleApply}
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? "Applying..." : "Apply for this Position"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobDetails;
