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
    phone?: string;
    bio: string;
    location: string;
    email?: string;
    education: {
        degree: string;
        university: string;
        location?: string;
        duration: string;
        gpa: string;
        highlights: string[];
    };
    skills: {
        languages: string[];
        frameworks_web: string[];
        ai_data: string[];
        backend_cloud: string[];
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
        duration?: string;
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
 * Dynamically read profile data from disk and merge with env variables
 * Sensitive data (phone, email) is loaded from environment variables
 */
function getProfileData(): ProfileData {
    const filePath = path.join(process.cwd(), 'lib/data/profile.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const profileFromFile = JSON.parse(data) as ProfileData;

    // Merge sensitive data from environment variables
    return {
        ...profileFromFile,
        phone: process.env.PROFILE_PHONE || profileFromFile.phone || '',
        email: process.env.PROFILE_EMAIL || profileFromFile.email || '',
    };
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
        id: "skills-frameworks",
        content: `Frameworks & Web Technologies: ${skills.frameworks_web.join(", ")}. These are the frontend frameworks and tools Vansh uses for building user interfaces.`,
        metadata: { category: "skills", source: "frameworks-web" },
    });

    chunks.push({
        id: "skills-ai",
        content: `AI & Data Technologies: ${skills.ai_data.join(", ")}. Vansh has experience with these AI, data, and machine learning tools.`,
        metadata: { category: "skills", source: "ai-data" },
    });

    chunks.push({
        id: "skills-backend-cloud",
        content: `Backend & Cloud Technologies: ${skills.backend_cloud.join(", ")}. These are the backend, DevOps, and cloud tools Vansh works with.`,
        metadata: { category: "skills", source: "backend-cloud" },
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
        const durationInfo = project.duration ? ` Duration: ${project.duration}.` : '';
        chunks.push({
            id: `project-${index}`,
            content: `Project: ${project.name}.${durationInfo} ${project.description} Technologies used: ${project.technologies.join(", ")}.`,
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

    // Social links and contact info
    const social = profile.social;
    chunks.push({
        id: "social",
        content: `Contact and Social Links: Phone: ${profile.phone}, Email: ${profile.email}, GitHub: ${social.github}, LinkedIn: ${social.linkedin}, Twitter: ${social.twitter}, Website: ${social.website}.`,
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
