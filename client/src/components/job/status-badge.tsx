import { getStatusColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const color = getStatusColor(status);
  
  return (
    <Badge 
      variant="outline" 
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${color}-100 text-${color}-800`}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
