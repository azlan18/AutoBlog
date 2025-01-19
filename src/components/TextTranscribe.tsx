import React, { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BookOpen, Database, AlertCircle } from 'lucide-react'

const TextTranscribe = () => {
    const [file, setFile] = useState<File | null>(null)
    const [fileContent, setFileContent] = useState('')
    const [error, setError] = useState('')
    const [generatedBlog, setGeneratedBlog] = useState<{ title: string; content: string } | null>(null)
    const [generatingBlog, setGeneratingBlog] = useState(false)
    const [savingBlog, setSavingBlog] = useState(false)
    console.log(file)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0]
            setFile(selectedFile)

            // Read file content
            const reader = new FileReader()
            reader.onload = (e) => {
                const text = e.target?.result as string
                setFileContent(text)
            }
            reader.readAsText(selectedFile)
        }
    }

    const handleGenerateBlog = async () => {
        if (!fileContent) {
            setError('No text content available to generate blog.')
            return
        }

        setGeneratingBlog(true)
        setError('')
        setGeneratedBlog(null)

        try {
            const response = await axios.post('https://team-dedsec-backend.onrender.com/generate-text-blog', {
                text: fileContent
            })
            setGeneratedBlog(response.data)
        } catch (err: any) {
            setError('Error generating blog: ' + (err.response?.data?.error || err.message))
        } finally {
            setGeneratingBlog(false)
        }
    }

    const handleSaveBlog = async () => {
        if (!generatedBlog) {
            setError('No blog content available to save.')
            return
        }

        setSavingBlog(true)
        setError('')

        try {
            const response = await axios.post('https://team-dedsec-backend.onrender.com/save-blog', {
                title: generatedBlog.title,
                content: generatedBlog.content
            })
            alert('Blog saved successfully!')
            console.log(response.data)
        } catch (err: any) {
            setError('Error saving blog: ' + (err.response?.data?.error || err.message))
        } finally {
            setSavingBlog(false)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100">
                    <CardTitle className="text-2xl font-bold text-gray-800">Text File to Blog Generator</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Input
                                type="file"
                                accept=".txt"
                                onChange={handleFileChange}
                                required
                                className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 h-20"
                            />
                        </div>
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
                    {fileContent && (
                        <div className="w-full space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">File Content</h2>
                                <div className="bg-white p-4 rounded-lg shadow-inner">
                                    <p className="text-gray-700 whitespace-pre-wrap">{fileContent}</p>
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
                                        Generating Blog...
                                    </>
                                ) : (
                                    <>
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Generate Blog
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                    {generatedBlog && (
                        <div className="w-full mt-4">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">Generated Blog</h2>
                            <div className="bg-white p-4 rounded-lg shadow-inner">
                                <h3 className="text-lg font-semibold mb-2">{generatedBlog.title}</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{generatedBlog.content}</p>
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

export default TextTranscribe