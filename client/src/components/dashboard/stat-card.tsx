import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
}

const StatCard = ({ title, value, icon, iconBgColor, iconColor }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 bg-${iconBgColor}-100`}>
            <div className={`h-6 w-6 text-${iconColor}-600`}>{icon}</div>
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-xl font-bold text-slate-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
