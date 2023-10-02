export enum CellType {
  Regular = "Time Worked",
  PTO = "PTO",
}

export enum CellStatus {
  Active = "Active",
  Deleted = "Deleted",
}

export enum CommentType {
  Comment = "Comment",
  Report = "Report",
}

export const enum Review_Stages {
  UNSUBMITTED = "Not-Submitted",
  EMPLOYEE_SUBMITTED = "Employee Submitted",
  ADMIN_REVIEW = "Review (Breaktime)",
  APPROVED = "Approved",
}

export const TABLE_COLUMNS = [
  "Type",
  "Date",
  "Clock-in",
  "Clock-Out",
  "Hours",
  "Comment",
];

export enum CardState {
  Rejected = "Rejected",
  InReviewSupervisor = "In Review - Supervisor",
  InReviewAdmin = "In Review - Admin",
  AdminFinalized = "Finalized by Admin",
  Unsubmitted = "Unsubmitted",
}

export enum UserTypes {
  Associate = "Associate",
  Supervisor = "Supervisor",
  Admin = "Admin",
}
