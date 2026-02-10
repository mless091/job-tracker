// components/job-board/ResumeDocument.tsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  // FINAL STANDARD LAYOUT: 30px padding, 10pt font
  page: { 
    padding: 30, 
    fontFamily: 'Helvetica', 
    fontSize: 10, 
    lineHeight: 1.4, 
    color: '#000'
  },
  
  // HEADER
  header: { 
    marginBottom: 18, 
    textAlign: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingBottom: 10
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, // Safe margin for contact info
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  contact: { 
    fontSize: 10, 
    color: '#333' 
  },

  // SECTIONS
  section: { 
    marginBottom: 12 // Tightened slightly (was 15) to save vertical space
  },
  sectionTitle: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
    marginBottom: 6, 
    paddingBottom: 2, 
    textTransform: 'uppercase',
    letterSpacing: 1
  },

  // HELPERS
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 2 // Tightened slightly (was 3)
  },
  company: { fontWeight: 'bold', fontSize: 10.5 },
  date: { fontSize: 10, fontStyle: 'italic', textAlign: 'right' },
  role: { fontStyle: 'italic', fontSize: 10, marginBottom: 3, fontWeight: 'bold', color: '#444' },
  
  // Bullets
  bullet: { marginLeft: 12, marginBottom: 2, fontSize: 10, lineHeight: 1.4 }, // Tightened (was 3)
  
  // SKILLS (Bottom)
  skillsContainer: {
    marginTop: 'auto', 
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  skillText: { fontSize: 10, lineHeight: 1.5 }
});

export type ResumeData = {
  fullName: string;
  contactInfo: string;
  skills: string[];
  experience: { company: string; role: string; date: string; bullets: string[] }[];
  education: { school: string; degree: string; date: string }[];
  projects: { name: string; description: string | string[] }[];
};

export const ResumeDocument = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.fullName}</Text>
        <Text style={styles.contact}>{data.contactInfo}</Text>
      </View>

      {/* 2. EDUCATION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {data.education.map((edu, i) => (
          <View key={i} style={styles.row}>
            <View>
                <Text style={styles.company}>{edu.school}</Text>
                <Text style={{ fontSize: 10 }}>{edu.degree}</Text>
            </View>
            <Text style={styles.date}>{edu.date}</Text>
          </View>
        ))}
      </View>

      {/* 3. WORK EXPERIENCE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Experience</Text>
        {data.experience.map((job, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <View style={styles.row}>
              <Text style={styles.company}>{job.company}</Text>
              <Text style={styles.date}>{job.date}</Text>
            </View>
            <Text style={styles.role}>{job.role}</Text>
            {job.bullets.map((bullet, j) => (
              <Text key={j} style={styles.bullet}>• {bullet}</Text>
            ))}
          </View>
        ))}
      </View>

      {/* 4. PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects & Outside Experience</Text>
            {data.projects.map((proj, i) => (
                <View key={i} style={{ marginBottom: 8 }} wrap={false}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10.5, marginBottom: 2 }}>{proj.name}</Text>
                     {Array.isArray(proj.description) ? (
                       proj.description.map((desc: string, j: number) => (
                         <Text key={j} style={styles.bullet}>• {desc}</Text>
                       ))
                    ) : (
                       <Text style={styles.bullet}>• {proj.description}</Text>
                    )}
                </View>
            ))}
        </View>
      )}

      {/* 5. SKILLS */}
      <View style={[styles.section, { marginTop: 'auto' }]}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <Text style={styles.skillText}>{data.skills.join(" • ")}</Text>
      </View>

    </Page>
  </Document>
);