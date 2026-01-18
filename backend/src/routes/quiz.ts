import { Hono } from 'hono';

const app = new Hono();

/**
 * Quiz Generation API
 * 
 * Generates quiz questions from lesson content and user notes using AI.
 * Inspired by OpenNote's approach to personalized learning.
 * 
 * POST /api/quiz/generate
 * Body: { lessonTitle, lessonSlug, lessonContent, userNotes, questionCount }
 * Returns: { questions: QuizQuestion[] }
 */

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Generate quiz questions using OpenAI
app.post('/generate', async (c) => {
  try {
    const body = await c.req.json();
    const { lessonTitle, lessonContent, userNotes, questionCount = 5 } = body;

    if (!lessonTitle || !lessonContent) {
      return c.json({ error: 'Lesson title and content are required' }, 400);
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      // Fallback to demo questions if no API key
      console.log('[QUIZ] No OpenAI API key, using demo questions');
      const demoQuestions = generateDemoQuestions(lessonTitle, questionCount);
      return c.json({ questions: demoQuestions });
    }

    // Build the prompt for OpenAI
    const prompt = buildQuizPrompt(lessonTitle, lessonContent, userNotes, questionCount);

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an educational quiz generator for HardwareHub, an embedded programming learning platform. 
            Generate multiple-choice questions based on lesson content and student notes. 
            Questions should test understanding, not just memorization.
            Always respond with valid JSON.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error('Failed to generate quiz from AI');
    }

    const data = await response.json() as {
      choices: Array<{
        message: {
          content: string;
        };
      }>;
    };
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response
    let questions: QuizQuestion[];
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                        content.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      questions = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse quiz questions');
    }

    // Validate and format questions
    const validatedQuestions = questions.slice(0, questionCount).map((q, idx) => ({
      id: idx + 1,
      question: q.question || `Question ${idx + 1}`,
      options: Array.isArray(q.options) ? q.options.slice(0, 4) : ['A', 'B', 'C', 'D'],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: q.explanation || 'Review the lesson content for more details.'
    }));

    console.log(`[QUIZ] Generated ${validatedQuestions.length} questions for "${lessonTitle}"`);

    return c.json({ questions: validatedQuestions });

  } catch (error: any) {
    console.error('Quiz generation error:', error);
    
    // Fallback to demo questions on error
    const { lessonTitle, questionCount = 5 } = await c.req.json().catch(() => ({}));
    const demoQuestions = generateDemoQuestions(lessonTitle || 'Lesson', questionCount);
    
    return c.json({ 
      questions: demoQuestions,
      warning: 'Using demo questions due to an error'
    });
  }
});

/**
 * Build the prompt for OpenAI
 */
function buildQuizPrompt(
  lessonTitle: string, 
  lessonContent: string, 
  userNotes: string, 
  questionCount: number
): string {
  return `
Generate ${questionCount} multiple-choice quiz questions for the lesson "${lessonTitle}".

LESSON CONTENT:
${lessonContent.substring(0, 3000)}

${userNotes ? `STUDENT'S NOTES:
${userNotes.substring(0, 1000)}

Pay special attention to concepts the student wrote notes about.` : ''}

Generate questions that:
1. Test understanding of key concepts
2. Have 4 answer options each
3. Include one clearly correct answer
4. Provide helpful explanations

RESPOND WITH ONLY A JSON ARRAY in this exact format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation of why the answer is correct"
  }
]

correctAnswer should be the index (0-3) of the correct option.
Generate exactly ${questionCount} questions.
`;
}

/**
 * Generate demo questions when OpenAI is not available
 */
function generateDemoQuestions(lessonTitle: string, count: number): QuizQuestion[] {
  const demoQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: `What is the main topic covered in the "${lessonTitle}" lesson?`,
      options: [
        'Understanding embedded systems basics',
        'Advanced networking protocols',
        'Database management',
        'Web development frameworks'
      ],
      correctAnswer: 0,
      explanation: 'This lesson focuses on embedded systems and hardware programming concepts.'
    },
    {
      id: 2,
      question: 'In embedded programming, what does "digital input" typically refer to?',
      options: [
        'A continuous range of values',
        'Binary states: ON (1) or OFF (0)',
        'Audio signals',
        'Network packets'
      ],
      correctAnswer: 1,
      explanation: 'Digital inputs have two states: HIGH (1/ON) or LOW (0/OFF), representing binary values.'
    },
    {
      id: 3,
      question: 'What is the purpose of the IF MAGIC platform?',
      options: [
        'To run web servers',
        'To create modular hardware projects with plug-and-play components',
        'To edit photos',
        'To manage databases'
      ],
      correctAnswer: 1,
      explanation: 'IF MAGIC is a modular hardware platform that lets you create interactive projects by connecting sensor and output modules.'
    },
    {
      id: 4,
      question: 'Why is taking notes during lessons beneficial?',
      options: [
        'It has no benefit',
        'It helps reinforce learning and creates personalized study material',
        'It only looks good',
        'It is required by the platform'
      ],
      correctAnswer: 1,
      explanation: 'Taking notes helps reinforce learning, creates personalized study material, and improves retention of key concepts.'
    },
    {
      id: 5,
      question: 'What does IPO stand for in programming concepts?',
      options: [
        'Internet Protocol Optimization',
        'Input, Process, Output',
        'Integrated Programming Operations',
        'Internal Processor Override'
      ],
      correctAnswer: 1,
      explanation: 'IPO stands for Input, Process, Output - the fundamental pattern of most programs: something comes IN, you PROCESS it, and something goes OUT.'
    }
  ];

  return demoQuestions.slice(0, count);
}

export default app;
