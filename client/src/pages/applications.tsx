import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationWithJob } from "@shared/schema";
import ApplicationTable from "@/components/job/application-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Applications = () => {
  const [statusFilter, setStatusFilter] = useState("");
  
  const { data: applications = [], isLoading } = useQuery<ApplicationWithJob[]>({
    queryKey: ['/api/applications'],
  });
  
  // Filter applications based on status
  const filteredApplications = statusFilter && statusFilter !== "all-statuses"
    ? applications.filter(app => app.status === statusFilter)
    : applications;
  
  // Group applications by status for tabs
  const activeApplications = applications.filter(
    app => app.status !== "Rejected" && app.status !== "Accepted"
  );
  
  const offerApplications = applications.filter(
    app => app.status === "Offer" || app.status === "Accepted"
  );
  
  const rejectedApplications = applications.filter(
    app => app.status === "Rejected"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage your job applications</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-statuses">All Statuses</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Final Interview">Final Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {statusFilter && statusFilter !== "all-statuses" ? (
        <Card>
          <CardHeader>
            <CardTitle>Applications {statusFilter ? `- ${statusFilter}` : ""}</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationTable 
              applications={filteredApplications} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeApplications.length})</TabsTrigger>
            <TabsTrigger value="offers">Offers ({offerApplications.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardContent className="p-0 pt-6">
                <ApplicationTable 
                  applications={applications} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active">
            <Card>
              <CardContent className="p-0 pt-6">
                <ApplicationTable 
                  applications={activeApplications} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="offers">
            <Card>
              <CardContent className="p-0 pt-6">
                <ApplicationTable 
                  applications={offerApplications} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rejected">
            <Card>
              <CardContent className="p-0 pt-6">
                <ApplicationTable 
                  applications={rejectedApplications} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Applications;
