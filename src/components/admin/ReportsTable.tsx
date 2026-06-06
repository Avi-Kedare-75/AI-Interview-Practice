"use client";

import { motion } from "motion/react";
import { FileSearch, MoreHorizontal, Eye, Download } from "lucide-react";
import { adminReports } from "@/data/mock";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ReportsTable() {
  return (
    <div className="glass-card flex flex-col rounded-2xl p-6 h-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold font-heading">
          <FileSearch className="h-5 w-5 text-primary" />
          Recent Reports
        </h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input 
            placeholder="Search candidates..." 
            className="h-9 w-full sm:w-[250px] bg-background/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground">
              <th className="pb-3 font-medium px-2">Candidate</th>
              <th className="pb-3 font-medium px-2">Date</th>
              <th className="pb-3 font-medium px-2">Type</th>
              <th className="pb-3 font-medium px-2 text-center">Score</th>
              <th className="pb-3 font-medium px-2 text-center">Status</th>
              <th className="pb-3 font-medium px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {adminReports.map((report, index) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="transition-colors hover:bg-accent/50"
              >
                <td className="py-3 px-2 font-medium">{report.candidateName}</td>
                <td className="py-3 px-2 text-muted-foreground">{report.date}</td>
                <td className="py-3 px-2 capitalize text-muted-foreground">{report.type.replace("-", " ")}</td>
                <td className="py-3 px-2 text-center">
                  <span className={`font-semibold ${report.score >= 80 ? "text-success" : report.score >= 60 ? "text-warning" : "text-destructive"}`}>
                    {report.score}
                  </span>
                </td>
                <td className="py-3 px-2 text-center">
                  <Badge
                    variant="outline"
                    className={`capitalize
                      ${report.status === "reviewed" ? "border-success/50 text-success bg-success/10" : ""}
                      ${report.status === "pending" ? "border-warning/50 text-warning bg-warning/10" : ""}
                      ${report.status === "flagged" ? "border-destructive/50 text-destructive bg-destructive/10" : ""}
                    `}
                  >
                    {report.status}
                  </Badge>
                </td>
                <td className="py-3 px-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none ml-auto">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Eye className="h-4 w-4" /> View Report
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Download className="h-4 w-4" /> Download PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
