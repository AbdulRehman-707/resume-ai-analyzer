import re

SKILLS = {
    "Python": ["python"],
    "Java": ["java"],
    "C++": ["c++", "cpp"],
    "C": ["c programming", "c language"],
    "JavaScript": ["javascript", "js"],
    "TypeScript": ["typescript"],
    "HTML": ["html", "html5"],
    "CSS": ["css", "css3"],
    "React": ["react", "reactjs"],
    "Node.js": ["node.js", "nodejs", "node js"],
    "FastAPI": ["fastapi"],
    "Django": ["django"],
    "Flask": ["flask"],
    "SQL": ["sql"],
    "MySQL": ["mysql"],
    "PostgreSQL": ["postgresql", "postgres"],
    "MongoDB": ["mongodb", "mongo db"],
    "Git": ["git"],
    "GitHub": ["github"],
    "NumPy": ["numpy"],
    "Pandas": ["pandas"],
    "Scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
    "TensorFlow": ["tensorflow"],
    "PyTorch": ["pytorch"],
    "Machine Learning": ["machine learning"],
    "Deep Learning": ["deep learning"],
    "Artificial Intelligence": ["artificial intelligence", "ai"],
    "Data Science": ["data science"],
    "Data Analysis": ["data analysis"],
    "Natural Language Processing": ["natural language processing", "nlp"],
    "Computer Vision": ["computer vision"],
    "Generative AI": ["generative ai"],
    "Large Language Models": ["large language models", "llm", "llms"],
    "Power BI": ["power bi"],
    "Excel": ["excel"],
    "Tableau": ["tableau"],
    "Docker": ["docker"],
    "AWS": ["aws"],
    "Azure": ["azure"],
    "Linux": ["linux"]
}


def extract_skills(text):
    text_lower = text.lower()
    detected_skills = []

    for skill, keywords in SKILLS.items():
        for keyword in keywords:
            if keyword in text_lower:
                detected_skills.append(skill)
                break

    return sorted(detected_skills)