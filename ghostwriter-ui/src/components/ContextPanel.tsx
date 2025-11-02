import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Sparkles, ChevronRight } from 'lucide-react';

interface InterviewEntry {
  question: string;
  answer: string;
  context: string[];
}

interface InterviewData {
  [section: string]: InterviewEntry[];
}

interface ContextPanelProps {
  projectId: string;
  activeSection?: string;
}

export function ContextPanel({ projectId, activeSection }: ContextPanelProps) {
  const [interviewData, setInterviewData] = useState<InterviewData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterviewData = async () => {
      try {
        const response = await fetch(`/mock-data/${projectId}/02_interview_data.json`);
        if (response.ok) {
          const data = await response.json();
          setInterviewData(data);
        }
      } catch (error) {
        console.error('Failed to load interview data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInterviewData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-gray-400">
        Loading context...
      </div>
    );
  }

  // Get relevant context for the active section
  const relevantEntries = activeSection ? interviewData[activeSection] || [] : [];
  const hasContext = relevantEntries.length > 0;

  if (!activeSection) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6 text-sm text-gray-400">
        <Sparkles className="w-8 h-8 mb-3 opacity-40" />
        <p>Click on an outline heading to see</p>
        <p>relevant interview context</p>
      </div>
    );
  }

  if (!hasContext) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6 text-sm text-gray-400">
        <Sparkles className="w-8 h-8 mb-3 opacity-40" />
        <p>No interview data available</p>
        <p className="text-xs mt-2">for "{activeSection}"</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-800/50 bg-gray-900/30">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300 font-medium">Context</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-gray-400 truncate">{activeSection}</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {relevantEntries.map((entry, index) => (
            <Card key={index} className="p-4 bg-gray-900/40 border-gray-800/50 hover:bg-gray-900/60 transition-colors">
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-purple-400 mb-1.5">Question</div>
                  <div className="text-sm text-gray-300">{entry.question}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-blue-400 mb-1.5">Answer</div>
                  <div className="text-sm text-gray-300 leading-relaxed">{entry.answer}</div>
                </div>

                {entry.context && entry.context.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1.5">Related Topics</div>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.context.map((topic, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-800/50 text-gray-400 border border-gray-700/50"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
