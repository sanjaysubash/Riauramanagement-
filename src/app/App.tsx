import { useState, useRef, useEffect, useCallback, createContext, useContext } from "react";
import {
  LayoutDashboard, Users, Building2, Network, FolderKanban, CheckSquare,
  Calendar, Clock, PlaneTakeoff, DollarSign, Award, Target, BarChart3,
  FileBarChart, BookOpen, FileText, MessageSquare, Bell, Video, Bot,
  Sparkles, Settings, ShieldCheck, Key, CreditCard, LogOut, User,
  Search, Plus, Filter, Grid3X3, List, MoreHorizontal, ChevronDown,
  ChevronRight, ArrowUp, ArrowDown, ArrowUpRight, Star, Zap, AlertCircle,
  CheckCircle2, XCircle, TrendingUp, TrendingDown, Send, Paperclip,
  Smile, Hash, Menu, X, Eye, Edit2, Trash2, Download, RefreshCw,
  GripVertical, Play, Phone, Mail, MapPin, Globe, Activity, SlidersHorizontal,
  Mic, Code, Layers, Sun, Moon, ChevronLeft, Tag, Info, Copy, Lock, Upload
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────

type ThemeMode = "dark" | "light";

interface ThemeCtxType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  light: boolean;
  c: (dark: string, light: string) => string;
}

const ThemeCtx = createContext<ThemeCtxType>({
  theme: "dark", setTheme: () => {}, light: false, c: (d) => d,
});

const useTheme = () => useContext(ThemeCtx);

// ─── APP CONTEXT ──────────────────────────────────────────────────────────────

const AppCtx = createContext<{ selectedEmployeeId: number; setSelectedEmployeeId: (id: number) => void; navigateTo: (p: Page) => void }>({
  selectedEmployeeId: 1, setSelectedEmployeeId: () => {}, navigateTo: () => {},
});
const useApp = () => useContext(AppCtx);

const DARK = {
  bg: "#0F172A", topbar: "#0B1020", sidebar: "#0B1020",
  tooltipBg: "#1E293B", tooltipBorder: "rgba(255,255,255,0.1)",
  tooltipText: "#F1F5F9", tooltipLabel: "#94A3B8",
  chartGrid: "rgba(255,255,255,0.04)", tickColor: "#64748B",
};
const LIGHT = {
  bg: "#F8FAFC", topbar: "#FFFFFF", sidebar: "#0B1020",
  tooltipBg: "#FFFFFF", tooltipBorder: "#E2E8F0",
  tooltipText: "#1E293B", tooltipLabel: "#64748B",
  chartGrid: "rgba(0,0,0,0.04)", tickColor: "#94A3B8",
};

// ─── AUTH TYPES ──────────────────────────────────────────────────────────────

type UserRole = "super-admin" | "1st-level-manager" | "2nd-level-manager" | "manager" | "team-lead" | "hr-admin" | "employee";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  avatarColor: string;
  role: UserRole;
  roleLabel: string;
  dept: string;
  title: string;
  password: string;
  permissions: string[];
}

const demoAccounts: AuthUser[] = [
  { id: 0, name: "Sanjay ", email: "sanjay.@riaura.com", avatar: "SJ", avatarColor: "bg-indigo-600", role: "super-admin", roleLabel: "Super Admin", dept: "Executive", title: "Chief Executive Officer", password: "Admin@2026", permissions: ["*"] },
  { id: 10, name: "Ryan O'Brien", email: "ryan.o@riaura.com", avatar: "RO", avatarColor: "bg-lime-600", role: "1st-level-manager", roleLabel: "1st Level Manager", dept: "Sales", title: "Sales Director", password: "Director@2026", permissions: ["dashboard","employees","teams","projects","tasks","attendance","leave","payroll","performance","kpi","okr","analytics","reports","settings","my-work","employee-profile"] },
  { id: 2, name: "Marcus Johnson", email: "marcus.j@riaura.com", avatar: "MJ", avatarColor: "bg-emerald-500", role: "2nd-level-manager", roleLabel: "2nd Level Manager", dept: "Product", title: "Product Manager", password: "SrMgr@2026", permissions: ["dashboard","employees","teams","projects","tasks","attendance","leave","performance","kpi","okr","analytics","reports","my-work","employee-profile"] },
  { id: 1, name: "Sarah Chen", email: "sarah.chen@riaura.com", avatar: "SC", avatarColor: "bg-indigo-500", role: "manager", roleLabel: "Manager", dept: "Engineering", title: "Engineering Manager", password: "Manager@2026", permissions: ["dashboard","employees","teams","projects","tasks","attendance","leave","performance","my-work","employee-profile","chat","ai-assistant","knowledge"] },
  { id: 6, name: "James Wilson", email: "james.w@riaura.com", avatar: "JW", avatarColor: "bg-cyan-500", role: "team-lead", roleLabel: "Team Lead", dept: "Engineering", title: "DevOps Team Lead", password: "TLead@2026", permissions: ["dashboard","projects","tasks","attendance","leave","my-work","employee-profile","chat","ai-assistant","knowledge","calendar","meetings"] },
  { id: 7, name: "Elena Rodriguez", email: "elena.r@riaura.com", avatar: "ER", avatarColor: "bg-pink-500", role: "hr-admin", roleLabel: "HR Admin", dept: "HR", title: "HR Manager", password: "HRAdmin@2026", permissions: ["dashboard","employees","departments","teams","attendance","leave","payroll","performance","my-work","employee-profile","settings","roles","audit","reports","knowledge"] },
  { id: 4, name: "David Kim", email: "david.kim@riaura.com", avatar: "DK", avatarColor: "bg-amber-500", role: "employee", roleLabel: "Employee", dept: "Analytics", title: "Data Scientist", password: "Emp@2026", permissions: ["dashboard","my-work","tasks","attendance","leave","calendar","meetings","chat","ai-assistant","knowledge","profile"] },
];

const AuthCtx = createContext<{
  authUser: AuthUser | null;
  login: (u: AuthUser) => void;
  logout: () => void;
}>({ authUser: null, login: () => {}, logout: () => {} });
const useAuth = () => useContext(AuthCtx);

// ─── MODAL CONTEXT ────────────────────────────────────────────────────────────

type ModalName =
  | "add-employee" | "add-department" | "create-team" | "create-project"
  | "create-task" | "create-event" | "schedule-meeting" | "apply-leave"
  | "start-review-cycle" | null;

const ModalCtx = createContext<{
  openModal: (n: ModalName, data?: any) => void;
  closeModal: () => void;
  activeModal: ModalName;
  modalData: any;
}>({ openModal: () => {}, closeModal: () => {}, activeModal: null, modalData: null });
const useModal = () => useContext(ModalCtx);

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Page =
  | "dashboard" | "employees" | "departments" | "teams"
  | "projects" | "tasks" | "calendar" | "attendance" | "leave"
  | "payroll" | "performance" | "kpi" | "okr" | "analytics"
  | "reports" | "knowledge" | "chat" | "ai-assistant" | "settings"
  | "notifications" | "meetings" | "roles" | "audit" | "billing" | "profile"
  | "employee-profile" | "my-work" | "eod" | "payroll-expenses";

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────

const employees = [
  { id: 1, name: "Sarah Chen", role: "Senior Engineer", dept: "Engineering", email: "sarah.chen@riaura.com", phone: "+1 (555) 001-0001", location: "San Francisco", status: "active", avatar: "SC", avatarColor: "bg-indigo-500", joined: "Jan 12, 2021", salary: 145000, attendance: 98 },
  { id: 2, name: "Marcus Johnson", role: "Product Manager", dept: "Product", email: "marcus.j@riaura.com", phone: "+1 (555) 001-0002", location: "New York", status: "active", avatar: "MJ", avatarColor: "bg-emerald-500", joined: "Mar 5, 2020", salary: 135000, attendance: 96 },
  { id: 3, name: "Priya Sharma", role: "UX Designer", dept: "Design", email: "priya.s@riaura.com", phone: "+1 (555) 001-0003", location: "Austin", status: "active", avatar: "PS", avatarColor: "bg-violet-500", joined: "Jun 20, 2022", salary: 120000, attendance: 97 },
  { id: 4, name: "David Kim", role: "Data Scientist", dept: "Analytics", email: "david.kim@riaura.com", phone: "+1 (555) 001-0004", location: "Seattle", status: "active", avatar: "DK", avatarColor: "bg-amber-500", joined: "Sep 14, 2021", salary: 140000, attendance: 95 },
  { id: 5, name: "Aisha Patel", role: "Marketing Lead", dept: "Marketing", email: "aisha.p@riaura.com", phone: "+1 (555) 001-0005", location: "Chicago", status: "on-leave", avatar: "AP", avatarColor: "bg-rose-500", joined: "Feb 28, 2020", salary: 115000, attendance: 88 },
  { id: 6, name: "James Wilson", role: "DevOps Engineer", dept: "Engineering", email: "james.w@riaura.com", phone: "+1 (555) 001-0006", location: "Boston", status: "active", avatar: "JW", avatarColor: "bg-cyan-500", joined: "Nov 3, 2022", salary: 138000, attendance: 99 },
  { id: 7, name: "Elena Rodriguez", role: "HR Manager", dept: "HR", email: "elena.r@riaura.com", phone: "+1 (555) 001-0007", location: "Miami", status: "active", avatar: "ER", avatarColor: "bg-pink-500", joined: "Apr 17, 2019", salary: 112000, attendance: 94 },
  { id: 8, name: "Tom Nakamura", role: "Backend Engineer", dept: "Engineering", email: "tom.n@riaura.com", phone: "+1 (555) 001-0008", location: "Denver", status: "active", avatar: "TN", avatarColor: "bg-teal-500", joined: "Aug 22, 2021", salary: 142000, attendance: 97 },
  { id: 9, name: "Grace Liu", role: "Finance Analyst", dept: "Finance", email: "grace.l@riaura.com", phone: "+1 (555) 001-0009", location: "San Jose", status: "active", avatar: "GL", avatarColor: "bg-orange-500", joined: "May 9, 2020", salary: 118000, attendance: 96 },
  { id: 10, name: "Ryan O'Brien", role: "Sales Director", dept: "Sales", email: "ryan.o@riaura.com", phone: "+1 (555) 001-0010", location: "Dallas", status: "inactive", avatar: "RO", avatarColor: "bg-lime-600", joined: "Jan 30, 2018", salary: 155000, attendance: 72 },
  { id: 11, name: "Nina Kowalski", role: "QA Engineer", dept: "Engineering", email: "nina.k@riaura.com", phone: "+1 (555) 001-0011", location: "Portland", status: "active", avatar: "NK", avatarColor: "bg-sky-500", joined: "Jul 11, 2022", salary: 115000, attendance: 98 },
  { id: 12, name: "Omar Hassan", role: "Security Engineer", dept: "Engineering", email: "omar.h@riaura.com", phone: "+1 (555) 001-0012", location: "Atlanta", status: "active", avatar: "OH", avatarColor: "bg-fuchsia-500", joined: "Oct 25, 2021", salary: 148000, attendance: 97 },
];

const departments = [
  { id: 1, name: "Engineering", head: "James Wilson", employees: 342, projects: 18, budget: 4200000, utilization: 87, color: "bg-indigo-500" },
  { id: 2, name: "Product", head: "Marcus Johnson", employees: 56, projects: 12, budget: 1800000, utilization: 92, color: "bg-emerald-500" },
  { id: 3, name: "Design", head: "Priya Sharma", employees: 38, projects: 8, budget: 950000, utilization: 78, color: "bg-violet-500" },
  { id: 4, name: "Analytics", head: "David Kim", employees: 45, projects: 6, budget: 1200000, utilization: 84, color: "bg-amber-500" },
  { id: 5, name: "Marketing", head: "Aisha Patel", employees: 62, projects: 14, budget: 2100000, utilization: 76, color: "bg-rose-500" },
  { id: 6, name: "HR", head: "Elena Rodriguez", employees: 28, projects: 3, budget: 680000, utilization: 65, color: "bg-pink-500" },
  { id: 7, name: "Finance", head: "Grace Liu", employees: 31, projects: 4, budget: 890000, utilization: 71, color: "bg-orange-500" },
  { id: 8, name: "Sales", head: "Ryan O'Brien", employees: 94, projects: 9, budget: 3100000, utilization: 89, color: "bg-lime-600" },
];

const projects = [
  { id: 1, name: "Riaura Platform v3.0", status: "in-progress", priority: "critical", progress: 68, team: 12, deadline: "Aug 15, 2026", budget: 850000, spent: 578000, manager: "Marcus Johnson", tasks: 124, completed: 84 },
  { id: 2, name: "Mobile App Redesign", status: "in-progress", priority: "high", progress: 42, team: 6, deadline: "Sep 30, 2026", budget: 320000, spent: 134400, manager: "Priya Sharma", tasks: 67, completed: 28 },
  { id: 3, name: "AI Analytics Engine", status: "planning", priority: "high", progress: 15, team: 8, deadline: "Dec 1, 2026", budget: 1200000, spent: 180000, manager: "David Kim", tasks: 89, completed: 13 },
  { id: 4, name: "Security Audit 2026", status: "review", priority: "critical", progress: 91, team: 4, deadline: "Jul 10, 2026", budget: 150000, spent: 136500, manager: "Omar Hassan", tasks: 32, completed: 29 },
  { id: 5, name: "Customer Portal 2.0", status: "completed", priority: "medium", progress: 100, team: 9, deadline: "Jun 1, 2026", budget: 540000, spent: 521000, manager: "Sarah Chen", tasks: 98, completed: 98 },
  { id: 6, name: "Data Warehouse Migration", status: "in-progress", priority: "high", progress: 54, team: 5, deadline: "Oct 15, 2026", budget: 670000, spent: 361800, manager: "Tom Nakamura", tasks: 56, completed: 30 },
  { id: 7, name: "Brand Identity Refresh", status: "planning", priority: "low", progress: 8, team: 3, deadline: "Nov 20, 2026", budget: 180000, spent: 14400, manager: "Priya Sharma", tasks: 24, completed: 2 },
  { id: 8, name: "Sales CRM Integration", status: "in-progress", priority: "high", progress: 77, team: 7, deadline: "Jul 25, 2026", budget: 290000, spent: 223300, manager: "Ryan O'Brien", tasks: 43, completed: 33 },
];

const tasks = [
  { id: 1, title: "Implement OAuth2 authentication flow", project: "Riaura Platform v3.0", assignee: "Sarah Chen", assigneeAvatar: "SC", assigneeColor: "bg-indigo-500", priority: "high", status: "in-progress", due: "Jul 5, 2026", tags: ["backend", "security"] },
  { id: 2, title: "Design new onboarding screens", project: "Mobile App Redesign", assignee: "Priya Sharma", assigneeAvatar: "PS", assigneeColor: "bg-violet-500", priority: "medium", status: "todo", due: "Jul 12, 2026", tags: ["design", "mobile"] },
  { id: 3, title: "Set up CI/CD pipeline for staging", project: "Riaura Platform v3.0", assignee: "James Wilson", assigneeAvatar: "JW", assigneeColor: "bg-cyan-500", priority: "critical", status: "todo", due: "Jul 3, 2026", tags: ["devops"] },
  { id: 4, title: "Write unit tests for payment module", project: "Riaura Platform v3.0", assignee: "Nina Kowalski", assigneeAvatar: "NK", assigneeColor: "bg-sky-500", priority: "high", status: "in-progress", due: "Jul 8, 2026", tags: ["testing"] },
  { id: 5, title: "Migrate legacy database schemas", project: "Data Warehouse Migration", assignee: "Tom Nakamura", assigneeAvatar: "TN", assigneeColor: "bg-teal-500", priority: "high", status: "todo", due: "Jul 20, 2026", tags: ["database"] },
  { id: 6, title: "Conduct penetration testing", project: "Security Audit 2026", assignee: "Omar Hassan", assigneeAvatar: "OH", assigneeColor: "bg-fuchsia-500", priority: "critical", status: "review", due: "Jul 7, 2026", tags: ["security"] },
  { id: 7, title: "Create API documentation", project: "Riaura Platform v3.0", assignee: "Sarah Chen", assigneeAvatar: "SC", assigneeColor: "bg-indigo-500", priority: "low", status: "done", due: "Jun 28, 2026", tags: ["docs"] },
  { id: 8, title: "Analyze user retention metrics", project: "AI Analytics Engine", assignee: "David Kim", assigneeAvatar: "DK", assigneeColor: "bg-amber-500", priority: "medium", status: "in-progress", due: "Jul 15, 2026", tags: ["analytics"] },
  { id: 9, title: "Build predictive churn model", project: "AI Analytics Engine", assignee: "David Kim", assigneeAvatar: "DK", assigneeColor: "bg-amber-500", priority: "high", status: "todo", due: "Aug 1, 2026", tags: ["ml"] },
  { id: 10, title: "Update brand color system", project: "Brand Identity Refresh", assignee: "Priya Sharma", assigneeAvatar: "PS", assigneeColor: "bg-violet-500", priority: "low", status: "done", due: "Jun 25, 2026", tags: ["design"] },
  { id: 11, title: "Integrate Salesforce CRM API", project: "Sales CRM Integration", assignee: "Ryan O'Brien", assigneeAvatar: "RO", assigneeColor: "bg-lime-600", priority: "high", status: "in-progress", due: "Jul 18, 2026", tags: ["integration"] },
  { id: 12, title: "Performance audit & optimization", project: "Riaura Platform v3.0", assignee: "James Wilson", assigneeAvatar: "JW", assigneeColor: "bg-cyan-500", priority: "medium", status: "review", due: "Jul 10, 2026", tags: ["performance"] },
];

const chatChannels = [
  { id: 1, name: "general", unread: 3 },
  { id: 2, name: "engineering", unread: 12 },
  { id: 3, name: "product-updates", unread: 0 },
  { id: 4, name: "design-system", unread: 5 },
  { id: 5, name: "ops-alerts", unread: 0 },
  { id: 6, name: "random", unread: 8 },
];

const chatMessages = [
  { id: 1, user: "Marcus Johnson", avatar: "MJ", color: "bg-emerald-500", time: "9:02 AM", text: "Morning team! Quick reminder: platform v3 sync at 2 PM today. Come prepared with sprint status updates.", reactions: [{ emoji: "👍", count: 8 }, { emoji: "✅", count: 4 }] },
  { id: 2, user: "Sarah Chen", avatar: "SC", color: "bg-indigo-500", time: "9:14 AM", text: "On it — auth module at 68% completion. Should hit the milestone by end of next week.", reactions: [{ emoji: "🚀", count: 3 }] },
  { id: 3, user: "James Wilson", avatar: "JW", color: "bg-cyan-500", time: "9:21 AM", text: "Staging CI/CD pipeline almost ready. Running final smoke tests. Green by noon.", reactions: [{ emoji: "🎉", count: 6 }, { emoji: "👏", count: 2 }] },
  { id: 4, user: "Priya Sharma", avatar: "PS", color: "bg-violet-500", time: "10:03 AM", text: "Shared onboarding wireframes in #design-system. Would love feedback before moving to hi-fi!", reactions: [] },
  { id: 5, user: "David Kim", avatar: "DK", color: "bg-amber-500", time: "10:47 AM", text: "Analytics showing a 23% spike in API errors since yesterday's deploy. @James can you check the logs?", reactions: [{ emoji: "👀", count: 2 }] },
  { id: 6, user: "James Wilson", avatar: "JW", color: "bg-cyan-500", time: "10:52 AM", text: "On it! Rate limiting issue on the new endpoint. Pushing a hotfix now.", reactions: [{ emoji: "💪", count: 4 }] },
];

const aiInitMessages = [
  { role: "assistant", text: "Hello! I'm your RIAURA AI Assistant. I have full access to your organization's data, projects, HR records, and analytics. How can I help you today?" },
];

const areaChartData = [
  { month: "Jan", employees: 1180, revenue: 820 },
  { month: "Feb", employees: 1195, revenue: 890 },
  { month: "Mar", employees: 1210, revenue: 940 },
  { month: "Apr", employees: 1220, revenue: 870 },
  { month: "May", employees: 1234, revenue: 1020 },
  { month: "Jun", employees: 1248, revenue: 1120 },
];

const barChartData = [
  { dept: "Eng", target: 95, actual: 87 },
  { dept: "Product", target: 90, actual: 92 },
  { dept: "Design", target: 85, actual: 78 },
  { dept: "Analytics", target: 88, actual: 84 },
  { dept: "Marketing", target: 80, actual: 76 },
  { dept: "Sales", target: 92, actual: 89 },
];

const projectStatusData = [
  { name: "Completed", value: 18, color: "#22C55E" },
  { name: "In Progress", value: 12, color: "#4F46E5" },
  { name: "At Risk", value: 7, color: "#F59E0B" },
  { name: "On Hold", value: 5, color: "#EF4444" },
];

const kpiLineData = [
  { month: "Q1", engineering: 87, product: 92, design: 78, sales: 85 },
  { month: "Q2", engineering: 91, product: 88, design: 82, sales: 89 },
  { month: "Q3", engineering: 89, product: 94, design: 86, sales: 91 },
  { month: "Q4", engineering: 94, product: 97, design: 90, sales: 93 },
];

const attendanceData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1, present: Math.random() > 0.15, late: Math.random() > 0.85,
}));

const payrollData = [
  { month: "Jan", gross: 4820000, net: 3780000 },
  { month: "Feb", gross: 4820000, net: 3790000 },
  { month: "Mar", gross: 4950000, net: 3880000 },
  { month: "Apr", gross: 4950000, net: 3860000 },
  { month: "May", gross: 5100000, net: 3990000 },
  { month: "Jun", gross: 5100000, net: 4010000 },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: "default"|"success"|"warning"|"danger"|"info"|"purple"; className?: string }) {
  const variants = {
    default: "bg-slate-500/20 text-slate-400 border border-slate-500/20",
    success: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/25",
    warning: "bg-amber-500/15 text-amber-500 border border-amber-500/25",
    danger: "bg-red-500/15 text-red-500 border border-red-500/25",
    info: "bg-indigo-500/15 text-indigo-500 border border-indigo-500/25",
    purple: "bg-violet-500/15 text-violet-500 border border-violet-500/25",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${variants[variant]} ${className}`}>{children}</span>;
}

function Avatar({ initials, color = "bg-indigo-500", size = "md" }: { initials: string; color?: string; size?: "sm"|"md"|"lg"|"xl" }) {
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-11 h-11 text-sm", xl: "w-14 h-14 text-base" };
  return <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}>{initials}</div>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { c } = useTheme();
  return <div className={`${c("bg-slate-800/60 border-white/[0.06]","bg-white border-slate-200")} border rounded-xl ${className}`}>{children}</div>;
}

function StatCard({ label, value, change, changeLabel, icon: Icon, iconColor, trend }: { label: string; value: string; change?: string; changeLabel?: string; icon: React.ElementType; iconColor: string; trend?: "up"|"down" }) {
  const { c } = useTheme();
  return (
    <div className={`${c("bg-slate-800/60 border-white/[0.06] hover:border-white/10","bg-white border-slate-200 hover:border-slate-300")} border rounded-xl p-5 flex flex-col gap-3 transition-colors`}>
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-semibold tracking-wide uppercase ${c("text-slate-400","text-slate-500")}`}>{label}</span>
        <div className={`w-8 h-8 rounded-lg ${iconColor} flex items-center justify-center`}><Icon size={15} className="text-white" /></div>
      </div>
      <div>
        <div className={`text-2xl font-bold ${c("text-white","text-slate-900")}`}>{value}</div>
        {change && (
          <div className={`flex items-center gap-1 mt-1 text-xs ${trend==="up"?"text-emerald-500":"text-red-500"}`}>
            {trend==="up"?<ArrowUp size={12}/>:<ArrowDown size={12}/>}
            <span className="font-medium">{change}</span>
            {changeLabel && <span className={c("text-slate-500","text-slate-400")}>{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const m: Record<string,{variant:any;label:string}> = {
    critical:{variant:"danger",label:"Critical"},high:{variant:"warning",label:"High"},medium:{variant:"info",label:"Medium"},low:{variant:"default",label:"Low"},
  };
  const p = m[priority]||m.low;
  return <Badge variant={p.variant}>{p.label}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  const m: Record<string,{variant:any;label:string}> = {
    active:{variant:"success",label:"Active"},"on-leave":{variant:"warning",label:"On Leave"},inactive:{variant:"danger",label:"Inactive"},
    "in-progress":{variant:"info",label:"In Progress"},planning:{variant:"purple",label:"Planning"},review:{variant:"warning",label:"In Review"},
    completed:{variant:"success",label:"Completed"},todo:{variant:"default",label:"To Do"},done:{variant:"success",label:"Done"},
    approved:{variant:"success",label:"Approved"},"on-track":{variant:"success",label:"On Track"},"at-risk":{variant:"warning",label:"At Risk"},
    recurring:{variant:"success",label:"Recurring"},upcoming:{variant:"info",label:"Upcoming"},
  };
  const s = m[status]||{variant:"default",label:status};
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

function ProgressBar({ value, color="bg-indigo-500" }: { value: number; color?: string }) {
  const { c } = useTheme();
  return (
    <div className={`w-full h-1.5 ${c("bg-slate-700","bg-slate-200")} rounded-full overflow-hidden`}>
      <div className={`h-full ${color} rounded-full`} style={{ width:`${Math.min(value,100)}%` }}/>
    </div>
  );
}

function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 className={`text-xl font-semibold ${c("text-white","text-slate-900")}`}>{title}</h1>
        {subtitle && <p className={`text-sm mt-0.5 ${c("text-slate-400","text-slate-500")}`}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

function Btn({ children, variant="primary", size="md", onClick, icon: Icon, className="" }: { children?: React.ReactNode; variant?: "primary"|"secondary"|"ghost"|"danger"; size?: "sm"|"md"; onClick?: ()=>void; icon?: React.ElementType; className?: string }) {
  const { c } = useTheme();
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
    secondary: c("bg-slate-700 hover:bg-slate-600 text-slate-200 border border-white/[0.08]","bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"),
    ghost: c("hover:bg-slate-700/60 text-slate-300","hover:bg-slate-100 text-slate-600"),
    danger: "bg-red-600 hover:bg-red-500 text-white",
  };
  const sizes = { sm:"px-3 py-1.5 text-xs gap-1.5", md:"px-4 py-2 text-sm gap-2" };
  return (
    <button onClick={onClick} className={`inline-flex items-center font-medium rounded-lg transition-colors ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon size={size==="sm"?13:15}/>}
      {children}
    </button>
  );
}

function ChartTip({ active, payload, label, light }: any) {
  if (!active||!payload?.length) return null;
  const col = light?LIGHT:DARK;
  return (
    <div style={{ background:col.tooltipBg, border:`1px solid ${col.tooltipBorder}` }} className="rounded-xl p-3 shadow-xl">
      <p style={{ color:col.tooltipLabel }} className="text-xs mb-2">{label}</p>
      {payload.map((p:any,i:number) => <p key={i} className="text-sm font-semibold" style={{ color:p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

const navGroups = [
  { label:"Overview", items:[{id:"dashboard",label:"Dashboard",icon:LayoutDashboard},{id:"my-work",label:"My Work",icon:User}] },
  { label:"Organization", items:[{id:"employees",label:"Employees",icon:Users},{id:"departments",label:"Departments",icon:Building2},{id:"teams",label:"Teams",icon:Network}] },
  { label:"Work", items:[{id:"projects",label:"Projects",icon:FolderKanban},{id:"tasks",label:"Tasks",icon:CheckSquare},{id:"calendar",label:"Calendar",icon:Calendar},{id:"meetings",label:"Meetings",icon:Video}] },
  { label:"HR", items:[{id:"attendance",label:"Attendance",icon:Clock},{id:"leave",label:"Leave",icon:PlaneTakeoff},{id:"payroll",label:"Payroll",icon:DollarSign},{id:"payroll-expenses",label:"Expenses",icon:BarChart3},{id:"performance",label:"Performance",icon:Award}] },
  { label:"Analytics", items:[{id:"kpi",label:"KPI",icon:Target},{id:"okr",label:"OKR",icon:Zap},{id:"analytics",label:"Analytics",icon:BarChart3},{id:"reports",label:"Reports",icon:FileBarChart}] },
  { label:"Workspace", items:[{id:"knowledge",label:"Knowledge Base",icon:BookOpen},{id:"chat",label:"Chat",icon:MessageSquare,badge:20},{id:"notifications",label:"Notifications",icon:Bell,badge:5},{id:"ai-assistant",label:"AI Assistant",icon:Bot},{id:"eod",label:"EOD Report",icon:FileText}] },
  { label:"Admin", items:[{id:"settings",label:"Settings",icon:Settings},{id:"roles",label:"Roles & Permissions",icon:ShieldCheck},{id:"audit",label:"Audit Logs",icon:Activity},{id:"billing",label:"Billing",icon:CreditCard}] },
];

function Sidebar({ activePage, onNavigate, collapsed, onToggle }: { activePage: Page; onNavigate:(p:Page)=>void; collapsed:boolean; onToggle:()=>void }) {
  const { authUser, logout } = useAuth();
  const perms = authUser?.permissions || ["*"];
  const hasAccess = (id: string) => perms.includes("*") || perms.includes(id);
  return (
    <aside className={`flex flex-col h-full flex-shrink-0 transition-all duration-300 ${collapsed?"w-16":"w-60"}`}
      style={{ background:DARK.sidebar, borderRight:"1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0"><Layers size={16} className="text-white"/></div>
        {!collapsed && <span className="text-base font-bold text-white tracking-tight">RIAURA</span>}
        <button onClick={onToggle} className={`text-slate-500 hover:text-slate-300 transition-colors ${collapsed?"mx-auto":"ml-auto"}`}><Menu size={16}/></button>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map(group => {
          const visibleItems = group.items.filter(item => hasAccess(item.id));
          if (!visibleItems.length) return null;
          return (
            <div key={group.label}>
              {!collapsed && <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-1">{group.label}</p>}
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const Icon = item.icon; const isActive = activePage===item.id;
                  return (
                    <button key={item.id} onClick={()=>onNavigate(item.id as Page)}
                      className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors group relative ${isActive?"bg-indigo-600/20 text-indigo-400":"text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"} ${collapsed?"justify-center":""}`}>
                      <Icon size={16} className={`flex-shrink-0 ${isActive?"text-indigo-400":"text-slate-500 group-hover:text-slate-300"}`}/>
                      {!collapsed && <span className="flex-1 text-left font-medium">{item.label}</span>}
                      {!collapsed && (item as any).badge && <span className="text-[10px] bg-indigo-600 text-white rounded-full px-1.5 py-0.5 font-semibold">{(item as any).badge}</span>}
                      {isActive && !collapsed && <div className="w-1 h-1 rounded-full bg-indigo-400 absolute right-2.5"/>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="px-3 py-3 border-t border-white/[0.06]">
        {!collapsed && authUser && (
          <div className="px-2 pb-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500`} />
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${roleConfig[authUser.role].bg} ${roleConfig[authUser.role].color}`}>{authUser.roleLabel}</span>
            </div>
          </div>
        )}
        <button onClick={logout} className={`w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.04] transition-colors ${collapsed?"justify-center":""}`}>
          <div className={`w-7 h-7 rounded-full ${authUser?.avatarColor||"bg-indigo-600"} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>{authUser?.avatar||"SJ"}</div>
          {!collapsed && (
            <>
              <div className="flex-1 text-left min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">{authUser?.name||"Sanjay Iyer"}</div>
                <div className="text-[10px] text-slate-500 truncate">{authUser?.title||"Admin"}</div>
              </div>
              <LogOut size={14} className="text-slate-600 hover:text-red-400 flex-shrink-0" title="Sign out"/>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────

function TopBar({ activePage, onNavigate, onToggleTheme }: { activePage: Page; onNavigate:(p:Page)=>void; onToggleTheme:()=>void }) {
  const { c, light } = useTheme();
  const { authUser, logout } = useAuth();
  const label = navGroups.flatMap(g=>g.items).find(i=>i.id===activePage)?.label||"Dashboard";
  return (
    <header className="h-14 flex items-center gap-4 px-6 flex-shrink-0"
      style={{ background:light?LIGHT.topbar:DARK.topbar, borderBottom:light?"1px solid #E2E8F0":"1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-2 text-sm">
        <span className={c("text-slate-500","text-slate-400")}>RIAURA</span>
        <ChevronRight size={14} className={c("text-slate-700","text-slate-300")}/>
        <span className={`font-medium ${c("text-slate-200","text-slate-800")}`}>{label}</span>
      </div>
      <div className="flex-1 max-w-sm mx-auto">
        <div className="relative">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${c("text-slate-500","text-slate-400")}`}/>
          <input className={`w-full border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none transition-colors ${c("bg-slate-800/60 border-white/[0.08] text-slate-300 placeholder-slate-600 focus:border-indigo-500/50","bg-slate-100 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-indigo-400")}`}
            placeholder="Search people, projects, tasks..."/>
          <kbd className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded border ${c("text-slate-600 bg-slate-800 border-white/[0.06]","text-slate-400 bg-white border-slate-200")}`}>⌘K</kbd>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Btn variant="secondary" size="sm" icon={Plus}>New</Btn>
        {/* Theme Toggle */}
        <button onClick={onToggleTheme}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${c("text-slate-400 hover:text-slate-200 hover:bg-slate-700/60","text-slate-500 hover:text-slate-700 hover:bg-slate-100")}`}
          title={light?"Switch to Dark":"Switch to Light"}>
          {light?<Moon size={16}/>:<Sun size={16}/>}
        </button>
        <button onClick={()=>onNavigate("notifications")} className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${c("text-slate-400 hover:text-slate-200 hover:bg-slate-700/60","text-slate-500 hover:text-slate-700 hover:bg-slate-100")}`}>
          <Bell size={16}/><span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full border-2" style={{ borderColor:light?LIGHT.topbar:DARK.topbar }}/>
        </button>
        <button onClick={()=>onNavigate("profile")} className={`w-8 h-8 rounded-full ${authUser?.avatarColor||"bg-indigo-600"} flex items-center justify-center text-xs font-bold text-white`}>{authUser?.avatar||"SJ"}</button>
        {authUser && (
          <button onClick={logout} title="Sign out"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${c("text-slate-400 hover:text-red-400 hover:bg-red-500/10","text-slate-500 hover:text-red-500 hover:bg-red-50")}`}>
            <LogOut size={15}/>
          </button>
        )}
      </div>
    </header>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function DashboardPage() {
  const { c, light } = useTheme();
  const { authUser } = useAuth();
  const col = light?LIGHT:DARK;
  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const firstName = authUser?.name.split(" ")[0] || "Sanjay";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-2xl font-bold ${c("text-white","text-slate-900")}`}>{greeting}, {firstName}! 👋</h1>
          <p className={`text-sm mt-1 ${c("text-slate-400","text-slate-500")}`}>Here's what's happening across your organization today.</p>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${c("text-slate-200","text-slate-700")}`}>Saturday, Jun 28 2026</div>
          <div className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>10:24 AM IST</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Employees" value="1,248" change="+14" changeLabel=" this month" icon={Users} iconColor="bg-indigo-600/40" trend="up"/>
        <StatCard label="Present Today" value="1,076" change="86.2%" changeLabel=" attendance" icon={CheckCircle2} iconColor="bg-emerald-600/40" trend="up"/>
        <StatCard label="Active Projects" value="42" change="+3" changeLabel=" this week" icon={FolderKanban} iconColor="bg-violet-600/40" trend="up"/>
        <StatCard label="Team Completion" value="78.4%" change="+2.1%" changeLabel=" vs last month" icon={TrendingUp} iconColor="bg-amber-600/40" trend="up"/>
        <StatCard label="Overdue Tasks" value="23" change="-5" changeLabel=" vs yesterday" icon={AlertCircle} iconColor="bg-red-600/40" trend="down"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Work Overview</h3>
              <p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>Employees & revenue trends</p>
            </div>
            <div className="flex gap-1">
              {["7D","30D","6M","1Y"].map(r=><button key={r} className={`px-2.5 py-1 text-xs rounded-md transition-colors ${r==="6M"?"bg-indigo-600 text-white":c("text-slate-500 hover:text-slate-300 hover:bg-slate-700/50","text-slate-500 hover:text-slate-700 hover:bg-slate-100")}`}>{r}</button>)}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaChartData}>
              <defs>
                <linearGradient id="empGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/><stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/></linearGradient>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/><stop offset="95%" stopColor="#22C55E" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid}/>
              <XAxis dataKey="month" tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={(p:any)=><ChartTip {...p} light={light}/>}/>
              <Area key="dash-employees" type="monotone" dataKey="employees" name="Employees" stroke="#4F46E5" strokeWidth={2} fill="url(#empGrad)"/>
              <Area key="dash-revenue" type="monotone" dataKey="revenue" name="Revenue (K)" stroke="#22C55E" strokeWidth={2} fill="url(#revGrad)"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Project Status</h3>
            <Badge variant="info">42 Total</Badge>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {projectStatusData.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
              </Pie>
              <Tooltip content={(p:any)=><ChartTip {...p} light={light}/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {projectStatusData.map(d=>(
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background:d.color }}/><span className={c("text-slate-400","text-slate-500")}>{d.name}</span></div>
                <span className={`font-semibold ${c("text-slate-200","text-slate-700")}`}>{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>My Tasks</h3>
            <Badge variant="default">8 open</Badge>
          </div>
          <div className="space-y-2.5">
            {tasks.slice(0,5).map(t=>(
              <div key={t.id} className={`flex items-start gap-3 p-2.5 rounded-lg ${c("hover:bg-slate-700/30","hover:bg-slate-50")} transition-colors cursor-pointer`}>
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${t.priority==="critical"?"bg-red-500":t.priority==="high"?"bg-amber-500":"bg-indigo-500"}`}/>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${c("text-slate-200","text-slate-700")}`}>{t.title}</p>
                  <p className={`text-[10px] mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{t.project}</p>
                </div>
                <span className={`text-[10px] flex-shrink-0 ${c("text-slate-600","text-slate-400")}`}>{t.due.split(",")[0]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Top Performers</h3>
            <button className="text-xs text-indigo-500 hover:text-indigo-400">View all</button>
          </div>
          <div className="space-y-3">
            {employees.slice(0,5).map((e,i)=>(
              <div key={e.id} className="flex items-center gap-3">
                <span className={`text-xs w-4 font-bold ${i===0?"text-amber-500":c("text-slate-600","text-slate-400")}`}>#{i+1}</span>
                <Avatar initials={e.avatar} color={e.avatarColor} size="sm"/>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${c("text-slate-200","text-slate-700")}`}>{e.name}</p>
                  <p className={`text-[10px] ${c("text-slate-500","text-slate-400")}`}>{e.dept}</p>
                </div>
                <span className="text-xs font-semibold text-emerald-500">{e.attendance}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/20 flex items-center justify-center"><Sparkles size={13} className="text-indigo-500"/></div>
            <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>AI Insights</h3>
          </div>
          <div className="space-y-3">
            {[
              {icon:TrendingUp,color:"text-emerald-500 bg-emerald-500/10",text:"Engineering productivity up 12% this week. Top: Sarah Chen, James Wilson."},
              {icon:AlertCircle,color:"text-amber-500 bg-amber-500/10",text:"3 projects risk missing Q3 deadlines. Recommend resource reallocation."},
              {icon:Users,color:"text-indigo-500 bg-indigo-500/10",text:"5 employees added in June — 2 Engineering, 2 Sales, 1 HR."},
            ].map((ins,i)=>(
              <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg ${c("bg-slate-700/20","bg-slate-50")}`}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${ins.color}`}><ins.icon size={12}/></div>
                <p className={`text-[11px] leading-relaxed ${c("text-slate-400","text-slate-500")}`}>{ins.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Department Performance vs Target</h3>
            <p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>Efficiency scores — June 2026</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barChartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid}/>
            <XAxis dataKey="dept" tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false} domain={[60,100]}/>
            <Tooltip content={(p:any)=><ChartTip {...p} light={light}/>}/>
            <Legend wrapperStyle={{ fontSize:11, color:col.tickColor }}/>
            <Bar key="dash-target" dataKey="target" name="Target" fill={light?"#CBD5E1":"#334155"} radius={[4,4,0,0]}/>
            <Bar key="dash-actual" dataKey="actual" name="Actual" fill="#4F46E5" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────

function EmployeesPage() {
  const { c } = useTheme();
  const { openModal } = useModal();
  const { setSelectedEmployeeId, navigateTo } = useApp();
  const [view, setView] = useState<"grid"|"table">("grid");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const depts = ["All",...Array.from(new Set(employees.map(e=>e.dept)))];
  const filtered = employees.filter(e=>(deptFilter==="All"||e.dept===deptFilter)&&(e.name.toLowerCase().includes(search.toLowerCase())||e.role.toLowerCase().includes(search.toLowerCase())));
  const openProfile = (emp: typeof employees[0]) => { setSelectedEmployeeId(emp.id); navigateTo("employee-profile"); };

  return (
    <div>
      <PageHeader title="Employee Directory" subtitle={`${filtered.length} employees`}
        actions={<><Btn variant="secondary" size="sm" icon={Download}>Export</Btn><Btn size="sm" icon={Plus} onClick={()=>openModal("add-employee")}>Add Employee</Btn></>}/>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${c("text-slate-500","text-slate-400")}`}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or role..."
            className={`w-full border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none ${c("bg-slate-800/60 border-white/[0.08] text-slate-300 placeholder-slate-600 focus:border-indigo-500/50","bg-white border-slate-200 text-slate-700 placeholder-slate-400 focus:border-indigo-400")}`}/>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {depts.map(d=><button key={d} onClick={()=>setDeptFilter(d)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${deptFilter===d?"bg-indigo-600 text-white":c("bg-slate-800/60 border border-white/[0.08] text-slate-400 hover:text-slate-200","bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50")}`}>{d}</button>)}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={()=>setView("grid")} className={`w-8 h-8 rounded-lg flex items-center justify-center ${view==="grid"?"bg-indigo-600 text-white":c("bg-slate-800/60 text-slate-500","bg-white border border-slate-200 text-slate-500")}`}><Grid3X3 size={15}/></button>
          <button onClick={()=>setView("table")} className={`w-8 h-8 rounded-lg flex items-center justify-center ${view==="table"?"bg-indigo-600 text-white":c("bg-slate-800/60 text-slate-500","bg-white border border-slate-200 text-slate-500")}`}><List size={15}/></button>
        </div>
      </div>

      {view==="grid"?(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(emp=>(
            <Card key={emp.id} className="p-4 cursor-pointer transition-all hover:-translate-y-0.5" onClick={()=>openProfile(emp)}>
              <div className="flex items-start gap-3 mb-3">
                <Avatar initials={emp.avatar} color={emp.avatarColor} size="lg"/>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${c("text-white","text-slate-900")}`}>{emp.name}</p>
                  <p className={`text-xs truncate mt-0.5 ${c("text-slate-400","text-slate-500")}`}>{emp.role}</p>
                </div>
                <StatusBadge status={emp.status}/>
              </div>
              <div className={`space-y-1.5 text-xs ${c("text-slate-500","text-slate-400")}`}>
                <div className="flex items-center gap-2"><Building2 size={12}/>{emp.dept}</div>
                <div className="flex items-center gap-2"><Mail size={12}/><span className="truncate">{emp.email}</span></div>
                <div className="flex items-center gap-2"><MapPin size={12}/>{emp.location}</div>
              </div>
              <div className={`mt-3 pt-3 border-t ${c("border-white/[0.06]","border-slate-100")} flex items-center justify-between`}>
                <span className={`text-[10px] ${c("text-slate-600","text-slate-400")}`}>Attendance</span>
                <span className={`text-xs font-semibold ${emp.attendance>=95?"text-emerald-500":emp.attendance>=85?"text-amber-500":"text-red-500"}`}>{emp.attendance}%</span>
              </div>
            </Card>
          ))}
        </div>
      ):(
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>
                {["Employee","Department","Role","Location","Status","Attendance","Joined","Actions"].map(h=><th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map(emp=>(
                  <tr key={emp.id} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")} transition-colors cursor-pointer`} onClick={()=>openProfile(emp)}>
                    <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar initials={emp.avatar} color={emp.avatarColor} size="sm"/><div><p className={`text-sm font-medium ${c("text-slate-200","text-slate-800")}`}>{emp.name}</p><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{emp.email}</p></div></div></td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{emp.dept}</td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{emp.role}</td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{emp.location}</td>
                    <td className="px-4 py-3"><StatusBadge status={emp.status}/></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><ProgressBar value={emp.attendance} color={emp.attendance>=95?"bg-emerald-500":emp.attendance>=85?"bg-amber-500":"bg-red-500"}/><span className={`text-xs w-10 ${c("text-slate-400","text-slate-500")}`}>{emp.attendance}%</span></div></td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-500","text-slate-400")}`}>{emp.joined}</td>
                    <td className="px-4 py-3"><div className="flex gap-1">
                      <button className={`w-7 h-7 rounded flex items-center justify-center ${c("text-slate-500 hover:text-slate-300 hover:bg-slate-700","text-slate-400 hover:text-slate-600 hover:bg-slate-100")}`}><Eye size={13}/></button>
                      <button className={`w-7 h-7 rounded flex items-center justify-center ${c("text-slate-500 hover:text-slate-300 hover:bg-slate-700","text-slate-400 hover:text-slate-600 hover:bg-slate-100")}`}><Edit2 size={13}/></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

    </div>
  );
}

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────

function DepartmentsPage() {
  const { c } = useTheme();
  const { openModal } = useModal();
  return (
    <div>
      <PageHeader title="Departments" subtitle="Manage organization structures and budgets" actions={<Btn size="sm" icon={Plus} onClick={()=>openModal("add-department")}>New Department</Btn>}/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {departments.map(dept=>(
          <Card key={dept.id} className="p-5 cursor-pointer transition-all hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${dept.color} flex items-center justify-center`}><Building2 size={18} className="text-white"/></div>
              <div><h3 className={`font-semibold text-sm ${c("text-white","text-slate-900")}`}>{dept.name}</h3><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{dept.employees} employees</p></div>
            </div>
            <div className="space-y-2 text-xs">
              {[["Head",dept.head],["Projects",`${dept.projects} active`],["Budget",`$${(dept.budget/1000000).toFixed(1)}M`]].map(([label,val])=>(
                <div key={label as string} className="flex justify-between"><span className={c("text-slate-500","text-slate-400")}>{label}</span><span className={`font-medium ${c("text-slate-300","text-slate-600")}`}>{val}</span></div>
              ))}
              <div className="mt-2">
                <div className="flex justify-between mb-1"><span className={c("text-slate-500","text-slate-400")}>Utilization</span><span className={`font-semibold ${dept.utilization>=85?"text-emerald-500":dept.utilization>=70?"text-amber-500":"text-red-500"}`}>{dept.utilization}%</span></div>
                <ProgressBar value={dept.utilization} color={dept.utilization>=85?"bg-emerald-500":dept.utilization>=70?"bg-amber-500":"bg-red-500"}/>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── TEAMS ────────────────────────────────────────────────────────────────────

const teamsData = [
  { id:1, name:"Platform Core", dept:"Engineering", lead:"Sarah Chen", leadAvatar:"SC", leadColor:"bg-indigo-500", members:[{i:"JW",c:"bg-cyan-500"},{i:"NK",c:"bg-sky-500"},{i:"OH",c:"bg-fuchsia-500"},{i:"TN",c:"bg-teal-500"}], size:8, projects:4, velocity:94 },
  { id:2, name:"Product Growth", dept:"Product", lead:"Marcus Johnson", leadAvatar:"MJ", leadColor:"bg-emerald-500", members:[{i:"PS",c:"bg-violet-500"},{i:"DK",c:"bg-amber-500"}], size:5, projects:3, velocity:88 },
  { id:3, name:"Design Systems", dept:"Design", lead:"Priya Sharma", leadAvatar:"PS", leadColor:"bg-violet-500", members:[{i:"AP",c:"bg-rose-500"}], size:4, projects:2, velocity:76 },
  { id:4, name:"Data Intelligence", dept:"Analytics", lead:"David Kim", leadAvatar:"DK", leadColor:"bg-amber-500", members:[{i:"GL",c:"bg-orange-500"}], size:6, projects:2, velocity:82 },
  { id:5, name:"Growth Marketing", dept:"Marketing", lead:"Aisha Patel", leadAvatar:"AP", leadColor:"bg-rose-500", members:[{i:"RO",c:"bg-lime-600"}], size:7, projects:5, velocity:71 },
  { id:6, name:"Revenue Sales", dept:"Sales", lead:"Ryan O'Brien", leadAvatar:"RO", leadColor:"bg-lime-600", members:[{i:"ER",c:"bg-pink-500"}], size:12, projects:3, velocity:89 },
];

function TeamsPage() {
  const { c } = useTheme();
  const { openModal } = useModal();
  return (
    <div>
      <PageHeader title="Teams" subtitle={`${teamsData.length} active teams`} actions={<Btn size="sm" icon={Plus} onClick={()=>openModal("create-team")}>Create Team</Btn>}/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamsData.map(team=>(
          <Card key={team.id} className="p-5 cursor-pointer transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-4"><div><h3 className={`font-semibold text-sm ${c("text-white","text-slate-900")}`}>{team.name}</h3><p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{team.dept}</p></div><Badge variant="info">{team.projects} projects</Badge></div>
            <div className="flex items-center gap-2 mb-4"><Avatar initials={team.leadAvatar} color={team.leadColor} size="sm"/><div><p className={`text-xs font-medium ${c("text-slate-300","text-slate-700")}`}>{team.lead}</p><p className={`text-[10px] ${c("text-slate-600","text-slate-400")}`}>Team Lead</p></div></div>
            <div className="flex items-center gap-1 mb-4">
              {team.members.slice(0,4).map((m,i)=><div key={i} className={`w-7 h-7 rounded-full ${m.c} flex items-center justify-center text-[10px] font-bold text-white border-2 ${c("border-slate-800","border-white")} -ml-1 first:ml-0`}>{m.i}</div>)}
              {team.size>5 && <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold border-2 -ml-1 ${c("bg-slate-700 text-slate-400 border-slate-800","bg-slate-100 text-slate-500 border-white")}`}>+{team.size-5}</div>}
              <span className={`ml-2 text-xs ${c("text-slate-500","text-slate-400")}`}>{team.size} members</span>
            </div>
            <div><div className="flex justify-between text-xs mb-1"><span className={c("text-slate-500","text-slate-400")}>Velocity</span><span className={`font-semibold ${team.velocity>=85?"text-emerald-500":"text-amber-500"}`}>{team.velocity}%</span></div><ProgressBar value={team.velocity} color={team.velocity>=85?"bg-emerald-500":"bg-amber-500"}/></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

function ProjectsPage() {
  const { c } = useTheme();
  const { openModal } = useModal();
  const [view, setView] = useState<"kanban"|"list">("kanban");
  const statuses = ["planning","in-progress","review","completed"];
  return (
    <div>
      <PageHeader title="Projects" subtitle={`${projects.length} total projects`}
        actions={<><div className="flex gap-1"><button onClick={()=>setView("kanban")} className={`w-8 h-8 rounded-lg flex items-center justify-center ${view==="kanban"?"bg-indigo-600 text-white":c("bg-slate-800/60 text-slate-500","bg-white border border-slate-200 text-slate-500")}`}><GripVertical size={15}/></button><button onClick={()=>setView("list")} className={`w-8 h-8 rounded-lg flex items-center justify-center ${view==="list"?"bg-indigo-600 text-white":c("bg-slate-800/60 text-slate-500","bg-white border border-slate-200 text-slate-500")}`}><List size={15}/></button></div><Btn size="sm" icon={Plus} onClick={()=>openModal("create-project")}>New Project</Btn></>}/>
      {view==="kanban"?(
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statuses.map(status=>{
            const sp=projects.filter(p=>p.status===status);
            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between px-1"><div className="flex items-center gap-2"><StatusBadge status={status}/><span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{sp.length}</span></div><button className={`w-6 h-6 rounded flex items-center justify-center ${c("text-slate-600 hover:bg-slate-700","text-slate-400 hover:bg-slate-100")}`}><Plus size={13}/></button></div>
                {sp.map(p=>(
                  <Card key={p.id} className="p-4 cursor-pointer transition-all hover:-translate-y-0.5">
                    <div className="flex items-start justify-between mb-2"><h4 className={`text-sm font-medium leading-snug ${c("text-white","text-slate-900")}`}>{p.name}</h4><PriorityBadge priority={p.priority}/></div>
                    <p className={`text-xs mb-3 flex items-center gap-1 ${c("text-slate-500","text-slate-400")}`}><Users size={11}/>{p.team} members · {p.tasks} tasks</p>
                    <ProgressBar value={p.progress}/>
                    <div className="flex items-center justify-between mt-2"><span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{p.progress}% done</span><span className={`text-[10px] ${c("text-slate-600","text-slate-400")}`}>{p.deadline}</span></div>
                    <div className={`mt-3 pt-3 border-t ${c("border-white/[0.06]","border-slate-100")} flex items-center justify-between text-xs ${c("text-slate-500","text-slate-400")}`}><span>${(p.spent/1000).toFixed(0)}K spent</span><span>${(p.budget/1000).toFixed(0)}K budget</span></div>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      ):(
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>{["Project","Status","Priority","Progress","Team","Budget","Deadline"].map(h=><th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}</tr></thead>
              <tbody>
                {projects.map(p=>(
                  <tr key={p.id} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")} cursor-pointer`}>
                    <td className="px-4 py-3"><p className={`text-sm font-medium ${c("text-slate-200","text-slate-800")}`}>{p.name}</p><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{p.manager}</p></td>
                    <td className="px-4 py-3"><StatusBadge status={p.status}/></td>
                    <td className="px-4 py-3"><PriorityBadge priority={p.priority}/></td>
                    <td className="px-4 py-3 w-36"><div className="flex items-center gap-2"><ProgressBar value={p.progress}/><span className={`text-xs w-8 ${c("text-slate-400","text-slate-500")}`}>{p.progress}%</span></div></td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{p.team}</td>
                    <td className="px-4 py-3"><p className={`text-sm ${c("text-slate-300","text-slate-700")}`}>${(p.budget/1000).toFixed(0)}K</p><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>${(p.spent/1000).toFixed(0)}K spent</p></td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{p.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── TASKS ────────────────────────────────────────────────────────────────────

function TasksPage() {
  const { c } = useTheme();
  const { openModal } = useModal();
  const [view, setView] = useState<"kanban"|"list">("kanban");
  const columns = [{id:"todo",label:"To Do",border:c("border-slate-600","border-slate-300")},{id:"in-progress",label:"In Progress",border:"border-indigo-500"},{id:"review",label:"In Review",border:"border-amber-500"},{id:"done",label:"Done",border:"border-emerald-500"}];
  return (
    <div>
      <PageHeader title="Tasks" subtitle={`${tasks.length} total tasks`}
        actions={<><div className="flex gap-1"><button onClick={()=>setView("kanban")} className={`w-8 h-8 rounded-lg flex items-center justify-center ${view==="kanban"?"bg-indigo-600 text-white":c("bg-slate-800/60 text-slate-500","bg-white border border-slate-200 text-slate-500")}`}><GripVertical size={15}/></button><button onClick={()=>setView("list")} className={`w-8 h-8 rounded-lg flex items-center justify-center ${view==="list"?"bg-indigo-600 text-white":c("bg-slate-800/60 text-slate-500","bg-white border border-slate-200 text-slate-500")}`}><List size={15}/></button></div><Btn size="sm" icon={Plus} onClick={()=>openModal("create-task")}>New Task</Btn></>}/>
      {view==="kanban"?(
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map(col=>{
            const colTasks=tasks.filter(t=>t.status===col.id);
            return (
              <div key={col.id} className="space-y-3">
                <div className="flex items-center gap-2 px-1"><div className={`w-3 h-3 rounded-sm border-2 ${col.border}`}/><span className={`text-sm font-medium ${c("text-slate-300","text-slate-700")}`}>{col.label}</span><span className={`text-xs px-1.5 py-0.5 rounded ${c("text-slate-600 bg-slate-800","text-slate-500 bg-slate-100")}`}>{colTasks.length}</span></div>
                {colTasks.map(task=>(
                  <Card key={task.id} className="p-3.5 cursor-pointer transition-all hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-2 mb-2"><p className={`text-xs font-medium leading-relaxed ${c("text-slate-200","text-slate-800")}`}>{task.title}</p><PriorityBadge priority={task.priority}/></div>
                    <p className={`text-[10px] mb-3 ${c("text-slate-500","text-slate-400")}`}>{task.project}</p>
                    <div className="flex items-center gap-1 mb-3 flex-wrap">{task.tags.map(tag=><span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded ${c("bg-slate-700 text-slate-400","bg-slate-100 text-slate-500")}`}>{tag}</span>)}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5"><div className={`w-5 h-5 rounded-full ${task.assigneeColor} flex items-center justify-center text-[8px] font-bold text-white`}>{task.assigneeAvatar}</div><span className={`text-[10px] ${c("text-slate-500","text-slate-400")}`}>{task.assignee.split(" ")[0]}</span></div>
                      <span className={`text-[10px] ${c("text-slate-600","text-slate-400")}`}>{task.due}</span>
                    </div>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      ):(
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>{["Task","Project","Assignee","Priority","Status","Due Date"].map(h=><th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}</tr></thead>
              <tbody>
                {tasks.map(t=>(
                  <tr key={t.id} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")} cursor-pointer`}>
                    <td className="px-4 py-3"><p className={`text-sm font-medium ${c("text-slate-200","text-slate-800")}`}>{t.title}</p><div className="flex gap-1 mt-1">{t.tags.map(tag=><span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded ${c("bg-slate-700 text-slate-400","bg-slate-100 text-slate-500")}`}>{tag}</span>)}</div></td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{t.project}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full ${t.assigneeColor} flex items-center justify-center text-[9px] font-bold text-white`}>{t.assigneeAvatar}</div><span className={`text-xs ${c("text-slate-400","text-slate-500")}`}>{t.assignee}</span></div></td>
                    <td className="px-4 py-3"><PriorityBadge priority={t.priority}/></td>
                    <td className="px-4 py-3"><StatusBadge status={t.status}/></td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{t.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────────

function CalendarPage() {
  const { c } = useTheme();
  const { openModal } = useModal();
  const daysInMonth=30;
  const events=[{day:3,title:"Platform Sync",type:"meeting"},{day:7,title:"Security Audit",type:"deadline"},{day:10,title:"Perf Reviews",type:"event"},{day:15,title:"Board Meeting",type:"meeting"},{day:18,title:"Orientation",type:"event"},{day:22,title:"Product Launch",type:"deadline"},{day:25,title:"Team Building",type:"event"},{day:28,title:"All-Hands",type:"meeting"}];
  return (
    <div>
      <PageHeader title="Calendar" subtitle="Manage your schedule and events" actions={<Btn size="sm" icon={Plus} onClick={()=>openModal("create-event")}>New Event</Btn>}/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5"><h3 className={`font-semibold ${c("text-white","text-slate-900")}`}>June 2026</h3><div className="flex gap-1"><button className={`w-7 h-7 rounded flex items-center justify-center ${c("text-slate-400 hover:bg-slate-700","text-slate-500 hover:bg-slate-100")}`}><ChevronLeft size={15}/></button><button className={`w-7 h-7 rounded flex items-center justify-center ${c("text-slate-400 hover:bg-slate-700","text-slate-500 hover:bg-slate-100")}`}><ChevronRight size={15}/></button></div></div>
          <div className="grid grid-cols-7 mb-2">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><div key={d} className={`text-center text-xs font-medium py-1 ${c("text-slate-500","text-slate-400")}`}>{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            <div/>
            {Array.from({length:daysInMonth},(_,i)=>{
              const day=i+1,dayEvents=events.filter(e=>e.day===day),isToday=day===28;
              return (
                <div key={day} className={`min-h-[60px] rounded-lg p-1 cursor-pointer ${isToday?"bg-indigo-600/20 border border-indigo-500/40":c("hover:bg-slate-700/30","hover:bg-slate-50")}`}>
                  <span className={`text-xs font-medium ${isToday?"text-indigo-400":c("text-slate-400","text-slate-500")}`}>{day}</span>
                  {dayEvents.map((ev,ei)=><div key={ei} className={`mt-0.5 px-1 py-0.5 rounded text-[9px] font-medium truncate ${ev.type==="meeting"?"bg-indigo-500/25 text-indigo-500":ev.type==="deadline"?"bg-red-500/25 text-red-500":"bg-emerald-500/25 text-emerald-600"}`}>{ev.title}</div>)}
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className={`font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Upcoming Events</h3>
          <div className="space-y-3">
            {events.map((ev,i)=>(
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ${c("bg-slate-700/20 hover:bg-slate-700/30","bg-slate-50 hover:bg-slate-100")}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ev.type==="meeting"?"bg-indigo-500/15":ev.type==="deadline"?"bg-red-500/15":"bg-emerald-500/15"}`}>{ev.type==="meeting"?<Video size={14} className="text-indigo-500"/>:ev.type==="deadline"?<AlertCircle size={14} className="text-red-500"/>:<Calendar size={14} className="text-emerald-500"/>}</div>
                <div><p className={`text-xs font-medium ${c("text-slate-200","text-slate-700")}`}>{ev.title}</p><p className={`text-[10px] mt-0.5 ${c("text-slate-500","text-slate-400")}`}>Jun {ev.day}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────

function AttendancePage() {
  const { c } = useTheme();
  const [punched, setPunched] = useState(true);
  return (
    <div>
      <PageHeader title="Attendance" subtitle="Track work hours and attendance patterns"/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Today's Attendance</h3>
          <div className="flex flex-col items-center gap-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${punched?"border-emerald-500 bg-emerald-500/10":c("border-slate-600 bg-slate-800","border-slate-300 bg-slate-100")}`}>
              <div className="text-center"><Clock size={24} className={`${punched?"text-emerald-500":c("text-slate-500","text-slate-400")} mx-auto mb-1`}/><p className={`text-xs font-semibold ${c("text-slate-300","text-slate-600")}`}>{punched?"Punched In":"Not In"}</p></div>
            </div>
            {punched && <p className="text-sm text-emerald-500 font-medium">In since 09:07 AM</p>}
            <button onClick={()=>setPunched(!punched)} className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${punched?"bg-red-600 hover:bg-red-500 text-white":"bg-emerald-600 hover:bg-emerald-500 text-white"}`}>{punched?"Punch Out":"Punch In"}</button>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            {[["Today's Hours","5h 17m"],["Break Time","30 min"],["Expected Hours","8h 00m"]].map(([l,v])=><div key={l} className="flex justify-between"><span className={c("text-slate-500","text-slate-400")}>{l}</span><span className={`font-semibold ${c("text-slate-300","text-slate-700")}`}>{v}</span></div>)}
          </div>
        </Card>
        <div className="space-y-4">
          {[{label:"This Month",value:"23/25",sublabel:"working days",color:"text-emerald-500"},{label:"Avg Hours/Day",value:"8.4h",sublabel:"vs 8h target",color:"text-indigo-500"},{label:"Late Arrivals",value:"2",sublabel:"this month",color:"text-amber-500"}].map(s=>(
            <Card key={s.label} className="p-4"><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{s.label}</p><p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p><p className={`text-xs mt-0.5 ${c("text-slate-600","text-slate-400")}`}>{s.sublabel}</p></Card>
          ))}
        </div>
        <Card className="p-5">
          <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Monthly Heatmap</h3>
          <div className="grid grid-cols-7 gap-1">
            {attendanceData.map((d,i)=><div key={i} className={`w-full aspect-square rounded-sm cursor-pointer hover:opacity-70 ${!d.present?"bg-red-500/40":d.late?"bg-amber-500/60":"bg-emerald-500/60"}`} title={`Day ${d.day}`}/>)}
          </div>
          <div className={`flex items-center gap-3 mt-3 text-[10px] ${c("text-slate-500","text-slate-400")}`}>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60"/>Present</div>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-amber-500/60"/>Late</div>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-red-500/40"/>Absent</div>
          </div>
        </Card>
      </div>
      <Card>
        <div className={`p-4 border-b ${c("border-white/[0.06]","border-slate-200")} flex items-center justify-between`}><h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Team Attendance — June 2026</h3><Btn variant="secondary" size="sm" icon={Download}>Export</Btn></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>{["Employee","Dept","Present","Absent","Late","Rate"].map(h=><th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}</tr></thead>
            <tbody>
              {employees.slice(0,8).map(e=>{const p=Math.round(e.attendance/100*25);return(
                <tr key={e.id} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar initials={e.avatar} color={e.avatarColor} size="sm"/><span className={`text-sm ${c("text-slate-200","text-slate-800")}`}>{e.name}</span></div></td>
                  <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{e.dept}</td>
                  <td className="px-4 py-3 text-sm text-emerald-500 font-medium">{p}</td>
                  <td className="px-4 py-3 text-sm text-red-500">{25-p}</td>
                  <td className="px-4 py-3 text-sm text-amber-500">{Math.round(Math.random()*3)}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><ProgressBar value={e.attendance} color={e.attendance>=95?"bg-emerald-500":"bg-amber-500"}/><span className={`text-xs w-10 ${c("text-slate-400","text-slate-500")}`}>{e.attendance}%</span></div></td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── LEAVE ────────────────────────────────────────────────────────────────────

function LeavePage() {
  const { c } = useTheme();
  const { openModal } = useModal();
  const leaveTypes=[{type:"Annual Leave",total:24,used:8,remaining:16,color:"bg-indigo-500"},{type:"Sick Leave",total:12,used:2,remaining:10,color:"bg-red-500"},{type:"Casual Leave",total:6,used:3,remaining:3,color:"bg-amber-500"},{type:"Maternity/Paternity",total:90,used:0,remaining:90,color:"bg-pink-500"}];
  const history=[{dates:"Jun 2–5, 2026",type:"Annual Leave",days:4,reason:"Family vacation",status:"approved"},{dates:"May 14, 2026",type:"Sick Leave",days:1,reason:"Unwell",status:"approved"},{dates:"Apr 18–19, 2026",type:"Annual Leave",days:2,reason:"Personal work",status:"approved"}];
  const inp=`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${c("bg-slate-800 border-white/[0.08] text-slate-300 focus:border-indigo-500/50","bg-white border-slate-200 text-slate-700 focus:border-indigo-400")}`;
  return (
    <div>
      <PageHeader title="Leave Management" subtitle="Track balances, apply, and manage approvals" actions={<Btn size="sm" icon={Plus} onClick={()=>openModal("apply-leave")}>Apply Leave</Btn>}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {leaveTypes.map(l=>(
          <Card key={l.type} className="p-4">
            <div className="flex items-center gap-2 mb-3"><div className={`w-2.5 h-2.5 rounded-full ${l.color}`}/><span className={`text-xs font-medium ${c("text-slate-300","text-slate-700")}`}>{l.type}</span></div>
            <div className={`text-2xl font-bold mb-1 ${c("text-white","text-slate-900")}`}>{l.remaining}<span className={`text-base font-normal ${c("text-slate-500","text-slate-400")}`}>/{l.total}</span></div>
            <p className={`text-xs mb-2 ${c("text-slate-500","text-slate-400")}`}>days remaining</p>
            <ProgressBar value={(l.used/l.total)*100} color={l.color}/>
          </Card>
        ))}
      </div>
      <Card>
        <div className={`p-4 border-b ${c("border-white/[0.06]","border-slate-200")}`}><h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Leave History</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>{["Dates","Type","Days","Reason","Status"].map(h=><th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}</tr></thead>
            <tbody>{history.map((l,i)=>(
              <tr key={i} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                <td className={`px-4 py-3 text-sm ${c("text-slate-300","text-slate-700")}`}>{l.dates}</td>
                <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{l.type}</td>
                <td className={`px-4 py-3 text-sm font-medium ${c("text-slate-300","text-slate-700")}`}>{l.days}</td>
                <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{l.reason}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status}/></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── PAYROLL ──────────────────────────────────────────────────────────────────

function PayrollPage() {
  const { c, light } = useTheme();
  const col = light?LIGHT:DARK;
  return (
    <div>
      <PageHeader title="Payroll" subtitle="Salary, payslips, and compensation" actions={<Btn size="sm" icon={Play}>Run Payroll</Btn>}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Payroll (Jun)" value="$5.1M" change="+2.9%" icon={DollarSign} iconColor="bg-emerald-600/40" trend="up"/>
        <StatCard label="Net Disbursed" value="$4.0M" change="+2.8%" icon={TrendingUp} iconColor="bg-indigo-600/40" trend="up"/>
        <StatCard label="Total Deductions" value="$1.09M" change="+0.9%" icon={ArrowDown} iconColor="bg-amber-600/40" trend="up"/>
        <StatCard label="Employees Paid" value="1,248" change="100%" icon={Users} iconColor="bg-violet-600/40" trend="up"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Payroll Trend — 2026</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={payrollData}>
              <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid}/>
              <XAxis dataKey="month" tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000000).toFixed(1)}M`}/>
              <Tooltip content={(p:any)=><ChartTip {...p} light={light}/>}/>
              <Bar key="pay-gross" dataKey="gross" name="Gross" fill="#4F46E5" radius={[4,4,0,0]}/>
              <Bar key="pay-net" dataKey="net" name="Net" fill="#22C55E" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Salary by Department</h3>
          <div className="space-y-3">
            {departments.slice(0,6).map(d=>(
              <div key={d.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${d.color}`}/>
                <span className={`text-xs w-24 flex-shrink-0 ${c("text-slate-400","text-slate-500")}`}>{d.name}</span>
                <div className="flex-1"><ProgressBar value={(d.employees/342)*100} color={d.color}/></div>
                <span className={`text-xs w-16 text-right ${c("text-slate-300","text-slate-700")}`}>${(d.employees*105/1000).toFixed(0)}K/mo</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <div className={`p-4 border-b ${c("border-white/[0.06]","border-slate-200")} flex items-center justify-between`}><h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Payslips — June 2026</h3><Btn variant="secondary" size="sm" icon={Download}>Download All</Btn></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>{["Employee","Basic","Allowances","Deductions","Net Pay","Status","Payslip"].map(h=><th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}</tr></thead>
            <tbody>
              {employees.slice(0,8).map(e=>{const b=e.salary/12,a=b*0.15,d=b*0.22,n=b+a-d;return(
                <tr key={e.id} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar initials={e.avatar} color={e.avatarColor} size="sm"/><span className={`text-sm ${c("text-slate-200","text-slate-800")}`}>{e.name}</span></div></td>
                  <td className={`px-4 py-3 text-sm ${c("text-slate-300","text-slate-700")}`}>${(b/1000).toFixed(1)}K</td>
                  <td className="px-4 py-3 text-sm text-emerald-500">+${(a/1000).toFixed(1)}K</td>
                  <td className="px-4 py-3 text-sm text-red-500">-${(d/1000).toFixed(1)}K</td>
                  <td className={`px-4 py-3 text-sm font-semibold ${c("text-white","text-slate-900")}`}>${(n/1000).toFixed(1)}K</td>
                  <td className="px-4 py-3"><Badge variant="success">Processed</Badge></td>
                  <td className="px-4 py-3"><button className="text-xs text-indigo-500 flex items-center gap-1"><Download size={11}/>PDF</button></td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── PERFORMANCE ──────────────────────────────────────────────────────────────

function PerformancePage() {
  const { c } = useTheme();
  const { openModal } = useModal();
  return (
    <div>
      <PageHeader title="Performance" subtitle="Reviews, ratings, and development plans" actions={<Btn size="sm" icon={Plus} onClick={()=>openModal("start-review-cycle")}>Start Review Cycle</Btn>}/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 flex flex-col items-center">
          <h3 className={`text-sm font-semibold mb-4 self-start ${c("text-white","text-slate-900")}`}>Review Completion</h3>
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={[{value:78},{value:22}]} cx="50%" cy="50%" innerRadius={38} outerRadius={52} startAngle={90} endAngle={-270} dataKey="value"><Cell key="perf-filled" fill="#4F46E5"/><Cell key="perf-empty" fill={c("#334155","#E2E8F0")}/></Pie></PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center"><span className={`text-2xl font-bold ${c("text-white","text-slate-900")}`}>78%</span></div>
          </div>
          <p className={`text-xs mt-2 ${c("text-slate-500","text-slate-400")}`}>973 of 1,248 reviews completed</p>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Rating Distribution</h3>
          <div className="space-y-3">
            {[{label:"Outstanding (5.0)",pct:12,color:"bg-emerald-500"},{label:"Exceeds Expectations (4.0–4.9)",pct:34,color:"bg-indigo-500"},{label:"Meets Expectations (3.0–3.9)",pct:41,color:"bg-amber-500"},{label:"Needs Improvement (2.0–2.9)",pct:10,color:"bg-orange-500"},{label:"Unsatisfactory (<2.0)",pct:3,color:"bg-red-500"}].map(r=>(
              <div key={r.label} className="flex items-center gap-3">
                <span className={`text-[11px] w-52 flex-shrink-0 ${c("text-slate-400","text-slate-500")}`}>{r.label}</span>
                <div className={`flex-1 h-2 ${c("bg-slate-700","bg-slate-200")} rounded-full overflow-hidden`}><div className={`h-full ${r.color} rounded-full`} style={{width:`${r.pct}%`}}/></div>
                <span className={`text-xs w-8 text-right ${c("text-slate-400","text-slate-500")}`}>{r.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <div className={`p-4 border-b ${c("border-white/[0.06]","border-slate-200")}`}><h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Performance Reviews</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>{["Employee","Reviewer","Period","Score","Status"].map(h=><th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}</tr></thead>
            <tbody>
              {employees.slice(0,8).map((e,i)=>{
                const scores=[4.8,4.2,4.5,3.8,3.5,4.7,4.0,4.3];const score=scores[i];
                const statuses=["completed","in-progress","completed","completed","todo","in-progress","completed","completed"];
                return (
                  <tr key={e.id} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar initials={e.avatar} color={e.avatarColor} size="sm"/><span className={`text-sm ${c("text-slate-200","text-slate-800")}`}>{e.name}</span></div></td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>Elena Rodriguez</td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>Q2 2026</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1"><Star size={12} className={score>=4?"text-amber-500 fill-amber-500":c("text-slate-600","text-slate-300")}/><span className={`text-sm font-semibold ${score>=4.5?"text-emerald-500":score>=3.5?"text-amber-500":"text-red-500"}`}>{score.toFixed(1)}</span></div></td>
                    <td className="px-4 py-3"><StatusBadge status={statuses[i]}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── KPI ──────────────────────────────────────────────────────────────────────

function KPIPage() {
  const { c, light } = useTheme();
  const col=light?LIGHT:DARK;
  const kpis=[{name:"Revenue Target",dept:"Sales",current:4.2,target:5.0,unit:"M",pct:84,trend:"up"},{name:"Customer Satisfaction",dept:"Product",current:4.6,target:5.0,unit:"/5",pct:92,trend:"up"},{name:"Deployment Frequency",dept:"Engineering",current:18,target:20,unit:"/mo",pct:90,trend:"up"},{name:"Employee NPS",dept:"HR",current:62,target:70,unit:"",pct:89,trend:"up"},{name:"Lead Conversion",dept:"Marketing",current:3.8,target:5.0,unit:"%",pct:76,trend:"down"},{name:"Bug Resolution Time",dept:"Engineering",current:18,target:12,unit:"hrs",pct:67,trend:"down"}];
  return (
    <div>
      <PageHeader title="KPI Dashboard" subtitle="Key performance indicators across all departments"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {kpis.map(kpi=>(
          <Card key={kpi.name} className="p-5">
            <div className="flex items-start justify-between mb-3"><div><h4 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>{kpi.name}</h4><p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{kpi.dept}</p></div><div className={`flex items-center text-xs font-medium ${kpi.trend==="up"?"text-emerald-500":"text-red-500"}`}>{kpi.trend==="up"?<ArrowUp size={12}/>:<ArrowDown size={12}/>}</div></div>
            <div className="flex items-end gap-2 mb-3"><span className={`text-2xl font-bold ${c("text-white","text-slate-900")}`}>{kpi.current}{kpi.unit}</span><span className={`text-sm mb-0.5 ${c("text-slate-500","text-slate-400")}`}>/ {kpi.target}{kpi.unit}</span></div>
            <ProgressBar value={kpi.pct} color={kpi.pct>=85?"bg-emerald-500":kpi.pct>=70?"bg-amber-500":"bg-red-500"}/>
            <p className={`text-xs mt-1 font-medium ${kpi.pct>=85?"text-emerald-500":kpi.pct>=70?"text-amber-500":"text-red-500"}`}>{kpi.pct}% of target</p>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Department KPI Trends — Quarterly</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={kpiLineData}>
            <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid}/>
            <XAxis dataKey="month" tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false} domain={[60,100]}/>
            <Tooltip content={(p:any)=><ChartTip {...p} light={light}/>}/>
            <Legend wrapperStyle={{ fontSize:11, color:col.tickColor }}/>
            <Line key="kpi-eng" type="monotone" dataKey="engineering" name="Engineering" stroke="#4F46E5" strokeWidth={2} dot={false}/>
            <Line key="kpi-prod" type="monotone" dataKey="product" name="Product" stroke="#22C55E" strokeWidth={2} dot={false}/>
            <Line key="kpi-des" type="monotone" dataKey="design" name="Design" stroke="#8B5CF6" strokeWidth={2} dot={false}/>
            <Line key="kpi-sales" type="monotone" dataKey="sales" name="Sales" stroke="#F59E0B" strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── OKR ──────────────────────────────────────────────────────────────────────

function OKRPage() {
  const { c } = useTheme();
  const objectives=[
    {id:1,title:"Scale platform to 10M users",owner:"Marcus Johnson",progress:62,krs:[{title:"Achieve 99.9% uptime SLA",progress:94,status:"on-track"},{title:"Reduce page load time to <1.5s",progress:78,status:"on-track"},{title:"Launch CDN in 5 new regions",progress:40,status:"at-risk"}]},
    {id:2,title:"Increase ARR by 40%",owner:"Ryan O'Brien",progress:48,krs:[{title:"Close 50 enterprise accounts",progress:62,status:"on-track"},{title:"Expand APAC market presence",progress:30,status:"at-risk"}]},
    {id:3,title:"Build world-class engineering culture",owner:"Elena Rodriguez",progress:71,krs:[{title:"Achieve eNPS score of 70+",progress:89,status:"on-track"},{title:"Hire 40 engineers in H2",progress:58,status:"on-track"},{title:"Launch internal learning platform",progress:45,status:"at-risk"}]},
  ];
  return (
    <div>
      <PageHeader title="OKR Tracker" subtitle="Objectives and Key Results — Q3 2026"
        actions={<><div className="flex gap-1">{["Q1","Q2","Q3","Q4"].map(q=><button key={q} className={`px-3 py-1.5 text-xs rounded-lg ${q==="Q3"?"bg-indigo-600 text-white":c("bg-slate-800/60 text-slate-500","bg-white border border-slate-200 text-slate-500")}`}>{q} 2026</button>)}</div><Btn size="sm" icon={Plus}>Add Objective</Btn></>}/>
      <div className="space-y-4">
        {objectives.map(obj=>(
          <Card key={obj.id} className="overflow-hidden">
            <div className={`p-5 border-b ${c("border-white/[0.06]","border-slate-200")}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0 mt-0.5"><Target size={15} className="text-indigo-500"/></div><div><h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>{obj.title}</h3><p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{obj.owner} · Q3 2026</p></div></div>
                <span className={`text-xl font-bold flex-shrink-0 ${c("text-white","text-slate-900")}`}>{obj.progress}%</span>
              </div>
              <ProgressBar value={obj.progress} color={obj.progress>=70?"bg-emerald-500":obj.progress>=50?"bg-indigo-500":"bg-amber-500"}/>
            </div>
            <div className={`divide-y ${c("divide-white/[0.04]","divide-slate-100")}`}>
              {obj.krs.map((kr,i)=>(
                <div key={i} className={`flex items-center gap-4 px-5 py-3 ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                  <div className={`w-4 h-4 rounded border flex-shrink-0 ${c("border-slate-600","border-slate-300")}`}/>
                  <p className={`flex-1 text-sm ${c("text-slate-300","text-slate-700")}`}>{kr.title}</p>
                  <StatusBadge status={kr.status}/>
                  <div className="w-32 flex items-center gap-2"><ProgressBar value={kr.progress} color={kr.status==="on-track"?"bg-emerald-500":"bg-amber-500"}/><span className={`text-xs w-8 ${c("text-slate-400","text-slate-500")}`}>{kr.progress}%</span></div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

function AnalyticsPage() {
  const { c, light } = useTheme();
  const col=light?LIGHT:DARK;
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Deep insights across your entire organization"/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Monthly Active Users" value="1,124" change="+8.2%" icon={Users} iconColor="bg-indigo-600/40" trend="up"/>
        <StatCard label="Avg Session Duration" value="42 min" change="+3.1%" icon={Clock} iconColor="bg-emerald-600/40" trend="up"/>
        <StatCard label="Task Completion Rate" value="84.6%" change="+1.8%" icon={CheckCircle2} iconColor="bg-violet-600/40" trend="up"/>
        <StatCard label="Response Time" value="1.2h" change="-18%" icon={Zap} iconColor="bg-amber-600/40" trend="down"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Headcount Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaChartData}>
              <defs><linearGradient id="anaHcG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35}/><stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid}/><XAxis dataKey="month" tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false}/><YAxis tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false} domain={[1150,1280]}/>
              <Tooltip content={(p:any)=><ChartTip {...p} light={light}/>}/>
              <Area key="ana-headcount" type="monotone" dataKey="employees" name="Headcount" stroke="#4F46E5" strokeWidth={2} fill="url(#anaHcG)"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Project Velocity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[{w:"W1",v:34},{w:"W2",v:42},{w:"W3",v:38},{w:"W4",v:51},{w:"W5",v:47},{w:"W6",v:55}]}>
              <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid}/><XAxis dataKey="w" tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false}/><YAxis tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={(p:any)=><ChartTip {...p} light={light}/>}/>
              <Line key="ana-velocity" type="monotone" dataKey="v" name="Story Points" stroke="#22C55E" strokeWidth={2.5} dot={{ fill:"#22C55E", r:3 }}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="p-5">
        <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Department Workforce Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={departments.map(d=>({ name:d.name, employees:d.employees, projects:d.projects }))}>
            <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid}/><XAxis dataKey="name" tick={{ fill:col.tickColor, fontSize:10 }} axisLine={false} tickLine={false}/><YAxis tick={{ fill:col.tickColor, fontSize:11 }} axisLine={false} tickLine={false}/>
            <Tooltip content={(p:any)=><ChartTip {...p} light={light}/>}/>
            <Bar key="ana-emps" dataKey="employees" name="Employees" fill="#4F46E5" radius={[4,4,0,0]}/><Bar key="ana-projs" dataKey="projects" name="Projects" fill="#22C55E" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────────

function KnowledgePage() {
  const { c } = useTheme();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const categories=["All","Engineering","HR Policies","Product","Onboarding","Finance","Security"];
  const articles=[{id:1,title:"Engineering Contribution Guidelines",category:"Engineering",author:"James Wilson",updated:"Jun 24",views:342,icon:Code},{id:2,title:"Onboarding Checklist for New Hires",category:"Onboarding",author:"Elena Rodriguez",updated:"Jun 20",views:812,icon:CheckSquare},{id:3,title:"Remote Work & Attendance Policy 2026",category:"HR Policies",author:"Elena Rodriguez",updated:"Jun 15",views:1204,icon:FileText},{id:4,title:"Product Roadmap Q3–Q4 2026",category:"Product",author:"Marcus Johnson",updated:"Jun 12",views:567,icon:Target},{id:5,title:"Security Incident Response Playbook",category:"Security",author:"Omar Hassan",updated:"Jun 8",views:289,icon:ShieldCheck},{id:6,title:"Expense Reimbursement Policy",category:"Finance",author:"Grace Liu",updated:"Jun 5",views:445,icon:DollarSign},{id:7,title:"Code Review Best Practices",category:"Engineering",author:"Sarah Chen",updated:"May 30",views:631,icon:Code},{id:8,title:"Brand Identity & Design System",category:"Product",author:"Priya Sharma",updated:"May 28",views:388,icon:Layers}];
  const filtered=articles.filter(a=>(cat==="All"||a.category===cat)&&a.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader title="Knowledge Base" subtitle="Documentation, SOPs, and company resources" actions={<Btn size="sm" icon={Plus}>New Article</Btn>}/>
      <div className="relative mb-4"><Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${c("text-slate-500","text-slate-400")}`}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search articles..." className={`w-full border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none ${c("bg-slate-800/60 border-white/[0.08] text-slate-300 placeholder-slate-600 focus:border-indigo-500/50","bg-white border-slate-200 text-slate-700 placeholder-slate-400 focus:border-indigo-400")}`}/></div>
      <div className="flex gap-2 mb-5 flex-wrap">{categories.map(ca=><button key={ca} onClick={()=>setCat(ca)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${cat===ca?"bg-indigo-600 text-white":c("bg-slate-800/60 border border-white/[0.08] text-slate-400 hover:text-slate-200","bg-white border border-slate-200 text-slate-500 hover:text-slate-700")}`}>{ca}</button>)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(a=>(
          <Card key={a.id} className="p-4 cursor-pointer transition-all hover:-translate-y-0.5 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${c("bg-slate-700/50","bg-slate-100")}`}><a.icon size={16} className={c("text-slate-400","text-slate-500")}/></div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium transition-colors ${c("text-white hover:text-indigo-300","text-slate-800 hover:text-indigo-600")}`}>{a.title}</h4>
              <div className={`flex items-center gap-3 mt-1.5 text-xs ${c("text-slate-500","text-slate-400")} flex-wrap`}>
                <Badge variant="default">{a.category}</Badge><span>{a.author}</span><span>Updated {a.updated}</span><span className="flex items-center gap-0.5"><Eye size={11}/>{a.views}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────

function ChatPage() {
  const { c, light } = useTheme();
  const { authUser } = useAuth();
  const [activeChannel, setActiveChannel] = useState(chatChannels[0]);
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const send = useCallback(()=>{if(!input.trim())return;setMessages(prev=>[...prev,{id:prev.length+1,user:authUser?.name||"Sanjay Iyer",avatar:authUser?.avatar||"SJ",color:authUser?.avatarColor||"bg-indigo-600",time:"Now",text:input,reactions:[]}]);setInput("");},[input,authUser]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  return (
    <div className="flex h-[calc(100vh-8rem)] -m-6">
      <div className="w-56 flex-shrink-0 border-r flex flex-col" style={{ background:"#0B1020", borderColor:"rgba(255,255,255,0.06)" }}>
        <div className="p-4 border-b border-white/[0.06]"><h3 className="text-xs font-semibold text-slate-300">RIAURA Workspace</h3><p className="text-[10px] text-slate-600 mt-0.5">1,248 members</p></div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider px-2 py-1.5">Channels</p>
          {chatChannels.map(ch=><button key={ch.id} onClick={()=>setActiveChannel(ch)} className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm transition-colors ${activeChannel.id===ch.id?"bg-indigo-600/20 text-indigo-400":"text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"}`}><span className="flex items-center gap-2"><Hash size={13}/>{ch.name}</span>{ch.unread>0&&<span className="text-[10px] bg-indigo-600 text-white rounded-full px-1.5 py-0.5 font-semibold">{ch.unread}</span>}</button>)}
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider px-2 py-1.5 mt-2">Direct Messages</p>
          {employees.slice(0,5).map(e=><button key={e.id} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"><div className={`w-5 h-5 rounded-full ${e.avatarColor} flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0`}>{e.avatar}</div><span className="truncate">{e.name.split(" ")[0]}</span><span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"/></button>)}
        </div>
      </div>
      <div className="flex-1 flex flex-col" style={{ background:light?LIGHT.bg:DARK.bg }}>
        <div className={`px-5 py-3 border-b flex items-center gap-3 flex-shrink-0 ${c("border-white/[0.06]","border-slate-200")}`} style={{ background:light?LIGHT.topbar:"#131E35" }}>
          <Hash size={16} className={c("text-slate-500","text-slate-400")}/><h3 className={`font-semibold text-sm ${c("text-white","text-slate-900")}`}>{activeChannel.name}</h3>
          <span className={`text-xs border-l pl-3 ${c("text-slate-600 border-white/[0.08]","text-slate-400 border-slate-200")}`}>Team discussions</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map(msg=>(
            <div key={msg.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${msg.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5`}>{msg.avatar}</div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1"><span className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>{msg.user}</span><span className={`text-[11px] ${c("text-slate-600","text-slate-400")}`}>{msg.time}</span></div>
                <p className={`text-sm leading-relaxed ${c("text-slate-300","text-slate-600")}`}>{msg.text}</p>
                {msg.reactions.length>0&&<div className="flex items-center gap-1.5 mt-2 flex-wrap">{msg.reactions.map((r,i)=><button key={i} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${c("bg-slate-700/50 border-white/[0.06] text-slate-400","bg-slate-100 border-slate-200 text-slate-600")}`}><span>{r.emoji}</span><span>{r.count}</span></button>)}</div>}
              </div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>
        <div className={`p-4 border-t flex-shrink-0 ${c("border-white/[0.06]","border-slate-200")}`}>
          <div className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 ${c("bg-slate-800/60 border-white/[0.08] focus-within:border-indigo-500/40","bg-white border-slate-200 focus-within:border-indigo-400")}`}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={`Message #${activeChannel.name}`} className={`flex-1 bg-transparent text-sm focus:outline-none ${c("text-slate-300 placeholder-slate-600","text-slate-700 placeholder-slate-400")}`}/>
            <div className="flex items-center gap-1.5">
              <button className={c("text-slate-600 hover:text-slate-400","text-slate-400 hover:text-slate-600")}><Paperclip size={15}/></button>
              <button className={c("text-slate-600 hover:text-slate-400","text-slate-400 hover:text-slate-600")}><Smile size={15}/></button>
              <button onClick={send} className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center"><Send size={13} className="text-white"/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI ASSISTANT ─────────────────────────────────────────────────────────────

function AIAssistantPage() {
  const { c, light } = useTheme();
  const { authUser } = useAuth();
  const [messages, setMessages] = useState(aiInitMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const suggested=["Summarize this week's project status","Which employees are at risk of leaving?","Generate Q2 Engineering performance report","Top 5 overdue tasks across all projects"];
  const replies=["Based on current data: **Platform v3.0** is at 68% — on track for August. **Security Audit** nearly done at 91%. **Mobile Redesign** at 42% may need resource boost.","Engagement analysis indicates **2 employees** show disengagement signs: attendance below 80%, no skills training in 90+ days. Recommend 1:1 sessions.","**Q2 Engineering**: 342 engineers, 87% KPI achievement, 18 deployments/month (+12% QoQ). Top performers: Sarah Chen (4.8/5), James Wilson (4.7/5)."];
  const send = useCallback(async(text?:string)=>{
    const msg=text||input;if(!msg.trim())return;
    setMessages(prev=>[...prev,{role:"user",text:msg}]);setInput("");setLoading(true);
    await new Promise(r=>setTimeout(r,1100));
    setMessages(prev=>[...prev,{role:"assistant",text:replies[Math.floor(Math.random()*replies.length)]}]);
    setLoading(false);
  },[input]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col -m-6">
      <div className={`px-6 py-4 border-b flex items-center gap-3 flex-shrink-0 ${c("border-white/[0.06]","border-slate-200")}`}>
        <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center"><Sparkles size={18} className="text-indigo-500"/></div>
        <div><h2 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>RIAURA AI Assistant</h2><p className={`text-[11px] ${c("text-slate-500","text-slate-400")}`}>Enterprise intelligence · Full org data access</p></div>
        <div className="ml-auto flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/><span className="text-xs text-emerald-500">Online</span></div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {messages.map((msg,i)=>(
          <div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"} items-start gap-3`}>
            {msg.role==="assistant"&&<div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0 mt-0.5"><Bot size={14} className="text-indigo-500"/></div>}
            <div className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role==="user"?"bg-indigo-600 text-white rounded-tr-sm":c("bg-slate-800 text-slate-200 border border-white/[0.06] rounded-tl-sm","bg-slate-100 text-slate-700 border border-slate-200 rounded-tl-sm")}`}>{msg.text}</div>
            {msg.role==="user"&&<div className={`w-7 h-7 rounded-full ${authUser?.avatarColor||"bg-indigo-600"} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5`}>{authUser?.avatar||"SJ"}</div>}
          </div>
        ))}
        {loading&&<div className="flex items-start gap-3"><div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0"><Bot size={14} className="text-indigo-500"/></div><div className={`${c("bg-slate-800 border-white/[0.06]","bg-slate-100 border-slate-200")} border rounded-2xl rounded-tl-sm px-4 py-3`}><div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}</div></div></div>}
        <div ref={bottomRef}/>
      </div>
      {messages.length<=1&&<div className="px-6 pb-3"><p className={`text-xs mb-2 ${c("text-slate-500","text-slate-400")}`}>Suggested prompts</p><div className="flex flex-wrap gap-2">{suggested.map((p,i)=><button key={i} onClick={()=>send(p)} className={`text-xs border rounded-lg px-3 py-1.5 transition-colors ${c("text-slate-300 bg-slate-800/60 border-white/[0.08] hover:border-indigo-500/40 hover:text-indigo-300","text-slate-600 bg-white border-slate-200 hover:border-indigo-400 hover:text-indigo-600")}`}>{p}</button>)}</div></div>}
      <div className="px-6 pb-5 flex-shrink-0">
        <div className={`flex items-center gap-2 border rounded-2xl px-4 py-3 ${c("bg-slate-800/60 border-white/[0.08] focus-within:border-indigo-500/40","bg-white border-slate-200 focus-within:border-indigo-400")}`}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Ask anything about your organization..." className={`flex-1 bg-transparent text-sm focus:outline-none ${c("text-slate-300 placeholder-slate-600","text-slate-700 placeholder-slate-400")}`}/>
          <div className="flex items-center gap-2"><button className={c("text-slate-600 hover:text-slate-400","text-slate-400 hover:text-slate-600")}><Mic size={16}/></button><button onClick={()=>send()} disabled={!input.trim()} className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 flex items-center justify-center"><Send size={14} className="text-white"/></button></div>
        </div>
      </div>
    </div>
  );
}

// ─── REMAINING PAGES ──────────────────────────────────────────────────────────

function MeetingsPage() {
  const { c } = useTheme();
  const { openModal } = useModal();
  const meetings=[{title:"Platform v3 Sprint Sync",date:"Today, Jun 28",time:"2:00 PM — 3:00 PM",attendees:["SC","JW","MJ","NK"],status:"upcoming"},{title:"Q2 Board Review",date:"Mon, Jun 30",time:"10:00 AM — 12:00 PM",attendees:["MJ","RO","GL","ER"],status:"upcoming"},{title:"Design System Standup",date:"Daily",time:"9:30 AM — 9:50 AM",attendees:["PS","MJ","DK"],status:"recurring"},{title:"All Hands — July 2026",date:"Mon, Jul 7",time:"11:00 AM — 12:30 PM",attendees:["SC","MJ","PS","DK","AP","JW"],status:"upcoming"}];
  const ac=["bg-indigo-500","bg-emerald-500","bg-violet-500","bg-amber-500","bg-cyan-500","bg-rose-500"];
  return (
    <div>
      <PageHeader title="Meetings" subtitle="Upcoming meetings and sessions" actions={<Btn size="sm" icon={Plus} onClick={()=>openModal("schedule-meeting")}>Schedule Meeting</Btn>}/>
      <div className="space-y-3">{meetings.map((m,mi)=>(
        <Card key={mi} className="p-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center flex-shrink-0"><Video size={16} className="text-indigo-500"/></div>
              <div><h4 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>{m.title}</h4><div className={`flex items-center gap-3 mt-1 text-xs ${c("text-slate-500","text-slate-400")}`}><span>{m.date}</span><span>{m.time}</span></div>
              <div className="flex items-center gap-1 mt-2">{m.attendees.slice(0,5).map((a,i)=><div key={i} className={`w-6 h-6 rounded-full ${ac[i%ac.length]} flex items-center justify-center text-[9px] font-bold text-white border-2 ${c("border-slate-800","border-white")} -ml-1 first:ml-0`}>{a}</div>)}</div></div>
            </div>
            <div className="flex items-center gap-2"><StatusBadge status={m.status}/><Btn variant="secondary" size="sm">Join</Btn></div>
          </div>
        </Card>
      ))}</div>
    </div>
  );
}

function NotificationsPage() {
  const { c } = useTheme();
  const notifs=[{icon:CheckSquare,color:"bg-indigo-500/15 text-indigo-500",title:"Task assigned to you",body:"Sarah Chen assigned \"Implement OAuth2 auth flow\" in Platform v3.0",time:"5 min ago",read:false},{icon:PlaneTakeoff,color:"bg-emerald-500/15 text-emerald-500",title:"Leave request approved",body:"Your leave request for Jun 2–5 has been approved",time:"1 hour ago",read:false},{icon:FolderKanban,color:"bg-amber-500/15 text-amber-500",title:"Project milestone reached",body:"Security Audit 2026 reached 90% completion",time:"2 hours ago",read:false},{icon:DollarSign,color:"bg-violet-500/15 text-violet-500",title:"Payroll processed",body:"June 2026 payroll has been processed",time:"1 day ago",read:true},{icon:Sparkles,color:"bg-pink-500/15 text-pink-500",title:"AI Insight ready",body:"Your weekly organization health report is ready",time:"2 days ago",read:true}];
  return (
    <div>
      <PageHeader title="Notifications" subtitle={`${notifs.filter(n=>!n.read).length} unread`} actions={<Btn variant="ghost" size="sm">Mark all read</Btn>}/>
      <div className="space-y-2 max-w-2xl">{notifs.map((n,i)=>(
        <Card key={i} className={`p-4 cursor-pointer ${!n.read?c("border-indigo-500/20","border-indigo-300/40"):""}`}>
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl ${n.color} flex items-center justify-center flex-shrink-0`}><n.icon size={16}/></div>
            <div className="flex-1"><div className="flex items-start justify-between gap-2"><p className={`text-sm font-medium ${n.read?c("text-slate-400","text-slate-500"):c("text-white","text-slate-900")}`}>{n.title}</p><span className={`text-[10px] flex-shrink-0 ${c("text-slate-600","text-slate-400")}`}>{n.time}</span></div><p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-500")}`}>{n.body}</p></div>
            {!n.read&&<div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 mt-2"/>}
          </div>
        </Card>
      ))}</div>
    </div>
  );
}

function RolesPage() {
  const { c } = useTheme();
  const roles=[{name:"Super Admin",users:2,permissions:48,color:"bg-red-500"},{name:"HR Manager",users:8,permissions:32,color:"bg-violet-500"},{name:"Project Manager",users:24,permissions:28,color:"bg-indigo-500"},{name:"Team Lead",users:67,permissions:21,color:"bg-amber-500"},{name:"Employee",users:1147,permissions:12,color:"bg-emerald-500"}];
  const groups=["Employees","Projects","Finance","Analytics","Settings","Audit"];
  return (
    <div>
      <PageHeader title="Roles & Permissions" subtitle="Define access control" actions={<Btn size="sm" icon={Plus}>Create Role</Btn>}/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-3">{roles.map(role=>(
          <Card key={role.name} className="p-4 cursor-pointer hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg ${role.color}/20 flex items-center justify-center`}><ShieldCheck size={15} className={role.color.replace("bg-","text-")}/></div><div><p className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>{role.name}</p><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{role.users} users · {role.permissions} permissions</p></div></div>
          </Card>
        ))}</div>
        <Card className="p-5 lg:col-span-2">
          <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Permission Matrix — Project Manager</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}><th className={`text-left font-medium pb-2 pr-4 ${c("text-slate-500","text-slate-400")}`}>Resource</th>{["View","Create","Edit","Delete","Export"].map(h=><th key={h} className={`text-center font-medium pb-2 px-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}</tr></thead>
              <tbody>{groups.map((group,gi)=>(
                <tr key={group} className={`border-b ${c("border-white/[0.04]","border-slate-100")}`}>
                  <td className={`py-2.5 pr-4 ${c("text-slate-400","text-slate-500")}`}>{group}</td>
                  {[true,gi<3,gi<3,gi<2,gi<2].map((enabled,pi)=>(
                    <td key={pi} className="py-2.5 px-3 text-center"><div className={`w-5 h-5 rounded-md mx-auto flex items-center justify-center ${enabled?"bg-emerald-500/15":"bg-slate-500/10"}`}>{enabled?<CheckCircle2 size={12} className="text-emerald-500"/>:<XCircle size={12} className={c("text-slate-600","text-slate-300")}/>}</div></td>
                  ))}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AuditPage() {
  const { c } = useTheme();
  const logs=[{user:"Sarah Chen",action:"Updated employee profile",resource:"Employees",ip:"192.168.1.42",time:"Jun 28, 10:18 AM",severity:"info"},{user:"Elena Rodriguez",action:"Approved leave request #LV-2891",resource:"Leave",ip:"192.168.1.18",time:"Jun 28, 9:54 AM",severity:"info"},{user:"Sanjay Iyer",action:"Generated API key for integration",resource:"Settings",ip:"192.168.1.5",time:"Jun 28, 9:22 AM",severity:"warning"},{user:"Marcus Johnson",action:"Exported employee data (CSV)",resource:"Employees",ip:"192.168.1.33",time:"Jun 27, 4:45 PM",severity:"warning"},{user:"Unknown",action:"Failed login attempt (3x)",resource:"Auth",ip:"103.25.88.211",time:"Jun 27, 3:12 PM",severity:"danger"},{user:"Grace Liu",action:"Ran payroll for June 2026",resource:"Payroll",ip:"192.168.1.29",time:"Jun 27, 1:30 PM",severity:"info"}];
  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Track all system actions and security events" actions={<Btn variant="secondary" size="sm" icon={Download}>Export Logs</Btn>}/>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>{["User","Action","Resource","IP Address","Severity","Time"].map(h=><th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}</tr></thead>
            <tbody>{logs.map((log,i)=>(
              <tr key={i} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                <td className={`px-4 py-3 text-sm font-medium ${c("text-slate-300","text-slate-700")}`}>{log.user}</td>
                <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{log.action}</td>
                <td className="px-4 py-3"><Badge variant="default">{log.resource}</Badge></td>
                <td className={`px-4 py-3 text-xs font-mono ${c("text-slate-500","text-slate-400")}`}>{log.ip}</td>
                <td className="px-4 py-3"><Badge variant={log.severity==="danger"?"danger":log.severity==="warning"?"warning":"success"}>{log.severity}</Badge></td>
                <td className={`px-4 py-3 text-xs ${c("text-slate-500","text-slate-400")}`}>{log.time}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function BillingPage() {
  const { c } = useTheme();
  return (
    <div>
      <PageHeader title="Billing & Plans" subtitle="Manage subscription and payment information"/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className={`p-5 ${c("border-indigo-500/30","border-indigo-300")}`}>
          <div className="flex items-center justify-between mb-3"><Badge variant="info">Current Plan</Badge><Badge variant="success">Active</Badge></div>
          <h3 className={`text-lg font-bold mb-1 ${c("text-white","text-slate-900")}`}>Enterprise</h3>
          <p className={`text-sm mb-4 ${c("text-slate-400","text-slate-500")}`}>Full access to all RIAURA features</p>
          <div className={`text-3xl font-bold ${c("text-white","text-slate-900")}`}>$4,200<span className={`text-base font-normal ${c("text-slate-500","text-slate-400")}`}>/month</span></div>
          <p className={`text-xs mt-1 mb-4 ${c("text-slate-500","text-slate-400")}`}>Billed annually · 1,248 seats</p>
          <div className="space-y-1.5 text-xs">{["Unlimited employees","All HR modules","AI Assistant","Priority support","99.99% SLA"].map(f=><div key={f} className={`flex items-center gap-2 ${c("text-slate-400","text-slate-500")}`}><CheckCircle2 size={12} className="text-emerald-500"/>{f}</div>)}</div>
        </Card>
        <div className="space-y-4">{[{label:"Next Invoice",value:"$4,200.00",sub:"Due July 1, 2026"},{label:"Payment Method",value:"VISA •••• 4821",sub:"Expires 04/28"},{label:"Current Cycle",value:"Jun 1 – Jun 30",sub:"28 of 30 days"}].map(s=>(
          <Card key={s.label} className="p-4"><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{s.label}</p><p className={`text-base font-semibold mt-0.5 ${c("text-white","text-slate-900")}`}>{s.value}</p><p className={`text-xs mt-0.5 ${c("text-slate-600","text-slate-400")}`}>{s.sub}</p></Card>
        ))}</div>
        <Card className="p-5">
          <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Usage This Month</h3>
          <div className="space-y-3">{[{label:"Active Seats",used:1248,limit:1500},{label:"Storage",used:287,limit:500},{label:"API Calls",used:82400,limit:100000},{label:"AI Queries",used:4820,limit:10000}].map(u=>(
            <div key={u.label}>
              <div className="flex justify-between text-xs mb-1"><span className={c("text-slate-400","text-slate-500")}>{u.label}</span><span className={c("text-slate-300","text-slate-700")}>{u.used.toLocaleString()} / {u.limit.toLocaleString()}</span></div>
              <ProgressBar value={(u.used/u.limit)*100} color={(u.used/u.limit)>0.85?"bg-amber-500":"bg-indigo-500"}/>
            </div>
          ))}</div>
        </Card>
      </div>
    </div>
  );
}

function SettingsPage() {
  const { c } = useTheme();
  const [tab, setTab] = useState("organization");
  const tabs=[{id:"organization",label:"Organization",icon:Building2},{id:"notifications",label:"Notifications",icon:Bell},{id:"security",label:"Security",icon:Lock},{id:"api",label:"API Keys",icon:Key}];
  const inp=`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${c("bg-slate-800/60 border-white/[0.08] text-slate-300 focus:border-indigo-500/50","bg-white border-slate-200 text-slate-700 focus:border-indigo-400")}`;
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage organization and account preferences"/>
      <div className="flex gap-1 mb-6 flex-wrap">{tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab===t.id?"bg-indigo-600 text-white":c("text-slate-400 hover:text-slate-200 hover:bg-slate-800/60","text-slate-500 hover:text-slate-700 hover:bg-slate-100")}`}><t.icon size={15}/>{t.label}</button>)}</div>

      {tab==="organization"&&<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5"><h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Organization Details</h3><div className="space-y-3">{[["Company Name","RIAURA Technologies Inc."],["Domain","riaura.com"],["Industry","Enterprise Software"],["Company Size","1,001–5,000 employees"],["Headquarters","San Francisco, CA, USA"]].map(([l,v])=><div key={l}><label className={`text-[11px] block mb-1 ${c("text-slate-500","text-slate-400")}`}>{l}</label><input defaultValue={v} className={inp}/></div>)}<Btn variant="primary" size="sm" icon={RefreshCw} className="mt-2">Save Changes</Btn></div></Card>
        <Card className="p-5"><h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Localization</h3><div className="space-y-3">{[["Fiscal Year Start",["January","April","July"]],["Currency",["USD","EUR","GBP"]],["Timezone",["America/New_York","Asia/Kolkata"]],["Date Format",["MM/DD/YYYY","DD/MM/YYYY"]]].map(([l,opts])=><div key={l as string}><label className={`text-[11px] block mb-1 ${c("text-slate-500","text-slate-400")}`}>{l as string}</label><select className={inp}>{(opts as string[]).map(o=><option key={o}>{o}</option>)}</select></div>)}<Btn variant="primary" size="sm" icon={RefreshCw} className="mt-2">Save Changes</Btn></div></Card>
      </div>}

      {tab==="notifications"&&<Card className="p-5 max-w-2xl"><h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Notification Preferences</h3><div className="space-y-4">{[["Task Assignments","When a task is assigned to you",true],["Project Updates","Status changes and milestone completions",true],["Leave Approvals","When leave is approved or rejected",true],["Payroll Processed","Monthly payroll notifications",false],["AI Insights","Weekly AI-generated insights",false]].map(([l,d,en]:any)=>(
        <div key={l} className={`flex items-center justify-between py-2 border-b ${c("border-white/[0.04]","border-slate-100")} last:border-0`}><div><p className={`text-sm ${c("text-slate-200","text-slate-700")}`}>{l}</p><p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{d}</p></div><div className={`w-10 h-5 rounded-full cursor-pointer relative ${en?"bg-indigo-600":c("bg-slate-700","bg-slate-300")}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 ${en?"left-5":"left-0.5"}`}/></div>
        </div>
      ))}</div></Card>}

      {tab==="security"&&<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
        <Card className="p-5"><h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Authentication</h3><div className="space-y-3">{[["Two-Factor Authentication","Enabled","text-emerald-500"],["SSO / SAML","Configured","text-emerald-500"],["Password Policy","Strong (12+ chars)","text-amber-500"],["Session Timeout","8 hours",c("text-slate-400","text-slate-500")]].map(([l,s,col])=><div key={l} className={`flex items-center justify-between p-3 rounded-lg ${c("bg-slate-700/20","bg-slate-50")}`}><span className={`text-sm ${c("text-slate-300","text-slate-700")}`}>{l}</span><span className={`text-xs font-medium ${col}`}>{s}</span></div>)}</div></Card>
        <Card className="p-5"><h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Active Sessions</h3><div className="space-y-3">{[{device:"MacBook Pro 16\"",location:"San Francisco, CA",last:"Now — Current",current:true},{device:"iPhone 16 Pro",location:"SF, CA",last:"2 hours ago",current:false},{device:"Chrome on Windows",location:"New York, NY",last:"Yesterday",current:false}].map(s=><div key={s.device} className={`flex items-center justify-between p-3 rounded-lg ${c("bg-slate-700/20","bg-slate-50")}`}><div><p className={`text-sm ${c("text-slate-200","text-slate-700")}`}>{s.device}</p><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{s.location} · {s.last}</p></div>{s.current?<Badge variant="success">Current</Badge>:<button className="text-xs text-red-500">Revoke</button>}</div>)}</div></Card>
      </div>}

      {tab==="api"&&<Card className="p-5 max-w-2xl">
        <div className="flex items-center justify-between mb-4"><h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>API Keys</h3><Btn size="sm" icon={Plus}>Generate Key</Btn></div>
        <div className="space-y-3">{[{name:"Production API Key",key:"riaura_prod_sk_••••••4a8f",created:"Jan 12, 2026",last:"2 min ago",perms:"Read + Write"},{name:"Analytics Integration",key:"riaura_int_sk_••••••9b3c",created:"Mar 5, 2026",last:"1 day ago",perms:"Read Only"},{name:"Webhook Secret",key:"riaura_wh_sk_••••••2e7d",created:"Apr 20, 2026",last:"5 min ago",perms:"Webhook"}].map(k=>(
          <div key={k.name} className={`p-4 rounded-xl border ${c("bg-slate-700/20 border-white/[0.06]","bg-slate-50 border-slate-200")}`}>
            <div className="flex items-start justify-between mb-2"><div><p className={`text-sm font-medium ${c("text-slate-200","text-slate-800")}`}>{k.name}</p><code className="text-xs text-indigo-500 font-mono mt-0.5 block">{k.key}</code></div><div className="flex gap-1"><button className={`w-7 h-7 rounded flex items-center justify-center ${c("text-slate-500 hover:text-slate-300 hover:bg-slate-700","text-slate-400 hover:text-slate-600 hover:bg-slate-200")}`}><Copy size={13}/></button><button className={`w-7 h-7 rounded flex items-center justify-center ${c("text-slate-500 hover:text-red-400 hover:bg-slate-700","text-slate-400 hover:text-red-500 hover:bg-slate-200")}`}><Trash2 size={13}/></button></div></div>
            <div className={`flex items-center gap-4 text-[11px] ${c("text-slate-600","text-slate-400")} flex-wrap`}><span>Created {k.created}</span><span>Last used {k.last}</span><Badge variant="default">{k.perms}</Badge></div>
          </div>
        ))}</div>
      </Card>}
    </div>
  );
}

function ProfilePage() {
  const { c } = useTheme();
  const { authUser } = useAuth();
  const u = authUser || demoAccounts[0];
  const nameParts = u.name.split(" ");
  const inp=`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${c("bg-slate-800/60 border-white/[0.08] text-slate-300 focus:border-indigo-500/50","bg-white border-slate-200 text-slate-700 focus:border-indigo-400")}`;
  const cfg = roleConfig[u.role];
  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage personal information"/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-full ${u.avatarColor} flex items-center justify-center text-2xl font-bold text-white mb-4`}>{u.avatar}</div>
          <h2 className={`text-lg font-bold ${c("text-white","text-slate-900")}`}>{u.name}</h2>
          <p className={`text-sm mt-0.5 ${c("text-slate-400","text-slate-500")}`}>{u.title}</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>{u.roleLabel}</span>
            <Badge variant="success">Active</Badge>
          </div>
          <div className={`w-full mt-6 space-y-2 text-xs text-left ${c("text-slate-500","text-slate-400")}`}>
            <div className="flex items-center gap-2"><Mail size={12}/>{u.email}</div>
            <div className="flex items-center gap-2"><Building2 size={12}/>{u.dept}</div>
            <div className="flex items-center gap-2"><MapPin size={12}/>San Francisco, CA</div>
          </div>
          <Btn variant="secondary" size="sm" icon={Edit2} className="mt-5 w-full justify-center">Edit Profile</Btn>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Personal Information</h3>
          <div className="grid grid-cols-2 gap-3">{[["First Name",nameParts[0]||""],["Last Name",nameParts.slice(1).join(" ")||""],["Email",u.email],["Phone",employees.find(e=>e.id===u.id)?.phone||"+1 (555) 000-0001"],["Job Title",u.title],["Department",u.dept],["Role Level",u.roleLabel],["Time Zone","America/Los_Angeles (PST)"]].map(([l,v])=><div key={l}><label className={`text-[11px] block mb-1 ${c("text-slate-500","text-slate-400")}`}>{l}</label><input defaultValue={v} className={inp}/></div>)}</div>
          <Btn variant="primary" size="sm" icon={RefreshCw} className="mt-4">Save Changes</Btn>
        </Card>
      </div>
    </div>
  );
}

function ReportsPage() {
  const { c } = useTheme();
  const reports=[{name:"Monthly Headcount Report",desc:"Employee counts, joins and exits by department",type:"HR",icon:Users,color:"bg-indigo-500/15 text-indigo-500"},{name:"Payroll Summary Q2 2026",desc:"Total payroll costs, department breakdown, tax analysis",type:"Finance",icon:DollarSign,color:"bg-emerald-500/15 text-emerald-500"},{name:"Project Delivery Report",desc:"On-time delivery rates, budget adherence, milestones",type:"Projects",icon:FolderKanban,color:"bg-violet-500/15 text-violet-500"},{name:"Attendance & Absenteeism",desc:"Monthly attendance patterns, late arrivals, overtime",type:"HR",icon:Clock,color:"bg-amber-500/15 text-amber-500"},{name:"Performance Review Summary",desc:"Rating distributions, top performers, improvement areas",type:"HR",icon:Award,color:"bg-rose-500/15 text-rose-500"},{name:"Department KPI Report",desc:"KPI achievement vs targets across all departments",type:"Analytics",icon:Target,color:"bg-cyan-500/15 text-cyan-500"}];
  return (
    <div>
      <PageHeader title="Reports" subtitle="Generate and download organization reports" actions={<Btn size="sm" icon={Plus}>Custom Report</Btn>}/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{reports.map(r=>(
        <Card key={r.name} className="p-5 cursor-pointer transition-all hover:-translate-y-0.5">
          <div className="flex items-start gap-3 mb-4"><div className={`w-10 h-10 rounded-xl ${r.color} flex items-center justify-center flex-shrink-0`}><r.icon size={18}/></div><div><h4 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>{r.name}</h4><p className={`text-xs mt-0.5 leading-relaxed ${c("text-slate-500","text-slate-400")}`}>{r.desc}</p></div></div>
          <div className="flex items-center justify-between"><Badge variant="default">{r.type}</Badge><button className="text-xs text-indigo-500 flex items-center gap-1"><Download size={11}/>Download</button></div>
        </Card>
      ))}</div>
    </div>
  );
}

// ─── EMPLOYEE PROFILE PAGE ───────────────────────────────────────────────────

function EmployeeProfilePage() {
  const { c, light } = useTheme();
  const { selectedEmployeeId, navigateTo } = useApp();
  const col = light ? LIGHT : DARK;
  const emp = employees.find(e => e.id === selectedEmployeeId) || employees[0];
  const [tab, setTab] = useState("overview");

  const tabs = ["Overview","Personal Info","Employment","Performance","Attendance","Leave","Payroll","Documents","Notes"];

  // Derived data
  const joinYear = parseInt(emp.joined.split(", ")[1] || "2021");
  const tenure = new Date().getFullYear() - joinYear;
  const perfScore = [4.8,4.2,4.5,3.8,3.5,4.7,4.0,4.3,4.6,3.9,4.4,4.9][emp.id - 1] || 4.2;
  const salaryMonthly = emp.salary / 12;

  // Chart data per employee
  const perfTrend = [
    { q: "Q1 2025", score: +(perfScore - 0.4).toFixed(1) },
    { q: "Q2 2025", score: +(perfScore - 0.2).toFixed(1) },
    { q: "Q3 2025", score: +(perfScore - 0.1).toFixed(1) },
    { q: "Q4 2025", score: +(perfScore + 0.1).toFixed(1) },
    { q: "Q1 2026", score: +(perfScore).toFixed(1) },
    { q: "Q2 2026", score: +(perfScore + 0.15).toFixed(1) },
  ];

  const attendanceLog = [
    { date: "Jun 28, 2026", in: "09:02 AM", out: "06:14 PM", hours: "9h 12m", status: "present" },
    { date: "Jun 27, 2026", in: "09:21 AM", out: "06:05 PM", hours: "8h 44m", status: "present" },
    { date: "Jun 26, 2026", in: "09:48 AM", out: "06:30 PM", hours: "8h 42m", status: "late" },
    { date: "Jun 25, 2026", in: "—",        out: "—",        hours: "—",      status: "absent" },
    { date: "Jun 24, 2026", in: "08:58 AM", out: "06:02 PM", hours: "9h 04m", status: "present" },
    { date: "Jun 23, 2026", in: "09:05 AM", out: "06:00 PM", hours: "8h 55m", status: "present" },
    { date: "Jun 22, 2026", in: "—",        out: "—",        hours: "—",      status: "absent" },
    { date: "Jun 21, 2026", in: "—",        out: "—",        hours: "—",      status: "absent" },
    { date: "Jun 20, 2026", in: "09:03 AM", out: "06:18 PM", hours: "9h 15m", status: "present" },
    { date: "Jun 19, 2026", in: "09:55 AM", out: "06:30 PM", hours: "8h 35m", status: "late" },
  ];

  const workHoursData = [
    { month: "Jan", hours: 168 }, { month: "Feb", hours: 152 },
    { month: "Mar", hours: 176 }, { month: "Apr", hours: 162 },
    { month: "May", hours: 171 }, { month: "Jun", hours: 158 },
  ];

  const salaryHistory = [
    { year: "2023", salary: Math.round(emp.salary * 0.82 / 1000) },
    { year: "2024", salary: Math.round(emp.salary * 0.9 / 1000) },
    { year: "2025", salary: Math.round(emp.salary * 0.96 / 1000) },
    { year: "2026", salary: Math.round(emp.salary / 1000) },
  ];

  const salaryBreakdown = [
    { name: "Basic Salary", value: 60, color: "#4F46E5" },
    { name: "HRA", value: 20, color: "#22C55E" },
    { name: "Allowances", value: 10, color: "#F59E0B" },
    { name: "Tax Deduction", value: 10, color: "#EF4444" },
  ];

  const skills = [
    { name: "React / Next.js", level: 92 },
    { name: "TypeScript", level: 88 },
    { name: "Node.js", level: 75 },
    { name: "System Design", level: 82 },
    { name: "CI/CD & DevOps", level: 70 },
    { name: "PostgreSQL", level: 78 },
  ];

  const competencies = [
    { name: "Leadership", score: 87 },
    { name: "Technical", score: 94 },
    { name: "Communication", score: 82 },
    { name: "Teamwork", score: 90 },
    { name: "Innovation", score: 85 },
    { name: "Delivery", score: 91 },
  ];

  const currentProjects = [
    { name: "Riaura Platform v3.0", progress: 68, status: "in-progress", role: "Lead Engineer" },
    { name: "Security Audit 2026", progress: 91, status: "review", role: "Contributor" },
    { name: "AI Analytics Engine", progress: 15, status: "planning", role: "Advisor" },
  ];

  const recentActivity = [
    { icon: CheckCircle2, color: "text-emerald-500", text: "Completed task: Implement OAuth2 flow", time: "2h ago" },
    { icon: MessageSquare, color: "text-indigo-500", text: "Added comment on Security Audit milestone", time: "4h ago" },
    { icon: Upload, color: "text-violet-500", text: "Uploaded Q2 performance self-review", time: "Yesterday" },
    { icon: CheckSquare, color: "text-amber-500", text: "Closed 3 bug tickets in Platform v3.0", time: "2 days ago" },
    { icon: Star, color: "text-rose-500", text: "Received 5-star peer review from James Wilson", time: "3 days ago" },
  ];

  const upcomingTasks = [
    { title: "Review PR: Auth module refactor", priority: "high", due: "Today" },
    { title: "Team stand-up preparation", priority: "medium", due: "Tomorrow" },
    { title: "Q3 architecture proposal doc", priority: "high", due: "Jul 5" },
    { title: "Mentor session with new hire", priority: "low", due: "Jul 8" },
  ];

  const teamMembers = [
    { initials: "JW", color: "bg-cyan-500", name: "James Wilson" },
    { initials: "NK", color: "bg-sky-500", name: "Nina Kowalski" },
    { initials: "OH", color: "bg-fuchsia-500", name: "Omar Hassan" },
    { initials: "TN", color: "bg-teal-500", name: "Tom Nakamura" },
  ];

  const performanceGoals = [
    { title: "Ship Platform v3.0 on schedule", progress: 68, status: "on-track" },
    { title: "Reduce API response time by 30%", progress: 52, status: "on-track" },
    { title: "Complete AWS Solutions Architect cert", progress: 35, status: "at-risk" },
    { title: "Mentor 2 junior engineers", progress: 80, status: "on-track" },
  ];

  const reviewHistory = [
    { date: "Apr 1, 2026", reviewer: "Elena Rodriguez", period: "Q1 2026", score: perfScore, status: "completed" },
    { date: "Jan 2, 2026", reviewer: "Elena Rodriguez", period: "Q4 2025", score: +(perfScore - 0.1).toFixed(1), status: "completed" },
    { date: "Oct 1, 2025", reviewer: "Elena Rodriguez", period: "Q3 2025", score: +(perfScore - 0.2).toFixed(1), status: "completed" },
    { date: "Jul 1, 2025", reviewer: "Elena Rodriguez", period: "Q2 2025", score: +(perfScore - 0.3).toFixed(1), status: "completed" },
    { date: "Apr 1, 2025", reviewer: "Elena Rodriguez", period: "Q1 2025", score: +(perfScore - 0.4).toFixed(1), status: "completed" },
  ];

  const leaveBalances = [
    { type: "Annual Leave", total: 24, used: 8, remaining: 16, color: "bg-indigo-500" },
    { type: "Sick Leave", total: 12, used: 2, remaining: 10, color: "bg-red-500" },
    { type: "Casual Leave", total: 6, used: 3, remaining: 3, color: "bg-amber-500" },
    { type: "Maternity/Paternity", total: 90, used: 0, remaining: 90, color: "bg-pink-500" },
  ];

  const leaveHistory = [
    { dates: "Jun 2–5, 2026", type: "Annual Leave", days: 4, reason: "Family vacation", status: "approved" },
    { dates: "May 14, 2026", type: "Sick Leave", days: 1, reason: "Unwell", status: "approved" },
    { dates: "Apr 18–19, 2026", type: "Annual Leave", days: 2, reason: "Personal work", status: "approved" },
    { dates: "Mar 3, 2026", type: "Casual Leave", days: 1, reason: "Errand", status: "approved" },
    { dates: "Feb 10–11, 2026", type: "Annual Leave", days: 2, reason: "Travel", status: "approved" },
    { dates: "Jan 2, 2026", type: "Sick Leave", days: 1, reason: "Doctor visit", status: "approved" },
  ];

  const payslips = [
    { month: "Jun 2026", gross: salaryMonthly * 1.15, net: salaryMonthly * 0.93, status: "processed" },
    { month: "May 2026", gross: salaryMonthly * 1.15, net: salaryMonthly * 0.93, status: "processed" },
    { month: "Apr 2026", gross: salaryMonthly * 1.15, net: salaryMonthly * 0.93, status: "processed" },
    { month: "Mar 2026", gross: salaryMonthly * 1.15, net: salaryMonthly * 0.93, status: "processed" },
    { month: "Feb 2026", gross: salaryMonthly * 1.15, net: salaryMonthly * 0.93, status: "processed" },
    { month: "Jan 2026", gross: salaryMonthly * 1.15, net: salaryMonthly * 0.93, status: "processed" },
  ];

  const documents = [
    { name: "Resume / CV", size: "420 KB", date: emp.joined, icon: FileText, color: "bg-indigo-500/15 text-indigo-500" },
    { name: "Offer Letter", size: "185 KB", date: emp.joined, icon: FileText, color: "bg-emerald-500/15 text-emerald-500" },
    { name: "Employment Contract", size: "312 KB", date: emp.joined, icon: FileText, color: "bg-violet-500/15 text-violet-500" },
    { name: "NDA Agreement", size: "98 KB", date: emp.joined, icon: Lock, color: "bg-amber-500/15 text-amber-500" },
    { name: "ID Proof", size: "256 KB", date: emp.joined, icon: User, color: "bg-rose-500/15 text-rose-500" },
    { name: "Educational Certificates", size: "1.2 MB", date: emp.joined, icon: Award, color: "bg-cyan-500/15 text-cyan-500" },
  ];

  const notes = [
    { author: "Elena Rodriguez", date: "Jun 20, 2026", content: "Excellent performance in Q2. Consistently delivers high-quality work ahead of schedule. Recommended for senior engineering track promotion in next cycle.", border: "border-indigo-500" },
    { author: "Marcus Johnson", date: "May 15, 2026", content: "Strong technical leadership on Platform v3.0. The auth module implementation was clean and well-documented.", border: "border-emerald-500" },
    { author: "Sanjay Iyer", date: "Apr 3, 2026", content: "Participated in Q1 board review. Strong candidate for internal mentorship program. Follow up at next 1:1.", border: "border-amber-500" },
    { author: "Elena Rodriguez", date: "Feb 10, 2026", content: "Annual review completed — rating 4.8/5. Salary increase approved for FY2026. Continue monitoring career development goals.", border: "border-violet-500" },
  ];

  const heatmapData = Array.from({ length: 30 }, (_, i) => {
    const rand = Math.random();
    const isWeekend = (i % 7 === 5 || i % 7 === 6);
    if (isWeekend) return { day: i + 1, status: "weekend" };
    const r = rand * 100;
    if (r < emp.attendance * 0.05) return { day: i + 1, status: "absent" };
    if (r < emp.attendance * 0.15) return { day: i + 1, status: "late" };
    return { day: i + 1, status: "present" };
  });

  const tbtn = (id: string) =>
    `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${tab === id ? "bg-indigo-600 text-white" : c("text-slate-400 hover:bg-slate-800/60 hover:text-slate-200","text-slate-500 hover:bg-slate-100 hover:text-slate-700")}`;

  const FieldBox = ({ label, value }: { label: string; value: string }) => (
    <div className={`p-3 rounded-lg ${c("bg-slate-800/50","bg-slate-50")}`}>
      <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${c("text-slate-500","text-slate-400")}`}>{label}</p>
      <p className={`text-sm font-medium ${c("text-slate-200","text-slate-800")}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Back button */}
      <button onClick={() => navigateTo("employees")} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${c("text-slate-400 hover:text-indigo-400","text-slate-500 hover:text-indigo-600")}`}>
        <ChevronLeft size={16}/> Back to Employees
      </button>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar + identity */}
          <div className="flex items-start gap-5 flex-1">
            <div className={`w-20 h-20 rounded-2xl ${emp.avatarColor} flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 ring-4 ${c("ring-slate-700","ring-slate-200")}`}>
              {emp.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className={`text-xl font-bold ${c("text-white","text-slate-900")}`}>{emp.name}</h1>
                <StatusBadge status={emp.status}/>
              </div>
              <p className={`text-sm mb-2 ${c("text-slate-400","text-slate-500")}`}>{emp.role}</p>
              <div className="flex items-center gap-1 mb-3"><Badge variant="info">{emp.dept}</Badge></div>
              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1.5 text-xs ${c("text-slate-500","text-slate-400")}`}>
                <span className="flex items-center gap-1.5"><MapPin size={11}/>{emp.location}</span>
                <span className="flex items-center gap-1.5"><Mail size={11}/><span className="truncate">{emp.email}</span></span>
                <span className="flex items-center gap-1.5"><Phone size={11}/>{emp.phone}</span>
                <span className="flex items-center gap-1.5"><Calendar size={11}/>Joined {emp.joined}</span>
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
            <Btn variant="primary" size="sm" icon={Edit2}>Edit Profile</Btn>
            <Btn variant="secondary" size="sm" icon={Send}>Send Message</Btn>
            <Btn variant="secondary" size="sm" icon={Download}>Download CV</Btn>
          </div>
        </div>

        {/* Quick stats */}
        <div className={`grid grid-cols-2 sm:grid-cols-5 gap-4 mt-5 pt-5 border-t ${c("border-white/[0.06]","border-slate-100")}`}>
          {[
            { label: "Attendance", value: `${emp.attendance}%`, sub: "this month", color: emp.attendance >= 95 ? "text-emerald-500" : "text-amber-500" },
            { label: "Performance", value: `${perfScore}/5`, sub: "Q2 2026 rating", color: "text-indigo-500" },
            { label: "Tenure", value: `${tenure}y`, sub: "with company", color: c("text-slate-200","text-slate-700") },
            { label: "Tasks", value: "42", sub: "completed YTD", color: "text-violet-500" },
            { label: "Salary", value: `$${(emp.salary/1000).toFixed(0)}K`, sub: "annual CTC", color: "text-emerald-500" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className={`text-[10px] font-semibold ${c("text-slate-300","text-slate-600")}`}>{s.label}</p>
              <p className={`text-[10px] ${c("text-slate-600","text-slate-400")}`}>{s.sub}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className={`flex gap-1 overflow-x-auto pb-1 flex-wrap`}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t.toLowerCase().replace(/ /g, "-"))} className={tbtn(t.toLowerCase().replace(/ /g, "-"))}>
            {t}
          </button>
        ))}
      </div>

      {/* ── TAB: Overview ── */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-3 ${c("text-white","text-slate-900")}`}>About</h3>
              <p className={`text-sm leading-relaxed ${c("text-slate-400","text-slate-600")}`}>
                {emp.name} is an experienced {emp.role} at RIAURA with {tenure}+ years of contributions to the {emp.dept} team.
                Known for delivering high-quality, scalable solutions and mentoring junior colleagues, {emp.name.split(" ")[0]} consistently
                exceeds expectations on complex cross-functional projects. Based in {emp.location}, {emp.name.split(" ")[0]} brings deep
                domain expertise and a collaborative work style to every initiative.
              </p>
            </Card>

            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Skills & Expertise</h3>
              <div className="space-y-3">
                {skills.map(skill => (
                  <div key={skill.name} className="flex items-center gap-3">
                    <span className={`text-xs w-40 flex-shrink-0 ${c("text-slate-300","text-slate-600")}`}>{skill.name}</span>
                    <div className="flex-1"><ProgressBar value={skill.level} color="bg-indigo-500"/></div>
                    <span className={`text-xs w-8 text-right font-semibold ${c("text-slate-400","text-slate-500")}`}>{skill.level}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Current Projects</h3>
              <div className="space-y-4">
                {currentProjects.map(p => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className={`text-sm font-medium ${c("text-slate-200","text-slate-700")}`}>{p.name}</span>
                        <span className={`ml-2 text-xs ${c("text-slate-500","text-slate-400")}`}>· {p.role}</span>
                      </div>
                      <StatusBadge status={p.status}/>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1"><ProgressBar value={p.progress} color="bg-indigo-500"/></div>
                      <span className={`text-xs w-8 ${c("text-slate-500","text-slate-400")}`}>{p.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg ${c("bg-slate-700/50","bg-slate-100")} flex items-center justify-center flex-shrink-0`}>
                      <a.icon size={13} className={a.color}/>
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs ${c("text-slate-300","text-slate-700")}`}>{a.text}</p>
                      <p className={`text-[10px] mt-0.5 ${c("text-slate-600","text-slate-400")}`}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Quick Stats</h3>
              <div className="space-y-3">
                {[
                  { icon: CheckCircle2, color: "text-emerald-500", label: "Tasks Completed", value: "42" },
                  { icon: Clock, color: "text-indigo-500", label: "Avg Hours/Day", value: "8.7h" },
                  { icon: Star, color: "text-amber-500", label: "Peer Rating", value: "4.9 / 5" },
                  { icon: FolderKanban, color: "text-violet-500", label: "Projects Active", value: "3" },
                  { icon: Award, color: "text-rose-500", label: "Recognitions", value: "7 this year" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${c("bg-slate-700/50","bg-slate-100")} flex items-center justify-center`}>
                      <s.icon size={14} className={s.color}/>
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{s.label}</p>
                    </div>
                    <span className={`text-sm font-semibold ${c("text-slate-200","text-slate-700")}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Upcoming Tasks</h3>
              <div className="space-y-2.5">
                {upcomingTasks.map((t, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${t.priority === "high" ? "bg-amber-500" : t.priority === "medium" ? "bg-indigo-500" : "bg-slate-500"}`}/>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${c("text-slate-300","text-slate-700")}`}>{t.title}</p>
                      <p className={`text-[10px] mt-0.5 ${c("text-slate-600","text-slate-400")}`}>{t.due}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Team Members</h3>
              <div className="space-y-3">
                {teamMembers.map(m => (
                  <div key={m.name} className="flex items-center gap-3">
                    <Avatar initials={m.initials} color={m.color} size="sm"/>
                    <span className={`text-sm ${c("text-slate-300","text-slate-700")}`}>{m.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: Personal Info ── */}
      {tab === "personal-info" && (
        <div className="space-y-5 max-w-4xl">
          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg ${c("bg-slate-800/50","bg-slate-50")} flex items-center justify-between`}>
                <div><p className={`text-[10px] font-semibold uppercase ${c("text-slate-500","text-slate-400")}`}>Work Email</p><p className={`text-sm mt-0.5 ${c("text-slate-200","text-slate-700")}`}>{emp.email}</p></div>
                <button className={c("text-slate-600 hover:text-slate-300","text-slate-400 hover:text-slate-600")}><Copy size={14}/></button>
              </div>
              <div className={`p-3 rounded-lg ${c("bg-slate-800/50","bg-slate-50")} flex items-center justify-between`}>
                <div><p className={`text-[10px] font-semibold uppercase ${c("text-slate-500","text-slate-400")}`}>Phone</p><p className={`text-sm mt-0.5 ${c("text-slate-200","text-slate-700")}`}>{emp.phone}</p></div>
                <button className={c("text-slate-600 hover:text-slate-300","text-slate-400 hover:text-slate-600")}><Copy size={14}/></button>
              </div>
              <div className={`p-3 rounded-lg ${c("bg-slate-800/50","bg-slate-50")} flex items-center justify-between`}>
                <div><p className={`text-[10px] font-semibold uppercase ${c("text-slate-500","text-slate-400")}`}>LinkedIn</p><p className={`text-sm mt-0.5 ${c("text-slate-200","text-slate-700")}`}>linkedin.com/in/{emp.name.toLowerCase().replace(/ /g,"-")}</p></div>
                <button className={c("text-slate-600 hover:text-slate-300","text-slate-400 hover:text-slate-600")}><Copy size={14}/></button>
              </div>
              <div className={`p-3 rounded-lg ${c("bg-slate-800/50","bg-slate-50")} flex items-center justify-between`}>
                <div><p className={`text-[10px] font-semibold uppercase ${c("text-slate-500","text-slate-400")}`}>GitHub</p><p className={`text-sm mt-0.5 ${c("text-slate-200","text-slate-700")}`}>github.com/{emp.name.split(" ")[0].toLowerCase()}</p></div>
                <button className={c("text-slate-600 hover:text-slate-300","text-slate-400 hover:text-slate-600")}><Copy size={14}/></button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Personal Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <FieldBox label="Date of Birth" value="Mar 14, 1990"/>
                <FieldBox label="Nationality" value="American"/>
                <FieldBox label="Gender" value="Not specified"/>
                <FieldBox label="Blood Type" value="O+"/>
                <FieldBox label="Marital Status" value="Single"/>
                <FieldBox label="Personal Email" value={`${emp.name.split(" ")[0].toLowerCase()}@gmail.com`}/>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Home Address</h3>
              <div className="grid grid-cols-2 gap-3">
                <FieldBox label="Street" value="142 Maple Ave, Apt 3B"/>
                <FieldBox label="City" value={emp.location}/>
                <FieldBox label="State" value="California"/>
                <FieldBox label="ZIP Code" value="94103"/>
                <FieldBox label="Country" value="United States"/>
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Emergency Contacts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Alex Chen", relation: "Spouse", phone: "+1 (555) 902-1122" },
                { name: "Linda Chen", relation: "Parent", phone: "+1 (555) 903-4455" },
              ].map(ec => (
                <div key={ec.name} className={`p-4 rounded-xl border ${c("bg-slate-700/20 border-white/[0.06]","bg-slate-50 border-slate-200")}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-indigo-600/20 flex items-center justify-center"><User size={14} className="text-indigo-500"/></div>
                    <div><p className={`text-sm font-semibold ${c("text-slate-200","text-slate-800")}`}>{ec.name}</p><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{ec.relation}</p></div>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${c("text-slate-500","text-slate-400")}`}><Phone size={11}/>{ec.phone}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: Employment ── */}
      {tab === "employment" && (
        <div className="space-y-5 max-w-4xl">
          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Current Position</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <FieldBox label="Job Title" value={emp.role}/>
              <FieldBox label="Department" value={emp.dept}/>
              <FieldBox label="Team" value="Platform Core"/>
              <FieldBox label="Reporting Manager" value="Elena Rodriguez"/>
              <FieldBox label="Work Type" value="Full-time"/>
              <FieldBox label="Work Mode" value="Hybrid"/>
              <FieldBox label="Employment Type" value="Permanent"/>
              <FieldBox label="Office Location" value={emp.location}/>
              <FieldBox label="Employee ID" value={`EMP-10${emp.id.toString().padStart(2,"0")}`}/>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Work Timeline</h3>
            <div className="relative pl-5 space-y-6">
              <div className={`absolute left-1.5 top-2 bottom-2 w-px ${c("bg-slate-700","bg-slate-200")}`}/>
              {[
                { date: emp.joined, title: emp.role, dept: emp.dept, desc: "Current role — leading core platform engineering initiatives and mentoring junior engineers." },
                { date: "Jan 2023", title: emp.role.replace("Senior","Mid-level"), dept: emp.dept, desc: "Promoted after consistently exceeding targets. Led migration of legacy auth system." },
                { date: "Jun 2020", title: "Junior " + emp.role.replace("Senior ","").replace("Lead","Engineer"), dept: emp.dept, desc: "Joined RIAURA as part of the early engineering team. Focused on frontend components and API integration." },
              ].map((item, i) => (
                <div key={i} className="relative flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 -ml-5 border-2 ${i === 0 ? "bg-indigo-500 border-indigo-500" : c("bg-slate-800 border-slate-600","bg-white border-slate-300")}`}/>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>{item.title}</h4>
                      {i === 0 && <Badge variant="success">Current</Badge>}
                    </div>
                    <p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{item.dept} · {item.date}</p>
                    <p className={`text-xs mt-2 leading-relaxed ${c("text-slate-400","text-slate-600")}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Assets & Equipment</h3>
            <div className="space-y-3">
              {[
                { asset: "MacBook Pro 16\" M3 Max", id: "ASSET-4821", assigned: emp.joined },
                { asset: "iPhone 15 Pro", id: "ASSET-4822", assigned: "Mar 1, 2023" },
                { asset: "LG 27\" 4K Monitor", id: "ASSET-4823", assigned: emp.joined },
                { asset: "YubiKey 5C NFC", id: "ASSET-4824", assigned: "Jun 1, 2022" },
              ].map(a => (
                <div key={a.id} className={`flex items-center justify-between p-3 rounded-lg ${c("bg-slate-700/20","bg-slate-50")}`}>
                  <div>
                    <p className={`text-sm font-medium ${c("text-slate-200","text-slate-800")}`}>{a.asset}</p>
                    <p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{a.id} · Assigned {a.assigned}</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: Performance ── */}
      {tab === "performance" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-5 flex flex-col items-center">
              <h3 className={`text-sm font-semibold mb-4 self-start ${c("text-white","text-slate-900")}`}>Overall Rating</h3>
              <div className="relative w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ value: perfScore }, { value: 5 - perfScore }]} cx="50%" cy="50%" innerRadius={42} outerRadius={58} startAngle={90} endAngle={-270} dataKey="value">
                      <Cell key="emp-pfilled" fill="#4F46E5"/><Cell key="emp-pempty" fill={c("#334155","#E2E8F0")}/>
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${c("text-white","text-slate-900")}`}>{perfScore}</span>
                  <span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>out of 5</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= Math.round(perfScore) ? "text-amber-500 fill-amber-500" : c("text-slate-600","text-slate-300")}/>)}
              </div>
              <p className={`text-xs mt-1 ${c("text-slate-500","text-slate-400")}`}>Q2 2026 · Excellent</p>
            </Card>

            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Rating Trend</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={perfTrend}>
                  <defs>
                    <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid}/>
                  <XAxis dataKey="q" tick={{ fill: col.tickColor, fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[3, 5]} tick={{ fill: col.tickColor, fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={(p: any) => <ChartTip {...p} light={light}/>}/>
                  <Area key="emp-score" type="monotone" dataKey="score" name="Rating" stroke="#4F46E5" strokeWidth={2} fill="url(#pfGrad)"/>
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Performance Goals</h3>
            <div className="space-y-4">
              {performanceGoals.map(goal => (
                <div key={goal.title}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm ${c("text-slate-200","text-slate-700")}`}>{goal.title}</span>
                    <StatusBadge status={goal.status}/>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1"><ProgressBar value={goal.progress} color={goal.status === "on-track" ? "bg-emerald-500" : "bg-amber-500"}/></div>
                    <span className={`text-xs w-8 ${c("text-slate-500","text-slate-400")}`}>{goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Competency Breakdown</h3>
            <div className="space-y-3">
              {competencies.map(comp => (
                <div key={comp.name} className="flex items-center gap-3">
                  <span className={`text-xs w-32 flex-shrink-0 ${c("text-slate-400","text-slate-600")}`}>{comp.name}</span>
                  <div className="flex-1"><ProgressBar value={comp.score} color="bg-indigo-500"/></div>
                  <span className={`text-xs w-8 text-right font-medium ${c("text-slate-400","text-slate-500")}`}>{comp.score}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className={`p-4 border-b ${c("border-white/[0.06]","border-slate-200")}`}>
              <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Review History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>
                  {["Date","Reviewer","Period","Score","Status"].map(h => <th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}
                </tr></thead>
                <tbody>{reviewHistory.map((r, i) => (
                  <tr key={i} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{r.date}</td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-300","text-slate-700")}`}>{r.reviewer}</td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{r.period}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500"/>
                        <span className={`text-sm font-semibold ${r.score >= 4.5 ? "text-emerald-500" : r.score >= 4 ? "text-amber-500" : "text-red-500"}`}>{r.score.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={r.status}/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: Attendance ── */}
      {tab === "attendance" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Today's Status</h3>
              <div className="flex flex-col items-center gap-3">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-emerald-500 bg-emerald-500/10`}>
                  <div className="text-center"><Clock size={22} className="text-emerald-500 mx-auto mb-0.5"/><p className={`text-xs font-semibold ${c("text-slate-300","text-slate-600")}`}>Punched In</p></div>
                </div>
                <p className="text-sm text-emerald-500 font-medium">In since 09:02 AM</p>
                <div className="w-full space-y-1.5 text-xs">
                  {[["Today's Hours","5h 22m"],["Break","30 min"],["Expected","8h 00m"]].map(([l,v]) => (
                    <div key={l} className="flex justify-between"><span className={c("text-slate-500","text-slate-400")}>{l}</span><span className={`font-semibold ${c("text-slate-200","text-slate-700")}`}>{v}</span></div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Monthly Stats</h3>
              <div className="space-y-3">
                {[
                  { label: "Days Present", value: Math.round(emp.attendance / 100 * 25).toString(), color: "text-emerald-500" },
                  { label: "Days Absent", value: (25 - Math.round(emp.attendance / 100 * 25)).toString(), color: "text-red-500" },
                  { label: "Late Arrivals", value: "2", color: "text-amber-500" },
                  { label: "Avg Hours/Day", value: "8.7h", color: c("text-slate-200","text-slate-700") },
                ].map(s => (
                  <div key={s.label} className="flex justify-between">
                    <span className={`text-sm ${c("text-slate-400","text-slate-500")}`}>{s.label}</span>
                    <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>30-Day Heatmap</h3>
              <div className="grid grid-cols-7 gap-1">
                {heatmapData.map((d, i) => (
                  <div key={i} title={`Day ${d.day}: ${d.status}`}
                    className={`w-full aspect-square rounded-sm ${
                      d.status === "present" ? "bg-emerald-500/70" :
                      d.status === "late" ? "bg-amber-500/70" :
                      d.status === "absent" ? "bg-red-500/40" :
                      c("bg-slate-700/30","bg-slate-100")
                    }`}/>
                ))}
              </div>
              <div className={`flex items-center gap-3 mt-3 text-[10px] ${c("text-slate-500","text-slate-400")}`}>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70"/>Present</div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-amber-500/70"/>Late</div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-red-500/40"/>Absent</div>
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Monthly Work Hours — 2026</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={workHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid}/>
                <XAxis dataKey="month" tick={{ fill: col.tickColor, fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: col.tickColor, fontSize: 11 }} axisLine={false} tickLine={false} domain={[130, 190]}/>
                <Tooltip content={(p: any) => <ChartTip {...p} light={light}/>}/>
                <Bar key="emp-hours" dataKey="hours" name="Work Hours" fill="#4F46E5" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div className={`p-4 border-b ${c("border-white/[0.06]","border-slate-200")}`}>
              <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Attendance Log</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>
                  {["Date","In Time","Out Time","Hours","Status"].map(h => <th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}
                </tr></thead>
                <tbody>{attendanceLog.map((a, i) => (
                  <tr key={i} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-300","text-slate-700")}`}>{a.date}</td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{a.in}</td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{a.out}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${c("text-slate-300","text-slate-700")}`}>{a.hours}</td>
                    <td className="px-4 py-3">
                      <Badge variant={a.status === "present" ? "success" : a.status === "late" ? "warning" : "danger"}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: Leave ── */}
      {tab === "leave" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {leaveBalances.map(l => (
              <Card key={l.type} className="p-4">
                <div className="flex items-center gap-2 mb-3"><div className={`w-2.5 h-2.5 rounded-full ${l.color}`}/><span className={`text-xs font-medium ${c("text-slate-300","text-slate-700")}`}>{l.type}</span></div>
                <div className={`text-2xl font-bold mb-1 ${c("text-white","text-slate-900")}`}>{l.remaining}<span className={`text-base font-normal ${c("text-slate-500","text-slate-400")}`}>/{l.total}</span></div>
                <p className={`text-xs mb-2 ${c("text-slate-500","text-slate-400")}`}>days remaining</p>
                <ProgressBar value={(l.used / l.total) * 100} color={l.color}/>
              </Card>
            ))}
          </div>

          <Card>
            <div className={`p-4 border-b ${c("border-white/[0.06]","border-slate-200")}`}>
              <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Leave History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>
                  {["Dates","Type","Days","Reason","Status"].map(h => <th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}
                </tr></thead>
                <tbody>{leaveHistory.map((l, i) => (
                  <tr key={i} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-300","text-slate-700")}`}>{l.dates}</td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{l.type}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${c("text-slate-300","text-slate-700")}`}>{l.days}</td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{l.reason}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status}/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Leave Calendar — June 2026</h3>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} className={`text-center text-[10px] font-medium ${c("text-slate-600","text-slate-400")}`}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              <div/>{/* offset */}
              {Array.from({ length: 30 }, (_, i) => {
                const d = i + 1;
                const isLeave = [2,3,4,5].includes(d);
                const isToday = d === 28;
                return (
                  <div key={d} className={`h-8 rounded flex items-center justify-center text-[11px] font-medium
                    ${isLeave ? "bg-amber-500/20 text-amber-500" :
                      isToday ? "bg-indigo-600/20 text-indigo-400" :
                      c("text-slate-500","text-slate-400")}`}>
                    {d}
                  </div>
                );
              })}
            </div>
            <div className={`flex items-center gap-4 mt-3 text-[10px] ${c("text-slate-500","text-slate-400")}`}>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-amber-500/20"/><span className="text-amber-500">Leave taken</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-indigo-600/20"/><span className="text-indigo-400">Today</span></div>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: Payroll ── */}
      {tab === "payroll" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Basic Salary", value: `$${(salaryMonthly * 0.6 / 1000).toFixed(1)}K`, sub: "per month", color: "text-indigo-500" },
              { label: "Allowances", value: `$${(salaryMonthly * 0.15 / 1000).toFixed(1)}K`, sub: "per month", color: "text-emerald-500" },
              { label: "Deductions", value: `$${(salaryMonthly * 0.22 / 1000).toFixed(1)}K`, sub: "tax & benefits", color: "text-red-500" },
              { label: "Net Pay", value: `$${(salaryMonthly * 0.93 / 1000).toFixed(1)}K`, sub: "take-home", color: c("text-white","text-slate-900") },
            ].map(s => (
              <Card key={s.label} className="p-4 text-center">
                <p className={`text-xs ${c("text-slate-500","text-slate-400")} mb-1`}>{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className={`text-[10px] mt-0.5 ${c("text-slate-600","text-slate-400")}`}>{s.sub}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Compensation History</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={salaryHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid}/>
                  <XAxis dataKey="year" tick={{ fill: col.tickColor, fontSize: 11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill: col.tickColor, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`}/>
                  <Tooltip content={(p: any) => <ChartTip {...p} light={light}/>}/>
                  <Line key="emp-salary" type="monotone" dataKey="salary" name="Annual Salary ($K)" stroke="#4F46E5" strokeWidth={2.5} dot={{ fill: "#4F46E5", r: 4 }}/>
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Salary Breakdown</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={salaryBreakdown} cx="50%" cy="50%" innerRadius={30} outerRadius={52} paddingAngle={2} dataKey="value">
                      {salaryBreakdown.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {salaryBreakdown.map(s => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: s.color }}/><span className={c("text-slate-400","text-slate-500")}>{s.name}</span></div>
                      <span className={`font-semibold ${c("text-slate-300","text-slate-700")}`}>{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className={`p-4 border-b ${c("border-white/[0.06]","border-slate-200")} flex items-center justify-between`}>
              <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Payslip History</h3>
              <Btn variant="secondary" size="sm" icon={Download}>Download All</Btn>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>
                  {["Month","Gross","Net Pay","Status","Payslip"].map(h => <th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}
                </tr></thead>
                <tbody>{payslips.map((p, i) => (
                  <tr key={i} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                    <td className={`px-4 py-3 text-sm font-medium ${c("text-slate-300","text-slate-700")}`}>{p.month}</td>
                    <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>${(p.gross / 1000).toFixed(1)}K</td>
                    <td className={`px-4 py-3 text-sm font-semibold ${c("text-white","text-slate-900")}`}>${(p.net / 1000).toFixed(1)}K</td>
                    <td className="px-4 py-3"><Badge variant="success">Processed</Badge></td>
                    <td className="px-4 py-3"><button className="text-xs text-indigo-500 flex items-center gap-1"><Download size={11}/>PDF</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: Documents ── */}
      {tab === "documents" && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <Btn variant="primary" size="sm" icon={Upload}>Upload Document</Btn>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map(doc => (
              <Card key={doc.name} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${doc.color} flex items-center justify-center flex-shrink-0`}>
                    <doc.icon size={18}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>{doc.name}</p>
                    <p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{doc.size} · Added {doc.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Btn variant="secondary" size="sm" icon={Download} className="flex-1 justify-center">Download</Btn>
                  <Btn variant="ghost" size="sm" icon={Eye}>Preview</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: Notes ── */}
      {tab === "notes" && (
        <div className="space-y-5 max-w-3xl">
          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-3 ${c("text-white","text-slate-900")}`}>Add Note</h3>
            <textarea rows={3} placeholder="Add a private note about this employee..." className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none mb-3 ${c("bg-slate-800/60 border-white/[0.08] text-slate-300 placeholder-slate-600 focus:border-indigo-500/50","bg-white border-slate-200 text-slate-700 placeholder-slate-400 focus:border-indigo-400")}`}/>
            <Btn variant="primary" size="sm" icon={Plus}>Add Note</Btn>
          </Card>

          <div className="space-y-4">
            {notes.map((note, i) => (
              <div key={i} className={`pl-4 border-l-2 ${note.border}`}>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center"><User size={11} className="text-indigo-500"/></div>
                      <span className={`text-xs font-semibold ${c("text-slate-300","text-slate-700")}`}>{note.author}</span>
                    </div>
                    <span className={`text-[10px] ${c("text-slate-600","text-slate-400")}`}>{note.date}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${c("text-slate-400","text-slate-600")}`}>{note.content}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MY WORK PAGE ────────────────────────────────────────────────────────────

const myWorkTasks = [
  { id: 1, title: "Implement OAuth2 authentication flow", project: "Riaura Platform v3.0", priority: "high", status: "in-progress", due: "Jul 5, 2026", timeLogged: "3h 20m", estimate: "8h", tags: ["backend","security"], subtasks: 4, done: 2 },
  { id: 2, title: "Set up CI/CD pipeline for staging", project: "Riaura Platform v3.0", priority: "critical", status: "todo", due: "Jul 3, 2026", timeLogged: "0h", estimate: "5h", tags: ["devops"], subtasks: 3, done: 0 },
  { id: 3, title: "Performance audit & optimization", project: "Riaura Platform v3.0", priority: "medium", status: "review", due: "Jul 10, 2026", timeLogged: "6h 15m", estimate: "6h", tags: ["performance"], subtasks: 6, done: 5 },
  { id: 4, title: "Write unit tests for payment module", project: "Riaura Platform v3.0", priority: "high", status: "in-progress", due: "Jul 8, 2026", timeLogged: "2h 45m", estimate: "4h", tags: ["testing"], subtasks: 8, done: 3 },
  { id: 5, title: "Code review: dashboard refactor PR #214", project: "Riaura Platform v3.0", priority: "medium", status: "todo", due: "Jul 4, 2026", timeLogged: "0h", estimate: "2h", tags: ["review"], subtasks: 0, done: 0 },
  { id: 6, title: "Create API documentation for v3 endpoints", project: "Riaura Platform v3.0", priority: "low", status: "done", due: "Jun 28, 2026", timeLogged: "4h 00m", estimate: "4h", tags: ["docs"], subtasks: 2, done: 2 },
  { id: 7, title: "Fix memory leak in WebSocket handler", project: "Riaura Platform v3.0", priority: "critical", status: "done", due: "Jun 26, 2026", timeLogged: "5h 30m", estimate: "3h", tags: ["bug","backend"], subtasks: 1, done: 1 },
  { id: 8, title: "Migrate auth service to microservice", project: "Data Warehouse Migration", priority: "high", status: "todo", due: "Jul 20, 2026", timeLogged: "0h", estimate: "12h", tags: ["architecture"], subtasks: 7, done: 0 },
];

const timesheetData = [
  { day: "Mon", riaura: 4.5, migration: 2.0, review: 1.5 },
  { day: "Tue", riaura: 5.0, migration: 1.5, review: 1.0 },
  { day: "Wed", riaura: 3.5, migration: 3.0, review: 1.5 },
  { day: "Thu", riaura: 6.0, migration: 0.0, review: 2.0 },
  { day: "Fri", riaura: 4.0, migration: 2.5, review: 1.5 },
];

const weeklyHoursData = [
  { week: "W1 Jun", hours: 38.5, target: 40 },
  { week: "W2 Jun", hours: 41.0, target: 40 },
  { week: "W3 Jun", hours: 39.5, target: 40 },
  { week: "W4 Jun", hours: 36.0, target: 40 },
  { week: "W1 Jul", hours: 8.0, target: 40 },
];

const scheduleToday = [
  { time: "09:00", end: "09:30", title: "Daily Standup", type: "meeting", color: "bg-indigo-500" },
  { time: "10:00", end: "12:00", title: "Implement OAuth2 — Deep Work", type: "focus", color: "bg-emerald-500" },
  { time: "12:00", end: "13:00", title: "Lunch Break", type: "break", color: "bg-slate-500" },
  { time: "13:00", end: "14:00", title: "Code Review Session with James", type: "meeting", color: "bg-violet-500" },
  { time: "14:00", end: "15:30", title: "Unit Tests — Payment Module", type: "focus", color: "bg-amber-500" },
  { time: "15:30", end: "16:00", title: "1:1 with Marcus Johnson", type: "meeting", color: "bg-cyan-500" },
  { time: "16:00", end: "17:30", title: "CI/CD Pipeline Setup", type: "focus", color: "bg-rose-500" },
  { time: "17:30", end: "18:00", title: "End of Day Review", type: "review", color: "bg-slate-400" },
];

const myGoals = [
  { title: "Ship Platform v3.0 Auth Module", progress: 68, due: "Aug 15", category: "Project", status: "on-track" },
  { title: "Complete AWS Solutions Architect Cert", progress: 45, due: "Sep 30", category: "Learning", status: "on-track" },
  { title: "Reduce bug rate to <2 per sprint", progress: 80, due: "Jul 31", category: "Quality", status: "on-track" },
  { title: "Mentor 2 junior engineers", progress: 50, due: "Dec 31", category: "Leadership", status: "at-risk" },
  { title: "Document all API endpoints (v3)", progress: 100, due: "Jun 28", category: "Docs", status: "completed" },
];

const timeLogEntries = [
  { date: "Jun 28", project: "Riaura Platform v3.0", task: "Implement OAuth2 auth flow", hours: "3h 20m", type: "development" },
  { date: "Jun 28", project: "Riaura Platform v3.0", task: "Daily standup", hours: "0h 30m", type: "meeting" },
  { date: "Jun 27", project: "Riaura Platform v3.0", task: "Unit tests — payment module", hours: "2h 45m", type: "testing" },
  { date: "Jun 27", project: "Data Warehouse Migration", task: "Architecture planning", hours: "1h 30m", type: "planning" },
  { date: "Jun 27", project: "Riaura Platform v3.0", task: "Code review: PR #212", hours: "1h 00m", type: "review" },
  { date: "Jun 26", project: "Riaura Platform v3.0", task: "Fix memory leak in WebSocket", hours: "5h 30m", type: "development" },
  { date: "Jun 26", project: "Riaura Platform v3.0", task: "Performance audit", hours: "2h 00m", type: "development" },
  { date: "Jun 25", project: "Riaura Platform v3.0", task: "API documentation", hours: "4h 00m", type: "docs" },
];

function MyWorkPage() {
  const { c, light } = useTheme();
  const { authUser } = useAuth();
  const { openModal } = useModal();
  const col = light ? LIGHT : DARK;
  const [tab, setTab] = useState("today");
  const [taskView, setTaskView] = useState<"kanban"|"list">("kanban");
  const [timerActive, setTimerActive] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(3 * 3600 + 20 * 60); // 3h 20m
  const [newTask, setNewTask] = useState("");
  const [logHours, setLogHours] = useState("");

  useEffect(() => {
    if (!timerActive) return;
    const iv = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, [timerActive]);

  const fmtTimer = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const tabs = [
    { id: "today", label: "Today" },
    { id: "tasks", label: "My Tasks" },
    { id: "projects", label: "Projects" },
    { id: "timesheet", label: "Timesheet" },
    { id: "goals", label: "Goals" },
    { id: "schedule", label: "Schedule" },
  ];

  const taskCols = [
    { id: "todo", label: "To Do", border: c("border-slate-600", "border-slate-300"), count: myWorkTasks.filter(t => t.status === "todo").length },
    { id: "in-progress", label: "In Progress", border: "border-indigo-500", count: myWorkTasks.filter(t => t.status === "in-progress").length },
    { id: "review", label: "Review", border: "border-amber-500", count: myWorkTasks.filter(t => t.status === "review").length },
    { id: "done", label: "Done", border: "border-emerald-500", count: myWorkTasks.filter(t => t.status === "done").length },
  ];

  const typeColors: Record<string, string> = {
    development: "bg-indigo-500/20 text-indigo-500",
    testing: "bg-emerald-500/20 text-emerald-500",
    meeting: "bg-violet-500/20 text-violet-500",
    review: "bg-amber-500/20 text-amber-500",
    planning: "bg-cyan-500/20 text-cyan-500",
    docs: "bg-pink-500/20 text-pink-500",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className={`rounded-2xl border p-6 ${c("bg-gradient-to-r from-indigo-600/20 to-slate-800/60 border-indigo-500/20","bg-gradient-to-r from-indigo-50 to-slate-50 border-indigo-200")}`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${authUser?.avatarColor||"bg-indigo-600"} flex items-center justify-center text-xl font-bold text-white shadow-lg`}>{authUser?.avatar||"SJ"}</div>
            <div>
              <h1 className={`text-2xl font-bold ${c("text-white","text-slate-900")}`}>My Work</h1>
              <p className={`text-sm mt-0.5 ${c("text-slate-400","text-slate-500")}`}>{authUser?.name||"Sanjay Iyer"} · {authUser?.title||"CEO"} · RIAURA Technologies</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`text-xs font-medium ${c("text-emerald-400","text-emerald-600")}`}>Working — In Office</span>
                </div>
                <span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>Sat, Jun 28 2026</span>
              </div>
            </div>
          </div>
          {/* Live Work Timer */}
          <div className={`rounded-xl border p-4 min-w-[180px] ${c("bg-slate-800/80 border-white/[0.08]","bg-white border-slate-200")} shadow-sm`}>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${c("text-slate-500","text-slate-400")}`}>Today's Work Time</p>
            <div className={`text-3xl font-mono font-bold tracking-tight ${timerActive ? "text-emerald-500" : c("text-slate-400","text-slate-500")}`}>{fmtTimer(timerSeconds)}</div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => setTimerActive(v => !v)}
                className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-colors ${timerActive ? "bg-red-600/20 text-red-400 hover:bg-red-600/30" : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"}`}>
                {timerActive ? "⏸ Pause" : "▶ Resume"}
              </button>
              <button className={`text-xs py-1.5 px-2 rounded-lg transition-colors ${c("bg-slate-700 text-slate-400 hover:bg-slate-600","bg-slate-100 text-slate-500 hover:bg-slate-200")}`}>Log</button>
            </div>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
          {[
            { label: "Tasks Today", value: "4", sub: "2 completed", color: "text-indigo-500", icon: CheckSquare },
            { label: "Hours Logged", value: "5h 17m", sub: "of 8h target", color: "text-emerald-500", icon: Clock },
            { label: "Open Tasks", value: "6", sub: "across 2 projects", color: "text-amber-500", icon: AlertCircle },
            { label: "In Review", value: "1", sub: "awaiting feedback", color: "text-violet-500", icon: Eye },
            { label: "This Week", value: "32h", sub: "of 40h target", color: "text-cyan-500", icon: BarChart3 },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-3 ${c("bg-slate-800/50","bg-white/70")} border ${c("border-white/[0.06]","border-slate-200/80")}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${c("text-slate-500","text-slate-400")}`}>{s.label}</span>
                <s.icon size={13} className={s.color} />
              </div>
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className={`text-[10px] mt-0.5 ${c("text-slate-600","text-slate-400")}`}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? "bg-indigo-600 text-white" : c("text-slate-400 hover:text-slate-200 hover:bg-slate-800/60","text-slate-500 hover:text-slate-700 hover:bg-slate-100")}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TODAY TAB ─────────────────────────────────────────── */}
      {tab === "today" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Schedule */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Today's Schedule</h3>
                <Btn variant="secondary" size="sm" icon={Plus}>Add Event</Btn>
              </div>
              <div className="space-y-2">
                {scheduleToday.map((ev, i) => {
                  const isNow = ev.time === "10:00"; // simulate current block
                  return (
                    <div key={i} className={`flex items-stretch gap-3 group rounded-xl p-3 transition-colors ${isNow ? c("bg-indigo-600/10 border border-indigo-500/30","bg-indigo-50 border border-indigo-200") : c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                      <div className="flex flex-col items-end w-14 flex-shrink-0 pt-0.5">
                        <span className={`text-xs font-semibold ${isNow ? "text-indigo-500" : c("text-slate-400","text-slate-500")}`}>{ev.time}</span>
                        <span className={`text-[10px] ${c("text-slate-600","text-slate-400")}`}>{ev.end}</span>
                      </div>
                      <div className={`w-1 rounded-full flex-shrink-0 ${ev.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-medium ${isNow ? c("text-indigo-300","text-indigo-700") : c("text-slate-200","text-slate-800")}`}>{ev.title}</p>
                          {isNow && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">NOW</span>}
                        </div>
                        <span className={`text-[10px] capitalize mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{ev.type}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Priority Tasks for Today */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Priority Tasks — Today</h3>
                <div className="flex items-center gap-1.5">
                  <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Quick add task..."
                    className={`text-xs border rounded-lg px-3 py-1.5 w-44 focus:outline-none transition-colors ${c("bg-slate-800 border-white/[0.08] text-slate-300 placeholder-slate-600 focus:border-indigo-500/50","bg-white border-slate-200 text-slate-700 placeholder-slate-400 focus:border-indigo-400")}`} />
                  <Btn variant="primary" size="sm" icon={Plus} />
                </div>
              </div>
              <div className="space-y-2">
                {myWorkTasks.filter(t => t.status !== "done").slice(0, 5).map(task => (
                  <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors group ${c("border-white/[0.06] hover:border-white/10 bg-slate-800/40","border-slate-200 hover:border-slate-300 bg-slate-50/60")}`}>
                    <button className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${task.status === "done" ? "bg-emerald-500 border-emerald-500" : c("border-slate-600 hover:border-indigo-400","border-slate-300 hover:border-indigo-400")}`}>
                      {task.status === "done" && <CheckCircle2 size={12} className="text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${c("text-slate-200","text-slate-800")}`}>{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] ${c("text-slate-500","text-slate-400")}`}>{task.project}</span>
                        <span className={`text-[10px] ${c("text-slate-600","text-slate-500")}`}>·</span>
                        <span className={`text-[10px] ${c("text-slate-500","text-slate-400")}`}>Due {task.due}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`text-[10px] flex items-center gap-1 ${c("text-slate-500","text-slate-400")}`}>
                        <Clock size={10} />{task.timeLogged}
                      </div>
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Quick Time Log */}
            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Log Time</h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-[11px] block mb-1 ${c("text-slate-500","text-slate-400")}`}>Task</label>
                  <select className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none ${c("bg-slate-800 border-white/[0.08] text-slate-300","bg-white border-slate-200 text-slate-700")}`}>
                    {myWorkTasks.filter(t => t.status !== "done").map(t => <option key={t.id}>{t.title.slice(0, 40)}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`text-[11px] block mb-1 ${c("text-slate-500","text-slate-400")}`}>Hours</label>
                    <input value={logHours} onChange={e => setLogHours(e.target.value)} placeholder="e.g. 2.5" className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none ${c("bg-slate-800 border-white/[0.08] text-slate-300 placeholder-slate-600","bg-white border-slate-200 text-slate-700 placeholder-slate-400")}`} />
                  </div>
                  <div>
                    <label className={`text-[11px] block mb-1 ${c("text-slate-500","text-slate-400")}`}>Type</label>
                    <select className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none ${c("bg-slate-800 border-white/[0.08] text-slate-300","bg-white border-slate-200 text-slate-700")}`}>
                      {["Development","Testing","Review","Meeting","Planning","Documentation"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`text-[11px] block mb-1 ${c("text-slate-500","text-slate-400")}`}>Notes</label>
                  <textarea rows={2} placeholder="What did you work on?" className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none resize-none ${c("bg-slate-800 border-white/[0.08] text-slate-300 placeholder-slate-600","bg-white border-slate-200 text-slate-700 placeholder-slate-400")}`} />
                </div>
                <Btn variant="primary" className="w-full justify-center" size="sm" icon={Plus}>Log Time</Btn>
              </div>
            </Card>

            {/* Daily Progress */}
            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Daily Progress</h3>
              <div className="space-y-3">
                {[
                  { label: "Tasks Completed", value: 2, total: 4, color: "bg-indigo-500" },
                  { label: "Hours Logged", value: 5.3, total: 8, color: "bg-emerald-500" },
                  { label: "Focus Time", value: 3.5, total: 6, color: "bg-violet-500" },
                ].map(p => (
                  <div key={p.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={c("text-slate-400","text-slate-500")}>{p.label}</span>
                      <span className={`font-semibold ${c("text-slate-300","text-slate-700")}`}>{p.value} / {p.total}</span>
                    </div>
                    <ProgressBar value={(p.value / p.total) * 100} color={p.color} />
                  </div>
                ))}
              </div>
              <div className={`mt-4 pt-4 border-t ${c("border-white/[0.06]","border-slate-100")}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={c("text-slate-500","text-slate-400")}>Productivity Score</span>
                  <span className="text-emerald-500 font-bold text-base">87%</span>
                </div>
                <ProgressBar value={87} color="bg-emerald-500" />
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: "Completed task", detail: "Create API documentation", time: "2h ago", color: "bg-emerald-500" },
                  { action: "Logged 3h 20m", detail: "OAuth2 auth flow", time: "3h ago", color: "bg-indigo-500" },
                  { action: "Submitted PR #218", detail: "Memory leak fix in WebSocket", time: "Yesterday", color: "bg-violet-500" },
                  { action: "Review requested", detail: "Performance audit PR", time: "Yesterday", color: "bg-amber-500" },
                  { action: "Comment added", detail: "Auth module discussion", time: "2d ago", color: "bg-cyan-500" },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${a.color}`} />
                    <div>
                      <span className={`text-xs font-medium ${c("text-slate-300","text-slate-700")}`}>{a.action}</span>
                      <span className={`text-xs ${c("text-slate-500","text-slate-400")}`}> — {a.detail}</span>
                      <p className={`text-[10px] mt-0.5 ${c("text-slate-600","text-slate-400")}`}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* MY TASKS TAB ──────────────────────────────────────── */}
      {tab === "tasks" && (
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <button onClick={() => setTaskView("kanban")} className={`w-8 h-8 rounded-lg flex items-center justify-center ${taskView === "kanban" ? "bg-indigo-600 text-white" : c("bg-slate-800/60 text-slate-500","bg-white border border-slate-200 text-slate-500")}`}><GripVertical size={15} /></button>
                <button onClick={() => setTaskView("list")} className={`w-8 h-8 rounded-lg flex items-center justify-center ${taskView === "list" ? "bg-indigo-600 text-white" : c("bg-slate-800/60 text-slate-500","bg-white border border-slate-200 text-slate-500")}`}><List size={15} /></button>
              </div>
              <span className={`text-sm ${c("text-slate-400","text-slate-500")}`}>{myWorkTasks.length} tasks total · {myWorkTasks.filter(t => t.status === "done").length} completed</span>
            </div>
            <Btn size="sm" icon={Plus} onClick={()=>openModal("create-task")}>New Task</Btn>
          </div>

          {taskView === "kanban" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {taskCols.map(col => {
                const colTasks = myWorkTasks.filter(t => t.status === col.id);
                return (
                  <div key={col.id} className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                      <div className={`w-3 h-3 rounded-sm border-2 ${col.border}`} />
                      <span className={`text-sm font-semibold ${c("text-slate-300","text-slate-700")}`}>{col.label}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${c("text-slate-600 bg-slate-800","text-slate-500 bg-slate-100")}`}>{col.count}</span>
                    </div>
                    {colTasks.map(task => (
                      <Card key={task.id} className="p-4 cursor-pointer transition-all hover:-translate-y-0.5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className={`text-xs font-semibold leading-snug ${c("text-slate-200","text-slate-800")}`}>{task.title}</p>
                          <PriorityBadge priority={task.priority} />
                        </div>
                        <p className={`text-[10px] mb-3 ${c("text-slate-500","text-slate-400")}`}>{task.project}</p>
                        {task.subtasks > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className={c("text-slate-500","text-slate-400")}>Subtasks</span>
                              <span className={c("text-slate-400","text-slate-500")}>{task.done}/{task.subtasks}</span>
                            </div>
                            <ProgressBar value={(task.done / task.subtasks) * 100} />
                          </div>
                        )}
                        <div className="flex items-center gap-1 mb-3 flex-wrap">
                          {task.tags.map(tag => <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded ${c("bg-slate-700 text-slate-400","bg-slate-100 text-slate-500")}`}>{tag}</span>)}
                        </div>
                        <div className={`flex items-center justify-between pt-2.5 border-t ${c("border-white/[0.06]","border-slate-100")} text-[10px] ${c("text-slate-500","text-slate-400")}`}>
                          <span className="flex items-center gap-1"><Clock size={10} />{task.timeLogged} / {task.estimate}</span>
                          <span>Due {task.due}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>
                    {["Task","Project","Priority","Status","Time Logged","Estimate","Due","Subtasks"].map(h => <th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {myWorkTasks.map(task => (
                      <tr key={task.id} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")} cursor-pointer`}>
                        <td className="px-4 py-3">
                          <p className={`text-sm font-medium ${c("text-slate-200","text-slate-800")}`}>{task.title}</p>
                          <div className="flex gap-1 mt-1">{task.tags.map(tag => <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded ${c("bg-slate-700 text-slate-400","bg-slate-100 text-slate-500")}`}>{tag}</span>)}</div>
                        </td>
                        <td className={`px-4 py-3 text-xs ${c("text-slate-400","text-slate-500")}`}>{task.project}</td>
                        <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                        <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                        <td className={`px-4 py-3 text-sm font-medium ${c("text-slate-300","text-slate-700")}`}>{task.timeLogged}</td>
                        <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{task.estimate}</td>
                        <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{task.due}</td>
                        <td className="px-4 py-3">
                          {task.subtasks > 0 ? (
                            <div className="flex items-center gap-2 w-24">
                              <ProgressBar value={(task.done / task.subtasks) * 100} />
                              <span className={`text-[10px] flex-shrink-0 ${c("text-slate-500","text-slate-400")}`}>{task.done}/{task.subtasks}</span>
                            </div>
                          ) : <span className={`text-[10px] ${c("text-slate-600","text-slate-400")}`}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* PROJECTS TAB ──────────────────────────────────────── */}
      {tab === "projects" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm ${c("text-slate-400","text-slate-500")}`}>Projects you're assigned to</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.filter(p => ["Riaura Platform v3.0","Data Warehouse Migration","Security Audit 2026"].includes(p.name)).map(p => (
              <Card key={p.id} className="p-5 cursor-pointer transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>{p.name}</h3>
                    <p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{p.manager} · {p.team} team members</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={p.priority} />
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <ProgressBar value={p.progress} color={p.progress >= 80 ? "bg-emerald-500" : p.progress >= 50 ? "bg-indigo-500" : "bg-amber-500"} />
                <div className="flex items-center justify-between mt-2 mb-4">
                  <span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{p.progress}% complete</span>
                  <span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>Due {p.deadline}</span>
                </div>
                <div className={`grid grid-cols-3 gap-3 pt-3 border-t ${c("border-white/[0.06]","border-slate-100")}`}>
                  {[["My Tasks", myWorkTasks.filter(t => t.project === p.name).length + " tasks"], ["Logged", myWorkTasks.filter(t => t.project === p.name).reduce((a, t) => a + (parseFloat(t.timeLogged) || 0), 0).toFixed(1) + "h"], ["Budget", `$${(p.spent/1000).toFixed(0)}K / $${(p.budget/1000).toFixed(0)}K`]].map(([l, v]) => (
                    <div key={l as string} className="text-center">
                      <div className={`text-xs font-semibold ${c("text-white","text-slate-900")}`}>{v}</div>
                      <div className={`text-[10px] ${c("text-slate-500","text-slate-400")}`}>{l}</div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TIMESHEET TAB ─────────────────────────────────────── */}
      {tab === "timesheet" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button className={`w-7 h-7 rounded flex items-center justify-center ${c("text-slate-400 hover:bg-slate-700","text-slate-500 hover:bg-slate-100")}`}><ChevronLeft size={15} /></button>
              <span className={`text-sm font-semibold ${c("text-slate-200","text-slate-800")}`}>Week of Jun 23 – Jun 27, 2026</span>
              <button className={`w-7 h-7 rounded flex items-center justify-center ${c("text-slate-400 hover:bg-slate-700","text-slate-500 hover:bg-slate-100")}`}><ChevronRight size={15} /></button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold text-emerald-500`}>32h logged</span>
              <Btn variant="primary" size="sm">Submit Timesheet</Btn>
            </div>
          </div>

          {/* Weekly Summary Chart */}
          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Weekly Hours by Project</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={timesheetData}>
                <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid} />
                <XAxis dataKey="day" tick={{ fill: col.tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: col.tickColor, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 10]} />
                <Tooltip content={(p: any) => <ChartTip {...p} light={light} />} />
                <Legend wrapperStyle={{ fontSize: 11, color: col.tickColor }} />
                <Bar key="ts-riaura" dataKey="riaura" name="Platform v3.0" stackId="a" fill="#4F46E5" radius={[0, 0, 0, 0]} />
                <Bar key="ts-migration" dataKey="migration" name="Data Migration" stackId="a" fill="#22C55E" radius={[0, 0, 0, 0]} />
                <Bar key="ts-review" dataKey="review" name="Reviews" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Timesheet Grid */}
          <Card className="overflow-hidden">
            <div className={`p-4 border-b ${c("border-white/[0.06]","border-slate-200")}`}>
              <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Weekly Timesheet</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>
                  <th className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")} w-48`}>Project / Task</th>
                  {["Mon","Tue","Wed","Thu","Fri"].map(d => <th key={d} className={`text-center text-xs font-semibold px-3 py-3 w-20 ${c("text-slate-500","text-slate-400")}`}>{d}</th>)}
                  <th className={`text-center text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>Total</th>
                </tr></thead>
                <tbody>
                  {[
                    { project: "Riaura Platform v3.0", task: "OAuth2 Auth Flow", hours: [1.5, 2.0, 0, 3.0, 1.5] },
                    { project: "Riaura Platform v3.0", task: "Unit Tests — Payment", hours: [1.5, 1.5, 1.5, 1.0, 0] },
                    { project: "Riaura Platform v3.0", task: "CI/CD Pipeline", hours: [1.5, 1.5, 0, 2.0, 1.5] },
                    { project: "Data Warehouse Migration", task: "Architecture Planning", hours: [2.0, 1.5, 3.0, 0, 2.5] },
                    { project: "Code Reviews", task: "PR Reviews", hours: [1.5, 1.0, 1.5, 2.0, 1.5] },
                  ].map((row, i) => {
                    const total = row.hours.reduce((a, b) => a + b, 0);
                    return (
                      <tr key={i} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                        <td className="px-4 py-3">
                          <p className={`text-xs font-medium ${c("text-slate-200","text-slate-800")}`}>{row.task}</p>
                          <p className={`text-[10px] ${c("text-slate-500","text-slate-400")}`}>{row.project}</p>
                        </td>
                        {row.hours.map((h, j) => (
                          <td key={j} className="px-3 py-3 text-center">
                            {h > 0 ? (
                              <span className={`text-xs font-medium px-2 py-1 rounded-md ${c("bg-indigo-600/20 text-indigo-400","bg-indigo-50 text-indigo-600")}`}>{h}h</span>
                            ) : <span className={`text-xs ${c("text-slate-700","text-slate-300")}`}>—</span>}
                          </td>
                        ))}
                        <td className={`px-4 py-3 text-center text-sm font-bold ${c("text-white","text-slate-900")}`}>{total}h</td>
                      </tr>
                    );
                  })}
                  {/* Totals row */}
                  <tr className={`${c("bg-slate-800/50","bg-slate-50")} font-semibold`}>
                    <td className={`px-4 py-3 text-xs font-bold ${c("text-slate-300","text-slate-700")}`}>Daily Total</td>
                    {[8.0, 7.5, 6.0, 8.0, 7.0].map((t, i) => (
                      <td key={i} className={`px-3 py-3 text-center text-sm font-bold ${t >= 8 ? "text-emerald-500" : t >= 6 ? "text-amber-500" : "text-red-500"}`}>{t}h</td>
                    ))}
                    <td className={`px-4 py-3 text-center text-sm font-bold text-emerald-500`}>36.5h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Time Log */}
          <Card>
            <div className={`p-4 border-b ${c("border-white/[0.06]","border-slate-200")} flex items-center justify-between`}>
              <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Recent Time Entries</h3>
              <Btn variant="secondary" size="sm" icon={Plus}>Log Time</Btn>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>
                  {["Date","Project","Task","Hours","Type","Actions"].map(h => <th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {timeLogEntries.map((entry, i) => (
                    <tr key={i} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                      <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")}`}>{entry.date}</td>
                      <td className={`px-4 py-3 text-sm ${c("text-slate-300","text-slate-700")}`}>{entry.project}</td>
                      <td className={`px-4 py-3 text-sm ${c("text-slate-400","text-slate-500")} max-w-xs truncate`}>{entry.task}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${c("text-white","text-slate-900")}`}>{entry.hours}</td>
                      <td className="px-4 py-3"><span className={`text-[10px] px-2 py-1 rounded-full font-medium ${typeColors[entry.type] || "bg-slate-500/20 text-slate-400"}`}>{entry.type}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className={`w-6 h-6 rounded flex items-center justify-center ${c("text-slate-500 hover:text-slate-300 hover:bg-slate-700","text-slate-400 hover:text-slate-600 hover:bg-slate-100")}`}><Edit2 size={11} /></button>
                          <button className={`w-6 h-6 rounded flex items-center justify-center ${c("text-slate-500 hover:text-red-400 hover:bg-slate-700","text-slate-400 hover:text-red-500 hover:bg-slate-100")}`}><Trash2 size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* GOALS TAB ─────────────────────────────────────────── */}
      {tab === "goals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm ${c("text-slate-400","text-slate-500")}`}>Personal goals and OKR alignment for Q3 2026</p>
            <Btn size="sm" icon={Plus}>Add Goal</Btn>
          </div>

          {/* Goal Cards */}
          <div className="space-y-3">
            {myGoals.map((goal, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${goal.status === "completed" ? "bg-emerald-500/20" : goal.status === "on-track" ? "bg-indigo-500/20" : "bg-amber-500/20"}`}>
                      <Target size={18} className={goal.status === "completed" ? "text-emerald-500" : goal.status === "on-track" ? "text-indigo-500" : "text-amber-500"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>{goal.title}</h4>
                        <Badge variant="default">{goal.category}</Badge>
                        <StatusBadge status={goal.status} />
                      </div>
                      <p className={`text-xs mt-0.5 ${c("text-slate-500","text-slate-400")}`}>Due {goal.due} · Q3 2026</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 max-w-xs">
                          <ProgressBar value={goal.progress} color={goal.status === "completed" ? "bg-emerald-500" : goal.status === "on-track" ? "bg-indigo-500" : "bg-amber-500"} />
                        </div>
                        <span className={`text-sm font-bold ${goal.status === "completed" ? "text-emerald-500" : goal.status === "on-track" ? "text-indigo-500" : "text-amber-500"}`}>{goal.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={`w-7 h-7 rounded flex items-center justify-center ${c("text-slate-500 hover:text-slate-300 hover:bg-slate-700","text-slate-400 hover:text-slate-600 hover:bg-slate-100")}`}><Edit2 size={13} /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Goals Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {[
              { label: "On Track", count: myGoals.filter(g => g.status === "on-track").length, color: "text-emerald-500", bg: c("bg-emerald-500/10","bg-emerald-50") },
              { label: "At Risk", count: myGoals.filter(g => g.status === "at-risk").length, color: "text-amber-500", bg: c("bg-amber-500/10","bg-amber-50") },
              { label: "Completed", count: myGoals.filter(g => g.status === "completed").length, color: "text-indigo-500", bg: c("bg-indigo-500/10","bg-indigo-50") },
              { label: "Avg Progress", count: `${Math.round(myGoals.reduce((a, g) => a + g.progress, 0) / myGoals.length)}%`, color: "text-violet-500", bg: c("bg-violet-500/10","bg-violet-50") },
            ].map(s => (
              <Card key={s.label} className={`p-4 ${s.bg}`}>
                <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
                <div className={`text-xs mt-1 ${c("text-slate-400","text-slate-500")}`}>{s.label}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SCHEDULE TAB ──────────────────────────────────────── */}
      {tab === "schedule" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Weekly Calendar */}
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className={`font-semibold ${c("text-white","text-slate-900")}`}>Week of Jun 23 – Jun 28, 2026</h3>
              <div className="flex gap-1">
                <button className={`w-7 h-7 rounded flex items-center justify-center ${c("text-slate-400 hover:bg-slate-700","text-slate-500 hover:bg-slate-100")}`}><ChevronLeft size={15} /></button>
                <button className={`w-7 h-7 rounded flex items-center justify-center ${c("text-slate-400 hover:bg-slate-700","text-slate-500 hover:bg-slate-100")}`}><ChevronRight size={15} /></button>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2 mb-3">
              <div /> {/* Time column header */}
              {["Mon 23","Tue 24","Wed 25","Thu 26","Fri 27","Sat 28"].map((d, i) => (
                <div key={d} className={`text-center text-xs font-semibold py-2 rounded-lg ${i === 5 ? "bg-indigo-600/20 text-indigo-400" : c("text-slate-500","text-slate-500")}`}>{d}</div>
              ))}
            </div>
            <div className="space-y-1.5">
              {["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"].map((time, ti) => (
                <div key={time} className="grid grid-cols-6 gap-2 items-center">
                  <div className={`text-[10px] text-right pr-2 ${c("text-slate-600","text-slate-400")}`}>{time}</div>
                  {[0, 1, 2, 3, 4, 5].map(di => {
                    const ev = di === 5 ? scheduleToday.find(e => e.time === time) : null;
                    return (
                      <div key={di} className={`h-9 rounded-lg text-[10px] flex items-center justify-center overflow-hidden ${ev ? `${ev.color} text-white font-medium px-1 text-center` : c("bg-slate-800/30","bg-slate-100/50")}`}>
                        {ev ? <span className="truncate px-1">{ev.title.split("—")[0].trim()}</span> : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>

          {/* Right: Upcoming + Availability */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Upcoming This Week</h3>
              <div className="space-y-3">
                {scheduleToday.filter(e => e.type === "meeting").map((ev, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${c("bg-slate-700/20","bg-slate-50")}`}>
                    <div className={`w-2 h-10 rounded-full flex-shrink-0 ${ev.color}`} />
                    <div>
                      <p className={`text-xs font-semibold ${c("text-slate-200","text-slate-800")}`}>{ev.title}</p>
                      <p className={`text-[10px] mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{ev.time} — {ev.end} · Today</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Availability Settings</h3>
              <div className="space-y-3">
                {[["Work Hours", "9:00 AM – 6:00 PM"], ["Timezone", "America/Los_Angeles"], ["Days Off", "Sat & Sun"], ["Focus Time", "10:00–12:00 AM"]].map(([l, v]) => (
                  <div key={l} className={`flex items-center justify-between p-2.5 rounded-lg ${c("bg-slate-700/20","bg-slate-50")}`}>
                    <span className={`text-xs ${c("text-slate-400","text-slate-500")}`}>{l}</span>
                    <span className={`text-xs font-semibold ${c("text-slate-200","text-slate-700")}`}>{v}</span>
                  </div>
                ))}
                <Btn variant="secondary" size="sm" icon={Edit2} className="w-full justify-center">Edit Availability</Btn>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────

const roleConfig: Record<UserRole, { icon: React.ElementType; color: string; bg: string; desc: string }> = {
  "super-admin":        { icon: ShieldCheck, color: "text-red-400",    bg: "bg-red-500/15 border-red-500/30",    desc: "Full system access · All modules" },
  "1st-level-manager":  { icon: Award,       color: "text-orange-400", bg: "bg-orange-500/15 border-orange-500/30", desc: "Director-level · Cross-dept view" },
  "2nd-level-manager":  { icon: Users,       color: "text-violet-400", bg: "bg-violet-500/15 border-violet-500/30", desc: "Senior Manager · Team analytics" },
  "manager":            { icon: Target,       color: "text-indigo-400", bg: "bg-indigo-500/15 border-indigo-500/30", desc: "Team Manager · Project access" },
  "team-lead":          { icon: Network,      color: "text-cyan-400",   bg: "bg-cyan-500/15 border-cyan-500/30",   desc: "Team Lead · Tasks & sprints" },
  "hr-admin":           { icon: FileText,     color: "text-pink-400",   bg: "bg-pink-500/15 border-pink-500/30",   desc: "HR Admin · People & payroll" },
  "employee":           { icon: User,         color: "text-emerald-400",bg: "bg-emerald-500/15 border-emerald-500/30", desc: "Employee · My work & tasks" },
};

function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("super-admin");
  const [email, setEmail]     = useState("sanjay.iyer@riaura.com");
  const [password, setPassword] = useState("Admin@2026");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  const pickAccount = (acc: AuthUser) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  };

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) { setError("Email is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const acc = demoAccounts.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (!acc) { setLoading(false); setError("Invalid credentials. Check the demo accounts below."); return; }
    setLoading(false);
    login(acc);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#060D1F", fontFamily: "'Inter',-apple-system,sans-serif" }}>
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0B1020 0%,#111827 50%,#0B1020 100%)" }}>
        {/* Grid decoration */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Glow */}
        <div className="absolute top-32 left-32 w-72 h-72 bg-indigo-600/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-32 right-16 w-56 h-56 bg-violet-600/15 rounded-full blur-[60px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <Layers size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">RIAURA</span>
            <span className="text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full ml-1">Work OS</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Enterprise HRMS<br/>
            <span className="text-indigo-400">built for teams</span><br/>
            that move fast.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            One platform for HR, projects, payroll, performance, and AI-powered insights. Trusted by 1,200+ people at RIAURA Technologies.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-10">
            {[
              { icon: Users, label: "1,248 Employees", sub: "Across 8 departments" },
              { icon: FolderKanban, label: "42 Active Projects", sub: "Tracked in real-time" },
              { icon: BarChart3, label: "AI-Powered Insights", sub: "Smart HR analytics" },
              { icon: ShieldCheck, label: "Role-Based Access", sub: "7 permission levels" },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                  <f.icon size={15} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{f.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex -space-x-2 mb-3">
            {demoAccounts.slice(0, 6).map(a => (
              <div key={a.id} className={`w-8 h-8 rounded-full ${a.avatarColor} border-2 border-[#0B1020] flex items-center justify-center text-[10px] font-bold text-white`}>{a.avatar}</div>
            ))}
          </div>
          <p className="text-xs text-slate-500">"The most complete Work OS we've ever used."</p>
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><Layers size={16} className="text-white"/></div>
            <span className="text-base font-bold text-white">RIAURA Work OS</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Sign in to your workspace</h2>
          <p className="text-slate-400 text-sm mb-7">Select your role and enter credentials below</p>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Select Role</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(roleConfig) as [UserRole, typeof roleConfig[UserRole]][]).map(([role, cfg]) => {
                const acc = demoAccounts.find(a => a.role === role);
                return (
                  <button key={role} onClick={() => acc && pickAccount(acc)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${selectedRole === role ? `${cfg.bg} border-opacity-100` : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedRole === role ? cfg.bg : "bg-slate-800"}`}>
                      <cfg.icon size={14} className={selectedRole === role ? cfg.color : "text-slate-500"} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${selectedRole === role ? "text-white" : "text-slate-400"}`}>
                        {demoAccounts.find(a => a.role === role)?.roleLabel}
                      </p>
                      <p className={`text-[9px] truncate ${selectedRole === role ? "text-slate-300" : "text-slate-600"}`}>{cfg.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Work Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  className="w-full bg-slate-800/60 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                  placeholder="you@riaura.com" autoComplete="email" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  className="w-full bg-slate-800/60 border border-white/[0.08] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                  placeholder="••••••••" autoComplete="current-password" />
                <button onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  <Eye size={15} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setRemember(v => !v)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${remember ? "bg-indigo-600" : "bg-slate-700"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${remember ? "left-4" : "left-0.5"}`} />
                </div>
                <span className="text-xs text-slate-400">Remember me</span>
              </label>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <button onClick={handleLogin} disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              ) : (
                <>Sign In<ChevronRight size={16} /></>
              )}
            </button>
          </div>

          {/* Demo credentials table */}
          <div className="mt-8 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Demo Credentials — Click to Auto-fill</p>
            <div className="space-y-1.5">
              {demoAccounts.map(acc => {
                const cfg = roleConfig[acc.role];
                const isActive = email === acc.email;
                return (
                  <button key={acc.id} onClick={() => pickAccount(acc)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left ${isActive ? "bg-indigo-600/15 border border-indigo-500/25" : "hover:bg-white/[0.03]"}`}>
                    <div className={`w-7 h-7 rounded-full ${acc.avatarColor} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>{acc.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-slate-300"}`}>{acc.name}</p>
                      <p className={`text-[10px] truncate ${isActive ? "text-slate-400" : "text-slate-600"}`}>{acc.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>{acc.roleLabel}</span>
                      <p className={`text-[10px] mt-0.5 font-mono ${isActive ? "text-slate-400" : "text-slate-600"}`}>{acc.password}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-700 mt-5">
            RIAURA Work OS · Enterprise Edition · v3.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED FORM HELPERS ─────────────────────────────────────────────────────

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  const { c } = useTheme();
  return <label className={`text-xs font-semibold block mb-1.5 ${c("text-slate-400","text-slate-600")}`}>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>;
}

function FInput({ value, onChange, placeholder, type = "text", className = "" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string }) {
  const { c } = useTheme();
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${c("bg-slate-800/60 border-white/[0.08] text-slate-200 placeholder-slate-600 focus:border-indigo-500/50","bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-400")} ${className}`} />;
}

function FSelect({ value, onChange, children, className = "" }: { value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string }) {
  const { c } = useTheme();
  return <select value={value} onChange={e => onChange(e.target.value)}
    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${c("bg-slate-800/60 border-white/[0.08] text-slate-200 focus:border-indigo-500/50","bg-white border-slate-200 text-slate-800 focus:border-indigo-400")} ${className}`}>
    {children}
  </select>;
}

function FTextarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  const { c } = useTheme();
  return <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none transition-colors ${c("bg-slate-800/60 border-white/[0.08] text-slate-200 placeholder-slate-600 focus:border-indigo-500/50","bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-400")}`} />;
}

function ModalOverlay({ title, subtitle, onClose, children, size = "md" }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode; size?: "sm" | "md" | "lg" | "xl" }) {
  const { c } = useTheme();
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className={`w-full ${sizes[size]} my-8 ${c("bg-slate-900 border-white/[0.08]","bg-white border-slate-200")} border rounded-2xl shadow-2xl`} onClick={e => e.stopPropagation()}>
        <div className={`flex items-start justify-between px-6 py-5 border-b ${c("border-white/[0.06]","border-slate-200")}`}>
          <div>
            <h2 className={`text-base font-bold ${c("text-white","text-slate-900")}`}>{title}</h2>
            {subtitle && <p className={`text-xs mt-0.5 ${c("text-slate-400","text-slate-500")}`}>{subtitle}</p>}
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${c("text-slate-500 hover:text-slate-300 hover:bg-slate-800","text-slate-400 hover:text-slate-600 hover:bg-slate-100")}`}><X size={18}/></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/25 mb-4"><CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0"/><p className="text-sm text-emerald-400">{message}</p></div>;
}

// ─── MODALS ───────────────────────────────────────────────────────────────────

function AddEmployeeModal({ onClose }: { onClose: () => void }) {
  const { c } = useTheme();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({
    firstName: "", lastName: "", email: "", phone: "", dob: "", gender: "Male", nationality: "American",
    dept: "Engineering", jobTitle: "", roleLevel: "employee", empType: "Full-time", workLoc: "Hybrid",
    manager: "James Wilson", startDate: "", probationEnd: "",
    salary: "", payFreq: "Monthly", currency: "USD", annualLeave: "24", sickLeave: "12",
  });
  const set = (k: string, v: string) => setF(prev => ({ ...prev, [k]: v }));

  const stepLabels = ["Personal Info", "Employment", "Compensation"];
  const deptList = ["Engineering","Product","Design","Analytics","Marketing","HR","Finance","Sales"];
  const managerList = employees.map(e => e.name);

  if (done) return (
    <ModalOverlay title="Add Employee" onClose={onClose}>
      <SuccessBanner message={`${f.firstName} ${f.lastName} has been added successfully and an onboarding email has been sent to ${f.email}.`} />
      <div className={`rounded-xl p-4 ${c("bg-slate-800/50","bg-slate-50")} space-y-2 text-sm`}>
        <div className="flex justify-between"><span className={c("text-slate-400","text-slate-500")}>Name</span><span className={c("text-white","text-slate-900")} >{f.firstName} {f.lastName}</span></div>
        <div className="flex justify-between"><span className={c("text-slate-400","text-slate-500")}>Department</span><span className={c("text-white","text-slate-900")}>{f.dept}</span></div>
        <div className="flex justify-between"><span className={c("text-slate-400","text-slate-500")}>Role</span><span className={c("text-white","text-slate-900")}>{f.jobTitle}</span></div>
        <div className="flex justify-between"><span className={c("text-slate-400","text-slate-500")}>Start Date</span><span className={c("text-white","text-slate-900")}>{f.startDate}</span></div>
      </div>
      <div className="flex gap-2 mt-4"><Btn variant="primary" onClick={onClose}>Done</Btn><Btn variant="secondary" onClick={() => { setDone(false); setStep(1); setF(p => ({...p, firstName:"", lastName:"", email:""})); }}>Add Another</Btn></div>
    </ModalOverlay>
  );

  return (
    <ModalOverlay title="Add New Employee" subtitle={`Step ${step} of 3 — ${stepLabels[step-1]}`} onClose={onClose} size="lg">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {stepLabels.map((sl, i) => (
          <div key={sl} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > i+1 ? "bg-emerald-500 text-white" : step === i+1 ? "bg-indigo-600 text-white" : c("bg-slate-700 text-slate-500","bg-slate-200 text-slate-400")}`}>
              {step > i+1 ? <CheckCircle2 size={14}/> : i+1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step === i+1 ? c("text-white","text-slate-800") : c("text-slate-500","text-slate-400")}`}>{sl}</span>
            {i < stepLabels.length-1 && <div className={`flex-1 h-px ${step > i+1 ? "bg-emerald-500" : c("bg-slate-700","bg-slate-200")}`}/>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel label="First Name" required/><FInput value={f.firstName} onChange={v => set("firstName",v)} placeholder="e.g. Sarah"/></div>
            <div><FieldLabel label="Last Name" required/><FInput value={f.lastName} onChange={v => set("lastName",v)} placeholder="e.g. Chen"/></div>
          </div>
          <div><FieldLabel label="Work Email" required/><FInput value={f.email} onChange={v => set("email",v)} placeholder="name@riaura.com" type="email"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel label="Phone Number"/><FInput value={f.phone} onChange={v => set("phone",v)} placeholder="+1 (555) 000-0000"/></div>
            <div><FieldLabel label="Date of Birth"/><FInput value={f.dob} onChange={v => set("dob",v)} type="date"/></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel label="Gender"/><FSelect value={f.gender} onChange={v => set("gender",v)}><option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option></FSelect></div>
            <div><FieldLabel label="Nationality"/><FInput value={f.nationality} onChange={v => set("nationality",v)} placeholder="e.g. American"/></div>
          </div>
          <div className={`flex items-center gap-3 p-4 rounded-xl border border-dashed ${c("border-slate-600 hover:border-indigo-500/50","border-slate-300 hover:border-indigo-400")} cursor-pointer transition-colors`}>
            <Upload size={20} className={c("text-slate-500","text-slate-400")}/>
            <div><p className={`text-sm font-medium ${c("text-slate-300","text-slate-600")}`}>Upload Profile Photo</p><p className={`text-xs ${c("text-slate-600","text-slate-400")}`}>PNG, JPG up to 5MB</p></div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel label="Department" required/><FSelect value={f.dept} onChange={v => set("dept",v)}>{deptList.map(d => <option key={d}>{d}</option>)}</FSelect></div>
            <div><FieldLabel label="Job Title" required/><FInput value={f.jobTitle} onChange={v => set("jobTitle",v)} placeholder="e.g. Senior Engineer"/></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel label="Role Level" required/><FSelect value={f.roleLevel} onChange={v => set("roleLevel",v)}><option value="employee">Employee</option><option value="team-lead">Team Lead</option><option value="manager">Manager</option><option value="2nd-level-manager">2nd Level Manager</option><option value="1st-level-manager">1st Level Manager</option></FSelect></div>
            <div><FieldLabel label="Employment Type"/><FSelect value={f.empType} onChange={v => set("empType",v)}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Intern</option></FSelect></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel label="Work Location"/><FSelect value={f.workLoc} onChange={v => set("workLoc",v)}><option>On-site</option><option>Remote</option><option>Hybrid</option></FSelect></div>
            <div><FieldLabel label="Reporting Manager"/><FSelect value={f.manager} onChange={v => set("manager",v)}>{managerList.map(m => <option key={m}>{m}</option>)}</FSelect></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel label="Start Date" required/><FInput value={f.startDate} onChange={v => set("startDate",v)} type="date"/></div>
            <div><FieldLabel label="Probation End Date"/><FInput value={f.probationEnd} onChange={v => set("probationEnd",v)} type="date"/></div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel label="Basic Salary (Annual)" required/><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span><FInput value={f.salary} onChange={v => set("salary",v)} placeholder="e.g. 120000" className="pl-7"/></div></div>
            <div><FieldLabel label="Pay Frequency"/><FSelect value={f.payFreq} onChange={v => set("payFreq",v)}><option>Monthly</option><option>Bi-weekly</option><option>Weekly</option></FSelect></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel label="Currency"/><FSelect value={f.currency} onChange={v => set("currency",v)}><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option></FSelect></div>
            {f.salary && <div className={`p-3 rounded-xl ${c("bg-indigo-600/10","bg-indigo-50")} border ${c("border-indigo-500/20","border-indigo-200")}`}><p className={`text-xs ${c("text-indigo-400","text-indigo-600")}`}>Monthly: <strong className="text-sm">${f.currency} {(parseFloat(f.salary||"0")/12).toLocaleString("en-US",{maximumFractionDigits:0})}</strong></p></div>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel label="Annual Leave (days)"/><FInput value={f.annualLeave} onChange={v => set("annualLeave",v)} placeholder="24"/></div>
            <div><FieldLabel label="Sick Leave (days)"/><FInput value={f.sickLeave} onChange={v => set("sickLeave",v)} placeholder="12"/></div>
          </div>
          <div className={`p-4 rounded-xl ${c("bg-slate-800/50","bg-slate-50")} space-y-2`}>
            <p className={`text-xs font-semibold ${c("text-slate-400","text-slate-600")}`}>Summary</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[["Name",`${f.firstName} ${f.lastName}`],["Email",f.email],["Department",f.dept],["Title",f.jobTitle],["Type",f.empType],["Location",f.workLoc]].map(([l,v]) => v ? <div key={l}><span className={c("text-slate-500","text-slate-400")}>{l}: </span><span className={c("text-slate-200","text-slate-700")}>{v}</span></div> : null)}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.06]">
        <Btn variant="secondary" onClick={() => step > 1 ? setStep(s => s-1) : onClose()}>{step > 1 ? "← Back" : "Cancel"}</Btn>
        {step < 3
          ? <Btn variant="primary" onClick={() => setStep(s => s+1)} icon={ChevronRight}>Next Step</Btn>
          : <Btn variant="primary" onClick={() => { if (f.firstName && f.email && f.jobTitle) setDone(true); }}>Create Employee</Btn>
        }
      </div>
    </ModalOverlay>
  );
}

function AddDepartmentModal({ onClose }: { onClose: () => void }) {
  const { c } = useTheme();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", head: "", parent: "None", desc: "", code: "", budget: "", color: "bg-indigo-500" });
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const colors = ["bg-indigo-500","bg-emerald-500","bg-violet-500","bg-amber-500","bg-rose-500","bg-cyan-500","bg-pink-500","bg-teal-500"];

  if (done) return (
    <ModalOverlay title="Add Department" onClose={onClose}>
      <SuccessBanner message={`${f.name} department created successfully.`}/>
      <Btn variant="primary" onClick={onClose}>Done</Btn>
    </ModalOverlay>
  );

  return (
    <ModalOverlay title="Add New Department" subtitle="Create a new organizational department" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Department Name" required/><FInput value={f.name} onChange={v => set("name",v)} placeholder="e.g. Engineering"/></div>
          <div><FieldLabel label="Department Code"/><FInput value={f.code} onChange={v => set("code",v)} placeholder="e.g. ENG-001"/></div>
        </div>
        <div><FieldLabel label="Head of Department" required/><FSelect value={f.head} onChange={v => set("head",v)}><option value="">Select manager...</option>{employees.map(e => <option key={e.id}>{e.name}</option>)}</FSelect></div>
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Parent Department"/><FSelect value={f.parent} onChange={v => set("parent",v)}><option>None (Top-level)</option>{departments.map(d => <option key={d.id}>{d.name}</option>)}</FSelect></div>
          <div><FieldLabel label="Annual Budget (USD)"/><FInput value={f.budget} onChange={v => set("budget",v)} placeholder="e.g. 1500000"/></div>
        </div>
        <div><FieldLabel label="Description"/><FTextarea value={f.desc} onChange={v => set("desc",v)} placeholder="Brief description of this department's purpose and responsibilities..."/></div>
        <div>
          <FieldLabel label="Department Color"/>
          <div className="flex gap-2 mt-1">{colors.map(col => <button key={col} onClick={() => set("color",col)} className={`w-7 h-7 rounded-full ${col} transition-transform ${f.color === col ? "scale-125 ring-2 ring-white/40" : "hover:scale-110"}`}/>)}</div>
        </div>
        <div className="flex gap-2 pt-2">
          <Btn variant="primary" icon={Plus} onClick={() => { if (f.name && f.head) setDone(true); }}>Create Department</Btn>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </ModalOverlay>
  );
}

function CreateTeamModal({ onClose }: { onClose: () => void }) {
  const { c } = useTheme();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", dept: "Engineering", lead: "", desc: "", type: "Engineering", goals: "" });
  const [selected, setSelected] = useState<number[]>([]);
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const toggle = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  if (done) return (
    <ModalOverlay title="Create Team" onClose={onClose}>
      <SuccessBanner message={`Team "${f.name}" created with ${selected.length} members.`}/>
      <Btn variant="primary" onClick={onClose}>Done</Btn>
    </ModalOverlay>
  );

  return (
    <ModalOverlay title="Create New Team" subtitle="Build a cross-functional team" onClose={onClose} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Team Name" required/><FInput value={f.name} onChange={v => set("name",v)} placeholder="e.g. Platform Core"/></div>
          <div><FieldLabel label="Team Type"/><FSelect value={f.type} onChange={v => set("type",v)}>{["Engineering","Design","Product","Marketing","Sales","Support","HR","Finance","Data"].map(t => <option key={t}>{t}</option>)}</FSelect></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Department" required/><FSelect value={f.dept} onChange={v => set("dept",v)}>{departments.map(d => <option key={d.id}>{d.name}</option>)}</FSelect></div>
          <div><FieldLabel label="Team Lead" required/><FSelect value={f.lead} onChange={v => set("lead",v)}><option value="">Select team lead...</option>{employees.map(e => <option key={e.id}>{e.name}</option>)}</FSelect></div>
        </div>
        <div><FieldLabel label="Team Description"/><FTextarea value={f.desc} onChange={v => set("desc",v)} placeholder="What does this team focus on?"/></div>
        <div><FieldLabel label="Team Goals / OKR Focus"/><FTextarea value={f.goals} onChange={v => set("goals",v)} placeholder="Key goals and objectives for this team..." rows={2}/></div>
        <div>
          <FieldLabel label={`Add Members (${selected.length} selected)`}/>
          <div className={`max-h-48 overflow-y-auto rounded-xl border ${c("border-white/[0.08]","border-slate-200")} divide-y ${c("divide-white/[0.04]","divide-slate-100")}`}>
            {employees.map(e => (
              <label key={e.id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${selected.includes(e.id) ? c("bg-indigo-600/10","bg-indigo-50") : c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                <input type="checkbox" checked={selected.includes(e.id)} onChange={() => toggle(e.id)} className="rounded accent-indigo-500"/>
                <Avatar initials={e.avatar} color={e.avatarColor} size="sm"/>
                <div className="flex-1"><p className={`text-sm font-medium ${c("text-slate-200","text-slate-800")}`}>{e.name}</p><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>{e.role} · {e.dept}</p></div>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Btn variant="primary" icon={Plus} onClick={() => { if (f.name && f.lead) setDone(true); }}>Create Team</Btn>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </ModalOverlay>
  );
}

function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const { c } = useTheme();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", code: "PROJ-009", client: "", dept: "Engineering", manager: "", priority: "high", status: "planning", desc: "", startDate: "", deadline: "", budget: "" });
  const [members, setMembers] = useState<number[]>([]);
  const [milestones, setMilestones] = useState([{ title: "", date: "" }, { title: "", date: "" }]);
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const toggle = (id: number) => setMembers(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const priorityOpts = [{ v: "critical", label: "Critical", color: "text-red-400" }, { v: "high", label: "High", color: "text-amber-400" }, { v: "medium", label: "Medium", color: "text-indigo-400" }, { v: "low", label: "Low", color: "text-slate-400" }];

  if (done) return (
    <ModalOverlay title="Create Project" onClose={onClose}>
      <SuccessBanner message={`Project "${f.name}" (${f.code}) has been created and team members notified.`}/>
      <Btn variant="primary" onClick={onClose}>View Project</Btn>
    </ModalOverlay>
  );

  return (
    <ModalOverlay title="Create New Project" subtitle="Set up a project with team and timeline" onClose={onClose} size="xl">
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><FieldLabel label="Project Name" required/><FInput value={f.name} onChange={v => set("name",v)} placeholder="e.g. Customer Portal 3.0"/></div>
          <div><FieldLabel label="Project Code"/><FInput value={f.code} onChange={v => set("code",v)} placeholder="PROJ-009"/></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Department" required/><FSelect value={f.dept} onChange={v => set("dept",v)}>{departments.map(d => <option key={d.id}>{d.name}</option>)}</FSelect></div>
          <div><FieldLabel label="Project Manager" required/><FSelect value={f.manager} onChange={v => set("manager",v)}><option value="">Select manager...</option>{employees.map(e => <option key={e.id}>{e.name}</option>)}</FSelect></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Client / Stakeholder"/><FInput value={f.client} onChange={v => set("client",v)} placeholder="e.g. Internal / ACME Corp"/></div>
          <div><FieldLabel label="Status"/><FSelect value={f.status} onChange={v => set("status",v)}><option value="planning">Planning</option><option value="in-progress">Active / In Progress</option><option value="review">In Review</option><option value="on-hold">On Hold</option></FSelect></div>
        </div>
        <div>
          <FieldLabel label="Priority" required/>
          <div className="flex gap-2 mt-1">{priorityOpts.map(opt => <button key={opt.v} onClick={() => set("priority",opt.v)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${f.priority === opt.v ? "bg-indigo-600 text-white border-indigo-500" : c("border-white/[0.08] text-slate-400 hover:border-white/20","border-slate-200 text-slate-500 hover:border-slate-300")}`}>{opt.label}</button>)}</div>
        </div>
        <div><FieldLabel label="Description"/><FTextarea value={f.desc} onChange={v => set("desc",v)} placeholder="Project overview, goals, and scope..." rows={3}/></div>
        <div className="grid grid-cols-3 gap-4">
          <div><FieldLabel label="Start Date" required/><FInput value={f.startDate} onChange={v => set("startDate",v)} type="date"/></div>
          <div><FieldLabel label="Deadline" required/><FInput value={f.deadline} onChange={v => set("deadline",v)} type="date"/></div>
          <div><FieldLabel label="Total Budget (USD)"/><FInput value={f.budget} onChange={v => set("budget",v)} placeholder="e.g. 500000"/></div>
        </div>
        <div>
          <FieldLabel label="Milestones"/>
          <div className="space-y-2">{milestones.map((m, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <div className="col-span-2"><FInput value={m.title} onChange={v => setMilestones(p => p.map((x, j) => j === i ? {...x, title: v} : x))} placeholder={`Milestone ${i+1} name`}/></div>
              <FInput value={m.date} onChange={v => setMilestones(p => p.map((x, j) => j === i ? {...x, date: v} : x))} type="date"/>
            </div>
          ))}</div>
          <button onClick={() => setMilestones(p => [...p, { title: "", date: "" }])} className="text-xs text-indigo-500 mt-2 hover:text-indigo-400">+ Add milestone</button>
        </div>
        <div>
          <FieldLabel label={`Team Members (${members.length} selected)`}/>
          <div className={`max-h-40 overflow-y-auto rounded-xl border ${c("border-white/[0.08]","border-slate-200")} divide-y ${c("divide-white/[0.04]","divide-slate-100")}`}>
            {employees.map(e => (
              <label key={e.id} className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${members.includes(e.id) ? c("bg-indigo-600/10","bg-indigo-50") : c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                <input type="checkbox" checked={members.includes(e.id)} onChange={() => toggle(e.id)} className="rounded accent-indigo-500"/>
                <Avatar initials={e.avatar} color={e.avatarColor} size="sm"/>
                <span className={`text-sm ${c("text-slate-200","text-slate-700")}`}>{e.name}</span>
                <span className={`ml-auto text-xs ${c("text-slate-500","text-slate-400")}`}>{e.dept}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Btn variant="primary" icon={Plus} onClick={() => { if (f.name && f.manager) setDone(true); }}>Create Project</Btn>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </ModalOverlay>
  );
}

function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const { c } = useTheme();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ title: "", project: "Riaura Platform v3.0", assignee: "", priority: "high", status: "todo", dueDate: "", estimate: "", desc: "", tagInput: "" });
  const [tags, setTags] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState(["", ""]);
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const addTag = () => { if (f.tagInput.trim()) { setTags(p => [...p, f.tagInput.trim()]); set("tagInput", ""); }};
  const projectList = projects.map(p => p.name);
  const priorityOpts = ["critical","high","medium","low"];

  if (done) return (
    <ModalOverlay title="Create Task" onClose={onClose}>
      <SuccessBanner message={`Task "${f.title}" created and assigned to ${f.assignee || "Unassigned"}.`}/>
      <Btn variant="primary" onClick={onClose}>Done</Btn>
    </ModalOverlay>
  );

  return (
    <ModalOverlay title="Create New Task" subtitle="Define work item with assignee and deadline" onClose={onClose} size="lg">
      <div className="space-y-4">
        <div><FieldLabel label="Task Title" required/><FInput value={f.title} onChange={v => set("title",v)} placeholder="e.g. Implement dark mode for dashboard"/></div>
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Project" required/><FSelect value={f.project} onChange={v => set("project",v)}>{projectList.map(p => <option key={p}>{p}</option>)}</FSelect></div>
          <div><FieldLabel label="Assignee"/><FSelect value={f.assignee} onChange={v => set("assignee",v)}><option value="">Unassigned</option>{employees.map(e => <option key={e.id}>{e.name}</option>)}</FSelect></div>
        </div>
        <div>
          <FieldLabel label="Priority" required/>
          <div className="flex gap-2 mt-1">{priorityOpts.map(opt => <button key={opt} onClick={() => set("priority",opt)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-colors ${f.priority === opt ? "bg-indigo-600 text-white border-indigo-500" : c("border-white/[0.08] text-slate-400 hover:border-white/20","border-slate-200 text-slate-500 hover:border-slate-300")}`}>{opt}</button>)}</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><FieldLabel label="Status"/><FSelect value={f.status} onChange={v => set("status",v)}><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="review">In Review</option><option value="done">Done</option></FSelect></div>
          <div><FieldLabel label="Due Date" required/><FInput value={f.dueDate} onChange={v => set("dueDate",v)} type="date"/></div>
          <div><FieldLabel label="Estimate (hrs)"/><FInput value={f.estimate} onChange={v => set("estimate",v)} placeholder="e.g. 4"/></div>
        </div>
        <div><FieldLabel label="Description"/><FTextarea value={f.desc} onChange={v => set("desc",v)} placeholder="Task details, acceptance criteria, notes..."/></div>
        <div>
          <FieldLabel label="Tags"/>
          <div className="flex gap-2 mb-2">{tags.map(t => <span key={t} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${c("bg-slate-700 text-slate-300","bg-slate-100 text-slate-600")}`}>{t}<button onClick={() => setTags(p => p.filter(x => x !== t))} className="ml-0.5 opacity-60 hover:opacity-100"><X size={11}/></button></span>)}</div>
          <div className="flex gap-2"><FInput value={f.tagInput} onChange={v => set("tagInput",v)} placeholder="Add tag..." className="flex-1" /><Btn variant="secondary" size="sm" onClick={addTag}>Add</Btn></div>
        </div>
        <div>
          <FieldLabel label="Subtasks"/>
          <div className="space-y-2">{subtasks.map((st, i) => <FInput key={i} value={st} onChange={v => setSubtasks(p => p.map((x, j) => j === i ? v : x))} placeholder={`Subtask ${i+1}`}/>)}</div>
          <button onClick={() => setSubtasks(p => [...p, ""])} className="text-xs text-indigo-500 mt-2 hover:text-indigo-400">+ Add subtask</button>
        </div>
        <div className="flex gap-2 pt-2">
          <Btn variant="primary" icon={Plus} onClick={() => { if (f.title && f.project) setDone(true); }}>Create Task</Btn>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </ModalOverlay>
  );
}

function CreateEventModal({ onClose }: { onClose: () => void }) {
  const { c } = useTheme();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ title: "", date: "", startTime: "09:00", endTime: "10:00", allDay: false, type: "meeting", color: "bg-indigo-500", desc: "", location: "", link: "", recurring: false, freq: "weekly", endDate: "" });
  const [attendees, setAttendees] = useState<number[]>([]);
  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));
  const eventTypes = ["meeting","focus","event","deadline","holiday"];
  const colors = ["bg-indigo-500","bg-emerald-500","bg-violet-500","bg-amber-500","bg-rose-500","bg-cyan-500"];

  if (done) return (
    <ModalOverlay title="Create Event" onClose={onClose}>
      <SuccessBanner message={`"${f.title}" has been added to the calendar${attendees.length > 0 ? ` and ${attendees.length} attendees notified` : ""}.`}/>
      <Btn variant="primary" onClick={onClose}>Done</Btn>
    </ModalOverlay>
  );

  return (
    <ModalOverlay title="Create New Event" subtitle="Schedule an event on the team calendar" onClose={onClose} size="lg">
      <div className="space-y-4">
        <div><FieldLabel label="Event Title" required/><FInput value={f.title} onChange={v => set("title",v)} placeholder="e.g. Q3 Planning Session"/></div>
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Event Type"/><FSelect value={f.type} onChange={v => set("type",v)}>{eventTypes.map(t => <option key={t} className="capitalize">{t}</option>)}</FSelect></div>
          <div><FieldLabel label="Date" required/><FInput value={f.date} onChange={v => set("date",v)} type="date"/></div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => set("allDay", !f.allDay)} className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${f.allDay ? "bg-indigo-600" : c("bg-slate-700","bg-slate-300")}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${f.allDay ? "left-4" : "left-0.5"}`}/></div>
            <span className={`text-xs ${c("text-slate-400","text-slate-600")}`}>All Day</span>
          </label>
        </div>
        {!f.allDay && <div className="grid grid-cols-2 gap-4"><div><FieldLabel label="Start Time"/><FInput value={f.startTime} onChange={v => set("startTime",v)} type="time"/></div><div><FieldLabel label="End Time"/><FInput value={f.endTime} onChange={v => set("endTime",v)} type="time"/></div></div>}
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Location"/><FInput value={f.location} onChange={v => set("location",v)} placeholder="Room / Building / Platform"/></div>
          <div><FieldLabel label="Virtual Link"/><FInput value={f.link} onChange={v => set("link",v)} placeholder="https://meet.google.com/..."/></div>
        </div>
        <div><FieldLabel label="Description"/><FTextarea value={f.desc} onChange={v => set("desc",v)} placeholder="Event agenda, notes, or context..."/></div>
        <div>
          <FieldLabel label="Color"/>
          <div className="flex gap-2 mt-1">{colors.map(col => <button key={col} onClick={() => set("color",col)} className={`w-7 h-7 rounded-full ${col} transition-transform ${f.color === col ? "scale-125 ring-2 ring-white/40" : "hover:scale-110"}`}/>)}</div>
        </div>
        <div>
          <FieldLabel label={`Attendees (${attendees.length})`}/>
          <div className={`max-h-36 overflow-y-auto rounded-xl border ${c("border-white/[0.08]","border-slate-200")}`}>
            {employees.map(e => <label key={e.id} className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${attendees.includes(e.id) ? c("bg-indigo-600/10","bg-indigo-50") : c("hover:bg-slate-700/20","hover:bg-slate-50")}`}><input type="checkbox" checked={attendees.includes(e.id)} onChange={() => setAttendees(p => p.includes(e.id) ? p.filter(x=>x!==e.id) : [...p,e.id])} className="rounded accent-indigo-500"/><Avatar initials={e.avatar} color={e.avatarColor} size="sm"/><span className={`text-sm ${c("text-slate-200","text-slate-700")}`}>{e.name}</span></label>)}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Btn variant="primary" icon={Plus} onClick={() => { if (f.title && f.date) setDone(true); }}>Create Event</Btn>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </ModalOverlay>
  );
}

function ScheduleMeetingModal({ onClose }: { onClose: () => void }) {
  const { c } = useTheme();
  const { authUser } = useAuth();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ title: "", date: "", startTime: "10:00", endTime: "11:00", type: "video", gmeetLink: "", room: "", agenda: "", recurrence: "none", sendInvites: true, record: false });
  const [attendees, setAttendees] = useState<number[]>([]);
  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));

  const generateMeetLink = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const seg = (n: number) => Array.from({length:n},()=>chars[Math.floor(Math.random()*chars.length)]).join("");
    set("gmeetLink", `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`);
  };

  const copyLink = () => navigator.clipboard.writeText(f.gmeetLink).catch(() => {});

  if (done) return (
    <ModalOverlay title="Meeting Scheduled" onClose={onClose} size="lg">
      <SuccessBanner message={`"${f.title}" has been scheduled. ${f.sendInvites ? `${attendees.length} invites sent.` : ""}`}/>
      <div className={`rounded-xl p-5 space-y-3 ${c("bg-slate-800/50","bg-slate-50")} border ${c("border-white/[0.06]","border-slate-200")}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center"><Video size={18} className="text-indigo-500"/></div>
          <div><p className={`font-semibold ${c("text-white","text-slate-900")}`}>{f.title}</p><p className={`text-xs ${c("text-slate-400","text-slate-500")}`}>{f.date} · {f.startTime} – {f.endTime}</p></div>
        </div>
        {f.gmeetLink && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${c("bg-indigo-600/10","bg-indigo-50")} border ${c("border-indigo-500/20","border-indigo-200")}`}>
            <Globe size={14} className="text-indigo-500 flex-shrink-0"/>
            <a href={f.gmeetLink} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline truncate flex-1">{f.gmeetLink}</a>
            <button onClick={copyLink} className={`text-xs px-2 py-1 rounded ${c("bg-slate-700 text-slate-300 hover:bg-slate-600","bg-white text-slate-600 hover:bg-slate-100")} border ${c("border-white/[0.08]","border-slate-200")}`}><Copy size={12}/></button>
          </div>
        )}
        <div className="flex items-center gap-1 flex-wrap">{attendees.slice(0,6).map(id => { const e = employees.find(x=>x.id===id); return e ? <div key={id} className={`w-7 h-7 rounded-full ${e.avatarColor} flex items-center justify-center text-[9px] font-bold text-white border-2 ${c("border-slate-800","border-white")} -ml-1 first:ml-0`}>{e.avatar}</div> : null; })}{attendees.length > 6 && <span className={`text-xs ${c("text-slate-500","text-slate-400")} ml-1`}>+{attendees.length-6}</span>}</div>
      </div>
      <Btn variant="primary" onClick={onClose} className="mt-4">Done</Btn>
    </ModalOverlay>
  );

  return (
    <ModalOverlay title="Schedule Meeting" subtitle="Set up a meeting with Google Meet integration" onClose={onClose} size="lg">
      <div className="space-y-4">
        <div><FieldLabel label="Meeting Title" required/><FInput value={f.title} onChange={v => set("title",v)} placeholder="e.g. Sprint Planning — Week 27"/></div>
        <div className="grid grid-cols-3 gap-4">
          <div><FieldLabel label="Date" required/><FInput value={f.date} onChange={v => set("date",v)} type="date"/></div>
          <div><FieldLabel label="Start Time"/><FInput value={f.startTime} onChange={v => set("startTime",v)} type="time"/></div>
          <div><FieldLabel label="End Time"/><FInput value={f.endTime} onChange={v => set("endTime",v)} type="time"/></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Meeting Type"/><FSelect value={f.type} onChange={v => set("type",v)}><option value="video">Video Call (Google Meet)</option><option value="in-person">In-Person</option><option value="phone">Phone Call</option><option value="hybrid">Hybrid</option></FSelect></div>
          <div><FieldLabel label="Recurrence"/><FSelect value={f.recurrence} onChange={v => set("recurrence",v)}><option value="none">No Recurrence</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></FSelect></div>
        </div>

        {/* Google Meet Link */}
        <div>
          <FieldLabel label="Google Meet Link"/>
          <div className="flex gap-2">
            <FInput value={f.gmeetLink} onChange={v => set("gmeetLink",v)} placeholder="https://meet.google.com/abc-defg-hij" className="flex-1"/>
            <button onClick={generateMeetLink} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${c("bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/25","bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200")}`}>
              <RefreshCw size={12}/> Generate
            </button>
            {f.gmeetLink && <button onClick={copyLink} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${c("bg-slate-700 text-slate-300 hover:bg-slate-600 border border-white/[0.08]","bg-white text-slate-600 hover:bg-slate-50 border border-slate-200")}`}><Copy size={12}/></button>}
          </div>
          {f.gmeetLink && <p className="text-xs text-emerald-500 mt-1.5 flex items-center gap-1"><CheckCircle2 size={11}/> Meet link ready — will be included in calendar invites</p>}
        </div>

        {f.type === "in-person" || f.type === "hybrid" ? <div><FieldLabel label="Room / Location"/><FInput value={f.room} onChange={v => set("room",v)} placeholder="e.g. Conference Room A, Floor 3"/></div> : null}

        <div><FieldLabel label="Agenda"/><FTextarea value={f.agenda} onChange={v => set("agenda",v)} placeholder="• Welcome & intro&#10;• Review sprint goals&#10;• Blockers discussion&#10;• Action items" rows={4}/></div>

        <div>
          <FieldLabel label={`Invite Attendees (${attendees.length} selected)`}/>
          <div className={`max-h-40 overflow-y-auto rounded-xl border ${c("border-white/[0.08]","border-slate-200")}`}>
            {employees.map(e => <label key={e.id} className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${attendees.includes(e.id) ? c("bg-indigo-600/10","bg-indigo-50") : c("hover:bg-slate-700/20","hover:bg-slate-50")}`}><input type="checkbox" checked={attendees.includes(e.id)} onChange={() => setAttendees(p => p.includes(e.id) ? p.filter(x=>x!==e.id) : [...p,e.id])} className="rounded accent-indigo-500"/><Avatar initials={e.avatar} color={e.avatarColor} size="sm"/><span className={`text-sm ${c("text-slate-200","text-slate-700")}`}>{e.name}</span><span className={`ml-auto text-xs ${c("text-slate-500","text-slate-400")}`}>{e.dept}</span></label>)}
          </div>
        </div>

        <div className="flex gap-6">
          {[["sendInvites","Send calendar invites to all attendees"],["record","Record this meeting (auto-transcript)"]].map(([k,l]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => set(k, !(f as any)[k])} className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${(f as any)[k] ? "bg-indigo-600" : c("bg-slate-700","bg-slate-300")}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${(f as any)[k] ? "left-4" : "left-0.5"}`}/></div>
              <span className={`text-xs ${c("text-slate-400","text-slate-600")}`}>{l}</span>
            </label>
          ))}
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-lg ${c("bg-slate-800/50","bg-slate-50")}`}>
          <User size={13} className={c("text-slate-500","text-slate-400")}/>
          <span className={`text-xs ${c("text-slate-400","text-slate-500")}`}>Organizer: <strong className={c("text-slate-200","text-slate-700")}>{authUser?.name || "Sanjay Iyer"}</strong></span>
        </div>

        <div className="flex gap-2 pt-2">
          <Btn variant="primary" icon={Video} onClick={() => { if (f.title && f.date) setDone(true); }}>Schedule Meeting</Btn>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </ModalOverlay>
  );
}

function ApplyLeaveModal({ onClose }: { onClose: () => void }) {
  const { c } = useTheme();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ type: "Annual Leave", from: "", to: "", halfDay: false, halfDayPart: "Morning", reason: "", emergencyName: "", emergencyPhone: "" });
  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));
  const leaveBalance: Record<string,number> = { "Annual Leave": 16, "Sick Leave": 10, "Casual Leave": 3, "Maternity/Paternity Leave": 90, "Unpaid Leave": 999 };
  const calcDays = () => { if (!f.from || !f.to) return 0; const d = (new Date(f.to).getTime() - new Date(f.from).getTime()) / 86400000 + 1; return f.halfDay ? 0.5 : Math.max(0, d); };
  const days = calcDays();

  if (done) return (
    <ModalOverlay title="Leave Applied" onClose={onClose}>
      <SuccessBanner message={`Your ${f.type} application for ${days} day(s) has been submitted and is pending manager approval.`}/>
      <Btn variant="primary" onClick={onClose}>Done</Btn>
    </ModalOverlay>
  );

  return (
    <ModalOverlay title="Apply for Leave" subtitle="Submit a leave request for manager approval" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <FieldLabel label="Leave Type" required/>
          <FSelect value={f.type} onChange={v => set("type",v)}>
            {Object.keys(leaveBalance).map(t => <option key={t}>{t}</option>)}
          </FSelect>
          <div className={`flex items-center justify-between mt-1.5 px-1`}>
            <span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>Balance remaining</span>
            <span className="text-xs font-semibold text-emerald-500">{leaveBalance[f.type]} days available</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="From Date" required/><FInput value={f.from} onChange={v => set("from",v)} type="date"/></div>
          <div><FieldLabel label="To Date" required/><FInput value={f.to} onChange={v => set("to",v)} type="date"/></div>
        </div>
        {days > 0 && (
          <div className={`flex items-center justify-between p-3 rounded-xl ${c("bg-indigo-600/10","bg-indigo-50")} border ${c("border-indigo-500/20","border-indigo-200")}`}>
            <span className={`text-sm ${c("text-indigo-300","text-indigo-700")}`}>Duration</span>
            <span className="text-sm font-bold text-indigo-500">{days} working day{days !== 1 ? "s" : ""}</span>
          </div>
        )}
        <label className="flex items-center gap-2 cursor-pointer">
          <div onClick={() => set("halfDay", !f.halfDay)} className={`w-9 h-5 rounded-full relative transition-colors ${f.halfDay ? "bg-indigo-600" : c("bg-slate-700","bg-slate-300")}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${f.halfDay ? "left-4" : "left-0.5"}`}/></div>
          <span className={`text-sm ${c("text-slate-300","text-slate-700")}`}>Half Day</span>
        </label>
        {f.halfDay && <div><FieldLabel label="Half Day Preference"/><div className="flex gap-2">{["Morning","Afternoon"].map(p => <button key={p} onClick={() => set("halfDayPart",p)} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${f.halfDayPart === p ? "bg-indigo-600 text-white border-indigo-500" : c("border-white/[0.08] text-slate-400","border-slate-200 text-slate-500")}`}>{p}</button>)}</div></div>}
        <div><FieldLabel label="Reason" required/><FTextarea value={f.reason} onChange={v => set("reason",v)} placeholder="Please describe the reason for your leave..."/></div>
        {f.type === "Sick Leave" && (
          <div className={`p-3 rounded-xl ${c("bg-amber-500/10","bg-amber-50")} border ${c("border-amber-500/20","border-amber-200")}`}>
            <p className={`text-xs font-medium mb-2 ${c("text-amber-400","text-amber-700")}`}>📎 Medical certificate may be required for sick leave &gt; 2 days</p>
            <div className={`flex items-center gap-3 p-3 rounded-lg border border-dashed ${c("border-amber-500/30","border-amber-300")} cursor-pointer`}><Upload size={15} className={c("text-amber-400","text-amber-600")}/><span className={`text-xs ${c("text-amber-300","text-amber-700")}`}>Upload medical document (optional)</span></div>
          </div>
        )}
        <div>
          <FieldLabel label="Emergency Contact During Leave"/>
          <div className="grid grid-cols-2 gap-3">
            <FInput value={f.emergencyName} onChange={v => set("emergencyName",v)} placeholder="Contact name"/>
            <FInput value={f.emergencyPhone} onChange={v => set("emergencyPhone",v)} placeholder="+1 (555) 000-0000"/>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Btn variant="primary" onClick={() => { if (f.type && f.from && f.to && f.reason) setDone(true); }}>Submit Application</Btn>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </ModalOverlay>
  );
}

function StartReviewCycleModal({ onClose }: { onClose: () => void }) {
  const { c } = useTheme();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "Q3 2026 Performance Review", quarter: "Q3", year: "2026", reviewType: "360", ratingScale: "1-5", anonymousPeer: true, autoRemind: true, remindDays: "3", template: "Engineering Standard", kickoff: "", selfDeadline: "", managerDeadline: "", resultsDate: "" });
  const [depts, setDepts] = useState<string[]>(["Engineering","Product","Design"]);
  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));
  const allDepts = departments.map(d => d.name);
  const toggleDept = (d: string) => setDepts(p => p.includes(d) ? p.filter(x=>x!==d) : [...p,d]);

  if (done) return (
    <ModalOverlay title="Review Cycle Started" onClose={onClose} size="lg">
      <SuccessBanner message={`"${f.name}" has been launched for ${depts.length} departments. Employees will receive notifications shortly.`}/>
      <div className={`rounded-xl p-4 space-y-2 text-sm ${c("bg-slate-800/50","bg-slate-50")} border ${c("border-white/[0.06]","border-slate-200")}`}>
        {[["Cycle",f.name],["Period",`${f.quarter} ${f.year}`],["Type",f.reviewType],["Departments",depts.join(", ")],["Scale",f.ratingScale],["Self-Assessment Due",f.selfDeadline],["Manager Review Due",f.managerDeadline]].map(([l,v]) => v ? <div key={l} className="flex justify-between"><span className={c("text-slate-500","text-slate-400")}>{l}</span><span className={c("text-slate-200","text-slate-700")}>{v}</span></div> : null)}
      </div>
      <Btn variant="primary" onClick={onClose} className="mt-4">View Review Dashboard</Btn>
    </ModalOverlay>
  );

  return (
    <ModalOverlay title="Start Review Cycle" subtitle="Configure and launch a performance review" onClose={onClose} size="xl">
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><FieldLabel label="Cycle Name" required/><FInput value={f.name} onChange={v => set("name",v)} placeholder="e.g. Q3 2026 Performance Review"/></div>
          <div className="grid grid-cols-2 gap-2"><div><FieldLabel label="Quarter"/><FSelect value={f.quarter} onChange={v => set("quarter",v)}><option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option></FSelect></div><div><FieldLabel label="Year"/><FSelect value={f.year} onChange={v => set("year",v)}><option>2026</option><option>2027</option></FSelect></div></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel label="Review Type" required/>
            <div className="grid grid-cols-2 gap-2 mt-1">{[["360","360° Feedback"],["manager","Manager Only"],["self","Self-Assessment"],["peer","Peer Review"],["all","All Methods"]].map(([v,l]) => <button key={v} onClick={() => set("reviewType",v)} className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${f.reviewType === v ? "bg-indigo-600 text-white border-indigo-500" : c("border-white/[0.08] text-slate-400 hover:border-white/20","border-slate-200 text-slate-500 hover:border-slate-300")}`}>{l}</button>)}</div>
          </div>
          <div>
            <FieldLabel label="Rating Scale"/>
            <div className="grid grid-cols-3 gap-2 mt-1">{["1-5","1-10","A-F"].map(v => <button key={v} onClick={() => set("ratingScale",v)} className={`py-2 rounded-lg text-xs font-medium border transition-colors ${f.ratingScale === v ? "bg-indigo-600 text-white border-indigo-500" : c("border-white/[0.08] text-slate-400 hover:border-white/20","border-slate-200 text-slate-500 hover:border-slate-300")}`}>{v}</button>)}</div>
          </div>
        </div>
        <div>
          <FieldLabel label="Review Template"/>
          <FSelect value={f.template} onChange={v => set("template",v)}>{["Engineering Standard","Leadership Assessment","Sales Performance","Design & Creative","HR & Operations","Custom Template"].map(t => <option key={t}>{t}</option>)}</FSelect>
        </div>
        <div>
          <FieldLabel label={`Departments to Include (${depts.length} selected)`}/>
          <div className="flex flex-wrap gap-2 mt-1">
            <button onClick={() => setDepts(depts.length === allDepts.length ? [] : [...allDepts])} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${depts.length === allDepts.length ? "bg-indigo-600 text-white border-indigo-500" : c("border-white/[0.08] text-slate-400","border-slate-200 text-slate-500")}`}>Select All</button>
            {allDepts.map(d => <button key={d} onClick={() => toggleDept(d)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${depts.includes(d) ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30" : c("border-white/[0.08] text-slate-400 hover:border-white/20","border-slate-200 text-slate-500 hover:border-slate-300")}`}>{d}</button>)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Kick-off Date" required/><FInput value={f.kickoff} onChange={v => set("kickoff",v)} type="date"/></div>
          <div><FieldLabel label="Self-Assessment Deadline" required/><FInput value={f.selfDeadline} onChange={v => set("selfDeadline",v)} type="date"/></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel label="Manager Review Deadline" required/><FInput value={f.managerDeadline} onChange={v => set("managerDeadline",v)} type="date"/></div>
          <div><FieldLabel label="Results Release Date"/><FInput value={f.resultsDate} onChange={v => set("resultsDate",v)} type="date"/></div>
        </div>
        <div className="flex gap-8">
          {[["anonymousPeer","Anonymous peer reviews"],["autoRemind","Auto-remind employees"]].map(([k,l]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => set(k, !(f as any)[k])} className={`w-9 h-5 rounded-full relative transition-colors ${(f as any)[k] ? "bg-indigo-600" : c("bg-slate-700","bg-slate-300")}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${(f as any)[k] ? "left-4" : "left-0.5"}`}/></div>
              <span className={`text-sm ${c("text-slate-300","text-slate-700")}`}>{l}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <Btn variant="primary" icon={Play} onClick={() => { if (f.name && f.selfDeadline && depts.length > 0) setDone(true); }}>Launch Review Cycle</Btn>
          <Btn variant="secondary" onClick={onClose}>Save as Draft</Btn>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </ModalOverlay>
  );
}

function ModalSystem() {
  const { activeModal, closeModal } = useModal();
  if (!activeModal) return null;
  return (
    <>
      {activeModal === "add-employee" && <AddEmployeeModal onClose={closeModal}/>}
      {activeModal === "add-department" && <AddDepartmentModal onClose={closeModal}/>}
      {activeModal === "create-team" && <CreateTeamModal onClose={closeModal}/>}
      {activeModal === "create-project" && <CreateProjectModal onClose={closeModal}/>}
      {activeModal === "create-task" && <CreateTaskModal onClose={closeModal}/>}
      {activeModal === "create-event" && <CreateEventModal onClose={closeModal}/>}
      {activeModal === "schedule-meeting" && <ScheduleMeetingModal onClose={closeModal}/>}
      {activeModal === "apply-leave" && <ApplyLeaveModal onClose={closeModal}/>}
      {activeModal === "start-review-cycle" && <StartReviewCycleModal onClose={closeModal}/>}
    </>
  );
}

// ─── EMPLOYEE EOD PAGE ────────────────────────────────────────────────────────

function EODPage() {
  const { c, light } = useTheme();
  const { authUser } = useAuth();
  const col = light ? LIGHT : DARK;
  const [submitted, setSubmitted] = useState(false);
  const [mood, setMood] = useState(3);
  const [productivity, setProductivity] = useState(7);
  const [accomplish, setAccomplish] = useState("• Completed OAuth2 authentication flow (PR #218 ready for review)\n• Fixed memory leak in WebSocket handler — hotfix deployed\n• Reviewed 2 PRs from the team\n• Attended sprint sync and 1:1 with Marcus");
  const [blockers, setBlockers] = useState("• CI/CD pipeline setup blocked on AWS IAM permissions (waiting on DevOps)\n• Need design spec for the new onboarding flow before implementation can continue");
  const [priorities, setPriorities] = useState(["Set up staging CI/CD pipeline (pending AWS access)", "Start unit tests for payment module", "Code review: dashboard refactor PR #214"]);
  const [learnings, setLearnings] = useState("Discovered a more efficient approach to handling WebSocket reconnection using exponential backoff — will document this in the knowledge base.");
  const [flagManager, setFlagManager] = useState("");
  const [taskUpdates, setTaskUpdates] = useState(myWorkTasks.filter(t => t.status !== "done").slice(0,4).map(t => ({ ...t, hoursToday: "", updateNote: "", completedToday: false })));

  const moodEmojis = [{ e: "😫", l: "Exhausted" }, { e: "😕", l: "Struggling" }, { e: "😐", l: "Neutral" }, { e: "😊", l: "Good" }, { e: "🔥", l: "Energized" }];
  const teamStatus = employees.slice(0,5).map((e, i) => ({ ...e, eodDone: i < 3 }));

  const updateTaskField = (idx: number, key: string, value: any) => setTaskUpdates(p => p.map((t, i) => i === idx ? { ...t, [key]: value } : t));

  if (submitted) return (
    <div className={`min-h-[60vh] flex flex-col items-center justify-center text-center ${c("","")}`}>
      <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5"><CheckCircle2 size={36} className="text-emerald-500"/></div>
      <h2 className={`text-2xl font-bold mb-2 ${c("text-white","text-slate-900")}`}>EOD Report Submitted! 🎉</h2>
      <p className={`text-sm mb-1 ${c("text-slate-400","text-slate-500")}`}>Great work today, {authUser?.name?.split(" ")[0] || "there"}!</p>
      <p className={`text-xs ${c("text-slate-600","text-slate-400")}`}>Submitted at {new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})} · Your manager has been notified</p>
      <div className={`mt-6 p-4 rounded-2xl border ${c("bg-slate-800/50 border-white/[0.06]","bg-slate-50 border-slate-200")} flex items-center gap-4`}>
        <div className="text-4xl">{moodEmojis[mood-1].e}</div>
        <div className="text-left"><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>Mood · Productivity</p><p className={`text-sm font-semibold ${c("text-white","text-slate-800")}`}>{moodEmojis[mood-1].l} · {productivity}/10</p></div>
        <div className={`w-px h-10 ${c("bg-white/[0.08]","bg-slate-200")}`}/>
        <div><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>Tasks updated</p><p className={`text-sm font-semibold ${c("text-white","text-slate-800")}`}>{taskUpdates.filter(t=>t.hoursToday||t.completedToday).length}</p></div>
        <div className={`w-px h-10 ${c("bg-white/[0.08]","bg-slate-200")}`}/>
        <div><p className={`text-xs ${c("text-slate-500","text-slate-400")}`}>EOD Streak</p><p className="text-sm font-semibold text-amber-500">🔥 5 days</p></div>
      </div>
      <Btn variant="secondary" onClick={() => setSubmitted(false)} className="mt-5">Edit Report</Btn>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className={`rounded-2xl border p-5 ${c("bg-gradient-to-r from-slate-800/80 to-slate-800/40 border-white/[0.06]","bg-gradient-to-r from-slate-50 to-white border-slate-200")}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${authUser?.avatarColor||"bg-indigo-600"} flex items-center justify-center text-lg font-bold text-white`}>{authUser?.avatar||"SJ"}</div>
            <div>
              <h1 className={`text-xl font-bold ${c("text-white","text-slate-900")}`}>End of Day Report</h1>
              <p className={`text-sm mt-0.5 ${c("text-slate-400","text-slate-500")}`}>{authUser?.name||"Sanjay Iyer"} · {authUser?.title||"CEO"} · Saturday, Jun 28, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${c("bg-amber-500/10 border border-amber-500/20","bg-amber-50 border border-amber-200")}`}>
              <Clock size={13} className="text-amber-500"/><span className="text-xs font-medium text-amber-500">Draft · Due 6:00 PM</span>
            </div>
            <Btn variant="secondary" size="sm">Save Draft</Btn>
            <Btn variant="primary" onClick={() => setSubmitted(true)} icon={Send}>Submit EOD</Btn>
          </div>
        </div>
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
          {[
            { label: "Hours Logged", value: "5h 17m", sub: "/ 8h target", color: "text-indigo-500" },
            { label: "Tasks Updated", value: taskUpdates.filter(t=>t.hoursToday).length.toString(), sub: `of ${taskUpdates.length} tasks`, color: "text-emerald-500" },
            { label: "Completed Today", value: taskUpdates.filter(t=>t.completedToday).length.toString(), sub: "tasks done ✓", color: "text-emerald-500" },
            { label: "Blockers", value: blockers.split("\n").filter(Boolean).length.toString(), sub: "to resolve", color: "text-amber-500" },
            { label: "Mood", value: moodEmojis[mood-1].e, sub: moodEmojis[mood-1].l, color: "text-slate-400" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-3 ${c("bg-slate-800/50","bg-white/60")} border ${c("border-white/[0.06]","border-slate-200/80")}`}>
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className={`text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{s.label}</div>
              <div className={`text-[10px] ${c("text-slate-600","text-slate-400")}`}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Self-assessment */}
        <div className="space-y-4">
          {/* Mood */}
          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>How are you feeling?</h3>
            <div className="flex justify-between mb-3">
              {moodEmojis.map((m, i) => (
                <button key={i} onClick={() => setMood(i+1)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${mood === i+1 ? c("bg-indigo-600/20 scale-110","bg-indigo-50 scale-110") : "hover:scale-105 opacity-60 hover:opacity-100"}`}>
                  <span className="text-2xl">{m.e}</span>
                  <span className={`text-[9px] font-medium ${c("text-slate-400","text-slate-500")}`}>{m.l}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Productivity */}
          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-3 ${c("text-white","text-slate-900")}`}>Productivity Rating</h3>
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold ${productivity >= 8 ? "text-emerald-500" : productivity >= 5 ? "text-amber-500" : "text-red-500"}`}>{productivity}</span>
              <div className="flex-1"><span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>out of 10</span></div>
            </div>
            <input type="range" min="1" max="10" value={productivity} onChange={e => setProductivity(+e.target.value)}
              className="w-full mt-2 accent-indigo-500"/>
            <div className="flex justify-between text-[10px] mt-1">
              <span className={c("text-slate-600","text-slate-400")}>Low</span>
              <span className={c("text-slate-600","text-slate-400")}>High</span>
            </div>
          </Card>

          {/* Work Hours */}
          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Work Hours Today</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke={light?"#E2E8F0":"rgba(255,255,255,0.06)"} strokeWidth="8"/>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#4F46E5" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${213.6 * 0.66} 213.6`}/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><span className={`text-xs font-bold ${c("text-white","text-slate-900")}`}>5h17m</span></div>
              </div>
              <div className="space-y-1.5 text-xs">
                {[["Punch In","09:07 AM","text-emerald-500"],["Punch Out","—",c("text-slate-500","text-slate-400")],["Break","30 min",c("text-slate-400","text-slate-500")],["Target","8h 00m",c("text-slate-400","text-slate-500")]].map(([l,v,cls]) => <div key={l} className="flex justify-between gap-4"><span className={c("text-slate-500","text-slate-400")}>{l}</span><span className={`font-semibold ${cls}`}>{v}</span></div>)}
              </div>
            </div>
          </Card>

          {/* Team EOD Status */}
          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-3 ${c("text-white","text-slate-900")}`}>Team EOD Status</h3>
            <div className="space-y-2">
              {teamStatus.map(e => (
                <div key={e.id} className="flex items-center gap-3">
                  <Avatar initials={e.avatar} color={e.avatarColor} size="sm"/>
                  <span className={`text-xs flex-1 ${c("text-slate-300","text-slate-700")}`}>{e.name}</span>
                  {e.eodDone ? <span className="text-xs text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12}/>Submitted</span> : <span className="text-xs text-amber-500 flex items-center gap-1"><Clock size={12}/>Pending</span>}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Middle: Task Updates */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Tasks Worked On Today</h3>
              <span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>Update progress for tasks you touched today</span>
            </div>
            <div className="space-y-3">
              {taskUpdates.map((task, i) => (
                <div key={task.id} className={`p-4 rounded-xl border transition-colors ${task.completedToday ? c("border-emerald-500/30 bg-emerald-500/5","border-emerald-200 bg-emerald-50") : c("border-white/[0.06] bg-slate-800/30","border-slate-200 bg-slate-50/50")}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <button onClick={() => updateTaskField(i,"completedToday",!task.completedToday)}
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${task.completedToday ? "bg-emerald-500 border-emerald-500" : c("border-slate-600 hover:border-emerald-400","border-slate-300 hover:border-emerald-400")}`}>
                      {task.completedToday && <CheckCircle2 size={12} className="text-white"/>}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.completedToday ? "line-through opacity-60" : ""} ${c("text-slate-200","text-slate-800")}`}>{task.title}</p>
                      <p className={`text-[10px] mt-0.5 ${c("text-slate-500","text-slate-400")}`}>{task.project}</p>
                    </div>
                    <PriorityBadge priority={task.priority}/>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><label className={`text-[10px] ${c("text-slate-500","text-slate-400")}`}>Hours today</label><FInput value={task.hoursToday} onChange={v => updateTaskField(i,"hoursToday",v)} placeholder="e.g. 2.5"/></div>
                    <div className="col-span-2"><label className={`text-[10px] ${c("text-slate-500","text-slate-400")}`}>Quick update / progress note</label><FInput value={task.updateNote} onChange={v => updateTaskField(i,"updateNote",v)} placeholder="What did you do on this task?"/></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* EOD Notes */}
          <Card className="p-5 space-y-4">
            <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>EOD Notes</h3>

            <div>
              <FieldLabel label="What did you accomplish today?"/>
              <FTextarea value={accomplish} onChange={setAccomplish} rows={5} placeholder="• List your key accomplishments&#10;• Code written, reviews done, meetings attended..."/>
            </div>

            <div>
              <FieldLabel label="Blockers & Challenges"/>
              <div className={`rounded-xl overflow-hidden border ${c("border-red-500/20","border-red-200")}`}>
                <div className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${c("bg-red-500/10 text-red-400","bg-red-50 text-red-600")}`}>⚠ Blockers — requires manager attention</div>
                <FTextarea value={blockers} onChange={setBlockers} rows={3} placeholder="• List any blockers or challenges..."/>
              </div>
            </div>

            <div>
              <FieldLabel label="Top 3 Priorities for Tomorrow"/>
              <div className="space-y-2">
                {priorities.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i===0?"bg-indigo-600 text-white":i===1?c("bg-slate-700 text-slate-300","bg-slate-200 text-slate-600"):c("bg-slate-700 text-slate-400","bg-slate-100 text-slate-500")}`}>{i+1}</span>
                    <FInput value={p} onChange={v => setPriorities(prev => prev.map((x,j) => j===i?v:x))} placeholder={`Priority ${i+1}...`}/>
                  </div>
                ))}
              </div>
            </div>

            <div><FieldLabel label="Learnings / Observations"/><FTextarea value={learnings} onChange={setLearnings} rows={2} placeholder="Key insights, new approaches, or things to remember..."/></div>

            <div>
              <FieldLabel label="Flag to Manager"/>
              <div className={`rounded-xl overflow-hidden border ${c("border-amber-500/20","border-amber-200")}`}>
                <div className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${c("bg-amber-500/10 text-amber-400","bg-amber-50 text-amber-600")}`}>📌 Flagged items will be highlighted in your manager's dashboard</div>
                <FTextarea value={flagManager} onChange={setFlagManager} rows={2} placeholder="Anything your manager should know about? (optional)"/>
              </div>
            </div>
          </Card>

          {/* Action bar */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${c("bg-slate-800/60 border-white/[0.06]","bg-white border-slate-200")}`}>
            <span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>Last saved: 2 minutes ago</span>
            <div className="flex items-center gap-2">
              <Btn variant="secondary">Save Draft</Btn>
              <Btn variant="primary" onClick={() => setSubmitted(true)} icon={Send}>Submit EOD Report</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MONTHLY EXPENSES PAGE ────────────────────────────────────────────────────

const expensesMonthlyData = [
  { month: "Jan", payroll: 4820, benefits: 260, ops: 380, marketing: 75, infra: 78, travel: 82 },
  { month: "Feb", payroll: 4820, benefits: 260, ops: 385, marketing: 78, infra: 80, travel: 65 },
  { month: "Mar", payroll: 4950, benefits: 272, ops: 390, marketing: 82, infra: 82, travel: 71 },
  { month: "Apr", payroll: 4950, benefits: 272, ops: 388, marketing: 79, infra: 85, travel: 69 },
  { month: "May", payroll: 5100, benefits: 278, ops: 410, marketing: 81, infra: 87, travel: 58 },
  { month: "Jun", payroll: 5100, benefits: 280, ops: 420, marketing: 82, infra: 89, travel: 67 },
];

const expenseCategories = [
  { name: "Salaries & Wages", amount: 4820000, pct: 83.1, vsLast: 2.9, trend: "up" },
  { name: "Employee Benefits", amount: 280000, pct: 4.8, vsLast: 1.2, trend: "up" },
  { name: "Health Insurance", amount: 156000, pct: 2.7, vsLast: 0, trend: "flat" },
  { name: "Office Rent & Facilities", amount: 145000, pct: 2.5, vsLast: 0, trend: "flat" },
  { name: "Cloud Infrastructure", amount: 89000, pct: 1.5, vsLast: 8.3, trend: "up" },
  { name: "Travel & Expenses", amount: 67000, pct: 1.2, vsLast: -15, trend: "down" },
  { name: "Marketing & Events", amount: 82000, pct: 1.4, vsLast: 5.0, trend: "up" },
  { name: "Equipment & Assets", amount: 54000, pct: 0.9, vsLast: -20, trend: "down" },
  { name: "Training & Development", amount: 38000, pct: 0.7, vsLast: 12, trend: "up" },
  { name: "Miscellaneous", amount: 72000, pct: 1.2, vsLast: 3.0, trend: "up" },
];

function MonthlyExpensesPage() {
  const { c, light } = useTheme();
  const col = light ? LIGHT : DARK;
  const [currentMonth, setCurrentMonth] = useState(5);
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  const totalExpense = expenseCategories.reduce((a, e) => a + e.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Monthly Company Expenses" subtitle="Full cost breakdown and budget analysis"
        actions={
          <>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentMonth(m => Math.max(0, m-1))} className={`w-8 h-8 rounded-lg flex items-center justify-center ${c("text-slate-400 hover:bg-slate-700","text-slate-500 hover:bg-slate-100")}`}><ChevronLeft size={15}/></button>
              <span className={`text-sm font-semibold px-3 ${c("text-white","text-slate-900")}`}>{months[currentMonth]} 2026</span>
              <button onClick={() => setCurrentMonth(m => Math.min(months.length-1, m+1))} className={`w-8 h-8 rounded-lg flex items-center justify-center ${c("text-slate-400 hover:bg-slate-700","text-slate-500 hover:bg-slate-100")}`}><ChevronRight size={15}/></button>
            </div>
            <Btn variant="secondary" size="sm" icon={Download}>Export PDF</Btn>
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Expenses" value="$5.80M" change="+1.8%" changeLabel=" vs last month" icon={DollarSign} iconColor="bg-red-600/40" trend="up"/>
        <StatCard label="Payroll Cost" value="$5.10M" change="+2.9%" changeLabel=" vs last month" icon={Users} iconColor="bg-indigo-600/40" trend="up"/>
        <StatCard label="Operations" value="$420K" change="+2.4%" changeLabel=" vs last month" icon={Settings} iconColor="bg-amber-600/40" trend="up"/>
        <StatCard label="Benefits & Perks" value="$280K" change="+1.2%" changeLabel=" vs last month" icon={Award} iconColor="bg-emerald-600/40" trend="up"/>
      </div>

      {/* Stacked Bar Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>6-Month Expense Trend by Category</h3>
          <span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>Jan – Jun 2026 (in thousands USD)</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={expensesMonthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={col.chartGrid}/>
            <XAxis dataKey="month" tick={{ fill: col.tickColor, fontSize: 11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill: col.tickColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`}/>
            <Tooltip content={(p: any) => <ChartTip {...p} light={light}/>}/>
            <Legend wrapperStyle={{ fontSize: 11, color: col.tickColor }}/>
            <Bar key="exp-payroll" dataKey="payroll" name="Payroll" stackId="a" fill="#4F46E5"/>
            <Bar key="exp-benefits" dataKey="benefits" name="Benefits" stackId="a" fill="#22C55E"/>
            <Bar key="exp-ops" dataKey="ops" name="Operations" stackId="a" fill="#F59E0B"/>
            <Bar key="exp-marketing" dataKey="marketing" name="Marketing" stackId="a" fill="#8B5CF6"/>
            <Bar key="exp-infra" dataKey="infra" name="Infrastructure" stackId="a" fill="#06B6D4"/>
            <Bar key="exp-travel" dataKey="travel" name="Travel" stackId="a" fill="#F43F5E" radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Expense breakdown table */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className={`px-5 py-4 border-b ${c("border-white/[0.06]","border-slate-200")} flex items-center justify-between`}>
            <h3 className={`text-sm font-semibold ${c("text-white","text-slate-900")}`}>Expense Breakdown — {months[currentMonth]} 2026</h3>
            <span className={`text-xs font-semibold ${c("text-slate-300","text-slate-700")}`}>Total: ${(totalExpense/1000000).toFixed(2)}M</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className={`border-b ${c("border-white/[0.06]","border-slate-200")}`}>
                {["Category","Amount","% of Total","vs Last Month","Trend"].map(h => <th key={h} className={`text-left text-xs font-semibold px-4 py-3 ${c("text-slate-500","text-slate-400")}`}>{h}</th>)}
              </tr></thead>
              <tbody>
                {expenseCategories.map((cat, i) => (
                  <tr key={cat.name} className={`border-b ${c("border-white/[0.04]","border-slate-100")} ${c("hover:bg-slate-700/20","hover:bg-slate-50")}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: ["#4F46E5","#22C55E","#06B6D4","#F59E0B","#8B5CF6","#F43F5E","#EC4899","#14B8A6","#F97316","#94A3B8"][i] }}/>
                        <span className={`text-sm font-medium ${c("text-slate-200","text-slate-800")}`}>{cat.name}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold ${c("text-white","text-slate-900")}`}>${(cat.amount/1000).toFixed(0)}K</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={cat.pct * (100/83.1)} color="#4F46E5"/>
                        <span className={`text-xs w-10 flex-shrink-0 ${c("text-slate-400","text-slate-500")}`}>{cat.pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${cat.vsLast > 0 ? "text-red-400" : cat.vsLast < 0 ? "text-emerald-500" : c("text-slate-500","text-slate-400")}`}>
                        {cat.vsLast > 0 ? "+" : ""}{cat.vsLast}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {cat.trend === "up" && <span className="flex items-center gap-1 text-xs text-red-400"><ArrowUp size={11}/>Rising</span>}
                      {cat.trend === "down" && <span className="flex items-center gap-1 text-xs text-emerald-500"><ArrowDown size={11}/>Reduced</span>}
                      {cat.trend === "flat" && <span className={`text-xs ${c("text-slate-500","text-slate-400")}`}>→ Stable</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Dept cost centers + budget vs actual */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Cost by Department</h3>
            <div className="space-y-3">
              {departments.map(d => {
                const cost = (d.employees * 105 * 1000 / 12);
                const pct = (cost / (totalExpense)) * 100;
                return (
                  <div key={d.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${d.color}`}/><span className={c("text-slate-300","text-slate-700")}>{d.name}</span></div>
                      <span className={`font-semibold ${c("text-white","text-slate-900")}`}>${(cost/1000).toFixed(0)}K</span>
                    </div>
                    <ProgressBar value={pct * 3} color={d.color}/>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${c("text-white","text-slate-900")}`}>Budget vs Actual</h3>
            <div className="space-y-3">
              {[
                { cat: "Payroll", budget: 5200, actual: 5100 },
                { cat: "Operations", budget: 450, actual: 420 },
                { cat: "Marketing", budget: 90, actual: 82 },
                { cat: "Infrastructure", budget: 80, actual: 89 },
                { cat: "Training", budget: 50, actual: 38 },
              ].map(item => {
                const over = item.actual > item.budget;
                const pct = (item.actual / item.budget) * 100;
                return (
                  <div key={item.cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={c("text-slate-400","text-slate-500")}>{item.cat}</span>
                      <span className={`font-semibold ${over ? "text-red-400" : "text-emerald-500"}`}>${item.actual}K / ${item.budget}K</span>
                    </div>
                    <ProgressBar value={Math.min(pct, 100)} color={over ? "bg-red-500" : "bg-emerald-500"}/>
                    {over && <p className="text-[10px] text-red-400 mt-0.5">Over budget by ${item.actual-item.budget}K</p>}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ROUTER ─────────────────────────────────────────────────────────────

function PageContent({ page }: { page: Page }) {
  const fullPage = ["chat","ai-assistant"].includes(page);
  return (
    <div className={fullPage?"h-full":"p-6 overflow-y-auto h-full"}>
      {page==="dashboard"&&<DashboardPage/>}{page==="employees"&&<EmployeesPage/>}{page==="departments"&&<DepartmentsPage/>}{page==="teams"&&<TeamsPage/>}
      {page==="projects"&&<ProjectsPage/>}{page==="tasks"&&<TasksPage/>}{page==="calendar"&&<CalendarPage/>}{page==="meetings"&&<MeetingsPage/>}
      {page==="attendance"&&<AttendancePage/>}{page==="leave"&&<LeavePage/>}{page==="payroll"&&<PayrollPage/>}{page==="performance"&&<PerformancePage/>}
      {page==="kpi"&&<KPIPage/>}{page==="okr"&&<OKRPage/>}{page==="analytics"&&<AnalyticsPage/>}{page==="reports"&&<ReportsPage/>}
      {page==="knowledge"&&<KnowledgePage/>}{page==="chat"&&<ChatPage/>}{page==="ai-assistant"&&<AIAssistantPage/>}
      {page==="settings"&&<SettingsPage/>}{page==="notifications"&&<NotificationsPage/>}{page==="roles"&&<RolesPage/>}
      {page==="audit"&&<AuditPage/>}{page==="billing"&&<BillingPage/>}{page==="profile"&&<ProfilePage/>}
      {page==="employee-profile"&&<EmployeeProfilePage/>}{page==="my-work"&&<MyWorkPage/>}
      {page==="eod"&&<EODPage/>}{page==="payroll-expenses"&&<MonthlyExpensesPage/>}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const [modalData, setModalData] = useState<any>(null);
  const openModal = (n: ModalName, data?: any) => { setActiveModal(n); setModalData(data ?? null); };
  const closeModal = () => { setActiveModal(null); setModalData(null); };

  const light = theme === "light";
  const c = (dark: string, lt: string) => light ? lt : dark;
  const ctx: ThemeCtxType = { theme, setTheme, light, c };

  const login = (u: AuthUser) => {
    setAuthUser(u);
    // Land each role on the most relevant first page
    const landingPage: Record<UserRole, Page> = {
      "super-admin": "dashboard",
      "1st-level-manager": "dashboard",
      "2nd-level-manager": "dashboard",
      "manager": "dashboard",
      "team-lead": "my-work",
      "hr-admin": "employees",
      "employee": "my-work",
    };
    setPage(landingPage[u.role] || "dashboard");
  };

  const logout = () => {
    setAuthUser(null);
    setPage("dashboard");
  };

  if (!authUser) {
    return (
      <AuthCtx.Provider value={{ authUser, login, logout }}>
        <LoginPage />
      </AuthCtx.Provider>
    );
  }

  return (
    <AuthCtx.Provider value={{ authUser, login, logout }}>
      <ThemeCtx.Provider value={ctx}>
        <AppCtx.Provider value={{ selectedEmployeeId, setSelectedEmployeeId, navigateTo: setPage }}>
          <ModalCtx.Provider value={{ openModal, closeModal, activeModal, modalData }}>
            <div className="flex h-screen overflow-hidden" style={{ background:light?LIGHT.bg:DARK.bg, fontFamily:"'Inter',-apple-system,sans-serif" }}>
              <Sidebar activePage={page} onNavigate={setPage} collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(v=>!v)}/>
              <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <TopBar activePage={page} onNavigate={setPage} onToggleTheme={()=>setTheme(t=>t==="dark"?"light":"dark")}/>
                <main className="flex-1 overflow-hidden"><PageContent page={page}/></main>
              </div>
            </div>
            <ModalSystem/>
          </ModalCtx.Provider>
        </AppCtx.Provider>
      </ThemeCtx.Provider>
    </AuthCtx.Provider>
  );
}
