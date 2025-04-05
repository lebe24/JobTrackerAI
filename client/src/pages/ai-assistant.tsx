import { Card, CardContent } from "@/components/ui/card";
import AiChat from "@/components/chat/ai-chat";

const AiAssistant = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
          <p className="text-sm text-slate-500 mt-1">Get help with your job search, applications, and interview prep</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main chat area */}
        <div className="lg:col-span-2 h-[calc(100vh-200px)]">
          <AiChat />
        </div>
        
        {/* Tips/Suggestions */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold mb-4">How can the AI Assistant help?</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-1">Resume Help</h3>
                  <p className="text-sm text-blue-700">Get feedback on your resume, suggestions for improvements, and tailoring advice for specific roles.</p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-md">
                  <h3 className="font-medium text-green-800 mb-1">Interview Preparation</h3>
                  <p className="text-sm text-green-700">Practice answering common interview questions and get tips on how to present your experience effectively.</p>
                </div>
                
                <div className="bg-purple-50 p-3 rounded-md">
                  <h3 className="font-medium text-purple-800 mb-1">Cover Letter Writing</h3>
                  <p className="text-sm text-purple-700">Draft personalized cover letters that highlight your relevant skills and experience for the job.</p>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-1">Job Search Strategy</h3>
                  <p className="text-sm text-amber-700">Develop an effective job search plan based on your skills, experience, and career goals.</p>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 mt-6">Try asking: "Help me prepare for a frontend developer interview" or "Review my resume for a product manager role"</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
