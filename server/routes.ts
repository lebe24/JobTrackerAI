import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertApplicationSchema, insertChatMessageSchema, ApplicationStatus } from "@shared/schema";
import { aiAssistant } from "./openai";
import { notionClient } from "./notion";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Auth middleware (simple for this example)
  // In a real app, use proper auth with sessions
  app.use((req, res, next) => {
    // For this demo, we'll assume we're logged in as the sample user
    req.userId = 1;
    next();
  });

  // Get current user
  app.get("/api/me", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't expose password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get dashboard stats
  app.get("/api/dashboard", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats(req.userId!);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === JOB ROUTES ===
  
  // Get all jobs with application status
  app.get("/api/jobs", async (req: Request, res: Response) => {
    try {
      const jobs = await storage.getJobsWithStatus(req.userId!);
      res.json(jobs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get job by id
  app.get("/api/jobs/:id", async (req: Request, res: Response) => {
    try {
      const jobId = parseInt(req.params.id);
      const job = await storage.getJob(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Check if user has applied to this job
      const application = await storage.getApplicationByUserAndJob(req.userId!, jobId);
      
      if (application) {
        res.json({ ...job, applicationStatus: application.status, applicationId: application.id });
      } else {
        res.json(job);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === APPLICATION ROUTES ===
  
  // Get user applications
  app.get("/api/applications", async (req: Request, res: Response) => {
    try {
      const applications = await storage.getApplications(req.userId!);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get application by id
  app.get("/api/applications/:id", async (req: Request, res: Response) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Security check - make sure the application belongs to the user
      if (application.userId !== req.userId) {
        return res.status(403).json({ message: "Not authorized to view this application" });
      }
      
      const job = await storage.getJob(application.jobId);
      if (!job) {
        return res.status(404).json({ message: "Associated job not found" });
      }
      
      res.json({ ...application, job });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create application
  app.post("/api/applications", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = insertApplicationSchema.parse({
        ...req.body,
        userId: req.userId
      });
      
      // Check if user has already applied to this job
      const existingApplication = await storage.getApplicationByUserAndJob(
        req.userId!,
        validatedData.jobId
      );
      
      if (existingApplication) {
        return res.status(409).json({ 
          message: "You have already applied to this job",
          applicationId: existingApplication.id
        });
      }
      
      // Ensure the job exists
      const job = await storage.getJob(validatedData.jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Create application in Notion database
      let notionPageId = "";
      try {
        const notionResult = await notionClient.createApplicationInNotion(
          job,
          validatedData.status,
          req.userId!
        );
        notionPageId = notionResult.pageId;
      } catch (notionError) {
        console.error("Failed to create Notion entry:", notionError);
        // Continue without Notion integration if it fails
      }
      
      // Create application in local storage
      const newApplication = await storage.createApplication({
        ...validatedData,
        notionPageId
      });
      
      res.status(201).json(newApplication);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Update application status
  app.patch("/api/applications/:id/status", async (req: Request, res: Response) => {
    try {
      const applicationId = parseInt(req.params.id);
      
      // Validate the status
      const statusSchema = z.object({
        status: ApplicationStatus
      });
      
      const { status } = statusSchema.parse(req.body);
      
      // Get the application
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Security check - ensure the application belongs to the user
      if (application.userId !== req.userId) {
        return res.status(403).json({ message: "Not authorized to update this application" });
      }
      
      // Update application
      const updatedApplication = await storage.updateApplication(applicationId, { status });
      
      // Update in Notion if possible
      if (application.notionPageId) {
        try {
          await notionClient.updateApplicationStatus(application.notionPageId, status);
        } catch (notionError) {
          console.error("Failed to update Notion:", notionError);
          // Continue even if Notion update fails
        }
      }
      
      res.json(updatedApplication);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // === CHAT ROUTES ===
  
  // Get chat history
  app.get("/api/chat", async (req: Request, res: Response) => {
    try {
      const messages = await storage.getChatMessages(req.userId!);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Send message to AI assistant
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      // Validate request
      const messageSchema = z.object({
        message: z.string().min(1).max(1000)
      });
      
      const { message } = messageSchema.parse(req.body);
      
      // Store user message
      const userMessage = await storage.createChatMessage({
        userId: req.userId!,
        message,
        role: "user",
        createdAt: new Date()
      });
      
      // Get chat history for context
      const chatHistory = await storage.getChatMessages(req.userId!);
      
      // Get AI response
      const aiResponse = await aiAssistant.getResponse(chatHistory, message);
      
      // Store AI response
      const assistantMessage = await storage.createChatMessage({
        userId: req.userId!,
        message: aiResponse,
        role: "assistant",
        createdAt: new Date()
      });
      
      res.json({
        userMessage,
        assistantMessage
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}
