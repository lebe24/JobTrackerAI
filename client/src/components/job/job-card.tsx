import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { MoreVertical, MapPin, DollarSign } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import StatusBadge from "./status-badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface JobCardProps {
  id: number;
  companyName: string;
  companyInitials: string;
  companyColor: string;
  position: string;
  location: string;
  salary: string;
  postedDate: string;
  tags: string[];
  status?: string;
}

const JobCard = ({
  id,
  companyName,
  companyInitials,
  companyColor,
  position,
  location,
  salary,
  postedDate,
  tags,
  status,
}: JobCardProps) => {
  const { toast } = useToast();
  
  const applyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/applications", {
        jobId: id,
        status: "Applied",
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted",
        description: `You have successfully applied for ${position} at ${companyName}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
    onError: (error) => {
      // Check if it's already applied error
      if (error instanceof Error && error.message.includes("already applied")) {
        toast({
          title: "Already applied",
          description: "You have already applied to this job",
        });
      } else {
        toast({
          title: "Failed to apply",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      }
    },
  });
  
  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    applyMutation.mutate();
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Avatar>
              <AvatarFallback color={companyColor}>
                {companyInitials}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-slate-900">{position}</h3>
              <p className="text-sm text-slate-500">{companyName}</p>
            </div>
          </div>
          <div className="tooltip">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-500">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/jobs/${id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleApply} disabled={!!status || applyMutation.isPending}>
                  {status ? "Already Applied" : "Quick Apply"}
                </DropdownMenuItem>
                <DropdownMenuItem>Save Job</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="mt-4 flex items-center text-sm text-slate-500">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>
        
        <div className="mt-1 flex items-center text-sm text-slate-500">
          <DollarSign className="h-4 w-4 mr-1" />
          {salary}
        </div>
        
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className={`bg-${companyColor}-100 text-${companyColor}-800`}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
        <span className="text-xs text-slate-500">Posted {formatDate(postedDate)}</span>
        
        {status ? (
          <StatusBadge status={status} />
        ) : (
          <Button
            size="sm"
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={handleApply}
            disabled={applyMutation.isPending}
          >
            {applyMutation.isPending ? "Applying..." : "Apply Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
