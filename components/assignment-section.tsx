// components/assignment-section.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, BookOpen, Loader2, Download, CheckCircle } from "lucide-react"

interface AssignmentSectionProps {
  videoId?: string;
  videoTitle?: string;
  transcript?: any[];
  isLoading?: boolean;
}

export function AssignmentSection({ videoId, videoTitle, transcript, isLoading }: AssignmentSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [assignment, setAssignment] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [submission, setSubmission] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)

  const generateAssignment = async () => {
    if (!transcript || !videoId || !videoTitle) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          videoTitle,
          transcript,
          contentType: 'assignment'
        })
      });

      const data = await response.json();
      if (data.success) {
        setAssignment(data.content);
      } else {
        console.error('Failed to generate assignment:', data.error);
        alert(`Failed to generate assignment: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to generate assignment:', error);
      alert('Failed to generate assignment. Please check your internet connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAssignment = () => {
    if (!assignment) return;
    
    const content = `
Assignment: ${assignment.title}

Description:
${assignment.description}

Instructions:
${assignment.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

Deliverables:
${assignment.deliverables.map((del, i) => `• ${del}`).join('\n')}

Evaluation Criteria:
${assignment.evaluationCriteria.map((crit, i) => `• ${crit}`).join('\n')}

Estimated Time: ${assignment.estimatedTime}

Your Submission:
${submission}

Completed: ${isCompleted ? 'Yes' : 'No'}
Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assignment-${videoId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-gray-400">Loading transcript...</span>
        </div>
      )
    }

    if (!transcript || transcript.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">No transcript available for assignment generation</p>
        </div>
      )
    }

    if (!assignment) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm mb-4">Generate a personalized assignment based on video content</p>
          <Button 
            onClick={generateAssignment} 
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating Assignment...
              </>
            ) : (
              'Generate Assignment'
            )}
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-lg mb-2">{assignment.title}</h4>
          <p className="text-gray-300 text-sm mb-4">{assignment.description}</p>
          <p className="text-xs text-gray-500">⏱️ Estimated time: {assignment.estimatedTime}</p>
        </div>

        <div>
          <h5 className="font-medium text-sm mb-2">Instructions:</h5>
          <ol className="text-sm text-gray-300 space-y-1">
            {assignment.instructions.map((instruction, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-blue-400">{i + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h5 className="font-medium text-sm mb-2">Your Submission:</h5>
          <textarea
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            placeholder="Write your assignment solution here..."
            className="w-full h-32 bg-gray-900 border border-gray-700 rounded-md p-3 text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsCompleted(!isCompleted)}
            variant={isCompleted ? "default" : "outline"}
            size="sm"
            className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </>
            ) : (
              'Mark as Complete'
            )}
          </Button>
          
          <Button 
            onClick={downloadAssignment} 
            variant="outline" 
            size="sm"
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-blue-400">
          <BookOpen className="h-3 w-3 mr-1" />
          AI Assignment
          {isCompleted && <CheckCircle className="h-3 w-3 ml-1 text-green-400" />}
          <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
        {renderContent()}
      </CollapsibleContent>
    </Collapsible>
  )
}

// // components/documentation-section.tsx
// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { ChevronDown, FileText, Loader2, Download, ExternalLink } from "lucide-react"

// interface DocumentationSectionProps {
//   videoId?: string;
//   videoTitle?: string;
//   transcript?: any[];
//   isLoading?: boolean;
// }

// export function DocumentationSection({ videoId, videoTitle, transcript, isLoading }: DocumentationSectionProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [documentation, setDocumentation] = useState<any>(null)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [userResources, setUserResources] = useState<{title: string, url: string}[]>([])

//   const generateDocumentation = async () => {
//     if (!transcript || !videoId || !videoTitle) return;

//     setIsGenerating(true);
//     try {
//       const response = await fetch('/api/generate-content', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           videoId,
//           videoTitle,
//           transcript,
//           contentType: 'documentation'
//         })
//       });

//       const data = await response.json();
//       if (data.success) {
//         setDocumentation(data.content);
//       }
//     } catch (error) {
//       console.error('Failed to generate documentation:', error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const addUserResource = () => {
//     const titleInput = document.getElementById(`doc-title-${videoId}`) as HTMLInputElement;
//     const urlInput = document.getElementById(`doc-url-${videoId}`) as HTMLInputElement;
    
//     if (titleInput.value && urlInput.value) {
//       setUserResources(prev => [...prev, { title: titleInput.value, url: urlInput.value }]);
//       titleInput.value = '';
//       urlInput.value = '';
//     }
//   };

//   const downloadDocumentation = () => {
//     if (!documentation) return;
    
//     const content = `
// Documentation: ${videoTitle}

// Summary:
// ${documentation.summary}

// Key Points:
// ${documentation.keyPoints.map((point, i) => `• ${point}`).join('\n')}

// Key Concepts:
// ${documentation.concepts.map((concept) => `
// • ${concept.name}: ${concept.description}`).join('\n')}

// Recommended Resources:
// ${documentation.resources.map((resource) => `
// • ${resource.title} (${resource.type}): ${resource.description}`).join('\n')}

// Additional Resources:
// ${userResources.map(resource => `• ${resource.title}: ${resource.url}`).join('\n')}

// Generated on: ${new Date().toLocaleDateString()}
//     `;

//     const blob = new Blob([content], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `documentation-${videoId}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const renderContent = () => {
//     if (isLoading) {
//       return (
//         <div className="flex items-center justify-center py-4">
//           <Loader2 className="h-4 w-4 animate-spin mr-2" />
//           <span className="text-sm text-gray-400">Loading transcript...</span>
//         </div>
//       )
//     }

//     if (!transcript || transcript.length === 0) {
//       return (
//         <div className="text-center py-4">
//           <p className="text-gray-400 text-sm">No transcript available for documentation generation</p>
//         </div>
//       )
//     }

//     if (!documentation) {
//       return (
//         <div className="text-center py-4">
//           <p className="text-gray-400 text-sm mb-4">Generate comprehensive documentation based on video content</p>
//           <Button 
//             onClick={generateDocumentation} 
//             disabled={isGenerating}
//             className="bg-purple-600 hover:bg-purple-700"
//           >
//             {isGenerating ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 Generating Documentation...
//               </>
//             ) : (
//               'Generate Documentation'
//             )}
//           </Button>
//         </div>
//       )
//     }

//     return (
//       <div className="space-y-4">
//         <div>
//           <h4 className="font-medium text-sm mb-2">Summary:</h4>
//           <p className="text-gray-300 text-sm">{documentation.summary}</p>
//         </div>

//         <div>
//           <h4 className="font-medium text-sm mb-2">Key Points:</h4>
//           <ul className="text-sm text-gray-300 space-y-1">
//             {documentation.keyPoints.map((point, i) => (
//               <li key={i} className="flex gap-2">
//                 <span className="text-purple-400">•</span>
//                 <span>{point}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div>
//           <h4 className="font-medium text-sm mb-2">Key Concepts:</h4>
//           <div className="space-y-2">
//             {documentation.concepts.map((concept, i) => (
//               <div key={i} className="bg-gray-900/50 p-2 rounded">
//                 <span className="font-medium text-purple-400">{concept.name}:</span>
//                 <span className="text-sm text-gray-300 ml-2">{concept.description}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h4 className="font-medium text-sm mb-2">Recommended Resources:</h4>
//           <div className="space-y-1">
//             {documentation.resources.map((resource, i) => (
//               <div key={i} className="text-sm">
//                 <span className="font-medium text-blue-400">{resource.title}</span>
//                 <span className="text-gray-500 text-xs ml-2">({resource.type})</span>
//                 <p className="text-gray-300 text-xs ml-4">{resource.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h4 className="font-medium text-sm mb-2">Additional Resources:</h4>
//           <div className="space-y-2">
//             {userResources.map((resource, i) => (
//               <div key={i} className="flex items-center justify-between bg-gray-900/50 p-2 rounded">
//                 <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm flex items-center gap-1">
//                   {resource.title}
//                   <ExternalLink className="h-3 w-3" />
//                 </a>
//               </div>
//             ))}
            
//             <div className="space-y-2 pt-2 border-t border-gray-700">
//               <input
//                 type="text"
//                 placeholder="Resource Title"
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-md p-2 text-sm"
//                 id={`doc-title-${videoId}`}
//               />
//               <input
//                 type="text"
//                 placeholder="Resource URL"
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-md p-2 text-sm"
//                 id={`doc-url-${videoId}`}
//               />
//               <Button
//                 onClick={addUserResource}
//                 className="bg-green-600 text-white text-xs px-3 py-1 h-8"
//                 size="sm"
//               >
//                 Add Resource
//               </Button>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-2 justify-center">
//           <Button 
//             onClick={downloadDocumentation} 
//             variant="outline" 
//             size="sm"
//           >
//             <Download className="h-3 w-3 mr-1" />
//             Download Documentation
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
//       <CollapsibleTrigger asChild>
//         <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-purple-400">
//           <FileText className="h-3 w-3 mr-1" />
//           AI Documentation
//           <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
//         </Button>
//       </CollapsibleTrigger>
//       <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
//         {renderContent()}
//       </CollapsibleContent>
//     </Collapsible>
//   )
// }