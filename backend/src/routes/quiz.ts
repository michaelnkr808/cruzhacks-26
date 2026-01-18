import { Hono } from 'hono';
import type { PracticeProblem, PracticeProblemSetStatusResponse, GradeFRQResponse } from '@opennote-ed/sdk';

const app = new Hono();

// Lazy-load OpenNote SDK to avoid ESM issues on Vercel
let OpennoteClientClass: any = null;
async function getOpennoteClient(apiKey: string) {
  if (!OpennoteClientClass) {
    const sdk = await import('@opennote-ed/sdk');
    OpennoteClientClass = sdk.OpennoteClient;
  }
  return new OpennoteClientClass({ api_key: apiKey });
}

/**
 * Quiz Generation API
 * 
 * Generates quiz questions from lesson content using OpenNote Practice API.
 * Creates dynamic, lesson-specific practice problems.
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

// Generate quiz questions using OpenNote Practice API
app.post('/generate', async (c) => {
  console.log('[QUIZ] Received generate request');
  try {
    const body = await c.req.json();
    const { lessonTitle, lessonContent, userNotes, questionCount = 5 } = body;

    console.log(`[QUIZ] lessonTitle: "${lessonTitle}"`);
    console.log(`[QUIZ] lessonContent length: ${lessonContent?.length || 0} chars`);
    console.log(`[QUIZ] userNotes: ${userNotes?.length || 0} chars`);

    if (!lessonTitle || !lessonContent) {
      console.log('[QUIZ] Missing lessonTitle or lessonContent, returning 400');
      return c.json({ error: 'Lesson title and content are required' }, 400);
    }

    const OPENNOTE_API_KEY = process.env.OPENNOTE_API_KEY;
    console.log(`[QUIZ] OpenNote API Key exists: ${!!OPENNOTE_API_KEY}`);

    if (!OPENNOTE_API_KEY) {
      // Fallback to demo questions if no API key
      console.log('[QUIZ] No OpenNote API key, using demo questions');
      const demoQuestions = generateDemoQuestions(lessonTitle, questionCount);
      return c.json({ questions: demoQuestions });
    }

    // Initialize OpenNote client (lazy-loaded)
    const client = await getOpennoteClient(OPENNOTE_API_KEY);

    // Build a descriptive prompt for practice problems
    const problemDescription = buildProblemDescription(lessonTitle, lessonContent, userNotes);

    console.log(`[QUIZ] Generating ${questionCount} questions for "${lessonTitle}" using OpenNote...`);
    console.log(`[QUIZ] Problem description: ${problemDescription.substring(0, 200)}...`);

    // Create a practice problem set via interactives.practice
    let createResponse;
    try {
      createResponse = await client.interactives.practice.create({
        set_description: problemDescription,
        count: Math.min(questionCount, 15), // OpenNote max is 15
        set_name: `Quiz: ${lessonTitle}`,
        search_for_problems: false // Use lesson content directly
      });
      console.log(`[QUIZ] Create response:`, JSON.stringify(createResponse));
    } catch (apiError: unknown) {
      const msg = apiError instanceof Error ? apiError.message : String(apiError);
      console.error('[QUIZ] OpenNote API error:', msg);
      if (apiError instanceof Error && apiError.stack) {
        console.error('[QUIZ] API error stack:', apiError.stack);
      }
      throw new Error(`OpenNote API error: ${msg}`);
    }

    if (!createResponse.success || !createResponse.set_id) {
      console.error('[QUIZ] Failed to create practice set:', createResponse);
      throw new Error('Failed to create practice set: ' + (createResponse.message || 'unknown error'));
    }

    const setId = createResponse.set_id;
    console.log(`[QUIZ] Practice set created: ${setId}`);

    // Poll for completion (max 60 seconds)
    let attempts = 0;
    const maxAttempts = 12;
    let statusResponse: PracticeProblemSetStatusResponse | null = null;

    while (attempts < maxAttempts) {
      await sleep(5000); // Wait 5 seconds between polls
      statusResponse = await client.interactives.practice.status({ set_id: setId });

      if (statusResponse && statusResponse.status === 'completed') {
        console.log(`[QUIZ] Practice set completed after ${(attempts + 1) * 5} seconds`);
        break;
      } else if (statusResponse && statusResponse.status === 'failed') {
        console.error('[QUIZ] Practice set generation failed:', statusResponse.message);
        throw new Error(statusResponse.message || 'Practice set generation failed');
      }

      attempts++;
    }

    if (!statusResponse || statusResponse.status !== 'completed') {
      console.error('[QUIZ] Practice set timed out');
      throw new Error('Practice set generation timed out');
    }

    // Convert OpenNote problems to our quiz format
    const problems = statusResponse.response?.problems || [];
    console.log(`[QUIZ] Got ${problems.length} problems from OpenNote`);
    
    const questions = convertToQuizQuestions(problems, questionCount);

    console.log(`[QUIZ] Successfully generated ${questions.length} questions for "${lessonTitle}"`);

    return c.json({ questions });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('[QUIZ] Generation error:', errorMessage);
    console.error('[QUIZ] Stack:', errorStack);
    
    // Fallback to demo questions on error
    // Note: we can't re-read the body, so we just generate generic demo questions
    console.log('[QUIZ] Falling back to demo questions');
    const demoQuestions = generateDemoQuestions('Lesson', 5);
    
    return c.json({ 
      questions: demoQuestions,
      warning: `Using demo questions: ${errorMessage}`
    });
  }
});

// Grade a quiz response using OpenNote
app.post('/grade', async (c) => {
  try {
    const body = await c.req.json();
    const { question, userAnswer } = body;

    const OPENNOTE_API_KEY = process.env.OPENNOTE_API_KEY;

    if (!OPENNOTE_API_KEY) {
      return c.json({ error: 'OpenNote API key not configured' }, 500);
    }

    const client = await getOpennoteClient(OPENNOTE_API_KEY);

    const gradeResponse: GradeFRQResponse = await client.interactives.practice.grade({
      problem: {
        problem_type: 'frq',
        problem_statement: question,
        user_answer: userAnswer,
        difficulty: 'medium',
        include_graph: false
      }
    });

    return c.json({
      score: gradeResponse.score,
      maxScore: gradeResponse.max_score,
      explanation: gradeResponse.explanation,
      percentage: gradeResponse.percentage
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Grading error:', errorMessage);
    return c.json({ error: 'Failed to grade response' }, 500);
  }
});

/**
 * Helper function to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Build a description for OpenNote Practice API
 */
function buildProblemDescription(
  lessonTitle: string,
  lessonContent: string,
  userNotes?: string
): string {
  const contentSummary = lessonContent.substring(0, 2000);
  const notesSummary = userNotes ? userNotes.substring(0, 500) : '';

  let description = `Multiple choice questions about embedded programming topic: "${lessonTitle}". `;
  description += `Questions should test understanding of the following concepts: ${contentSummary}`;
  
  if (notesSummary) {
    description += ` Pay special attention to these student notes: ${notesSummary}`;
  }

  description += `. Create SHORT, CONCISE multiple choice questions appropriate for beginner to intermediate embedded systems students. `;
  description += `Questions should be 1-2 sentences max. Answer options should be brief (under 50 characters each).`;

  return description;
}

/**
 * Truncate text to a maximum length with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Convert OpenNote problems to our quiz question format
 * PracticeProblem has: problem_type, problem_statement, correct_answer, difficulty, answer_choices, explanation
 */
function convertToQuizQuestions(problems: PracticeProblem[], count: number): QuizQuestion[] {
  return problems.slice(0, count).map((problem, idx) => {
    // Truncate question to reasonable length (max 200 chars)
    const question = truncateText(problem.problem_statement, 200);
    
    // Handle MCQ (multiple choice questions)
    if (problem.problem_type === 'mcq' && problem.answer_choices) {
      const choices = Object.entries(problem.answer_choices);
      // Truncate each option to max 80 chars
      const options = choices.map(([_, value]) => truncateText(value, 80));
      
      // Find the correct answer index
      let correctAnswer = 0;
      if (typeof problem.correct_answer === 'string') {
        const correctKey = problem.correct_answer;
        correctAnswer = choices.findIndex(([key, _]) => key === correctKey);
        if (correctAnswer === -1) correctAnswer = 0;
      }

      return {
        id: idx + 1,
        question,
        options: options.length >= 4 ? options.slice(0, 4) : padOptions(options),
        correctAnswer,
        explanation: truncateText(problem.explanation || 'Review the lesson content for more details.', 300)
      };
    }

    // Handle selectall (convert to single correct for our format)
    if (problem.problem_type === 'selectall' && problem.answer_choices) {
      const choices = Object.entries(problem.answer_choices);
      const options = choices.map(([_, value]) => truncateText(value, 80));
      
      return {
        id: idx + 1,
        question,
        options: options.length >= 4 ? options.slice(0, 4) : padOptions(options),
        correctAnswer: 0, // First option for selectall
        explanation: truncateText(problem.explanation || 'Multiple answers may be correct.', 300)
      };
    }

    // Handle FRQ (free response questions) - convert to MC format
    const correctAnswerStr = Array.isArray(problem.correct_answer) 
      ? problem.correct_answer[0] 
      : (problem.correct_answer || '');
    
    return {
      id: idx + 1,
      question,
      options: generateOptionsFromAnswer(truncateText(correctAnswerStr, 80)),
      correctAnswer: 0, // First option is the correct answer
      explanation: truncateText(problem.explanation || correctAnswerStr || 'Review the lesson content for more details.', 300)
    };
  });
}

/**
 * Pad options array to have at least 4 options
 */
function padOptions(options: string[]): string[] {
  const padded = [...options];
  const fillers = ['None of the above', 'All of the above', 'Not enough information', 'Cannot be determined'];
  let i = 0;
  while (padded.length < 4 && i < fillers.length) {
    padded.push(fillers[i]);
    i++;
  }
  return padded;
}

/**
 * Generate multiple choice options from a free response answer
 */
function generateOptionsFromAnswer(correctAnswer: string): string[] {
  if (!correctAnswer || correctAnswer.length < 3) {
    return ['True', 'False', 'Not enough information', 'None of the above'];
  }
  
  return [
    correctAnswer,
    'The opposite is true',
    'This only applies in special cases',
    'None of the above'
  ];
}

/**
 * Generate demo questions when OpenNote is not available
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
