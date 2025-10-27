// src/services/candidates.js
import { supabase, supabaseMasters } from './supabase';

export const candidatesService = {
    // Fetch candidates with job subcategory, work experience, education, and technical skills
    async getCandidates(options = {}) {
        const {
            page = 1,
            limit = 12,
            searchQuery = '',
            subCategoryId = null
        } = options;

        try {
            let query = supabase
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
        `, { count: 'exact' });

            // Apply search filters
            if (searchQuery.trim()) {
                query = query.or(`full_name.ilike.%${searchQuery}%,register_number.ilike.%${searchQuery}%`);
            }

            // Apply sub category filter
            if (subCategoryId) {
                query = query.eq('job_sub_category_id', subCategoryId);
            }

            // Apply pagination
            const offset = (page - 1) * limit;
            query = query.range(offset, offset + limit - 1);

            // Order by creation date
            query = query.order('created_at', { ascending: false });

            const { data, error, count } = await query;

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

            return {
                data: processedData,
                count: count,
                hasMore: processedData.length === limit,
                page: page,
                limit: limit
            };
        } catch (error) {
            console.error('Error in getCandidates:', error);
            throw error;
        }
    },

    // Fetch subcategories for filtering
    async getSubCategories() {
        try {
            const { data, error } = await supabaseMasters
                .from('sub_categories')
                .select('id, name, main_category_id')
                .order('name', { ascending: true });

            if (error) {
                console.error('Error fetching subcategories:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error in getSubCategories:', error);
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