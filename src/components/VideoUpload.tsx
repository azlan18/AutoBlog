import React, { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, FileVideo, AlertCircle, BookOpen, Database } from 'lucide-react'

// Updated BlogArticles interface to handle titles
interface BlogArticle {
    title: string;
    content: string;
}

interface BlogArticles {
    english: BlogArticle;
    hindi: BlogArticle;
    marathi: BlogArticle;
    gujrati: BlogArticle;
    kannada: BlogArticle;
    bengali: BlogArticle;
    malayalam: BlogArticle;
    punjabi: BlogArticle;
    odia: BlogArticle;
}

const VideoUpload = () => {
    const [video, setVideo] = useState<File | null>(null)
    const [transcript, setTranscript] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [progress, setProgress] = useState(0)
    const [blogArticles, setBlogArticles] = useState<BlogArticles | null>(null)
    const [generatingBlog, setGeneratingBlog] = useState(false)
    const [savingBlog, setSavingBlog] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setVideo(event.target.files[0])
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!video) {
            setError('Please select a video file.')
            return
        }

        const formData = new FormData()
        formData.append('video', video)

        setLoading(true)
        setError('')
        setTranscript('')
        setProgress(0)
        setBlogArticles(null)

        try {
            const response = await axios.post('https://team-dedsec-backend.onrender.com/transcribe', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1))
                    setProgress(percentCompleted)
                },
            })

            setTranscript(response.data.transcript)
        } catch (err: any) {
            setError('Error uploading video or transcribing: ' + (err.response?.data?.error || err.message))
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateBlog = async () => {
        if (!transcript) {
            setError('No transcript available to generate blog articles.')
            return
        }

        setGeneratingBlog(true)
        setError('')
        setBlogArticles(null)

        try {
            const response = await axios.post('https://team-dedsec-backend.onrender.com/generate-blog', {
                transcript: transcript
            })
            setBlogArticles(response.data)
        } catch (err: any) {
            setError('Error generating blog articles: ' + (err.response?.data?.error || err.message))
        } finally {
            setGeneratingBlog(false)
        }
    }

    const handleSaveBlog = async () => {
        if (!blogArticles) {
            setError('No blog articles available to save.')
            return
        }
    
        const { title, content } = blogArticles.english;  // Assuming you're working with the 'english' article
    
        setSavingBlog(true)
        setError('')
    
        try {
            const response = await axios.post('https://team-dedsec-backend.onrender.com/save-blog', {
                title,
                content
            });
            alert('Blog articles saved successfully!')
            console.log(response.data)
        } catch (err: any) {
            setError('Error saving blog articles: ' + (err.response?.data?.error || err.message))
        } finally {
            setSavingBlog(false)
        }
    }
    

    return (
        <div className="container mx-auto p-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100">
                    <CardTitle className="text-2xl font-bold text-gray-800">Upload Video for Transcription(Kindly select at vid under 1 min)</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Input
                                type="file"
                                accept="video/mp4"
                                onChange={handleFileChange}
                                required
                                className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 h-20"
                            />
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                            >
                                {loading ? (
                                    <>
                                        <Upload className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading
                                    </>
                                ) : (
                                    <>
                                        <FileVideo className="mr-2 h-4 w-4" />
                                        Upload
                                    </>
                                )}
                            </Button>
                        </div>
                        {loading && (
                            <div className="space-y-2">
                                <Progress value={progress} className="w-full h-2 bg-blue-100" />
                                <p className="text-sm text-gray-500 text-center">{progress}% uploaded</p>
                            </div>
                        )}
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-start bg-gradient-to-r from-blue-50 to-purple-50">
                    {error && (
                        <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {transcript && (
                        <div className="w-full space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">Transcript</h2>
                                <div className="bg-white p-4 rounded-lg shadow-inner">
                                    <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleGenerateBlog}
                                disabled={generatingBlog}
                                className="w-full bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                            >
                                {generatingBlog ? (
                                    <>
                                        <BookOpen className="mr-2 h-4 w-4 animate-spin" />
                                        Generating Blog Articles...
                                    </>
                                ) : (
                                    <>
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Generate Blog Articles
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                    {blogArticles && (
                        <div className="w-full mt-4">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">Blog Articles</h2>
                            <div className="space-y-4">
                                {Object.entries(blogArticles).map(([language, article]) => (
                                    <div key={language} className="bg-white p-4 rounded-lg shadow-inner">
                                        <h3 className="text-lg font-semibold mb-2 capitalize">{language}</h3>
                                        <h4 className="text-md font-bold text-gray-900 mb-1">{(article as BlogArticle).title || "No Title"}</h4>
                                        <p className="text-gray-700 whitespace-pre-wrap">{(article as BlogArticle).content || "No Content Available"}</p>
                                    </div>
                                ))}
                            </div>
                            <Button
                                onClick={handleSaveBlog}
                                disabled={savingBlog}
                                className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200"
                            >
                                {savingBlog ? (
                                    <>
                                        <Database className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Database className="mr-2 h-4 w-4" />
                                        Save to Database
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

export default VideoUpload
