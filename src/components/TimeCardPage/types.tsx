export enum CellType {
    Regular = "Regular",
    PTO = "PTO"
};

export enum CellStatus {
    Active = "Active",
    Deleted = "Deleted"
}

export enum CommentType {
    Comment = "Comment",
    Report = "Report",
};

export const enum Review_Stages {
    UNSUBMITTED = "Not-Submitted",
    EMPLOYEE_SUBMITTED = "Employee Submitted",
    ADMIN_REVIEW = "Review (Breaktime)",
    APPROVED = "Approved"
};

export const TABLE_COLUMNS = ['Type', 'Date', 'Clock-in', 'Clock-Out', 'Hours', 'Comment'];

export enum USER_ROLES {
    ASSOCIATE = "Associate",
    SUPERVISOR = "Supervisor",
    ADMIN = "Admin"
  }

export enum CardState {
    Rejected = "Rejected",
    InReviewEmployer = "In Review - Employer",
    InReviewBreaktime = "In Review - Breaktime",
    Completed = "Completed",
    Unsubmitted = "Unsubmitted"
}