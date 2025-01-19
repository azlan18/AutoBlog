import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('https://team-dedsec-backend.onrender.com/blogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch blogs. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 my-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-black font-mono">Blog Posts</h1>
      <p className="xl fint-bold text-center mb-8 text-black font-mono">(Kindly only use Navbar to navigate. Do not refresh page)</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogList;

