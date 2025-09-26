// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { YoutubeIcon, ChevronDown, BookOpen, Award, FileText, Loader2 } from "lucide-react";
// import { Modal } from "./ui/modal";
// import Image from "next/image";
// import { VideoModal } from "./playvideos";

// interface TranscriptItem {
//   text: string;
//   duration: number;
//   offset: number;
// }

// interface Video {
//   id: string;
//   title: string;
//   description: string;
//   duration: string;
//   completed: boolean;
//   thumbnailUrl?: string;
//   progress?: number;
// }

// interface PlaylistProps {
//   playlist: {
//     videos: Video[];
//   };
//   onProgressUpdate: (completedVideos: number) => void;
//   onOpenModal: (url: string) => void;
// }

// export function VideoList({ playlist, onProgressUpdate, onOpenModal }: PlaylistProps) {
//   const [videos, setVideos] = useState(playlist.videos);
//   const [notes, setNotes] = useState<Record<string, string>>({});
//   const [assignments, setAssignments] = useState<Record<string, string>>({});
//   const [documentationLinks, setDocumentationLinks] = useState<Record<string, { title: string; url: string }[]>>({});
//   const [openSections, setOpenSections] = useState<Record<string, { quiz: boolean; documentation: boolean; assignment: boolean }>>({});
  
//   // New states for transcript handling
//   const [transcripts, setTranscripts] = useState<Record<string, TranscriptItem[]>>({});
//   const [loadingTranscripts, setLoadingTranscripts] = useState<Record<string, boolean>>({});
//   const [transcriptErrors, setTranscriptErrors] = useState<Record<string, string>>({});

//   const [isIframeLoaded, setIsIframeLoaded] = useState(false);
//   const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({}); 

//   // Function to fetch transcript
//   const fetchTranscript = async (videoId: string) => {
//     if (transcripts[videoId]) {
//       return transcripts[videoId]; // Return cached transcript
//     }

//     setLoadingTranscripts(prev => ({ ...prev, [videoId]: true }));
//     setTranscriptErrors(prev => ({ ...prev, [videoId]: '' }));

//     try {
//       const response = await fetch('/api/get-transcript', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ videoId }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch transcript');
//       }

//       const data = await response.json();
      
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       setTranscripts(prev => ({ ...prev, [videoId]: data.transcript }));
//       return data.transcript;
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transcript';
//       setTranscriptErrors(prev => ({ ...prev, [videoId]: errorMessage }));
//       return null;
//     } finally {
//       setLoadingTranscripts(prev => ({ ...prev, [videoId]: false }));
//     }
//   };

//   const toggleVideoCompletion = (videoId: string) => {
//     const updatedVideos = videos.map((video) =>
//       video.id === videoId ? { ...video, completed: !video.completed } : video
//     );
//     setVideos(updatedVideos);
//     onProgressUpdate(updatedVideos.filter((video) => video.completed).length);
//   };

//   const handleToggleSection = async (videoId: string, section: "quiz" | "documentation" | "assignment") => {
//     // Fetch transcript when opening any section
//     if (!openSections[videoId]?.[section]) {
//       await fetchTranscript(videoId);
//     }

//     setOpenSections((prev) => ({
//       ...prev,
//       [videoId]: {
//         ...prev[videoId],
//         [section]: !prev[videoId]?.[section],
//       },
//     }));
//   };

//   const handleToggleNotes = (videoId: string) => {
//     setOpenNotes((prev) => ({
//       ...prev,
//       [videoId]: !prev[videoId],
//     }));
//   };

//   const handleAddDocumentationLink = (videoId: string, title: string, url: string) => {
//     if (title && url) {
//       setDocumentationLinks((prev) => ({
//         ...prev,
//         [videoId]: [...(prev[videoId] || []), { title, url }],
//       }));
//       // Clear inputs
//       (document.getElementById(`doc-title-${videoId}`) as HTMLInputElement).value = '';
//       (document.getElementById(`doc-url-${videoId}`) as HTMLInputElement).value = '';
//     }
//   };

//   const handleSaveNotes = (videoId: string, note: string) => {
//     setNotes((prev) => ({
//       ...prev,
//       [videoId]: note,
//     }));
//   };

//   const renderTranscriptContent = (videoId: string, sectionType: string) => {
//     const isLoading = loadingTranscripts[videoId];
//     const error = transcriptErrors[videoId];
//     const transcript = transcripts[videoId];

//     if (isLoading) {
//       return (
//         <div className="flex items-center justify-center py-4">
//           <Loader2 className="h-4 w-4 animate-spin mr-2" />
//           <span className="text-sm text-gray-400">Loading transcript...</span>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div className="text-center py-4">
//           <p className="text-red-400 text-sm mb-2">Error: {error}</p>
//           <Button
//             onClick={() => fetchTranscript(videoId)}
//             variant="outline"
//             size="sm"
//             className="text-xs"
//           >
//             Retry
//           </Button>
//         </div>
//       );
//     }

//     if (transcript) {
//       return (
//         <div className="space-y-4">
//           <div className="bg-gray-900/50 rounded-md p-3 max-h-48 overflow-y-auto">
//             <h4 className="text-sm font-medium text-white mb-2">Video Transcript:</h4>
//             <div className="space-y-1 text-xs text-gray-300">
//               {transcript.map((item, index) => (
//                 <div key={index} className="flex gap-2">
//                   <span className="text-gray-500 min-w-[40px]">
//                     {Math.floor(item.offset / 60)}:{(item.offset % 60).toString().padStart(2, '0')}
//                   </span>
//                   <span>{item.text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <div className="text-center text-gray-400">
//             <p className="text-sm">
//               {sectionType === 'assignment' && 'Use the transcript above to complete your assignment'}
//               {sectionType === 'quiz' && 'Review the transcript to prepare for the quiz'}
//               {sectionType === 'documentation' && 'Reference the transcript for additional documentation'}
//             </p>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="text-center py-4 text-gray-400">
//         <p className="text-sm">Click to load transcript for this {sectionType}</p>
//       </div>
//     );
//   };

//   return (
//     <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden relative z-10">
//       <div className="p-4 border-b border-gray-800 bg-gray-800/50">
//         <h2 className="text-lg font-semibold">Course Content</h2>
//         <p className="text-sm text-gray-400">Complete all videos and assignments to finish the course</p>
//       </div>

//       <div className="divide-y divide-gray-800">
//         {videos.map((video, index) => (
//           <div key={video.id} className={`p-4 ${video.completed ? "bg-gray-800/30" : ""}`}>
//             <div className="flex items-start gap-4">
//               {/* Thumbnail */}
//               <div 
//                 className="flex-shrink-0 relative cursor-pointer"
//                 onClick={() => onOpenModal(video.id, `https://www.youtube.com/embed/${video.id}`)}
//               >
//                 {video.thumbnailUrl ? (
//                   <Image
//                     src={video.thumbnailUrl || "/placeholder.svg"}
//                     alt={video.title}
//                     width={120}
//                     height={68}
//                     className="rounded-md object-cover"
//                   />
//                 ) : (
//                   <div className="w-[120px] h-[68px] bg-gray-800 rounded-md flex items-center justify-center">
//                     <YoutubeIcon className="h-8 w-8 text-red-500" />
//                   </div>
//                 )}
//                 <div className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded">
//                   {video.duration}
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 
//                       className="font-medium line-clamp-2 cursor-pointer text-blue-400 hover:underline"
//                       onClick={() => onOpenModal(`https://www.youtube.com/embed/${video.id}`)}
//                     >
//                       {index + 1}. {video.title}
//                     </h3>
//                     <div className="flex items-center gap-2 mt-1">
//                       <Checkbox
//                         checked={video.completed}
//                         onCheckedChange={() => toggleVideoCompletion(video.id)}
//                         className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
//                       />
//                       <span className="text-xs text-gray-400">
//                         {video.completed ? "Completed" : "Mark as completed"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Notes Section */}
//                 <Collapsible open={!!openNotes[video.id]} onOpenChange={() => handleToggleNotes(video.id)}>
//                   <CollapsibleTrigger asChild>
//                     <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-green-400 mt-2">
//                       Notes
//                       <ChevronDown
//                         className={`h-3 w-3 ml-1 transition-transform ${
//                           openNotes[video.id] ? "rotate-180" : ""
//                         }`}
//                       />
//                     </Button>
//                   </CollapsibleTrigger>
//                   <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
//                     <textarea
//                       className="w-full bg-gray-900 text-white border border-gray-700 rounded-md p-2"
//                       placeholder="Write your notes here..."
//                       value={notes[video.id] || ""}
//                       onChange={(e) => handleSaveNotes(video.id, e.target.value)}
//                     />
//                     {notes[video.id] && (
//                       <div className="mt-4 p-2 bg-gray-700 rounded-md text-white">
//                         <strong>Your Notes:</strong>
//                         <p>{notes[video.id]}</p>
//                       </div>
//                     )}
//                   </CollapsibleContent>
//                 </Collapsible>

//                 {/* Assignment Section */}
//                 <Collapsible 
//                   open={!!openSections[video.id]?.assignment} 
//                   onOpenChange={() => handleToggleSection(video.id, "assignment")}
//                 >
//                   <CollapsibleTrigger asChild>
//                     <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-blue-400 mt-2">
//                       <BookOpen className="h-3 w-3 mr-1" />
//                       Assignment
//                       <ChevronDown 
//                         className={`h-3 w-3 ml-1 transition-transform ${
//                           openSections[video.id]?.assignment ? "rotate-180" : ""
//                         }`} 
//                       />
//                     </Button>
//                   </CollapsibleTrigger>
//                   <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
//                     {renderTranscriptContent(video.id, 'assignment')}
//                   </CollapsibleContent>
//                 </Collapsible>

//                 {/* Quiz Section */}
//                 <Collapsible 
//                   open={!!openSections[video.id]?.quiz} 
//                   onOpenChange={() => handleToggleSection(video.id, "quiz")}
//                 >
//                   <CollapsibleTrigger asChild>
//                     <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-yellow-400 mt-2">
//                       <Award className="h-3 w-3 mr-1" />
//                       Quiz
//                       <ChevronDown
//                         className={`h-3 w-3 ml-1 transition-transform ${
//                           openSections[video.id]?.quiz ? "rotate-180" : ""
//                         }`}
//                       />
//                     </Button>
//                   </CollapsibleTrigger>
//                   <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
//                     {renderTranscriptContent(video.id, 'quiz')}
//                   </CollapsibleContent>
//                 </Collapsible>

//                 {/* Documentation Section */}
//                 <Collapsible
//                   open={!!openSections[video.id]?.documentation}
//                   onOpenChange={() => handleToggleSection(video.id, "documentation")}
//                 >
//                   <CollapsibleTrigger asChild>
//                     <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-purple-400 mt-2">
//                       <FileText className="h-3 w-3 mr-1" />
//                       Documentation
//                       <ChevronDown
//                         className={`h-3 w-3 ml-1 transition-transform ${
//                           openSections[video.id]?.documentation ? "rotate-180" : ""
//                         }`}
//                       />
//                     </Button>
//                   </CollapsibleTrigger>
//                   <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
//                     {renderTranscriptContent(video.id, 'documentation')}
                    
//                     <div className="mt-4 pt-4 border-t border-gray-700">
//                       <h4 className="text-sm font-medium text-white mb-2">Additional Resources:</h4>
//                       <div className="space-y-2 mb-4">
//                         {(documentationLinks[video.id] || []).map((link, idx) => (
//                           <div key={idx} className="flex items-center justify-between">
//                             <a
//                               href={link.url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-400 hover:underline text-sm"
//                             >
//                               {link.title}
//                             </a>
//                           </div>
//                         ))}
//                       </div>
                      
//                       <div className="space-y-2">
//                         <input
//                           type="text"
//                           placeholder="Resource Title"
//                           className="w-full bg-gray-900 text-white border border-gray-700 rounded-md p-2 text-sm"
//                           id={`doc-title-${video.id}`}
//                         />
//                         <input
//                           type="text"
//                           placeholder="Resource URL"
//                           className="w-full bg-gray-900 text-white border border-gray-700 rounded-md p-2 text-sm"
//                           id={`doc-url-${video.id}`}
//                         />
//                         <Button
//                           onClick={() =>
//                             handleAddDocumentationLink(
//                               video.id,
//                               (document.getElementById(`doc-title-${video.id}`) as HTMLInputElement).value,
//                               (document.getElementById(`doc-url-${video.id}`) as HTMLInputElement).value
//                             )
//                           }
//                           className="bg-green-600 text-white text-xs px-3 py-1 h-8"
//                           size="sm"
//                         >
//                           Add Resource
//                         </Button>
//                       </div>
//                     </div>
//                   </CollapsibleContent>
//                 </Collapsible>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }





// Update your video-list.tsx to use the new AI-powered components

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { YoutubeIcon, ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { QuizSection } from "./quiz-section"; // Your enhanced quiz component
import { AssignmentSection } from "./assignment-section";
import { DocumentationSection } from "./documentation-section";
import { NotesSection } from "./notes-section";

interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  thumbnailUrl?: string;
  progress?: number;
}

interface PlaylistProps {
  playlist: {
    videos: Video[];
  };
  onProgressUpdate: (completedVideos: number) => void;
  onOpenModal: (url: string) => void;
}

export function VideoList({ playlist, onProgressUpdate, onOpenModal }: PlaylistProps) {
  const [videos, setVideos] = useState(playlist.videos);
  
  // New states for transcript handling
  const [transcripts, setTranscripts] = useState<Record<string, TranscriptItem[]>>({});
  const [loadingTranscripts, setLoadingTranscripts] = useState<Record<string, boolean>>({});
  const [transcriptErrors, setTranscriptErrors] = useState<Record<string, string>>({});

  // Function to fetch transcript
  const fetchTranscript = async (videoId: string) => {
    if (transcripts[videoId]) {
      return transcripts[videoId]; // Return cached transcript
    }

    setLoadingTranscripts(prev => ({ ...prev, [videoId]: true }));
    setTranscriptErrors(prev => ({ ...prev, [videoId]: '' }));

    try {
      const response = await fetch('/api/get-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setTranscripts(prev => ({ ...prev, [videoId]: data.transcript }));
      return data.transcript;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transcript';
      setTranscriptErrors(prev => ({ ...prev, [videoId]: errorMessage }));
      return null;
    } finally {
      setLoadingTranscripts(prev => ({ ...prev, [videoId]: false }));
    }
  };

  const toggleVideoCompletion = (videoId: string) => {
    const updatedVideos = videos.map((video) =>
      video.id === videoId ? { ...video, completed: !video.completed } : video
    );
    setVideos(updatedVideos);
    onProgressUpdate(updatedVideos.filter((video) => video.completed).length);
  };


  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden relative z-10">
      <div className="p-4 border-b border-gray-800 bg-gray-800/50">
        <h2 className="text-lg font-semibold">Course Content</h2>
        <p className="text-sm text-gray-400">Complete all videos and assignments to finish the course</p>
      </div>

      <div className="divide-y divide-gray-800">
        {videos.map((video, index) => (
          <div key={video.id} className={`p-4 ${video.completed ? "bg-gray-800/30" : ""}`}>
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              <div 
                className="flex-shrink-0 relative cursor-pointer"
                onClick={() => onOpenModal(video.id, `https://www.youtube.com/embed/${video.id}`)}
              >
                {video.thumbnailUrl ? (
                  <Image
                    src={video.thumbnailUrl || "/placeholder.svg"}
                    alt={video.title}
                    width={120}
                    height={68}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-[120px] h-[68px] bg-gray-800 rounded-md flex items-center justify-center">
                    <YoutubeIcon className="h-8 w-8 text-red-500" />
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded">
                  {video.duration}
                </div>
              </div>

              {/* Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 
                      className="font-medium line-clamp-2 cursor-pointer text-blue-400 hover:underline"
                      onClick={() => onOpenModal(`https://www.youtube.com/embed/${video.id}`)}
                    >
                      {index + 1}. {video.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Checkbox
                        checked={video.completed}
                        onCheckedChange={() => toggleVideoCompletion(video.id)}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                      />
                      <span className="text-xs text-gray-400">
                        {video.completed ? "Completed" : "Mark as completed"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI-Powered Notes Section */}
                <NotesSection 
                  videoId={video.id}
                  videoTitle={video.title}
                />

                {/* AI-Powered Assignment Section */}
                <AssignmentSection 
                  videoId={video.id}
                  videoTitle={video.title}
                  transcript={transcripts[video.id]}
                  isLoading={loadingTranscripts[video.id]}
                />

                {/* AI-Powered Quiz Section */}
                <QuizSection 
                  videoId={video.id}
                  videoTitle={video.title}
                  transcript={transcripts[video.id]}
                  isLoading={loadingTranscripts[video.id]}
                  onFetchTranscript={() => fetchTranscript(video.id)}
                />

                {/* AI-Powered Documentation Section */}
                <DocumentationSection 
                  videoId={video.id}
                  videoTitle={video.title}
                  transcript={transcripts[video.id]}
                  isLoading={loadingTranscripts[video.id]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}