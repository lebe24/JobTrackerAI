import { 
  users, type User, type InsertUser, 
  jobs, type Job, type InsertJob,
  applications, type Application, type InsertApplication,
  chatMessages, type ChatMessage, type InsertChatMessage,
  type ApplicationWithJob,
  type JobWithStatus,
  type DashboardStats 
} from "@shared/schema";

// Storage interface with all required CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Job operations
  getJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<Job>): Promise<Job | undefined>;
  deleteJob(id: number): Promise<boolean>;
  
  // Application operations
  getApplications(userId: number): Promise<ApplicationWithJob[]>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationByUserAndJob(userId: number, jobId: number): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, application: Partial<Application>): Promise<Application | undefined>;
  deleteApplication(id: number): Promise<boolean>;
  
  // Job with application status
  getJobsWithStatus(userId: number): Promise<JobWithStatus[]>;
  
  // Dashboard stats
  getDashboardStats(userId: number): Promise<DashboardStats>;
  
  // Chat operations
  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private chatMessages: Map<number, ChatMessage>;
  private userCurrentId: number;
  private jobCurrentId: number;
  private applicationCurrentId: number;
  private chatMessageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.chatMessages = new Map();
    this.userCurrentId = 1;
    this.jobCurrentId = 1;
    this.applicationCurrentId = 1;
    this.chatMessageCurrentId = 1;
    
    // Add sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Create sample user
    const sampleUser: InsertUser = {
      username: "alex",
      password: "password123",
      name: "Alex Johnson",
      email: "alex@example.com"
    };
    const user = this.createUser(sampleUser);

    // Create sample jobs
    const sampleJobs: InsertJob[] = [
      {
        companyName: "TechDomain",
        companyInitials: "TD",
        companyColor: "indigo",
        position: "Senior Frontend Developer",
        location: "San Francisco, CA (Remote)",
        salary: "$90K - $120K",
        jobType: "Full-time",
        description: "TechDomain is looking for a senior frontend developer with experience in React, TypeScript, and responsive design...",
        requirements: "5+ years of experience with modern JavaScript frameworks\nExperience with TypeScript\nStrong CSS/SCSS skills",
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        tags: ["React", "TypeScript", "Tailwind"]
      },
      {
        companyName: "InnoSystems",
        companyInitials: "IS",
        companyColor: "blue",
        position: "Full Stack Engineer",
        location: "Austin, TX",
        salary: "$110K - $140K",
        jobType: "Full-time",
        description: "InnoSystems is seeking a full stack engineer to develop and maintain web applications using React and Node.js...",
        requirements: "3+ years of experience with Node.js\nExperience with React\nFamiliarity with SQL databases",
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        tags: ["Node.js", "React", "PostgreSQL"]
      },
      {
        companyName: "GlobalLink",
        companyInitials: "GL",
        companyColor: "purple",
        position: "UX/UI Designer",
        location: "New York, NY (Hybrid)",
        salary: "$85K - $115K",
        jobType: "Full-time",
        description: "GlobalLink is looking for a talented UX/UI designer to create exceptional user experiences for our products...",
        requirements: "Portfolio showcasing UI design work\nExperience with design tools like Figma\nKnowledge of user research methodologies",
        postedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        tags: ["Figma", "Adobe XD", "User Research"]
      },
      {
        companyName: "NexaTech",
        companyInitials: "NX",
        companyColor: "pink",
        position: "Product Manager",
        location: "Chicago, IL",
        salary: "$120K - $150K",
        jobType: "Full-time",
        description: "NexaTech is seeking an experienced product manager to lead the development of our SaaS platform...",
        requirements: "5+ years of product management experience\nAgile methodology experience\nTechnical background preferred",
        postedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        tags: ["Product Management", "Agile", "SaaS"]
      },
      {
        companyName: "BlueThink Technologies",
        companyInitials: "BT",
        companyColor: "blue",
        position: "Frontend Developer",
        location: "San Francisco, CA (Remote)",
        salary: "$90K - $120K",
        jobType: "Full-time",
        description: "BlueThink Technologies is looking for a frontend developer to build user interfaces with React and TypeScript...",
        requirements: "3+ years of experience with React\nStrong TypeScript skills\nKnowledge of modern CSS frameworks",
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ["React", "TypeScript", "Tailwind"]
      },
      {
        companyName: "GrowSmart Inc.",
        companyInitials: "GS",
        companyColor: "green",
        position: "Full Stack Developer",
        location: "Austin, TX",
        salary: "$110K - $140K",
        jobType: "Full-time",
        description: "GrowSmart Inc. is looking for a full stack developer with experience in Node.js and React...",
        requirements: "3+ years of experience with JavaScript\nFamiliarity with React and Node.js\nDatabase experience required",
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        tags: ["Node.js", "React", "PostgreSQL"]
      },
      {
        companyName: "VisualTech Studios",
        companyInitials: "VT",
        companyColor: "purple",
        position: "UI/UX Designer",
        location: "New York, NY (Hybrid)",
        salary: "$85K - $115K",
        jobType: "Full-time",
        description: "VisualTech Studios is seeking a UI/UX designer to create beautiful and functional interfaces...",
        requirements: "Strong portfolio of UI/UX work\nExperience with Figma and Adobe XD\nUnderstanding of user-centered design principles",
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: ["Figma", "Adobe XD", "User Research"]
      }
    ];

    const jobs = sampleJobs.map(job => this.createJob(job));

    // Create sample applications
    const sampleApplications: InsertApplication[] = [
      {
        userId: user.id,
        jobId: jobs[0].id,
        status: "Interview",
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: "Had a great phone screening, moving to technical interview"
      },
      {
        userId: user.id,
        jobId: jobs[1].id,
        status: "In Review",
        appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        notes: "Application submitted, waiting for response"
      },
      {
        userId: user.id,
        jobId: jobs[2].id,
        status: "Rejected",
        appliedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        notes: "Not selected for the position"
      },
      {
        userId: user.id,
        jobId: jobs[3].id,
        status: "Final Interview",
        appliedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        notes: "Final round of interviews scheduled"
      }
    ];

    sampleApplications.forEach(app => this.createApplication(app));

    // Create sample chat messages
    const sampleChatMessages: InsertChatMessage[] = [
      {
        userId: user.id,
        message: "Hello Alex! I'm your JobNexus AI assistant. How can I help with your job search today?",
        role: "assistant",
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        userId: user.id,
        message: "I need help with my resume for a frontend developer position.",
        role: "user",
        createdAt: new Date(Date.now() - 25 * 60 * 1000)
      },
      {
        userId: user.id,
        message: "I'd be happy to help with your resume! For frontend developer positions, consider highlighting these key areas:\n- Technical skills (JavaScript, React, CSS frameworks)\n- Responsive design experience\n- Portfolio projects with links\n- Performance optimization work\n\nWould you like me to review your current resume or help with specific sections?",
        role: "assistant",
        createdAt: new Date(Date.now() - 24 * 60 * 1000)
      }
    ];

    sampleChatMessages.forEach(message => this.createChatMessage(message));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Job operations
  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    );
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.jobCurrentId++;
    const job: Job = { ...insertJob, id };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: number, jobUpdate: Partial<Job>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...jobUpdate };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: number): Promise<boolean> {
    return this.jobs.delete(id);
  }

  // Application operations
  async getApplications(userId: number): Promise<ApplicationWithJob[]> {
    const userApplications = Array.from(this.applications.values())
      .filter(app => app.userId === userId)
      .sort((a, b) => 
        new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
      );
    
    return userApplications.map(app => {
      const job = this.jobs.get(app.jobId);
      if (!job) throw new Error(`Job with id ${app.jobId} not found`);
      return { ...app, job };
    });
  }

  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationByUserAndJob(userId: number, jobId: number): Promise<Application | undefined> {
    return Array.from(this.applications.values()).find(
      app => app.userId === userId && app.jobId === jobId
    );
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.applicationCurrentId++;
    const application: Application = { ...insertApplication, id };
    this.applications.set(id, application);
    return application;
  }

  async updateApplication(id: number, applicationUpdate: Partial<Application>): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    
    const updatedApplication = { 
      ...application, 
      ...applicationUpdate,
      lastUpdated: new Date()
    };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }

  async deleteApplication(id: number): Promise<boolean> {
    return this.applications.delete(id);
  }

  // Get jobs with application status for a user
  async getJobsWithStatus(userId: number): Promise<JobWithStatus[]> {
    const jobs = await this.getJobs();
    const applications = Array.from(this.applications.values())
      .filter(app => app.userId === userId);
    
    return jobs.map(job => {
      const application = applications.find(app => app.jobId === job.id);
      if (!application) {
        return job;
      }
      
      return {
        ...job,
        status: application.status as any,
        appliedDate: application.appliedDate
      };
    });
  }

  // Dashboard stats
  async getDashboardStats(userId: number): Promise<DashboardStats> {
    const applications = Array.from(this.applications.values())
      .filter(app => app.userId === userId);
    
    const totalApplications = applications.length;
    const interviewInvites = applications.filter(
      app => app.status === "Interview" || app.status === "Final Interview" || app.status === "Offer"
    ).length;
    const inProgress = applications.filter(
      app => app.status === "Applied" || app.status === "In Review"
    ).length;
    const rejected = applications.filter(
      app => app.status === "Rejected"
    ).length;

    return {
      totalApplications,
      interviewInvites,
      inProgress,
      rejected
    };
  }

  // Chat operations
  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageCurrentId++;
    const message: ChatMessage = { ...insertMessage, id };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
