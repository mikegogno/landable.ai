import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { supabase } from './supabase'

export interface ResumeContent {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  summary: string
  experience: Array<{
    title: string
    company: string
    duration: string
    bullets: string[]
  }>
  education: Array<{
    degree: string
    school: string
    year: string
  }>
  skills: string[]
}

export class FileExportService {
  static async generatePDF(content: ResumeContent | string): Promise<Blob> {
    try {
      const doc = new jsPDF()
      let yPosition = 20

      if (typeof content === 'string') {
        // Simple text content (for cover letter)
        const lines = doc.splitTextToSize(content, 170)
        doc.setFontSize(11)
        doc.text(lines, 20, yPosition)
      } else {
        // Structured resume content
        const { personalInfo, summary, experience, education, skills } = content

        // Personal Info
        doc.setFontSize(20)
        doc.text(personalInfo.name, 20, yPosition)
        yPosition += 15

        doc.setFontSize(12)
        doc.text(`${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`, 20, yPosition)
        yPosition += 20

        // Summary
        if (summary) {
          doc.setFontSize(16)
          doc.text('Professional Summary', 20, yPosition)
          yPosition += 10
          
          doc.setFontSize(11)
          const summaryLines = doc.splitTextToSize(summary, 170)
          doc.text(summaryLines, 20, yPosition)
          yPosition += summaryLines.length * 5 + 15
        }

        // Experience
        if (experience.length > 0) {
          doc.setFontSize(16)
          doc.text('Experience', 20, yPosition)
          yPosition += 15

          experience.forEach((exp) => {
            doc.setFontSize(12)
            doc.text(exp.title, 20, yPosition)
            
            // Add duration on the right
            const textWidth = doc.getStringUnitWidth(exp.duration) * 12 / doc.internal.scaleFactor
            doc.text(exp.duration, 190 - textWidth, yPosition)
            
            yPosition += 8

            doc.setFontSize(11)
            doc.text(exp.company, 20, yPosition)
            yPosition += 10

            exp.bullets.forEach((bullet) => {
              const bulletLines = doc.splitTextToSize(`• ${bullet}`, 170)
              doc.text(bulletLines, 25, yPosition)
              yPosition += bulletLines.length * 5 + 2
            })
            yPosition += 8
          })
        }

        // Education
        if (education.length > 0) {
          doc.setFontSize(16)
          doc.text('Education', 20, yPosition)
          yPosition += 15

          education.forEach((edu) => {
            doc.setFontSize(12)
            doc.text(edu.degree, 20, yPosition)
            
            // Add year on the right
            const textWidth = doc.getStringUnitWidth(edu.year) * 12 / doc.internal.scaleFactor
            doc.text(edu.year, 190 - textWidth, yPosition)
            
            yPosition += 8

            doc.setFontSize(11)
            doc.text(edu.school, 20, yPosition)
            yPosition += 15
          })
        }

        // Skills
        if (skills.length > 0) {
          doc.setFontSize(16)
          doc.text('Skills', 20, yPosition)
          yPosition += 10

          doc.setFontSize(11)
          const skillsText = skills.join(', ')
          const skillsLines = doc.splitTextToSize(skillsText, 170)
          doc.text(skillsLines, 20, yPosition)
        }
      }

      return doc.output('blob')
    } catch (error) {
      console.error('PDF generation error:', error)
      throw new Error('Failed to generate PDF')
    }
  }

  static async generateDocx(content: ResumeContent | string): Promise<Blob> {
    try {
      let children: Paragraph[] = []

      if (typeof content === 'string') {
        // Simple text content (for cover letter)
        const lines = content.split('\n')
        children = lines.map(line => new Paragraph({
          children: [new TextRun(line)],
        }))
      } else {
        // Structured resume content
        const { personalInfo, summary, experience, education, skills } = content

        // Personal Info
        children.push(
          new Paragraph({
            children: [new TextRun({ text: personalInfo.name, bold: true, size: 32 })],
          }),
          new Paragraph({
            children: [new TextRun(`${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`)],
          }),
          new Paragraph({ children: [new TextRun('')] }) // Empty line
        )

        // Summary
        if (summary) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: 'Professional Summary', bold: true, size: 24 })],
            }),
            new Paragraph({
              children: [new TextRun(summary)],
            }),
            new Paragraph({ children: [new TextRun('')] })
          )
        }

        // Experience
        if (experience.length > 0) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: 'Experience', bold: true, size: 24 })],
            })
          )

          experience.forEach((exp) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: exp.title, bold: true }),
                  new TextRun({ text: ' | ' }),
                  new TextRun(exp.duration),
                ],
              }),
              new Paragraph({
                children: [new TextRun(exp.company)],
              })
            )

            exp.bullets.forEach((bullet) => {
              children.push(
                new Paragraph({
                  children: [new TextRun(`• ${bullet}`)],
                })
              )
            })

            children.push(new Paragraph({ children: [new TextRun('')] }))
          })
        }

        // Education
        if (education.length > 0) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: 'Education', bold: true, size: 24 })],
            })
          )

          education.forEach((edu) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: edu.degree, bold: true }),
                  new TextRun({ text: ' | ' }),
                  new TextRun(edu.year),
                ],
              }),
              new Paragraph({
                children: [new TextRun(edu.school)],
              })
            )
          })

          children.push(new Paragraph({ children: [new TextRun('')] }))
        }

        // Skills
        if (skills.length > 0) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: 'Skills', bold: true, size: 24 })],
            }),
            new Paragraph({
              children: [new TextRun(skills.join(', '))],
            })
          )
        }
      }

      const doc = new Document({
        sections: [{
          children,
        }],
      })

      const buffer = await Packer.toBuffer(doc)
      return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    } catch (error) {
      console.error('DOCX generation error:', error)
      throw new Error('Failed to generate DOCX')
    }
  }

  static async uploadToStorage(file: File, userId: string, folder: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${folder}/${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { error, data } = await supabase.storage
        .from('user_uploads')
        .upload(fileName, file)

      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage
        .from('user_uploads')
        .getPublicUrl(fileName)
        
      return publicUrl
    } catch (error) {
      console.error('File upload error:', error)
      throw new Error('Failed to upload file')
    }
  }
}