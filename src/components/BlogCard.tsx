import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TailSpin } from "react-loader-spinner";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
}

interface BlogCardProps {
  blog: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [translatedBlog, setTranslatedBlog] = useState<BlogPost | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    "Hindi", "Marathi", "Gujarati", "Tamil", "Kannada",
    "Telugu", "Bengali", "Malayalam", "Punjabi", "Odia",
  ];

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://picsum.photos/400/200?random=${blog._id}`);
        setImageUrl(response.url);
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageUrl(`https://picsum.photos/400/200`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [blog._id]);

  const handleTranslate = async () => {
    if (!selectedLanguage) {
      alert("Please select a language.");
      return;
    }

    setIsTranslating(true);

    try {
      const response = await fetch('https://team-dedsec-backend.onrender.com/translate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blog.title,
          content: blog.content,
          language: selectedLanguage.toLowerCase(),
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setTranslatedBlog({
        _id: blog._id,
        title: data.title,
        content: data.content
      });
    } catch (error) {
      console.error("Error translating blog:", error);
      alert("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReset = () => {
    setTranslatedBlog(null);
    setSelectedLanguage('');
  };

  return (
    <>
      <Card
        className="w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer bg-white"
        onClick={() => setIsOpen(true)}
      >
        <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
          {isLoading ? (
            <TailSpin height={50} width={50} color="#4F46E5" ariaLabel="loading" />
          ) : (
            <img src={imageUrl || "/placeholder.svg"} alt={blog.title} className="w-full h-full object-cover" />
          )}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
          <p className="text-gray-600 line-clamp-3">{blog.content}</p>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{translatedBlog?.title || blog.title}</span>
              {translatedBlog && (
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Show Original
                </button>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img 
              src={imageUrl || "/placeholder.svg"} 
              alt={blog.title} 
              className="w-full h-64 object-cover mb-4 rounded-lg" 
            />
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">
                {translatedBlog?.content || blog.content}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <select
              className="border border-gray-300 rounded-md p-2 flex-grow"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={isTranslating}
            >
              <option value="">Select Language</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <button
              className={`px-4 py-2 rounded-md text-white ${
                isTranslating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={handleTranslate}
              disabled={isTranslating}
            >
              {isTranslating ? (
                <span className="flex items-center gap-2">
                  <TailSpin height={16} width={16} color="#FFFFFF" ariaLabel="translating" />
                  Translating...
                </span>
              ) : (
                'Translate'
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogCard;
