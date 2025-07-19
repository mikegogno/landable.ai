import OpenAI from 'openai'

// In a real app, use environment variables
const apiKey = import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key'

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Only for demo purposes, in production use server-side API calls
})

export class AIService {
  static async generateResumeContent(
    experience: string,
    jobDescription: string
  ): Promise<string[]> {
    try {
      const prompt = `You're a professional resume writer. Given this experience and job description, write 3 ATS-optimized resume bullets using action verbs and metrics.

Experience: ${experience}
Job Description: ${jobDescription}

Format: Return only the bullet points, one per line, starting with "•"`

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content || ''
      return content.split('\n').filter(line => line.trim().startsWith('•'))
    } catch (error) {
      console.error('OpenAI API Error:', error)
      throw new Error('Failed to generate resume content')
    }
  }

  static async generateCoverLetter(
    jobTitle: string,
    company: string,
    jobDescription: string,
    tone: 'casual' | 'formal' | 'confident'
  ): Promise<string> {
    try {
      const toneMap = {
        casual: 'conversational and approachable',
        formal: 'professional and traditional',
        confident: 'assertive and impactful'
      }

      const prompt = `You're an expert career writer. Write a concise, modern cover letter tailored to this job with a ${toneMap[tone]} tone:

Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription}

Requirements:
- Keep it under 300 words
- Include specific examples
- Show enthusiasm for the role
- Make it ATS-friendly
- Use ${toneMap[tone]} language`

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('OpenAI API Error:', error)
      throw new Error('Failed to generate cover letter')
    }
  }

  static async optimizeContent(
    content: string,
    type: 'resume' | 'cover_letter'
  ): Promise<string> {
    try {
      const prompt = `Optimize this ${type} content for ATS systems and improve readability:

${content}

Requirements:
- Use ATS-friendly keywords
- Improve formatting and structure
- Enhance clarity and impact
- Maintain the original tone and length`

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.5,
      })

      return completion.choices[0]?.message?.content || content
    } catch (error) {
      console.error('OpenAI API Error:', error)
      throw new Error('Failed to optimize content')
    }
  }

  static async generateBulletPoints(
    experience: string,
    jobDescription: string
  ): Promise<string[]> {
    return this.generateResumeContent(experience, jobDescription)
  }
}