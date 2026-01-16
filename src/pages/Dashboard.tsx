import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  Receipt,
  Calendar,
  TrendingUp,
  UserPlus,
  IndianRupee,
  Activity,
  BedDouble,
} from "lucide-react";

const stats = [
  {
    title: "Total Patients",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    description: "from last month",
  },
  {
    title: "Today's Revenue",
    value: "₹45,250",
    change: "+8%",
    changeType: "positive" as const,
    icon: IndianRupee,
    description: "from yesterday",
  },
  {
    title: "Appointments Today",
    value: "48",
    change: "-2%",
    changeType: "negative" as const,
    icon: Calendar,
    description: "from yesterday",
  },
  {
    title: "Beds Occupied",
    value: "85/120",
    change: "71%",
    changeType: "neutral" as const,
    icon: BedDouble,
    description: "occupancy rate",
  },
];

const quickActions = [
  {
    title: "New Patient",
    description: "Register a new patient",
    icon: UserPlus,
    path: "/patients/new",
    color: "bg-blue-500",
  },
  {
    title: "Create Bill",
    description: "Generate patient bill",
    icon: Receipt,
    path: "/billing",
    color: "bg-green-500",
  },
  {
    title: "Book Appointment",
    description: "Schedule an appointment",
    icon: Calendar,
    path: "/appointments",
    color: "bg-purple-500",
  },
  {
    title: "View Reports",
    description: "Analytics & reports",
    icon: TrendingUp,
    path: "/reports",
    color: "bg-orange-500",
  },
];

const recentPatients = [
  { id: 1, name: "Rajesh Kumar", type: "OPD", time: "10:30 AM", status: "Checked In" },
  { id: 2, name: "Priya Sharma", type: "IPD", time: "09:45 AM", status: "Admitted" },
  { id: 3, name: "Mohammed Ali", type: "OPD", time: "09:15 AM", status: "Completed" },
  { id: 4, name: "Lakshmi Devi", type: "IPD", time: "08:30 AM", status: "Admitted" },
  { id: 5, name: "Suresh Gowda", type: "OPD", time: "08:00 AM", status: "Completed" },
];

const recentBills = [
  { id: "RMS-001234", patient: "Rajesh Kumar", amount: "₹2,500", status: "Paid" },
  { id: "RMS-001233", patient: "Priya Sharma", amount: "₹15,000", status: "Pending" },
  { id: "RMS-001232", patient: "Mohammed Ali", amount: "₹1,200", status: "Paid" },
  { id: "RMS-001231", patient: "Lakshmi Devi", amount: "₹8,500", status: "Partial" },
];

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here's what's happening at RMS Hospitals today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to="/patients/new">
              <UserPlus className="mr-2 h-4 w-4" />
              New Patient
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                      ? "text-red-600"
                      : "text-muted-foreground"
                  }
                >
                  {stat.change}
                </span>{" "}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.path}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {action.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Patients</CardTitle>
                <CardDescription>Today's patient activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/patients">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.type} • {patient.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      patient.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : patient.status === "Admitted"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bills */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Bills</CardTitle>
                <CardDescription>Latest billing activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/billing">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Receipt className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{bill.patient}</p>
                      <p className="text-xs text-muted-foreground">{bill.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{bill.amount}</p>
                    <span
                      className={`text-xs ${
                        bill.status === "Paid"
                          ? "text-green-600"
                          : bill.status === "Pending"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {bill.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue trends for the current year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Revenue chart will be displayed here</p>
              <p className="text-sm">Connect to your data source to see analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
