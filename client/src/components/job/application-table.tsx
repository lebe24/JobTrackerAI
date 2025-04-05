import { Link } from "wouter";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ApplicationWithJob } from "@shared/schema";
import StatusBadge from "./status-badge";

interface ApplicationTableProps {
  applications: ApplicationWithJob[];
  isLoading: boolean;
}

const ApplicationTable = ({ applications, isLoading }: ApplicationTableProps) => {
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-slate-500">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-slate-500">No applications found. Start applying to jobs!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applied</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {applications.map((application) => (
            <tr key={application.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <Avatar>
                      <AvatarFallback color={application.job.companyColor}>
                        {application.job.companyInitials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-slate-900">{application.job.companyName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{application.job.position}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={application.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {formatDate(application.appliedDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/jobs/${application.jobId}`}>
                  <Button variant="link" className="text-primary-600 hover:text-primary-900">
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
