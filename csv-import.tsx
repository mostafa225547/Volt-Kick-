"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Loader2, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type Question = {
  id: number
  question: string
  options: { id: string; text: string }[]
  correctAnswer: string
}

type DifficultyLevel = "easy" | "medium" | "hard" | "quiz"

export default function CSVImport() {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvText, setCsvText] = useState<string>("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [targetLevel, setTargetLevel] = useState<DifficultyLevel>("easy")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([])
  const [delimiter, setDelimiter] = useState(",")
  const [questionColumn, setQuestionColumn] = useState("")
  const [optionColumns, setOptionColumns] = useState<string[]>([])
  const [correctAnswerColumn, setCorrectAnswerColumn] = useState("")
  const [headers, setHeaders] = useState<string[]>([])
  const [mappingComplete, setMappingComplete] = useState(false)

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFile(file)
      setError(null)
      setSuccess(null)

      // Read the file content
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setCsvText(text)
        parseCSVHeaders(text)
      }
      reader.onerror = () => {
        setError("فشل في قراءة الملف")
      }
      reader.readAsText(file)
    }
  }

  // Parse CSV headers to allow column mapping
  const parseCSVHeaders = (text: string) => {
    try {
      // Try to detect delimiter
      let detectedDelimiter = ","
      const firstLine = text.split("\n")[0]

      if (firstLine.includes(";")) {
        detectedDelimiter = ";"
      } else if (firstLine.includes("\t")) {
        detectedDelimiter = "\t"
      }

      setDelimiter(detectedDelimiter)

      const headers = firstLine.split(detectedDelimiter).map((h) => h.trim())
      setHeaders(headers)

      // Reset mapping
      setQuestionColumn("")
      setOptionColumns([])
      setCorrectAnswerColumn("")
      setMappingComplete(false)
    } catch (err) {
      setError("فشل في تحليل رؤوس الملف CSV")
    }
  }

  // Complete the column mapping
  const completeMapping = () => {
    if (!questionColumn || optionColumns.length < 2 || !correctAnswerColumn) {
      setError("يرجى تحديد جميع الأعمدة المطلوبة")
      return
    }

    setMappingComplete(true)
    generatePreview()
  }

  // Generate preview of parsed questions
  const generatePreview = () => {
    try {
      setIsLoading(true)

      const lines = csvText.split("\n").filter((line) => line.trim() !== "")
      const parsedQuestions: Question[] = []

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        const values = line.split(delimiter)

        // Create a map of column name to value
        const rowData: Record<string, string> = {}
        headers.forEach((header, index) => {
          if (index < values.length) {
            rowData[header] = values[index].trim()
          }
        })

        // Extract question data
        const question = rowData[questionColumn]
        if (!question) continue // Skip rows without questions

        // Extract options
        const options = optionColumns
          .map((col, index) => {
            return {
              id: String.fromCharCode(97 + index), // a, b, c, d...
              text: rowData[col] || "",
            }
          })
          .filter((opt) => opt.text.trim() !== "")

        // Extract correct answer
        const correctAnswerValue = rowData[correctAnswerColumn]
        let correctAnswer = ""

        // Try to determine the correct answer format
        if (correctAnswerValue) {
          // If it's a number (1, 2, 3, 4) convert to letter (a, b, c, d)
          if (/^\d+$/.test(correctAnswerValue)) {
            const index = Number.parseInt(correctAnswerValue) - 1
            if (index >= 0 && index < options.length) {
              correctAnswer = String.fromCharCode(97 + index)
            }
          }
          // If it's already a letter (a, b, c, d)
          else if (/^[a-dA-D]$/.test(correctAnswerValue)) {
            correctAnswer = correctAnswerValue.toLowerCase()
          }
          // If it's the text of the correct answer, find its index
          else {
            const optionIndex = options.findIndex((opt) => opt.text.toLowerCase() === correctAnswerValue.toLowerCase())
            if (optionIndex >= 0) {
              correctAnswer = String.fromCharCode(97 + optionIndex)
            }
          }
        }

        if (options.length >= 2 && correctAnswer) {
          parsedQuestions.push({
            id: i,
            question,
            options,
            correctAnswer,
          })
        }
      }

      setPreviewQuestions(parsedQuestions.slice(0, 5)) // Show first 5 for preview
      setQuestions(parsedQuestions)

      if (parsedQuestions.length === 0) {
        setError("لم يتم العثور على أسئلة صالحة في الملف")
      } else {
        setSuccess(`تم تحليل ${parsedQuestions.length} سؤال بنجاح`)
      }
    } catch (err) {
      setError("حدث خطأ أثناء تحليل الملف")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Save questions to localStorage
  const saveQuestions = () => {
    try {
      setIsLoading(true)

      // Get existing questions from localStorage
      const existingQuestionsJSON = localStorage.getItem("voltKickQuestions")
      const existingQuestions: Record<string, Question[]> = existingQuestionsJSON
        ? JSON.parse(existingQuestionsJSON)
        : { easy: [], medium: [], hard: [], quiz: [] }

      // Add new questions to the selected level
      existingQuestions[targetLevel] = [
        ...existingQuestions[targetLevel],
        ...questions.map((q, index) => ({
          ...q,
          id: existingQuestions[targetLevel].length + index + 1, // Ensure unique IDs
        })),
      ]

      // Save back to localStorage
      localStorage.setItem("voltKickQuestions", JSON.stringify(existingQuestions))

      setSuccess(`تم حفظ ${questions.length} سؤال في مستوى "${targetLevel}" بنجاح!`)

      // Reset form
      setCsvFile(null)
      setCsvText("")
      setQuestions([])
      setPreviewQuestions([])
      setMappingComplete(false)
    } catch (err) {
      setError("فشل في حفظ الأسئلة")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4">
      <Card className="w-full max-w-3xl shadow-2xl border-gray-700 bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 flex items-center">
                <Home className="ml-1 h-4 w-4" />
                الرئيسية
              </Button>
            </Link>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="bg-black rounded-full p-2 shadow-lg">
                <Image src="/volt-kick-logo.png" alt="Volt Kick" width={80} height={48} className="object-contain" />
              </div>
            </div>
            <div className="w-16"></div>
          </div>
          <CardTitle className="text-center mt-2">استيراد أسئلة من ملف CSV</CardTitle>
          <CardDescription className="text-gray-100 text-center">
            قم بتحميل ملف CSV يحتوي على أسئلة لإضافتها إلى التطبيق
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>خطأ</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-900/20 border-green-800 text-green-400">
              <Check className="h-4 w-4" />
              <AlertTitle>تم بنجاح</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="csv-file">اختر ملف CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="bg-gray-700 border-gray-600"
            />
          </div>

          {headers.length > 0 && !mappingComplete && (
            <div className="space-y-4 border border-gray-700 rounded-lg p-4 bg-gray-800/50">
              <h3 className="text-lg font-medium text-white">تعيين الأعمدة</h3>

              <div className="space-y-2">
                <Label htmlFor="question-column">عمود السؤال</Label>
                <Select value={questionColumn} onValueChange={setQuestionColumn}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="اختر عمود السؤال" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>أعمدة الخيارات (اختر 2-4)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {headers.map((header) => (
                    <div key={header} className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        id={`option-${header}`}
                        checked={optionColumns.includes(header)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setOptionColumns([...optionColumns, header])
                          } else {
                            setOptionColumns(optionColumns.filter((col) => col !== header))
                          }
                        }}
                        className="ml-2"
                      />
                      <Label htmlFor={`option-${header}`}>{header}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="correct-column">عمود الإجابة الصحيحة</Label>
                <Select value={correctAnswerColumn} onValueChange={setCorrectAnswerColumn}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="اختر عمود الإجابة الصحيحة" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={completeMapping}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!questionColumn || optionColumns.length < 2 || !correctAnswerColumn}
              >
                تأكيد تعيين الأعمدة
              </Button>
            </div>
          )}

          {mappingComplete && (
            <>
              <div className="space-y-2">
                <Label htmlFor="target-level">مستوى الصعوبة</Label>
                <Select value={targetLevel} onValueChange={(value: DifficultyLevel) => setTargetLevel(value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="اختر مستوى الصعوبة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">سهل</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="hard">صعب</SelectItem>
                    <SelectItem value="quiz">كويز</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {previewQuestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">معاينة الأسئلة</h3>
                  <div className="max-h-64 overflow-y-auto space-y-4 border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                    {previewQuestions.map((q, index) => (
                      <div key={index} className="border-b border-gray-700 pb-3 last:border-0 last:pb-0">
                        <p className="font-medium text-white">{q.question}</p>
                        <div className="mt-2 space-y-1">
                          {q.options.map((option) => (
                            <div key={option.id} className="flex items-center">
                              <span
                                className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs ${option.id === q.correctAnswer ? "bg-green-600" : "bg-gray-600"}`}
                              >
                                {option.id}
                              </span>
                              <span className={option.id === q.correctAnswer ? "text-green-400" : "text-gray-300"}>
                                {option.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    تم تحليل {questions.length} سؤال بنجاح. يتم عرض أول 5 أسئلة فقط للمعاينة.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Link href="/">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              رجوع
            </Button>
          </Link>

          {mappingComplete && questions.length > 0 && (
            <Button onClick={saveQuestions} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                `حفظ ${questions.length} سؤال`
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
