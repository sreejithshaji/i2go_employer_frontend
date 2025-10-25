// src/services/candidates.js
import { supabase, supabaseMasters } from './supabase';

export const candidatesService = {
    // Fetch candidates with job subcategory, work experience, education, and technical skills
    async getCandidates() {
        try {
            // Use inner joins to fetch all related data in a single query where possible
            const { data, error } = await supabase
                .from('candidates')
                .select(`
          *,
          sub_categories_view!job_sub_category_id (
            id,
            name,
            main_category_id,
            main_category_name
          ),
          candidate_work_experience (
            id,
            company_name,
            position,
            start_date,
            end_date,
            is_current
          ),
          candidate_education (
            id,
            degree_type,
            course_name,
            specialization,
            institution_name,
            year_of_passing
          ),
          candidate_technical_skills (
            id,
            proficiency_level,
            years_of_experience,
            technical_skills (
              skill_name,
              skill_category
            )
          )
        `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching candidates with joins:', error);
                throw error;
            }

            // Process the data to add computed fields
            const processedData = data?.map(candidate => {
                return {
                    ...candidate,
                    has_work_experience: candidate.candidate_work_experience && candidate.candidate_work_experience.length > 0,
                    education_tags: candidate.candidate_education?.map(edu =>
                        `${edu.degree_type} ${edu.course_name}${edu.specialization ? ` (${edu.specialization})` : ''}`
                    ) || [],
                    skill_tags: candidate.candidate_technical_skills?.map(skill =>
                        `${skill.technical_skills?.skill_name || 'Unknown'} (${skill.proficiency_level})`
                    ) || [],
                    job_category: candidate.sub_categories_view?.name || 'Not specified',
                    main_job_category: candidate.sub_categories_view?.main_category_name || 'Not specified'
                };
            }) || [];

            return processedData;
        } catch (error) {
            console.error('Error in getCandidates:', error);
            throw error;
        }
    },    // Fetch a single candidate with all details
    async getCandidateById(id) {
        try {
            const { data, error } = await supabase
                .from('candidates')
                .select(`
                *,
                sub_categories_view!job_sub_category_id (
                    id,
                    name,
                    main_category_id,
                    main_category_name
                ),
                candidate_addresses (*),
                candidate_work_experience (*),
                candidate_education (*),
                candidate_technical_skills (
                    *,
                    technical_skills (*)
                ),
                candidate_languages (
                    *,
                    languages (*)
                ),
                candidate_documents (*)
                `)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching candidate:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in getCandidateById:', error);
            throw error;
        }
    }
};