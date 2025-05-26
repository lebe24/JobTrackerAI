import { Client } from "@notionhq/client";
import { type Job, type ApplicationStatusType } from "@shared/schema";

class NotionClient {
  private notion!: Client;
  private databaseId: string;
  private isConfigured: boolean = false;
  
  constructor() {
    const apiKey = process.env.NOTION_API_KEY;
    this.databaseId = process.env.NOTION_DATABASE_ID || "";
    
    if (apiKey) {
      try {
        this.notion = new Client({ auth: apiKey });
        this.isConfigured = true;
      } catch (error) {
        console.error("Failed to initialize Notion client:", error);
        this.isConfigured = false;
      }
    }
  }
  
  async createApplicationInNotion(
    job: Job,
    status: string,
    userId: number
  ): Promise<{ pageId: string }> {
    if (!this.isConfigured) {
      throw new Error("Notion integration not configured");
    }
    
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          "Company": { title: [{ text: { content: job.companyName } }] },
          "Position": { rich_text: [{ text: { content: job.position } }] },
          "Status": { select: { name: status } },
          "Applied Date": { date: { start: new Date().toISOString() } },
          "User ID": { number: userId },
        }
      });
      
      return { pageId: response.id };
    } catch (error) {
      console.error("Error creating application in Notion:", error);
      throw new Error("Failed to create application in Notion");
    }
  }
  
  async updateApplicationStatus(pageId: string, status: ApplicationStatusType): Promise<void> {
    if (!this.isConfigured) {
      throw new Error("Notion integration not configured");
    }
    
    try {
      await this.notion.pages.update({
        page_id: pageId,
        properties: {
          "Status": { select: { name: status } },
          "Last Updated": { date: { start: new Date().toISOString() } },
        }
      });
    } catch (error) {
      console.error("Error updating application in Notion:", error);
      throw new Error("Failed to update application in Notion");
    }
  }
  
  async getApplicationsFromNotion(userId: number): Promise<any[]> {
    if (!this.isConfigured) {
      throw new Error("Notion integration not configured");
    }
    
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: "User ID",
          number: {
            equals: userId
          }
        }
      });
      
      return response.results;
    } catch (error) {
      console.error("Error getting applications from Notion:", error);
      throw new Error("Failed to retrieve applications from Notion");
    }
  }
}

export const notionClient = new NotionClient();
