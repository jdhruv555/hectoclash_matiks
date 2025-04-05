
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, PlayCircle, Clock, ThumbsUp } from "lucide-react";

interface VideoLecture {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  url: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

interface VideoLectureGalleryProps {
  category?: string;
  difficulty?: string;
  videos: VideoLecture[];
}

const VideoLectureGallery: React.FC<VideoLectureGalleryProps> = ({
  category,
  difficulty,
  videos
}) => {
  const filteredVideos = videos
    .filter(video => !category || video.category === category)
    .filter(video => !difficulty || video.difficulty === difficulty);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden bg-black border-white/10 hover:border-primary/50 transition-all">
            <div className="relative">
              <div className="aspect-video bg-muted relative overflow-hidden group">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-16 h-16 text-primary" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded-md text-xs flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {video.duration}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 line-clamp-2 hover:text-primary transition-colors">{video.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{video.channel}</p>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                <span>{video.views} views</span>
                <span className="flex items-center">
                  <ThumbsUp className="w-3 h-3 mr-1" /> {video.likes}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-md">{video.difficulty}</span>
                <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-md">{video.category}</span>
              </div>
              
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">{video.description}</p>
              
              <Button 
                className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                asChild
              >
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  Watch Now <ExternalLink size={14} />
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredVideos.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-lg text-muted-foreground">No videos found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default VideoLectureGallery;
