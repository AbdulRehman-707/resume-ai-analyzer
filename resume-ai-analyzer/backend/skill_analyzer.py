from role_skills import ROLE_SKILLS


def analyze_skill_gap(resume_skills, role):
    if role not in ROLE_SKILLS:
        return {
            "error": "Role not found"
        }

    required_skills = ROLE_SKILLS[role]

    matched_skills = []
    missing_skills = []

    for skill in required_skills:
        if skill in resume_skills:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    total_required = len(required_skills)
    total_matched = len(matched_skills)

    if total_required > 0:
        match_percentage = round(
            (total_matched / total_required) * 100,
            2
        )
    else:
        match_percentage = 0

    return {
        "role": role,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "match_percentage": match_percentage
    }