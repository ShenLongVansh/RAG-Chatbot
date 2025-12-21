import fs from 'fs';
import path from 'path';

export interface DocumentChunk {
    id: string;
    content: string;
    metadata: {
        category: string;
        source: string;
    };
}

interface ProfileData {
    name: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    education: {
        degree: string;
        university: string;
        duration: string;
        gpa: string;
        highlights: string[];
    };
    skills: {
        languages: string[];
        frontend: string[];
        backend: string[];
        ai_ml: string[];
        tools: string[];
        soft_skills: string[];
    };
    experience: Array<{
        role: string;
        company: string;
        duration: string;
        description: string;
    }>;
    projects: Array<{
        name: string;
        description: string;
        technologies: string[];
        link: string;
    }>;
    achievements: string[];
    interests: string[];
    social: {
        github: string;
        linkedin: string;
        twitter: string;
        website: string;
    };
}

/**
 * Dynamically read profile data from disk (not cached by ESM)
 */
function getProfileData(): ProfileData {
    const filePath = path.join(process.cwd(), 'lib/data/profile.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as ProfileData;
}

/**
 * Prepare documents from profile data for embedding and retrieval
 */
export function prepareDocuments(): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const profile = getProfileData();

    // Basic info
    chunks.push({
        id: "profile-basic",
        content: `Name: ${profile.name}. Title: ${profile.title}. Bio: ${profile.bio}. Location: ${profile.location}.`,
        metadata: { category: "profile", source: "basic-info" },
    });

    // Education
    const edu = profile.education;
    chunks.push({
        id: "education",
        content: `Education: ${edu.degree} from ${edu.university} (${edu.duration}). GPA: ${edu.gpa}. Highlights: ${edu.highlights.join(". ")}.`,
        metadata: { category: "education", source: "education-details" },
    });

    // Skills - split by category for better retrieval
    const skills = profile.skills;
    chunks.push({
        id: "skills-languages",
        content: `Programming Languages: ${skills.languages.join(", ")}. These are the programming languages Vansh is proficient in.`,
        metadata: { category: "skills", source: "programming-languages" },
    });

    chunks.push({
        id: "skills-frontend",
        content: `Frontend Technologies: ${skills.frontend.join(", ")}. These are the frontend frameworks and tools Vansh uses for building user interfaces.`,
        metadata: { category: "skills", source: "frontend-stack" },
    });

    chunks.push({
        id: "skills-backend",
        content: `Backend Technologies: ${skills.backend.join(", ")}. These are the backend frameworks and databases Vansh works with.`,
        metadata: { category: "skills", source: "backend-stack" },
    });

    chunks.push({
        id: "skills-ai",
        content: `AI/ML Technologies: ${skills.ai_ml.join(", ")}. Vansh has experience with these AI and machine learning tools and frameworks.`,
        metadata: { category: "skills", source: "ai-ml" },
    });

    chunks.push({
        id: "skills-tools",
        content: `Development Tools: ${skills.tools.join(", ")}. Soft Skills: ${skills.soft_skills.join(", ")}.`,
        metadata: { category: "skills", source: "tools-and-soft-skills" },
    });

    // Experience - one chunk per role
    profile.experience.forEach((exp, index) => {
        chunks.push({
            id: `experience-${index}`,
            content: `Work Experience: ${exp.role} at ${exp.company} (${exp.duration}). ${exp.description}`,
            metadata: { category: "experience", source: exp.company },
        });
    });

    // Projects - one chunk per project
    profile.projects.forEach((project, index) => {
        chunks.push({
            id: `project-${index}`,
            content: `Project: ${project.name}. ${project.description} Technologies used: ${project.technologies.join(", ")}.`,
            metadata: { category: "projects", source: project.name },
        });
    });

    // Achievements
    chunks.push({
        id: "achievements",
        content: `Achievements and Certifications: ${profile.achievements.join(". ")}.`,
        metadata: { category: "achievements", source: "achievements-list" },
    });

    // Interests
    chunks.push({
        id: "interests",
        content: `Interests and Hobbies: ${profile.interests.join(", ")}. These are the areas Vansh is passionate about.`,
        metadata: { category: "interests", source: "interests-list" },
    });

    // Social links
    const social = profile.social;
    chunks.push({
        id: "social",
        content: `Contact and Social Links: GitHub: ${social.github}, LinkedIn: ${social.linkedin}, Twitter: ${social.twitter}, Website: ${social.website}, Email: ${profile.email}.`,
        metadata: { category: "contact", source: "social-links" },
    });

    return chunks;
}

/**
 * Get all prepared document chunks
 */
export function getDocumentChunks(): DocumentChunk[] {
    return prepareDocuments();
}
