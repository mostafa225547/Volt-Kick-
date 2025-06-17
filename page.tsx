"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Trophy, ArrowRight, RefreshCw, Star, Zap, Award, Home, Coins } from "lucide-react"
import Image from "next/image"

// تعريف الأسئلة حسب مستوى الصعوبة
const defaultQuestionsByLevel = {
  easy: [
    {
      id: 1,
      question: "أي منتخب فاز بكأس العالم 2022؟",
      options: [
        { id: "a", text: "البرازيل" },
        { id: "b", text: "فرنسا" },
        { id: "c", text: "الأرجنتين" },
        { id: "d", text: "ألمانيا" },
      ],
      correctAnswer: "c",
    },
    {
      id: 2,
      question: "من هو أفضل لاعب في العالم لعام 2023؟",
      options: [
        { id: "a", text: "ليونيل ميسي" },
        { id: "b", text: "كريستيانو رونالدو" },
        { id: "c", text: "كيليان مبابي" },
        { id: "d", text: "إيرلينغ هالاند" },
      ],
      correctAnswer: "a",
    },
    {
      id: 3,
      question: "أي نادٍ مصري يُلقب بـ 'القلعة الحمراء'؟",
      options: [
        { id: "a", text: "النادي الأهلي" },
        { id: "b", text: "الزمالك" },
        { id: "c", text: "الإسماعيلي" },
        { id: "d", text: "المصري" },
      ],
      correctAnswer: "a",
    },
    {
      id: 4,
      question: "ما هو لون قميص نادي الزمالك الأساسي؟",
      options: [
        { id: "a", text: "أحمر" },
        { id: "b", text: "أبيض" },
        { id: "c", text: "أزرق" },
        { id: "d", text: "أخضر" },
      ],
      correctAnswer: "b",
    },
    {
      id: 5,
      question: "كم مرة فازت مصر بكأس الأمم الأفريقية؟",
      options: [
        { id: "a", text: "5 مرات" },
        { id: "b", text: "6 مرات" },
        { id: "c", text: "7 مرات" },
        { id: "d", text: "8 مرات" },
      ],
      correctAnswer: "c",
    },
    {
      id: 6,
      question: "من هو الهداف التاريخي للمنتخب المصري؟",
      options: [
        { id: "a", text: "محمد صلاح" },
        { id: "b", text: "حسام حسن" },
        { id: "c", text: "أحمد حسن" },
        { id: "d", text: "محمد أبو تريكة" },
      ],
      correctAnswer: "b",
    },
    {
      id: 7,
      question: "في أي نادي يلعب محمد صلاح حالياً؟",
      options: [
        { id: "a", text: "ليفربول" },
        { id: "b", text: "مانشستر سيتي" },
        { id: "c", text: "تشيلسي" },
        { id: "d", text: "أرسنال" },
      ],
      correctAnswer: "a",
    },
    {
      id: 8,
      question: "ما هو النادي الذي يلقب بـ 'الملكي'؟",
      options: [
        { id: "a", text: "برشلونة" },
        { id: "b", text: "ريال مدريد" },
        { id: "c", text: "مانشستر يونايتد" },
        { id: "d", text: "بايرن ميونخ" },
      ],
      correctAnswer: "b",
    },
    {
      id: 9,
      question: "من هو مدرب المنتخب المصري الحالي؟",
      options: [
        { id: "a", text: "حسام البدري" },
        { id: "b", text: "إيهاب جلال" },
        { id: "c", text: "هيكتور كوبر" },
        { id: "d", text: "حسام حسن" },
      ],
      correctAnswer: "b",
    },
    {
      id: 10,
      question: "ما هو اسم ملعب النادي الأهلي الجديد؟",
      options: [
        { id: "a", text: "السلام" },
        { id: "b", text: "الأهلي وي الجديد" },
        { id: "c", text: "برج العرب" },
        { id: "d", text: "القاهرة الدولي" },
      ],
      correctAnswer: "b",
    },
  ],
  medium: [
    {
      id: 1,
      question: "من هو الهداف التاريخي لدوري أبطال أوروبا؟",
      options: [
        { id: "a", text: "روبرت ليفاندوفسكي" },
        { id: "b", text: "ليونيل ميسي" },
        { id: "c", text: "كريم بنزيما" },
        { id: "d", text: "كريستيانو رونالدو" },
      ],
      correctAnswer: "d",
    },
    {
      id: 2,
      question: "أي نادٍ فاز بأكبر عدد من بطولات دوري أبطال أوروبا؟",
      options: [
        { id: "a", text: "برشلونة" },
        { id: "b", text: "بايرن ميونخ" },
        { id: "c", text: "ريال مدريد" },
        { id: "d", text: "ليفربول" },
      ],
      correctAnswer: "c",
    },
    {
      id: 3,
      question: "من هو مدرب الأهلي الذي فاز بدوري أبطال أفريقيا 2020؟",
      options: [
        { id: "a", text: "بيتسو موسيماني" },
        { id: "b", text: "حسام البدري" },
        { id: "c", text: "مارتن يول" },
        { id: "d", text: "رينيه فايلر" },
      ],
      correctAnswer: "a",
    },
    {
      id: 4,
      question: "أي نادٍ مصري فاز بكأس الكونفدرالية الأفريقية 2019؟",
      options: [
        { id: "a", text: "الأهلي" },
        { id: "b", text: "الزمالك" },
        { id: "c", text: "بيراميدز" },
        { id: "d", text: "الإسماعيلي" },
      ],
      correctAnswer: "b",
    },
    {
      id: 5,
      question: "في أي عام تأسس النادي الأهلي؟",
      options: [
        { id: "a", text: "1907" },
        { id: "b", text: "1908" },
        { id: "c", text: "1909" },
        { id: "d", text: "1910" },
      ],
      correctAnswer: "a",
    },
    {
      id: 6,
      question: "من هو أكثر لاعب مصري تسجيلاً للأهداف في الدوري المصري؟",
      options: [
        { id: "a", text: "محمود الخطيب" },
        { id: "b", text: "حسام حسن" },
        { id: "c", text: "محمد أبو تريكة" },
        { id: "d", text: "طاهر أبو زيد" },
      ],
      correctAnswer: "a",
    },
    {
      id: 7,
      question: "ما هو النادي السعودي الذي انضم إليه كريستيانو رونالدو؟",
      options: [
        { id: "a", text: "الهلال" },
        { id: "b", text: "النصر" },
        { id: "c", text: "الاتحاد" },
        { id: "d", text: "الأهلي" },
      ],
      correctAnswer: "b",
    },
    {
      id: 8,
      question: "من هو اللاعب الفائز بجائزة الكرة الذهبية لعام 2023؟",
      options: [
        { id: "a", text: "ليونيل ميسي" },
        { id: "b", text: "كريم بنزيما" },
        { id: "c", text: "إيرلينغ هالاند" },
        { id: "d", text: "كيليان مبابي" },
      ],
      correctAnswer: "b",
    },
    {
      id: 9,
      question: "ما هو النادي الذي فاز بأول نسخة من كأس العالم للأندية؟",
      options: [
        { id: "a", text: "ريال مدريد" },
        { id: "b", text: "برشلونة" },
        { id: "c", text: "كورينثيانز" },
        { id: "d", text: "مانشستر يونايتد" },
      ],
      correctAnswer: "c",
    },
    {
      id: 10,
      question: "من هو الحارس المصري الذي لعب مباراة اوروغواى كاس العالم 2018؟",
      options: [
        { id: "a", text: "عصام الحضري" },
        { id: "b", text: "أحمد الشناوي" },
        { id: "c", text: "محمد الشناوي" },
        { id: "d", text: "محمد عواد" },
      ],
      correctAnswer: "c",
    },
  ],
  hard: [
    {
      id: 1,
      question: "من هو اللاعب الوحيد الذي فاز بكأس العالم ثلاث مرات كلاعب؟",
      options: [
        { id: "a", text: "بيليه" },
        { id: "b", text: "دييغو مارادونا" },
        { id: "c", text: "زين الدين زيدان" },
        { id: "d", text: "رونالدو (البرازيلي)" },
      ],
      correctAnswer: "a",
    },
    {
      id: 2,
      question: "من هو الحارس الوحيد الذي فاز بالكرة الذهبية؟",
      options: [
        { id: "a", text: "إيكر كاسياس" },
        { id: "b", text: "جيانلويجي بوفون" },
        { id: "c", text: "ليف ياشين" },
        { id: "d", text: "مانويل نوير" },
      ],
      correctAnswer: "c",
    },
    {
      id: 3,
      question: "من هو أول لاعب مصري يفوز بجائزة أفضل لاعب في أفريقيا؟",
      options: [
        { id: "a", text: "محمود الخطيب" },
        { id: "b", text: "طاهر أبو زيد" },
        { id: "c", text: "حسام حسن" },
        { id: "d", text: "أحمد شوبير" },
      ],
      correctAnswer: "a",
    },
    {
      id: 4,
      question: "كم مرة فاز الأهلي بدوري أبطال أفريقيا؟",
      options: [
        { id: "a", text: "8 مرات" },
        { id: "b", text: "9 مرات" },
        { id: "c", text: "10 مرات" },
        { id: "d", text: "11 مرة" },
      ],
      correctAnswer: "d",
    },
    {
      id: 5,
      question: "من هو اللاعب الذي سجل هدف فوز مصر على إيطاليا في كأس العالم 1990؟",
      options: [
        { id: "a", text: "مجدي عبد الغني" },
        { id: "b", text: "حسام حسن" },
        { id: "c", text: "طاهر أبو زيد" },
        { id: "d", text: "أحمد رمزي" },
      ],
      correctAnswer: "a",
    },
    {
      id: 6,
      question: "أي نادٍ مصري وصل لنهائي كأس العالم للأندية؟",
      options: [
        { id: "a", text: "الأهلي" },
        { id: "b", text: "الزمالك" },
        { id: "c", text: "الإسماعيلي" },
        { id: "d", text: "لم يصل أي نادٍ مصري" },
      ],
      correctAnswer: "d",
    },
    {
      id: 7,
      question: "من هو المدرب الذي قاد مصر لكأس العالم 2018؟",
      options: [
        { id: "a", text: "حسام البدري" },
        { id: "b", text: "هيكتور كوبر" },
        { id: "c", text: "بوب برادلي" },
        { id: "d", text: "كارلوس كيروش" },
      ],
      correctAnswer: "b",
    },
    {
      id: 8,
      question: "من هو اللاعب الذي سجل أكثر عدد من الأهداف في موسم واحد بالدوري الإنجليزي الممتاز (38 مباراة)؟",
      options: [
        { id: "a", text: "محمد صلاح" },
        { id: "b", text: "آلان شيرر" },
        { id: "c", text: "كريستيانو رونالدو" },
        { id: "d", text: "تييري هنري" },
      ],
      correctAnswer: "a",
    },
    {
      id: 9,
      question: "ما هو أكبر فوز في تاريخ كأس العالم؟",
      options: [
        { id: "a", text: "ألمانيا 7-1 البرازيل" },
        { id: "b", text: "المجر 10-1 السلفادور" },
        { id: "c", text: "يوغوسلافيا 9-0 زائير" },
        { id: "d", text: "المجر 9-0 كوريا الجنوبية" },
      ],
      correctAnswer: "b",
    },
    {
      id: 10,
      question: "من هو هداف كاس العالم ؟",
      options: [
        { id: "a", text: "كريستيانو رونالدو" },
        { id: "b", text: "ليونيل ميسي" },
        { id: "c", text: "ميروسلاف كلوزه" },
        { id: "d", text: "بيليه" },
      ],
      correctAnswer: "c",
    },
  ],
  quiz: [
    {
      id: 1,
      question: "من هو اللاعب الوحيد الفائز بدوري أبطال أوروبا مع ثلاث أندية مختلفة؟",
      options: [
        { id: "a", text: "كلارنس سيدورف" },
        { id: "b", text: "أندريا بيرلو" },
        { id: "c", text: "زين الدين زيدان" },
        { id: "d", text: "كاكا" },
      ],
      correctAnswer: "a",
    },
    {
      id: 2,
      question: "ما هو الرقم القياسي لأسرع هدف في تاريخ كأس العالم؟",
      options: [
        { id: "a", text: "9.12 ثانية" },
        { id: "b", text: "10.8 ثانية" },
        { id: "c", text: "11.5 ثانية" },
        { id: "d", text: "8.3 ثانية" },
      ],
      correctAnswer: "b",
    },
    {
      id: 3,
      question: "من هو اللاعب الذي سجل أول هدف في تاريخ كأس العالم 1930؟",
      options: [
        { id: "a", text: "لوسيان لوران" },
        { id: "b", text: "جيليرمو ستابيلي" },
        { id: "c", text: "بيدرو سيا" },
        { id: "d", text: "هيكتور كاسترو" },
      ],
      correctAnswer: "a",
    },
  ],
}

// نقاط لكل مستوى صعوبة
const pointsPerLevel = {
  easy: 5,
  medium: 10,
  hard: 15,
  quiz: 100,
}

// ألوان وأيقونات لكل مستوى - محدثة لتتناسب مع اللوجو
const levelConfig = {
  easy: {
    color: "bg-cyan-500",
    hoverColor: "hover:bg-cyan-600",
    icon: <Star className="h-6 w-6" />,
    title: "سهل",
  },
  medium: {
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    icon: <Zap className="h-6 w-6" />,
    title: "متوسط",
  },
  hard: {
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
    icon: <Award className="h-6 w-6" />,
    title: "صعب",
  },
  quiz: {
    color: "bg-purple-600",
    hoverColor: "hover:bg-purple-700",
    icon: <Trophy className="h-6 w-6" />,
    title: "كويز",
    cost: 50,
  },
}

type DifficultyLevel = "easy" | "medium" | "hard" | "quiz"

export default function FootballQuiz() {
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [points, setPoints] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [totalPoints, setTotalPoints] = useState(() => {
    // استرجاع النقاط المخزنة من localStorage إذا كانت موجودة
    if (typeof window !== "undefined") {
      const savedPoints = localStorage.getItem("voltKickTotalPoints")
      return savedPoints ? Number.parseInt(savedPoints, 10) : 0
    }
    return 0
  })
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const [showInsufficientCoins, setShowInsufficientCoins] = useState(false)
  const [questionsByLevel, setQuestionsByLevel] = useState(defaultQuestionsByLevel)
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([])

  // استرجاع الأسئلة المخزنة من localStorage وتحميلها
  useEffect(() => {
    if (typeof window !== "undefined") {
      // استرجاع الأسئلة المخزنة
      const savedQuestions = localStorage.getItem("voltKickQuestions")
      if (savedQuestions) {
        try {
          const parsedQuestions = JSON.parse(savedQuestions)
          // دمج الأسئلة المحفوظة مع الأسئلة الافتراضية
          const mergedQuestions = {
            easy: [...defaultQuestionsByLevel.easy, ...(parsedQuestions.easy || [])],
            medium: [...defaultQuestionsByLevel.medium, ...(parsedQuestions.medium || [])],
            hard: [...defaultQuestionsByLevel.hard, ...(parsedQuestions.hard || [])],
            quiz: [...defaultQuestionsByLevel.quiz, ...(parsedQuestions.quiz || [])],
          }
          setQuestionsByLevel(mergedQuestions)
        } catch (error) {
          console.error("Error loading saved questions:", error)
        }
      }
    }
  }, [])

  // حفظ النقاط الإجمالية في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem("voltKickTotalPoints", totalPoints.toString())
  }, [totalPoints])

  // دالة لخلط الأسئلة بشكل عشوائي
  const shuffleQuestions = (questions: any[]) => {
    const shuffled = [...questions]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const selectLevel = (level: DifficultyLevel) => {
    // التحقق من الكوينز للمستوى الخاص
    if (level === "quiz") {
      if (totalPoints < 50) {
        setShowInsufficientCoins(true)
        setTimeout(() => setShowInsufficientCoins(false), 3000)
        return
      }
      // خصم 50 كوينز عند الدخول للكويز
      setTotalPoints(totalPoints - 50)
    }

    // خلط الأسئلة بشكل عشوائي للمستوى المختار
    const shuffledQuestions = shuffleQuestions([...questionsByLevel[level]])
    setCurrentQuestions(shuffledQuestions)

    setSelectedLevel(level)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setPoints(0)
    setShowResult(false)
    setAnswered(false)
  }

  // الحصول على السؤال الحالي
  const currentQuestion = currentQuestions[currentQuestionIndex]
  const pointsPerCorrectAnswer = selectedLevel ? pointsPerLevel[selectedLevel] : 0

  const handleAnswerSelect = (value: string) => {
    if (!answered) {
      setSelectedAnswer(value)
    }
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return

    if (!answered) {
      if (selectedAnswer === currentQuestion.correctAnswer) {
        if (selectedLevel === "quiz") {
          // في الكويز، لا نضيف نقاط حتى ننتهي من جميع الأسئلة
          setPoints(points + 1) // نحسب عدد الإجابات الصحيحة
        } else {
          const earnedPoints = pointsPerCorrectAnswer
          setPoints(points + earnedPoints)
          setTotalPoints(totalPoints + earnedPoints)
          setShowPointsAnimation(true)
          setTimeout(() => setShowPointsAnimation(false), 1500)
        }
      } else if (selectedLevel === "quiz") {
        // في الكويز، إذا أخطأ في أي سؤال ينتهي الكويز فوراً
        resetQuiz()
        return
      }
      setAnswered(true)
    } else {
      // انتقل إلى السؤال التالي
      setAnswered(false)
      setSelectedAnswer(null)

      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        // إذا انتهى الكويز بنجاح (3 إجابات صحيحة)
        if (selectedLevel === "quiz" && points === currentQuestions.length - 1) {
          // points = 2 لأن هذا السؤال الثالث
          setTotalPoints(totalPoints + 100)
          setPoints(100) // لعرض 100 نقطة في النتائج
        }
        setShowResult(true)
      }
    }
  }

  const resetQuiz = () => {
    setSelectedLevel(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setPoints(0)
    setShowResult(false)
    setAnswered(false)
    setCurrentQuestions([])
  }

  // شاشة اختيار المستوى
  if (!selectedLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-80 p-2 z-10">
          <div className="flex justify-center items-center">
            <div className="flex items-center bg-yellow-500 bg-opacity-90 px-4 py-2 rounded-full shadow-lg">
              <Coins className="text-white h-5 w-5 mr-2" />
              <span className="text-white font-bold">{totalPoints}</span>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-lg shadow-2xl border-gray-700 bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-black rounded-full p-4 shadow-2xl">
                <Image
                  src="/volt-kick-logo.png"
                  alt="Volt Kick Logo"
                  width={200}
                  height={120}
                  className="object-contain"
                />
              </div>
              <CardDescription className="text-gray-100 text-center text-lg">
                اختبر معلوماتك الكروية واكسب النقاط!
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 bg-gray-800">
            <h3 className="text-white text-center text-lg font-semibold mb-4">اختر مستوى الصعوبة</h3>
            {showInsufficientCoins && (
              <div className="bg-red-600/20 border border-red-500 text-red-300 p-3 rounded-lg text-center mb-4">
                تحتاج إلى 50 كوينز على الأقل للدخول إلى الكويز!
              </div>
            )}
            {(Object.keys(levelConfig) as DifficultyLevel[]).map((level) => (
              <Button
                key={level}
                onClick={() => selectLevel(level)}
                disabled={level === "quiz" && totalPoints < 50}
                className={`w-full h-16 text-lg ${levelConfig[level].color} ${levelConfig[level].hoverColor} flex items-center justify-between shadow-lg border-2 border-transparent hover:border-white/20 ${
                  level === "quiz" && totalPoints < 50 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="font-bold">{levelConfig[level].title}</span>
                <div className="flex items-center">
                  {level === "quiz" ? (
                    <span className="ml-2 text-sm">50 كوينز - 3 أسئلة - 100 نقطة</span>
                  ) : (
                    <span className="ml-2 text-sm">{pointsPerLevel[level]} نقاط لكل إجابة صحيحة</span>
                  )}
                  {levelConfig[level].icon}
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  // شاشة الاختبار
  if (!showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-80 p-2 z-10">
          <div className="flex justify-center items-center">
            <div className="flex items-center bg-yellow-500 bg-opacity-90 px-4 py-2 rounded-full shadow-lg">
              <Coins className="text-white h-5 w-5 mr-2" />
              <span className="text-white font-bold">{totalPoints}</span>
              {showPointsAnimation && (
                <span className="text-white font-bold ml-2 animate-bounce">+{pointsPerCorrectAnswer}</span>
              )}
            </div>
          </div>
        </div>

        <Card className="w-full max-w-lg shadow-2xl border-gray-700 bg-gray-800">
          <CardHeader className={`${levelConfig[selectedLevel].color} text-white rounded-t-lg`}>
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetQuiz}
                className="text-white hover:bg-white/20 flex items-center"
              >
                <Home className="ml-1 h-4 w-4" />
                الرئيسية
              </Button>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="bg-black rounded-full p-2 shadow-lg">
                  <Image src="/volt-kick-logo.png" alt="Volt Kick" width={80} height={48} className="object-contain" />
                </div>
                <span className="text-lg font-bold"></span>
              </div>
              <div className="w-16"></div>
            </div>
            <CardDescription className="text-gray-100 text-center">
              السؤال {currentQuestionIndex + 1} من {currentQuestions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 bg-gray-800">
            <div className="text-lg font-medium text-center mb-6 text-white">{currentQuestion.question}</div>
            <RadioGroup value={selectedAnswer || ""} className="space-y-3">
              {currentQuestion.options.map((option: any) => (
                <div
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={`
                  flex items-center space-x-2 space-x-reverse rounded-lg border p-4 cursor-pointer transition-colors
                  ${answered && option.id === currentQuestion.correctAnswer ? "bg-green-600/20 border-green-500 text-green-300" : ""}
                  ${answered && option.id === selectedAnswer && option.id !== currentQuestion.correctAnswer ? "bg-red-600/20 border-red-500 text-red-300" : ""}
                  ${!answered && option.id === selectedAnswer ? "bg-blue-600/20 border-blue-500 text-blue-300" : ""}
                  ${!answered && option.id !== selectedAnswer ? "hover:bg-gray-700 border-gray-600 text-gray-300" : ""}
                  ${!answered ? "border-gray-600" : ""}
                `}
                >
                  <div className="flex-1 flex justify-between items-center">
                    <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer text-right pr-3">
                      {option.text}
                    </Label>
                    <RadioGroupItem value={option.id} id={`option-${option.id}`} disabled={answered} />
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 bg-gray-800">
            {selectedLevel !== "quiz" && (
              <div className="text-sm font-medium text-white">
                النقاط: {points} /{" "}
                {currentQuestionIndex * pointsPerCorrectAnswer + (answered ? pointsPerCorrectAnswer : 0)}
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`${levelConfig[selectedLevel].color} ${levelConfig[selectedLevel].hoverColor} shadow-lg`}
            >
              {answered ? (
                <>
                  السؤال التالي
                  <ArrowRight className="mr-2 h-4 w-4" />
                </>
              ) : (
                "تأكيد الإجابة"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // شاشة النتائج
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-80 p-2 z-10">
        <div className="flex justify-center items-center">
          <div className="flex items-center bg-yellow-500 bg-opacity-90 px-4 py-2 rounded-full shadow-lg">
            <Coins className="text-white h-5 w-5 mr-2" />
            <span className="text-white font-bold">{totalPoints}</span>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-gray-700 bg-gray-800">
        <CardHeader className={`${levelConfig[selectedLevel].color} text-white rounded-t-lg text-center`}>
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-black rounded-full p-3 shadow-xl">
              <Image src="/volt-kick-logo.png" alt="Volt Kick" width={120} height={72} className="object-contain" />
            </div>
            <CardTitle className="text-xl md:text-2xl">النتيجة النهائية - {levelConfig[selectedLevel].title}</CardTitle>
          </div>
          <CardDescription className="text-gray-100">لقد أكملت الاختبار!</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center bg-gray-800">
          <Trophy className="h-24 w-24 text-yellow-500 mb-4" />
          <div className="text-2xl font-bold text-center mb-2 text-white">{points} نقطة</div>
          <div className="text-lg text-center mb-2 text-gray-300">
            {selectedLevel === "quiz"
              ? points === 100
                ? "فوز في الكويز!"
                : "خسارة في الكويز"
              : `من أصل ${currentQuestions.length * pointsPerCorrectAnswer} نقطة`}
          </div>
          <div className="text-center text-gray-300 mb-6">
            {selectedLevel === "quiz"
              ? points === 100
                ? "مذهل! لقد فزت بالكويز وحصلت على 100 نقطة! 🏆💎"
                : "للأسف، لم تتمكن من إكمال الكويز. حاول مرة أخرى! 💪"
              : points === currentQuestions.length * pointsPerCorrectAnswer
                ? "ممتاز! لقد حصلت على النقاط كاملة! 🏆"
                : points >= (currentQuestions.length * pointsPerCorrectAnswer) / 2
                  ? "جيد جدًا! معلوماتك الكروية جيدة. ⚽"
                  : "حاول مرة أخرى لتحسين معلوماتك الكروية. 💪"}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-gray-800">
          <Button
            onClick={resetQuiz}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center"
          >
            <Home className="ml-1 h-4 w-4" />
            الصفحة الرئيسية
          </Button>
          {selectedLevel !== "quiz" && (
            <Button
              onClick={() => {
                // إعادة خلط الأسئلة عند إعادة نفس المستوى
                const shuffledQuestions = shuffleQuestions([...questionsByLevel[selectedLevel]])
                setCurrentQuestions(shuffledQuestions)
                setCurrentQuestionIndex(0)
                setSelectedAnswer(null)
                setPoints(0)
                setShowResult(false)
                setAnswered(false)
              }}
              className={`${levelConfig[selectedLevel].color} ${levelConfig[selectedLevel].hoverColor} shadow-lg`}
            >
              <RefreshCw className="ml-2 h-4 w-4" />
              إعادة نفس المستوى
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
